# MACH Protocol

The Fiat-to-Soroban Settlement Layer: landing page and technical specification.

|              | Path            | Local URL             |
| ------------ | --------------- | --------------------- |
| Landing page | [`web/`](web)   | http://localhost:3000 |
| Gitbook      | [`docs/`](docs) | http://localhost:4000 |

## Quick start

```bash
docker compose up          # web on :3000, docs on :4000
docker compose down        # stop
```

Or run the site natively and the docs in Docker:

```bash
cd web && pnpm install && pnpm dev
docker compose up docs
```

Both hot-reload from the host filesystem.

## Configuration

```bash
cd web && cp .env.example .env.local
```

| Variable               | Default                 | Purpose                                                       |
| ---------------------- | ----------------------- | ------------------------------------------------------------- |
| `NEXT_PUBLIC_DOCS_URL` | `http://localhost:4000` | Where the specification is published. Drives every docs link. |

`.env` holds the committed default and is tracked. `.env.local` is yours and is
gitignored. `NEXT_PUBLIC_*` is inlined at build time, so changing it needs a
rebuild rather than a restart, and nothing secret belongs behind that prefix.

## Landing page

Next.js 14 (App Router), Tailwind 3, shadcn/ui, Framer Motion, TypeScript.

```bash
cd web
pnpm dev         # dev server
pnpm build       # production build
pnpm typecheck   # tsc --noEmit
pnpm lint        # next lint
```

## Gitbook

`docs/` is a real GitBook repository. Point GitBook.com at it with `docs/` as the
content root and it syncs unchanged.

| Page                       | File                                      |
| -------------------------- | ----------------------------------------- |
| Introduction               | `docs/README.md`                          |
| The Visibility Gap         | `docs/concepts/visibility-gap.md`         |
| The Role of the Oracle     | `docs/concepts/role-of-the-oracle.md`     |
| The SEP Stack              | `docs/protocol/sep-stack.md`              |
| The SEP-59 Oracle Workflow | `docs/protocol/sep-59-oracle-workflow.md` |
| Protocol Architecture      | `docs/protocol/architecture.md`           |

Written for engineers evaluating or integrating the protocol. No market sizing,
no pitch.

GitBook.com has no offline renderer, so the local preview uses
[honkit](https://github.com/honkit/honkit), which reads the same `SUMMARY.md`.
It runs in Docker because honkit pulls a large legacy dependency tree. Two local
plugins bridge the gap, and neither affects what GitBook.com publishes:
`docs/.honkit/plugin-mermaid` renders diagrams with a current Mermaid, and
`docs/.honkit/plugin-hints` renders GitBook `{% hint %}` blocks.

> honkit's watcher only follows markdown. After editing `docs/styles/`,
> `docs/book.json`, or anything under `docs/.honkit/`, run
> `docker compose restart docs`. Changes under `docs/.honkit/` or
> `docs/Dockerfile` need `docker compose build docs` first.

The Rust in the architecture page is compile-verified against `soroban-sdk` 22.
Note `U256` and `Bytes` come from `soroban_sdk`, since `u256` is not a Rust
primitive, and `Error` is a `#[contracterror] #[repr(u32)]` enum.
