# The Role of the Oracle

> **Most oracles feed price data; MACH feeds payment data.**

That is a statement about which failure modes matter, and it is the reason MACH's
design looks nothing like a conventional price feed.

## Two different problems

A price oracle answers a question with no single authoritative source: what is
this asset worth right now? Nobody owns that answer. The market's opinion is
distributed across venues, so a price oracle's job is **aggregation under
adversarial conditions**: pull from many sources, discard outliers, take a
median, and make manipulation expensive by requiring an attacker to move several
markets at once.

A payment oracle answers a question that has exactly one authoritative source:
did this specific account receive this specific amount? One institution, the one
holding the account, knows definitively. Everyone else is guessing.

| | Price oracle | Payment oracle (MACH) |
| --- | --- | --- |
| Sources of truth | Many, none authoritative | Exactly one, definitively authoritative |
| Core problem | Aggregating a distribution | Authenticating a claim |
| Right defence | Median of *n* sources, deviation bounds | Signature verification against a known key |
| Freshness model | Continuously updated | Event-driven, once per payment |
| Wrong answer looks like | A price 3% off | A settlement that never happened |
| Consequence of failure | Mispriced liquidation | Collateral released against nothing |

Applying price-oracle machinery here would be actively harmful. Aggregating three
independent guesses about whether a bank credit occurred does not produce a
better answer than asking the bank; it produces an average of hearsay. And
median-based defences assume no source is authoritative, which is false here, and
throws away the one property that makes the problem tractable.

The correct primitive for a payment oracle is not aggregation. It is
**authentication**: establish that a message came from the party who actually
knows, and verify it cryptographically rather than socially.

## Why SEP-59

SEP-59 (the External Account Server proposal) is the right substrate because it
supplies both halves of what MACH needs, and both halves come from an entity that
is already regulated and already identifiable on-chain.

### 1. Per-invoice account provisioning removes reconciliation

SEP-59's `EXTERNAL_ACCOUNT_SERVER` lets MACH request a **dedicated receiving
instrument**, a virtual IBAN or local-rail account, bound to one smart invoice.

This sounds administrative. It is actually the load-bearing security property.

When a hundred buyers pay into one omnibus account, matching credits to
obligations is a heuristic exercise over reference fields, amounts, and timing.
Heuristics have false positives, and a false positive here means releasing
collateral against a payment intended for someone else. When each invoice has its
own account, the mapping is **structural**: a credit to account *X* can only be a
payment against invoice *X*. There is no matching logic to get wrong, and
therefore no matching logic to attack.

### 2. The webhook makes payment an on-chain-actionable event

SEP-59's `on_change_callback` inverts the polling relationship. Rather than MACH
asking whether funds have arrived yet on a timer, the anchor pushes a
notification the moment the credit posts. Sub-second signal, no polling budget,
and no interval during which a payment has settled but the protocol has not
noticed.

### 3. The signature is checkable by anyone

This is what makes MACH an oracle rather than a trusted relay.

The anchor signs its notification and publishes its `SIGNING_KEY` in its
`stellar.toml` under SEP-1. MACH fetches that key and validates the
`X-Stellar-Signature` header before treating the payload as true. Crucially, so
can anyone else: the verification path is public and reproducible.

{% hint style="info" %}
**MACH is not asking you to trust MACH.** It is asking you to trust a regulated
anchor's signature, and it makes that signature independently verifiable. If MACH
relayed a settlement that no anchor signed, the proof would fail to verify against
the anchor's published key, and the contract would reject it.
{% endhint %}

## The trust model, stated plainly

MACH's security reduces to a small, auditable set of assumptions:

| Assumption | Why it is reasonable | What breaks if it fails |
| --- | --- | --- |
| The anchor's `SIGNING_KEY` in `stellar.toml` is authentic. | Served over TLS from a domain the anchor controls, which is the same assumption every SEP-10 authentication already makes. | An attacker controlling the anchor's DNS or hosting could forge notifications. Mitigated by pinning known anchor keys per deployment. |
| The anchor reports credits honestly. | The anchor is a regulated custodian holding the fiat, so misreporting is a licensing matter and not merely a protocol one. | A malicious anchor could signal a payment that did not occur, which is the same exposure any fiat on-ramp carries. |
| Ed25519 signature verification is sound. | Standard cryptographic assumption. | Universal failure, out of scope. |

Note what is *not* on this list: MACH's own honesty. The middleware cannot forge a
settlement, because it cannot produce a signature over a payload that verifies
against the anchor's key. At worst it can **fail to relay**, which is a liveness
failure rather than a safety one, and one the liquidation time-lock in the
contract is designed to absorb.

This is the property that separates a payment oracle worth building from a
webhook with extra steps: the relay is untrusted by construction.

## Design consequences

Because MACH authenticates rather than aggregates:

* **There is no consensus round.** One valid signature from the correct anchor is
  sufficient. Adding relayers would add liveness, not safety.
* **There is no staking or slashing.** There is nothing for a relayer to lie
  about; an invalid proof simply fails verification.
* **Replay protection is mandatory.** Since a single signed message authorises
  settlement, that message must be bound to one invoice and consumed exactly
  once. The contract enforces this; see
  [Protocol Architecture](../protocol/architecture.md).
* **Failure is fail-closed.** An unverifiable notification produces no state
  change at all. There is no degraded mode in which MACH settles on a payload it
  could not authenticate.

[**The SEP Stack**](../protocol/sep-stack.md) covers the standards this depends
on, and [**The SEP-59 Oracle Workflow**](../protocol/sep-59-oracle-workflow.md)
walks the full path from provisioning to execution.
