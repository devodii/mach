import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

/** Mirrors the Mermaid sequence in docs/protocol/sep-59-oracle-workflow.md. */
const STEPS = [
  {
    step: "01",
    actor: "Buyer",
    system: "Commercial Bank",
    detail:
      "Funds are wired to a virtual account provisioned for one invoice and no other.",
  },
  {
    step: "02",
    actor: "Anchor",
    system: "SEP-59 Callback",
    detail:
      "The regulated anchor observes the credit and fires an on_change_callback, signed with its stellar.toml key.",
  },
  {
    step: "03",
    actor: "MACH",
    system: "Signature Verification",
    detail:
      "Middleware resolves SIGNING_KEY via SEP-1 and validates X-Stellar-Signature before the payload is trusted.",
  },
  {
    step: "04",
    actor: "Soroban",
    system: "Atomic Settlement",
    detail:
      "A signed authorization entry invokes execute_settlement. The invoice discharges in the same ledger close.",
  },
];

export function Flow() {
  return (
    <section id="flow" className="border-b border-hairline/[0.14] bg-tech">
      <div className="shell py-24 md:py-32">
        <Reveal>
          <p className="label">02 / The Oracle Workflow</p>
          <h2 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.06] tracking-tightest sm:text-5xl">
            Most oracles feed price data. MACH feeds payment data.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <ol className="mt-16 grid grid-cols-1 border-l border-hairline/[0.14] sm:grid-cols-2 lg:grid-cols-4 lg:border-l-0 lg:border-t">
            {STEPS.map((s, i) => (
              <li
                key={s.step}
                className={cn(
                  "relative border-b border-r border-hairline/[0.14] p-8",
                  "lg:border-b-0",
                  i === STEPS.length - 1 && "lg:border-r-0"
                )}
              >
                <span className="font-mono text-[11px] tracking-[0.18em] text-paper/30">
                  {s.step}
                </span>
                <h3 className="mt-6 text-xl font-semibold tracking-tight">
                  {s.actor}
                </h3>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/35">
                  {s.system}
                </p>
                <p className="mt-5 text-sm leading-relaxed text-paper/45">
                  {s.detail}
                </p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-10 max-w-3xl text-sm leading-relaxed text-paper/40">
            MACH never takes custody. The virtual account belongs to the anchor,
            the collateral belongs to the contract, and the middleware holds
            nothing but the authority to relay a proof it has verified.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
