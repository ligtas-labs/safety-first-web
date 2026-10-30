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
