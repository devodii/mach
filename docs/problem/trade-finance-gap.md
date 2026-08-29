# The Trade Finance Gap

## A $2.5 trillion shortfall

The Asian Development Bank's Trade Finance Gaps survey has, for the better part of
a decade, measured the difference between trade finance that is *requested* and
trade finance that is *supplied*. The figure most often cited is **$2.5 trillion**
— the volume of viable trade that does not happen because no institution will fund
it.

The gap is not a pricing problem. It is a **verification cost** problem.

The rejected applications are overwhelmingly from small and medium-sized
enterprises in emerging markets, and the reason given is almost never "this
business is not creditworthy." It is that the cost of establishing whether the
business is creditworthy — and then monitoring the transaction until it settles —
exceeds the margin available on the facility. A bank can profitably underwrite a
$40 million shipment. It cannot profitably underwrite a $40,000 one using the same
manual process.

| Where the cost sits | Why it does not shrink |
| --- | --- |
| KYC and counterparty diligence | Repeated per relationship, rarely reusable |
| Document verification | Paper, PDFs, and email; no canonical source |
| Payment reconciliation | A human matching a bank statement to an obligation |
| Ongoing monitoring | Manual until the facility closes |

Digitisation has attacked the first two lines for years. The third — reconciling a
payment against an obligation — is the one that has resisted, because it requires
a system inside the bank's perimeter to tell a system outside it that money
arrived. That is precisely the boundary MACH addresses.

## Self-liquidating invoices are the holy grail of RWA

Most real-world-asset tokenisation to date has taken an asset, wrapped it, and
left the hard part — what happens when the underlying obligation is discharged —
to an off-chain administrator. The token is a claim; redeeming the claim is a
phone call.

A **self-liquidating invoice** inverts this. It is an instrument that:

1. Is issued on-chain, against a specific receivable, with terms encoded in a contract.
2. Receives payment through a rail bound to that specific instrument and no other.
3. **Discharges itself** the moment payment is verified — releasing collateral,
   paying the lender, and closing the position without an administrator in the loop.

This is the holy grail of RWA because it is the point at which a tokenised asset
stops being a representation of an off-chain process and becomes the process. The
contract is not a record of settlement; the contract *is* settlement.

The barrier has never been the contract. Soroban can express the logic. The
barrier is that the contract cannot see the payment.

## T+0 Settlement Finality

MACH's primary value proposition is **T+0 Settlement Finality**: the invoice
discharges in the same ledger close as the verified payment notification, not on
the next business day and not after a reconciliation cycle.

Consider the two timelines for the same $250,000 receivable.

**Today — T+3, manual**

| Hour | Event |
| --- | --- |
| 0 | Buyer wires funds. |
| 0–24 | Funds land; bank statement updates. |
| 24–60 | An operations analyst reconciles the credit against the invoice. |
| 60–72 | Lender is notified; collateral is released by manual instruction. |
| **72** | **Position closes.** |

**With MACH — T+0**

| Elapsed | Event |
| --- | --- |
| 0s | Buyer wires funds to the invoice's virtual account. |
| ~0s | Anchor observes the credit, fires a signed `on_change_callback`. |
| < 1s | MACH validates the anchor signature against its SEP-1 `SIGNING_KEY`. |
| ~5s | Soroban executes `execute_settlement`; collateral releases atomically. |
| **~5s** | **Position closes.** |

### Why the 72 hours are expensive

The lag is not merely inconvenient. Every hour of it is priced:

* **Counterparty risk.** For three days, the lender holds an obligation that has
  economically been satisfied but not legally released. That exposure is capital
  the lender must reserve against.
* **Capital velocity.** A facility that recycles in three days can be redeployed
  roughly 120 times a year. One that recycles in seconds is bounded by
  origination, not by operations.
* **Minimum viable ticket size.** Manual reconciliation has a fixed cost per
  settlement. That fixed cost is what sets the floor on deal size — and that floor
  is what excludes the SMEs who constitute the gap.

Compressing settlement from 72 hours to one ledger close does not make an existing
process faster. It removes the fixed per-settlement cost that made small tickets
uneconomic in the first place. That is the mechanism by which infrastructure of
this kind addresses a $2.5 trillion gap: not by lending more, but by making small
lending cost what it should.

## What this requires

For T+0 finality to be real rather than marketing, three properties must hold:

1. **The payment signal must be attributable.** A notification must be provably
   from the regulated anchor, not from anyone who can reach an HTTP endpoint.
2. **The payment signal must be unambiguous.** A credit must map to exactly one
   invoice, with no reconciliation heuristics. This is what per-invoice virtual
   account provisioning buys.
3. **Execution must be atomic.** Verification and settlement cannot be separated
   by a window in which partial state exists.

The next page explains why an oracle is the right primitive for property one, and
why the oracles the ecosystem already has are the wrong kind.
