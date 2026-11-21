# Safety First Web

React + TypeScript + Vite starter. Uses pnpm 10.25.0, TypeScript 7 and Biome for linting/formatting. Application features have not been implemented.

## Development

Install the pinned pnpm version, then run:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## Checks

```sh
pnpm lint
pnpm typecheck
pnpm build
```

Use `pnpm format` to format files. Commit `pnpm-lock.yaml`; use pnpm consistently in development, CI and Docker. Do not restore package-lock.json or the removed ESLint config.

The packageManager field pins pnpm. CI/Docker must install that exact version before running a frozen-lockfile install. The earlier npm-based Docker/CI templates need to be adapted when added to this repository.

Shared project context: https://linear.app/ligtas-labs/team/LIG/overview

# Safety First Web

React, TypeScript, Vite, TanStack and Biome. Install Node 22.20+ and pnpm 10.25.0, then run `pnpm install --frozen-lockfile` and `pnpm dev`. Open the address printed by Vite. Run `pnpm lint`, `pnpm typecheck` and `pnpm build`. Use `pnpm format` for intentional formatting and `pnpm preview` to inspect the build. The proposed Docker image serves dist with SPA fallback. Use a public API base URL in the client configuration when wiring requests. Never put a database connection or API secret in Vite variables. Production web origin: https://safety-first.michaelconstantino.dev.


## Product scope

Let teachers assign and review work and let students inspect their confirmed progress.

[Requirements](docs/PRD.md) · [Design](docs/DESIGN.md) · [Contributing](CONTRIBUTING.md) · [Agent instructions](AGENTS.md)
