# Safety First Web

React, TypeScript and Vite render a starter at `/`. TanStack Router, Query and Zod are dependencies available for the planned classroom dashboard.

## Local development

Install Node.js 24 and pnpm 10.25.0. From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm lint
pnpm typecheck
pnpm build
```

Open the URL Vite prints. Use `pnpm preview` to serve `dist/`, and `pnpm format` for intentional formatting. Biome skips Markdown. If Windows checkout conversion introduces CRLF diagnostics, verify the affected files with an LF checkout matching CI. No unit test script is currently defined.

The starter makes no API requests. The Docker build accepts public `VITE_API_BASE_URL` for the planned client. Use the target API origin when wiring the client. Verify API CORS for the exact web origin. Keep connection strings, tokens and other credentials out of Vite build variables. Build the local image with `docker build -t safety-first-web:local .`.

## Repository layout

```text
index.html                        # Vite document entry
src/
  main.tsx                        # React mount
  App.tsx, App.css                # starter view
  index.css, assets/              # global styles and starter assets
public/                           # static icon assets
docs/                             # PRD and design
.github/workflows/image.yml       # lint, typecheck and Vite Docker build
Dockerfile, nginx.conf            # image and SPA fallback
```

## Deployment

The web and API images run behind Caddy on the Ubuntu VPS. Nginx in the web image serves the built assets on port 8080. The API alone accesses Neon. Coordinate the tested image pair using the API repository deployment runbook.

[Product requirements](docs/PRD.md) · [Technical design](docs/DESIGN.md) · [Contributing](CONTRIBUTING.md) · [Agent instructions](AGENTS.md)
