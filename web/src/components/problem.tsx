import { Reveal } from "@/components/reveal";

const LEDGER = [
  { k: "Manual verification lag", v: "72 HOURS", note: "Bank confirmation to lender action" },
  { k: "MACH settlement finality", v: "T+0", note: "Anchor notification to contract execution" },
  { k: "Trust surface removed", v: "1 PARTY", note: "The human reconciling a bank statement" },
];

export function Problem() {
  return (
    <section id="problem" className="border-b border-hairline/[0.14]">
      <div className="shell grid gap-14 py-24 md:grid-cols-12 md:py-32">
        <div className="md:col-span-5">
          <Reveal>
            <p className="label">01 / The Problem</p>
            <h2 className="mt-6 text-4xl font-bold leading-[1.06] tracking-tightest sm:text-5xl">
              The Visibility Gap.
            </h2>
          </Reveal>
        </div>

        <div className="md:col-span-7">
          <Reveal delay={0.08}>
            <p className="text-xl leading-relaxed text-paper/75 sm:text-2xl">
              RWA lending on Stellar currently suffers from a 72-hour manual
              verification lag. MACH eliminates this bottleneck.
            </p>
            <p className="mt-8 max-w-xl leading-relaxed text-paper/45">
              A smart contract cannot see a bank account. When a buyer wires funds
              against a tokenised invoice, the ledger has no way to know it
              happened, so a person reads a statement, confirms the credit, and
              triggers settlement by hand. That person is the bottleneck, and the
              window they occupy is where counterparty risk lives.
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <dl className="mt-14 border-t border-hairline/[0.14]">
              {LEDGER.map((row) => (
                <div
                  key={row.k}
                  className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b border-hairline/[0.14] py-5"
                >
                  <div>
                    <dt className="text-sm text-paper/70">{row.k}</dt>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/30">
                      {row.note}
                    </p>
                  </div>
                  <dd className="font-mono text-2xl font-medium tracking-tight sm:text-3xl">
                    {row.v}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
