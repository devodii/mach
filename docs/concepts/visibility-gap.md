# The Visibility Gap

A Soroban contract cannot see a bank account. That single limitation is the
reason MACH exists, and everything in this specification is downstream of it.

## The gap, stated precisely

When a buyer wires funds against a tokenised invoice, two things are true at the
same time:

* The obligation has been economically satisfied. The money has moved.
* The ledger has no way to know it. No contract can observe a credit posting
  inside a commercial bank.

Nothing in the Stellar protocol closes that distance. Contracts are
deterministic and sandboxed: they cannot open a socket, poll an API, or read a
bank statement. So the fact has to be carried across the boundary by something
else.

Today that something else is a person.

## What the manual path costs

The status quo for RWA lending on Stellar is a human reconciliation loop:

| Stage | Typical elapsed |
| --- | --- |
| Buyer wires funds | 0 |
| Funds land, bank statement updates | 0 to 24 hours |
| An operations analyst reconciles the credit against the invoice | 24 to 60 hours |
| Lender is notified, collateral released by manual instruction | 60 to 72 hours |
| **Position closes** | **~72 hours** |

Three consequences follow, and all three are operational rather than
theoretical:

1. **A window of counterparty risk.** For three days the lender holds an
   obligation that has been paid but not released. That exposure has to be
   reserved against.
2. **A fixed cost per settlement.** Reconciliation costs roughly the same whether
   the invoice is for $40,000 or $40 million. That fixed cost sets a floor on
   viable deal size.
3. **Discretionary trust.** A person decides when settlement happens. That is
   precisely the trust that moving on-chain was meant to remove.

## Self-liquidating invoices

A **self-liquidating invoice** is the construct MACH is built to support. It is
an instrument that:

1. Is issued on-chain against a specific receivable, with terms encoded in a
   contract.
2. Receives payment through a rail bound to that instrument and no other.
3. **Discharges itself** the moment payment is verified, releasing collateral,
   paying the lender, and closing the position with no administrator in the loop.

The distinction from most tokenised real-world assets is step three. A typical
RWA token is a claim on an off-chain process, and redeeming it means contacting
an administrator. A self-liquidating invoice is not a record of settlement; the
contract *is* settlement.

The barrier has never been the contract. Soroban can express the logic. The
barrier is that the contract cannot see the payment.

## T+0 Settlement Finality

MACH's core property is **T+0 Settlement Finality**: the invoice discharges in
the same ledger close as the verified payment notification, rather than on the
next business day or after a reconciliation cycle.

The same $250,000 receivable, settled through MACH:

| Elapsed | Event |
| --- | --- |
| 0s | Buyer wires funds to the invoice's virtual account. |
| ~0s | Anchor observes the credit and fires a signed `on_change_callback`. |
| < 1s | MACH validates the anchor signature against its SEP-1 `SIGNING_KEY`. |
| ~5s | Soroban executes `execute_settlement`; collateral releases atomically. |
| **~5s** | **Position closes.** |

Compressing settlement from 72 hours to one ledger close is not simply the same
process running faster. It removes the fixed per-settlement cost that made small
facilities uneconomic, which is what changes the range of invoices that can be
financed at all.

## What T+0 actually requires

For that latency to be real rather than aspirational, three properties must hold.
The rest of this specification is about making each one true.

| Property | Requirement | Where it is addressed |
| --- | --- | --- |
| **Attributable** | A notification must be provably from the regulated anchor, not from anyone who can reach an HTTP endpoint. | [The Role of the Oracle](role-of-the-oracle.md) |
| **Unambiguous** | A credit must map to exactly one invoice, with no reconciliation heuristics. | [The SEP Stack](../protocol/sep-stack.md) |
| **Atomic** | Verification and settlement cannot be separated by a window in which partial state exists. | [Protocol Architecture](../protocol/architecture.md) |

The next page explains why an oracle is the right primitive for the first
property, and why the oracles the ecosystem already has are the wrong kind.
