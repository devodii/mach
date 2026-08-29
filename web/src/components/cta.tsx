import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { SPEC_URL } from "@/lib/site";

export function Cta() {
  return (
    <section className="border-b border-hairline/[0.14] bg-paper text-ink">
      <div className="shell py-24 md:py-32">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/45">
            04 — Specification
          </p>
          <h2 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.04] tracking-tightest sm:text-6xl">
            Read the protocol before you trust it.
          </h2>
          <p className="mt-8 max-w-2xl leading-relaxed text-ink/60">
            The full specification covers the settlement engine&rsquo;s trust
            boundaries, the SEP-59 verification path, the Soroban contract
            interface, and the failure modes we design against.
          </p>

          <div className="mt-12">
            <Button
              size="lg"
              asChild
              className="bg-ink text-paper hover:bg-ink/85"
            >
              <a href={SPEC_URL} target="_blank" rel="noreferrer">
                Review the Protocol Specification
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
