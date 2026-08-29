import { SITE, SPEC_URL } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-ink">
      <div className="shell flex flex-col gap-8 py-14 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[17px] font-bold tracking-tightest">MACH</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-paper/35">
            A middleware settlement engine for the Stellar network. MACH does not
            hold funds; it governs the logic of settlement.
          </p>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <a
            href={SPEC_URL}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-paper/60 underline decoration-hairline/30 underline-offset-4 transition-colors hover:text-paper hover:decoration-paper"
          >
            docs.mach.finance
          </a>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-paper/25">
            &copy; {new Date().getFullYear()} {SITE.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
