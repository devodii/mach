# Introduction

MACH is a **middleware settlement engine** for the Stellar network.

It sits between two systems that cannot see each other: the global banking rails
where trade payments actually move, and Soroban, where the obligations those
payments discharge are represented as contracts. MACH's only job is to carry a
verified fact across that boundary — *this invoice has been paid* — and to do it
with cryptographic provenance rather than a human attestation.

## What MACH is

MACH is infrastructure, not an application. Concretely, it is three things:

| Component | Responsibility |
| --- | --- |
| **Provisioning service** | Requests a dedicated receiving instrument (a virtual IBAN or local-rail account) from a regulated anchor, bound one-to-one to a single on-chain invoice. |
| **Verification middleware** | Receives anchor payment notifications, resolves the anchor's signing key from its `stellar.toml`, and validates the signature before any payload is treated as true. |
| **Authorization relay** | Converts a verified payment notification into a signed Soroban authorization entry that invokes settlement on the invoice contract. |

Everything else — origination, underwriting, pricing, KYC, custody of fiat, custody
of collateral — belongs to somebody else. MACH is deliberately small.

## What MACH is not

{% hint style="warning" %}
**MACH does not hold funds.** This is the single most important property of the
design, and every other decision in this specification follows from it.
{% endhint %}

MACH never takes custody of fiat or of digital assets. It has no omnibus account,
no treasury, no pooled balance, and no ability to move a user's money.

* The **fiat sits with the anchor**, a regulated entity already licensed to hold it.
* The **collateral sits in the Soroban contract**, governed by contract logic.
* **MACH holds only the authority to relay a proof it has independently verified.**

The distinction matters legally and technically. A protocol that custodies funds
inherits the regulatory perimeter of a money transmitter and the blast radius of a
hot wallet. MACH governs *the logic of settlement* between bank accounts and
Soroban; it does not stand in the payment path.

## Why middleware is the right shape

A tokenised invoice is a contract that must react to an event occurring outside
the ledger. There are only three ways to make that happen:

1. **A human confirms it.** This is the status quo, and it costs roughly 72 hours
   per settlement. It also reintroduces exactly the discretionary trust that
   moving on-chain was supposed to remove.
2. **The contract queries the bank.** Contracts cannot make outbound calls, and
   banks do not expose ledgers to anonymous callers. This is not available.
3. **A verifiable relay carries a signed attestation from a party the bank already
   trusts.** This is MACH.

Option three works because the regulated anchor is *already* the entity that sees
the fiat credit and is *already* required to be identifiable on-chain via SEP-1.
MACH does not ask anyone to trust it. It asks them to trust the anchor's
signature, and it makes that signature checkable by anyone.

## Trust boundaries

```
┌───────────────┐   fiat    ┌──────────────┐  signed   ┌──────────────┐  authz   ┌──────────────┐
│ Buyer's bank  │ ────────► │ Anchor       │ ────────► │ MACH         │ ───────► │ Soroban      │
│               │           │ (custodian,  │  webhook  │ (verifier,   │  entry   │ (settlement, │
│               │           │  regulated)  │           │  no custody) │          │  collateral) │
└───────────────┘           └──────────────┘           └──────────────┘          └──────────────┘
                                    ▲                          │
                                    └──────────────────────────┘
                                      SEP-1 SIGNING_KEY lookup
```

The only trusted assertion in the system is the anchor's signature over a payment
notification. If that signature does not verify, MACH does nothing — no
settlement, no partial state, no retry against an unverified payload.

## The standards MACH composes

MACH is not a new interface for banks or lenders. It composes existing Stellar
Ecosystem Proposals into one executable path:

| Standard | Status | Role in MACH |
| --- | --- | --- |
| SEP-1 | Stable | Resolves the anchor's `SIGNING_KEY` for notification verification. |
| SEP-38 | Stable | Firm, time-bound quotes for cross-asset settlement. |
| SEP-45 | Draft | Contract-account (C-address) identity for the business. |
| SEP-59 | Proposed | Virtual account provisioning and the payment webhook. |
| SEP-56 | Proposed | Tokenised vault interface for institutional lenders. |

{% hint style="info" %}
Two of these standards are still moving. We label them as proposed rather than
final on purpose — MACH is built against them and contributes to them, but a
specification that overstates the maturity of its dependencies is not one an
engineer should trust.
{% endhint %}

## Where to go next

* [**The Trade Finance Gap**](problem/trade-finance-gap.md) — the market MACH exists to serve.
* [**The Role of the Oracle**](problem/role-of-the-oracle.md) — why payment data, not price data.
* [**The SEP-59 Oracle Workflow**](protocol/sep-59-oracle-workflow.md) — the verification path, step by step.
* [**Protocol Architecture**](protocol/architecture.md) — the Soroban contract interface.
