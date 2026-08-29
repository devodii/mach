# Protocol Architecture

## The Smart Invoice

The **Smart Invoice (SI)** is a Soroban contract. It is not a token wrapper around
an off-chain record; it is the obligation itself, holding collateral and encoding
the conditions under which that collateral moves.

Each Smart Invoice owns four things:

| It holds | Purpose |
| --- | --- |
| **Terms** | Principal, settlement asset, due date, liquidation time-lock. |
| **Parties** | The business (a SEP-45 C-address), the lender (or vault), and the anchor authorised to attest payment. |
| **Collateral** | Assets escrowed against the facility, released only by settlement or liquidation. |
| **Instrument binding** | The SEP-59 `account_id` whose credits — and only whose credits — can settle this invoice. |

### Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Draft: initialize_invoice
    Draft --> Provisioned: bind_instrument (SEP-59)
    Provisioned --> Funded: lender capital escrowed
    Funded --> Settled: execute_settlement (verified proof)
    Funded --> Liquidated: liquidate_collateral (time-lock expired)
    Settled --> [*]
    Liquidated --> [*]
```

State transitions are one-way. There is no path from `Settled` back to `Funded`,
and no administrative override — an incorrectly settled invoice is not reversible
by the protocol, which is why verification happens before execution rather than
after.

## The protocol interface

The contract surface is deliberately narrow. Three externally callable functions
carry the entire settlement lifecycle.

```rust
use soroban_sdk::{contracterror, Address, Bytes, Env, U256};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    InvoiceNotFound = 1,
    InvalidState = 2,
    ProofRejected = 3,
    NonceAlreadyUsed = 4,
    TimelockNotExpired = 5,
    Underpayment = 6,
    Unauthorized = 7,
}

pub trait MACHSettlementTrait {
    /// Provisions a new settlement account via SEP-59
    fn initialize_invoice(e: Env, business: Address, amount: i128, asset: Address) -> U256;

    /// The entry point for the MACH Oracle to settle the debt
    /// Requires verification of the Anchor-signed Proof-of-Payment
    fn execute_settlement(e: Env, invoice_id: U256, proof: Bytes) -> Result<(), Error>;

    /// Emergency fallback if the buyer fails to pay within the time-lock
    fn liquidate_collateral(e: Env, invoice_id: U256) -> Result<(), Error>;
}
```

{% hint style="info" %}
`U256` and `Bytes` are `soroban_sdk` types, not Rust primitives — there is no
`u256` in Rust. `Error` is a `#[contracterror]` enum with an explicit `#[repr(u32)]`
discriminant, because Soroban serialises error codes as `u32` across the host
boundary.
{% endhint %}

### Storage types

```rust
use soroban_sdk::{contracttype, Address, BytesN, String, U256};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum InvoiceStatus {
    Draft,
    Provisioned,
    Funded,
    Settled,
    Liquidated,
}

#[contracttype]
#[derive(Clone, Debug)]
pub struct Invoice {
    pub id: U256,
    /// SEP-45 contract account. Signing policy lives inside it, not here.
    pub business: Address,
    pub lender: Address,
    /// Ed25519 public key from the anchor's stellar.toml SIGNING_KEY,
    /// pinned on-chain at provisioning time.
    pub anchor_signing_key: BytesN<32>,
    /// SEP-59 account_id. Only credits to this instrument can settle this invoice.
    pub instrument_id: String,
    pub amount_due: i128,
    pub settlement_asset: Address,
    pub collateral: i128,
    /// Ledger sequence after which liquidate_collateral becomes callable.
    pub liquidation_ledger: u32,
    pub status: InvoiceStatus,
}

#[contracttype]
pub enum DataKey {
    Invoice(U256),
    /// Consumed proof nonces. Presence means "already settled with this proof".
    Nonce(BytesN<32>),
    NextId,
    Config,
}
```

### The Proof-of-Payment envelope

The `proof: Bytes` argument is the anchor's notification carried verbatim. The
contract does not trust MACH's parsing of it — it re-derives everything.

```rust
#[contracttype]
#[derive(Clone, Debug)]
pub struct ProofOfPayment {
    /// The exact raw callback body the anchor signed. Re-serialising would
    /// change the bytes and invalidate the signature.
    pub raw_body: Bytes,
    /// Ed25519 signature over `timestamp . raw_body`.
    pub signature: BytesN<64>,
    pub timestamp: u64,
    /// SHA-256 of (invoice_id, instrument_id, transaction_id). Consumed once.
    pub nonce: BytesN<32>,
}
```

### On-chain verification

`execute_settlement` re-verifies rather than trusting the caller. This is what
reduces MACH from a trusted oracle to an untrusted relay.

```rust
fn execute_settlement(e: Env, invoice_id: U256, proof: Bytes) -> Result<(), Error> {
    let mut invoice: Invoice = read_invoice(&e, &invoice_id)?;
    if invoice.status != InvoiceStatus::Funded {
        return Err(Error::InvalidState);
    }

    let pop: ProofOfPayment = decode_proof(&e, &proof)?;

    // 1. The signature must verify against the key pinned at provisioning —
    //    not against a key supplied in the call, and not against whatever the
    //    anchor's TOML says today.
    e.crypto()
        .ed25519_verify(&invoice.anchor_signing_key, &signed_payload(&e, &pop), &pop.signature);

    // 2. One proof settles one invoice, exactly once.
    let nonce_key = DataKey::Nonce(pop.nonce.clone());
    if e.storage().persistent().has(&nonce_key) {
        return Err(Error::NonceAlreadyUsed);
    }

    // 3. The credit must be for this instrument, in this asset, for enough.
    let credit = parse_credit(&e, &pop.raw_body)?;
    if credit.instrument_id != invoice.instrument_id {
        return Err(Error::ProofRejected);
    }
    if credit.asset != invoice.settlement_asset {
        return Err(Error::ProofRejected);
    }
    if credit.amount < invoice.amount_due {
        return Err(Error::Underpayment);
    }

    // 4. Atomic settlement: nonce burned, collateral released, status advanced,
    //    all in one transaction or none of it.
    e.storage().persistent().set(&nonce_key, &true);
    release_collateral(&e, &invoice)?;
    invoice.status = InvoiceStatus::Settled;
    write_invoice(&e, &invoice);

    e.events().publish(
        (symbol_short!("mach"), symbol_short!("settled")),
        (invoice.id.clone(), credit.amount),
    );
    Ok(())
}
```

`ed25519_verify` is a host function that panics on failure, so an invalid
signature aborts the transaction and no state persists. The nonce is written
**before** collateral moves, so a re-entrant path cannot spend the same proof
twice.

### Events

| Event | Topics | Data |
| --- | --- | --- |
| `InvoiceCreated` | `("mach", "created")` | `(invoice_id, business, amount)` |
| `InstrumentBound` | `("mach", "bound")` | `(invoice_id, instrument_id)` |
| `SettlementExecuted` | `("mach", "settled")` | `(invoice_id, amount)` |
| `CollateralLiquidated` | `("mach", "liquidated")` | `(invoice_id, lender, amount)` |

Indexers reconstruct the full lifecycle of any facility from these four topics
without reading contract storage.

## SEP-45: identity that survives key rotation

A classic Stellar account *is* its keypair. Lose the key and you lose the account;
rotate the key and you are, from the ledger's perspective, a different party.

That is unworkable for a business with a multi-month facility outstanding.
Employees leave, HSMs are replaced, signing policies change from one signer to a
2-of-3 quorum as the facility grows. Under a classic-account model, every one of
those events would require unwinding and reissuing the invoice — moving escrowed
collateral, renegotiating terms, and re-provisioning the banking instrument.

SEP-45 authenticates **contract accounts (C-addresses)**, where the signing policy
lives inside the account contract rather than in the address itself.

```rust
// The invoice stores the business's C-address — a contract, not a public key.
pub business: Address,

// Authorisation asks the account contract whether this call is permitted.
// The account decides how: one key, a quorum, a hardware signer, a policy
// contract. The invoice neither knows nor cares.
invoice.business.require_auth();
```

The consequence:

{% hint style="success" %}
**The business can rotate keys while the invoice remains locked in the MACH
settlement logic.** The C-address is stable for the life of the facility. Key
rotation is an internal operation of the account contract and produces no state
change in the invoice at all — the collateral never moves, the instrument binding
never changes, and settlement remains callable throughout.
{% endhint %}

This also composes cleanly with the rest of the stack. The SEP-59 provisioning
request in Step 1 identifies the account holder by C-address, so the anchor's KYC
record is bound to a durable identity rather than to a key that will change.

## SEP-56: the lender side

Institutional capital does not fund invoices one at a time. SEP-56 tokenised
vaults give lenders a standard deposit and redemption surface over a book of
Smart Invoices.

```mermaid
flowchart LR
    L["Institutional lender"] -->|deposit| V["SEP-56 Vault"]
    V -->|allocates| I1["Smart Invoice A"]
    V -->|allocates| I2["Smart Invoice B"]
    V -->|allocates| I3["Smart Invoice C"]
    I1 -->|settle_loan| V
    I2 -->|settle_loan| V
    I3 -->|liquidate| V
    V -->|redeem| L
```

The vault holds the lender position; the invoices hold the collateral. Because
settlement is atomic, a vault's accounting is exact at every ledger close — there
is no in-flight state where an invoice has been paid but the vault has not yet
recognised it.

## Composition summary

| Layer | Standard | Contract-visible artefact |
| --- | --- | --- |
| Identity | SEP-45 | `business: Address` (C-address) |
| Banking instrument | SEP-59 | `instrument_id: String`, `anchor_signing_key: BytesN<32>` |
| Cross-asset pricing | SEP-38 | Quote id referenced at settlement |
| Lender capital | SEP-56 | `lender: Address` (vault contract) |
| Anchor discovery | SEP-1 | `SIGNING_KEY` pinned at provisioning |

Every trusted input to `execute_settlement` is pinned on-chain **before** funds are
at risk. Nothing supplied at call time can redirect a settlement.
