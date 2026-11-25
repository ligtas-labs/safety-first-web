# Contributing to Safety First Web

Start with the [README](README.md) for setup and supported commands. Use the [PRD](docs/PRD.md) and [technical design](docs/DESIGN.md) for requirements and design decisions.

## Project Structure

```text
safety-first-web/
├── .github/            # GitHub automation and PR templates
│   └── workflows/      # Continuous integration workflows
│       └── image.yml   # Builds and publishes the web image
├── docs/               # Requirements, design, and development guides
├── public/             # Static assets served as-is
│   ├── favicon.svg     # Browser tab icon
│   └── icons.svg       # SVG icon sprite
├── src/                # React application source
│   ├── assets/         # Images imported by the app
│   ├── App.css         # Starter view styles
│   ├── App.test.tsx    # Vitest and Testing Library interaction test
│   ├── App.tsx         # Starter app component
│   ├── index.css       # Global styles
│   └── main.tsx        # React entry point
├── biome.json          # Lint and formatting configuration
├── Dockerfile          # Installs dependencies, checks the app, and builds the image
├── index.html          # Vite HTML entry point
├── nginx.conf          # Static serving and SPA fallback
├── package.json        # Dependencies and development scripts
├── pnpm-lock.yaml      # Locked dependency versions
├── tsconfig.json       # TypeScript project references
├── tsconfig.app.json   # App and test type-check settings
├── tsconfig.node.json  # Vite config type-check settings
└── vite.config.ts      # Vite and React plugin configuration
```

## Ticket and branch workflow

1. Pick up the Linear issue and confirm ownership, affected repos, dependencies and acceptance criteria. Use stable PRD requirement IDs where they apply.
2. Create new ticket branches from an updated `development` using `<type>/<lowercase-linear-id>-<short-slug>`. Use `feature/`, `fix/`, `refactor/`, `setup/` or `docs/`. Continue work on an existing ticket branch when one is assigned. Use a descriptive branch name for unticketed work.
3. Stage one logical change, inspect `git diff --cached`, and use Conventional Commits. Example: `docs(contributing): explain the test-first workflow`.
4. Open ticket PRs into `development`. Use a descriptive title and body and keep the Linear ID in the branch name. For cross-repo work, identify dependencies and merge order. Request teammate review and wait for applicable CI.
5. Verify the integrated result on `development` and record evidence in Linear before closing the ticket. For a sprint release, open a `development` → `main` PR, use a merge commit, and include applicable artifact versions, migration and rollback steps. Tag the accepted release. Merge urgent changes on `main` back into `development`.

## Test-driven development

1. **Red**. Turn one acceptance criterion into a test at the public interface. Run it and confirm the expected failure. For a bug, reproduce the existing behavior first.
2. **Green**. Make the smallest implementation that passes. Run the same test again.
3. **Refactor**. Clean up with the test green, then run the relevant suite and [repository checks](README.md#testing). Repeat for the next criterion.

Use Vitest for pure logic and React Testing Library for rendered behavior. Colocate `*.test.ts` and `*.test.tsx` files with the code they exercise. Assert via accessible roles, names and visible outcomes. For API-backed features, exercise the component or route and substitute responses at the network boundary. Cover applicable loading, empty, denied, failure and retry states. Check keyboard use and phone/desktop layouts in a browser when the change warrants it. For docs, visual or device checks, record the environment, steps, expected result and observed result. Use synthetic fixtures. Record failures and any checks still pending.

## Code organization

Place feature-owned components, hooks, queries, validation and types in `src/features/<feature>/` as each workflow lands. Colocate tests with the behavior. Move genuinely shared UI and API configuration to `src/shared/ui/` and `src/shared/api/` when multiple callers need them. Keep Vite's entry points and the route tree at the app boundary. Preserve existing URLs and deep-link refresh.

Use PascalCase for components and types, camelCase for hooks and functions, and kebab-case for URL paths. Follow TypeScript and Biome configuration. Keep server state in TanStack Query when wiring the API, scope cache keys by the relevant account and resource, and clear protected cached data on logout or revoked access.

Reference: [React + TypeScript folder structure](https://dev.to/pramod_boda/industry-standard-react-typescript-folder-structure-c7d).

## Pull request checklist

- [ ] Summarize the observed behavior and applicable requirement IDs.
- [ ] Record checks run, observed results and any remaining verification. Include screenshots, device details or migration evidence where relevant.
- [ ] Update affected setup instructions, contracts or configuration examples.
- [ ] Keep credentials, participant data and generated files out of the diff and evidence.

## Optional agent skills

Use [AGENTS.md](AGENTS.md) for repository instructions. The team bundle is optional for local agent-assisted work. List the available skills, install a selected one in this checkout, then start a new agent session and invoke it by name.

```sh
npx skills add MJayConstantino/skills --list
npx skills add MJayConstantino/skills --skill verification-before-completion --agent codex claude-code
```

Review the skill before use. Keep participant records and secrets out of agent prompts. Review agent changes and run the relevant checks before submitting a PR.
