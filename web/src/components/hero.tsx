import { ArrowUpRight } from "lucide-react";

import { ContainerVisual } from "@/components/container-visual";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { SITE, SPEC_URL } from "@/lib/site";

interface HeroProps {
  photograph?: string | null;
}

export function Hero({ photograph }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-hairline/[0.14]">
      <div className="grid-field pointer-events-none absolute inset-0 opacity-70" />

      <div className="shell relative pt-20 md:pt-28">
        <Reveal mode="mount">
          <p className="label">Stellar · Soroban · Settlement Infrastructure</p>
        </Reveal>

        <Reveal mode="mount" delay={0.06}>
          <h1 className="mt-7 max-w-5xl text-balance text-[40px] font-bold leading-[1.03] tracking-tightest sm:text-6xl lg:text-[76px]">
            {SITE.tagline}
          </h1>
        </Reveal>

        <Reveal mode="mount" delay={0.12}>
          <p className="mt-8 max-w-2xl text-pretty text-base leading-relaxed text-paper/55 sm:text-lg">
            {SITE.description}
          </p>
        </Reveal>

        <Reveal mode="mount" delay={0.18}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" asChild>
              <a href={SPEC_URL} target="_blank" rel="noreferrer">
                Review the Protocol Specification
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#flow">See the settlement path</a>
            </Button>
          </div>
        </Reveal>
      </div>

      {/* Visual sits flush to the section edges — the frame is the page itself. */}
      <Reveal mode="mount" delay={0.24} className="relative mt-16 md:mt-20">
        <div className="border-t border-hairline/[0.14]">
          <ContainerVisual photograph={photograph} />
        </div>
      </Reveal>
    </section>
  );
}
