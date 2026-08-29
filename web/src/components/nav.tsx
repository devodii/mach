import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SPEC_URL } from "@/lib/site";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline/[0.14] bg-ink/85 backdrop-blur-md">
      <div className="shell flex h-16 items-center justify-between">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="text-[17px] font-bold tracking-tightest">MACH</span>
          <span className="label hidden sm:inline">Protocol</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="#problem">Problem</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="#stack">Stack</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
            <Link href="#flow">Settlement</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={SPEC_URL} target="_blank" rel="noreferrer">
              Specification
            </a>
          </Button>
        </nav>
      </div>
    </header>
  );
}
