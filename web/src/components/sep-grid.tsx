import { Reveal } from "@/components/reveal";
import { SEPS } from "@/data/seps";
import { cn } from "@/lib/utils";

export function SepGrid() {
  return (
    <section id="stack" className="border-b border-hairline/[0.14]">
      <div className="shell py-24 md:py-32">
        <Reveal>
          <p className="label">02 — The Stack</p>
          <h2 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.06] tracking-tightest sm:text-5xl">
            Four standards, one settlement path.
          </h2>
          <p className="mt-7 max-w-2xl leading-relaxed text-paper/45">
            MACH does not invent a new interface for banks or lenders. It composes
            ratified and in-flight Stellar Ecosystem Proposals into a single
            executable path from a fiat credit to a contract state change.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-16 grid grid-cols-1 border border-hairline/[0.14] md:grid-cols-2">
            {SEPS.map((sep, i) => (
              <article
                key={sep.id}
                className={cn(
                  "group relative flex flex-col bg-ink p-8 transition-colors duration-300 hover:bg-tech sm:p-10",
                  // Shared hairlines: draw right/bottom, then drop the ones
                  // that would double up against the outer frame.
                  "border-b border-hairline/[0.14]",
                  i === SEPS.length - 1 && "border-b-0",
                  "md:border-r",
                  i % 2 === 1 && "md:border-r-0",
                  i >= SEPS.length - 2 && "md:border-b-0"
                )}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper/35">
                      SEP
                    </span>
                    <span className="text-5xl font-bold leading-none tracking-tightest sm:text-6xl">
                      {sep.id}
                    </span>
                  </div>
                  <span className="border border-hairline/[0.18] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-paper/45">
                    {sep.status}
                  </span>
                </div>

                <h3 className="mt-8 text-lg font-semibold leading-snug tracking-tight">
                  {sep.role}
                </h3>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-paper/30">
                  {sep.name}
                </p>

                <p className="mt-5 flex-1 text-[15px] leading-relaxed text-paper/50">
                  {sep.description}
                </p>

                <p className="mt-8 border-t border-hairline/[0.14] pt-5 font-mono text-[11px] tracking-tight text-paper/35">
                  {sep.surface}
                </p>
              </article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
