# MACH Protocol

The Fiat-to-Soroban Settlement Layer: landing page and technical specification.

| | Path | Local |
| --- | --- | --- |
| Landing page | `web/` | http://localhost:3000 |
| Docs | `docs/` | http://localhost:4000 |

Docs are live at https://devodii.github.io/mach/

## Run everything

```bash
docker compose up      # web on :3000, docs on :4000
docker compose down
```

## Run the site natively

```bash
cd web
cp .env.example .env.local
pnpm install
pnpm dev
```

Other commands:

```bash
pnpm build       # production build
pnpm typecheck   # tsc --noEmit
pnpm lint        # next lint
```

The docs still need Docker:

```bash
docker compose up docs
```
