# MACH Protocol

The Fiat-to-Soroban Settlement Layer — landing page and technical specification.

| | Path | Local URL |
| --- | --- | --- |
| Landing page | [`web/`](web) | http://localhost:3000 |
| Gitbook | [`docs/`](docs) | http://localhost:4000 |

---

## Quick start

### Native (fastest)

```bash
# Landing page
cd web && pnpm install && pnpm dev        # http://localhost:3000

# Gitbook preview (needs Docker; see below for why)
docker compose up docs                     # http://localhost:4000
```

### Everything in Docker

```bash
docker compose up          # web on :3000, docs on :4000
docker compose up web      # just the landing page
docker compose up docs     # just the Gitbook
docker compose down        # stop
```

Both services hot-reload from the host filesystem — edit `web/src/**` or
`docs/**` and the browser updates.

> First `docker compose up web` takes ~60s while pnpm installs into the
> container's own `node_modules` volume. Subsequent starts are a few seconds.

---

## The landing page

Next.js 14 (App Router) · Tailwind CSS 3 · shadcn/ui · Framer Motion · TypeScript.

```bash
cd web
pnpm dev         # dev server
pnpm build       # production build
pnpm start       # serve the production build
pnpm typecheck   # tsc --noEmit
pnpm lint        # next lint
```

### Design system

Institutional Brutalism. Three literal colors, square corners everywhere, hairline
rules, no shadows, no gradients in the UI chrome.

| Token | Value | Use |
| --- | --- | --- |
| `ink` | `#000000` | Page ground |
| `paper` | `#FFFFFF` | Text, inverted CTA band |
| `tech` | `#111111` | Panels, the settlement-flow band |
| `hairline` | `#FFFFFF` @ 14% | 1px rules |

**On the hairline.** The brief specified 1px solid gray borders alongside
`#111111` as the only gray. A literal `#111111` border on a `#000000` ground is
invisible on most displays, and on a `#111111` panel it disappears entirely. So
rules are white at low alpha, which composites to roughly `#1a1a1a` over black and
`#252525` over the gray panel — still strictly grayscale, one rule that reads on
both grounds. It is a single token: change `--hairline` in
`web/src/app/globals.css` to go fully solid.

Type is **Geist Sans / Geist Mono**, loaded from the `geist` npm package rather
than Google Fonts, so builds need no network and the font never flashes.

### The hero visual

No image was supplied, so the container is drawn procedurally as an SVG technical
elevation — corrugation, corner castings, door bars, stencilling — under an
animated light beam. Nothing is fetched at runtime.

To swap in a real photograph, **drop a grayscale image at `web/public/hero.jpg`**
(`.png` and `.webp` also work). `web/src/app/page.tsx` detects it at build time and
renders it through `next/image` with the same beam framing. No code change needed.

The beacon at the top of the beam is a neutral geometric mark, not the Stellar
logo — using official brand assets is a decision for you, not a default. Replace
the `<g transform="translate(600 80)">` group in
`web/src/components/container-visual.tsx` when you have clearance.

### Motion

Framer Motion, deliberately restrained: a 14px rise and a fade, nothing else.

* Above-the-fold content animates **on mount**, never on scroll — an
  IntersectionObserver-gated hero renders blank if hydration is slow.
* Below-the-fold content animates on scroll, once.
* `prefers-reduced-motion` removes all of it, including the beam.
* A `<noscript>` rule forces `[data-reveal]` visible, so the page is fully
  readable with JavaScript disabled.

### Deploying

Vercel: set the **root directory to `web/`**. No environment variables required.

---

## The Gitbook

`docs/` is a real GitBook repository — `.gitbook.yaml`, `SUMMARY.md`, and markdown.
Point GitBook.com at this repo with `docs/` as the content root and it syncs
unchanged.

| Page | File |
| --- | --- |
| Introduction | `docs/README.md` |
| The Trade Finance Gap | `docs/problem/trade-finance-gap.md` |
| The Role of the Oracle | `docs/problem/role-of-the-oracle.md` |
| The SEP-59 Oracle Workflow | `docs/protocol/sep-59-oracle-workflow.md` |
| Protocol Architecture | `docs/protocol/architecture.md` |

### Why the preview runs in Docker

GitBook.com is hosted SaaS with no offline renderer. The local preview uses
[honkit](https://github.com/honkit/honkit), the maintained fork of the legacy
GitBook CLI, which reads **the same `SUMMARY.md` GitBook.com reads** — so local
navigation is the navigation that ships. It is containerised because honkit pulls
a large legacy dependency tree that has no business in your global npm.

Two pieces bridge the renderers:

* **Mermaid** — ` ```mermaid ` fences render natively on GitBook.com. Locally,
  `docs/.honkit/plugin-mermaid` drives a vendored Mermaid 11. (The obvious choice,
  `gitbook-plugin-mermaid-gb3`, bundles a v7-era Mermaid that renders a silent
  empty box for `autonumber`, `stateDiagram-v2` and `flowchart` — i.e. most of
  the diagrams here.)
* **Hints** — `{% hint style="..." %}` is GitBook-native. `docs/.honkit/plugin-hints`
  translates them into blockquotes for the preview, so the source stays valid
  GitBook rather than being dumbed down for honkit.

Neither affects what GitBook.com publishes.

### Rust in the docs

The Soroban interfaces on the architecture page are compile-verified against
`soroban-sdk` 22, not hand-written pseudocode. Note that the trait uses `U256` and
`Bytes` from `soroban_sdk` — `u256` is not a Rust primitive — and `Error` is a
`#[contracterror] #[repr(u32)]` enum, which is what Soroban requires across the
host boundary.

---

## Verified locally

| Check | Result |
| --- | --- |
| `pnpm typecheck` | clean |
| `pnpm build` | clean, 4/4 static pages, 144 kB First Load JS |
| `pnpm lint` (via build) | clean |
| Horizontal overflow @ 390 / 768 / 1440 | none |
| Scroll reveals fire at all three widths | all, none stuck at opacity 0 |
| Gitbook: 5 pages | all HTTP 200, no template errors |
| Mermaid diagrams render | yes — sequence 729px, state 582px, flowchart 296px (screenshot-verified) |
| Rust snippets | `cargo check` clean against `soroban-sdk` 22 |
| `docker compose up web` / `docs` | both serve |

---

## Notes

* **No team section.** Omitted at your request.
* **SEP maturity is labelled honestly.** SEP-38 is marked `STABLE`, SEP-45 `DRAFT`,
  and SEP-59 / SEP-56 `PROPOSED`, in both the SEP grid and the docs. Reviewers are
  protocol specialists; presenting an in-flight proposal as ratified is a fast way
  to lose them. Change the `status` field in `web/src/data/seps.ts` if you have
  better information.
* **`docs.mach.finance`** is wired to every CTA and the footer.
* **`web/.pnpm-store/`** appears as an empty directory if you run the web
  container — it is a Docker mountpoint for the volume that holds pnpm's store,
  and it is gitignored. The ~370MB lives in the volume, not your source tree.
