<div align="center">

# Safety First Web

[![React 19](https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript 7](https://img.shields.io/badge/TypeScript-7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite 8](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Vitest tests](https://img.shields.io/badge/Vitest-tests-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![pnpm 10.25](https://img.shields.io/badge/pnpm-10.25-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)

</div>

[About](#about) · [Local development](#local-development) · [Configuration](#configuration) · [Testing](#testing) · [Repository layout](#repository-layout) · [Deployment](#deployment) · [Contributing](#contributing)

## About

Safety First Web is the teacher-facing web app for the Safety First construction safety learning platform. The current foundation serves a starter page at `/`. Classroom, assignment and progress workflows are planned.

| Area | Stack |
| --- | --- |
| UI and build | React 19, TypeScript 7, Vite 8 |
| Routing, server state and validation | TanStack Router, TanStack Query and Zod are installed for future features |
| Formatting and quality | Biome, Vitest, React Testing Library, jsdom, Husky and Commitlint |
| Container serving | Nginx with SPA fallback |

## Local development

Install [Node.js 24](https://nodejs.org/) and [Git](https://git-scm.com/). Install pnpm with `npm install --global pnpm@10.25.0`.

```sh
git clone https://github.com/ligtas-labs/safety-first-web.git
cd safety-first-web
pnpm install --frozen-lockfile
pnpm dev
```

Open the URL Vite prints. Use `pnpm build` then `pnpm preview` to inspect the production build locally. Use `pnpm format` for intentional formatting changes.

## Configuration

The starter runs with no environment file and makes no API requests.

| Setting | Where to set it | Purpose |
| --- | --- | --- |
| `VITE_API_BASE_URL` | `.env.local` for local Vite development or Docker build argument | Public API origin for the planned typed API client. The image passes this value to Vite at build time. |

Vite exposes `VITE_*` values to the browser. Keep secrets and connection strings on the server. When connecting the client, check that API CORS allows the exact web origin.

## Testing

Use **test-driven development** for new behavior and regressions. Start with one failing test, write the smallest fix, then refactor with the suite green. Colocate tests with the feature and verify accessible UI behavior through React Testing Library. See [the contributor workflow](CONTRIBUTING.md#test-driven-development).

```sh
pnpm test                    # run once
pnpm test:watch              # rerun during development
pnpm test src/App.test.tsx   # run one test file
pnpm lint
pnpm typecheck
pnpm build
```

The smoke test verifies the starter's visible counter interaction without a backend. Use a browser for keyboard controls, responsive layout and direct-link checks when relevant. Biome skips Markdown. If a Windows checkout produces CRLF diagnostics, verify formatting in an LF checkout matching CI.

## Repository layout

| Path | Purpose |
| --- | --- |
| `index.html`, `src/main.tsx` | Vite entry and React mount |
| `src/App.tsx`, `src/App.test.tsx` | Starter app and interaction test |
| `src/index.css`, `src/assets/`, `public/` | Global styles, imported assets and static files |
| `Dockerfile`, `nginx.conf`, `.github/workflows/image.yml` | Build checks and SPA serving |
| `docs/` | Product requirements and technical design |

Add new product features under `src/features/<feature>/` as they land and keep cross-feature code in `src/shared/` when needed. See the [React + TypeScript folder structure reference](https://dev.to/pramod_boda/industry-standard-react-typescript-folder-structure-c7d).

## Deployment

```sh
docker build -t safety-first-web:local .
docker run --rm -p 8080:8080 safety-first-web:local
```

Open `http://localhost:8080`. The image build runs lint, type checking, tests and the production build. Web and API images run behind Caddy on the Ubuntu VPS. Coordinate deployments using the [API deployment runbook](https://github.com/ligtas-labs/safety-first-api/blob/setup/lig-7-foundation/docs/deployment.md).

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) for the Linear issue workflow, testing expectations and PR checklist. For agent-assisted work, use [AGENTS.md](AGENTS.md) and the [optional skills instructions](CONTRIBUTING.md#optional-agent-skills).

## Project links

[Web](https://github.com/ligtas-labs/safety-first-web) · [API](https://github.com/ligtas-labs/safety-first-api) · [Mobile](https://github.com/ligtas-labs/safety-first-mobile) · [Linear handbook](https://linear.app/ligtas-labs/document/developer-handbook-web-caa3c910b5ba)

[Product requirements](docs/PRD.md) · [Technical design](docs/DESIGN.md) · [Contributing](CONTRIBUTING.md) · [Agent instructions](AGENTS.md)
