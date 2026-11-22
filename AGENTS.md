# Safety First Web agent instructions

- **Start here.** Read the task and any linked Linear issue. Use the [README](README.md) for setup, [CONTRIBUTING](CONTRIBUTING.md) for workflow, and the relevant sections of the [PRD](docs/PRD.md) or [design](docs/DESIGN.md) for behavior. Follow any more specific instructions in the directory you edit.
- **Respect product decisions.** Use approved safety content, scoring rules and integration contracts. Surface unresolved decisions to the task owner before implementing them. Use synthetic fixtures and keep secrets and participant data out of code, prompts, logs and evidence.
- **Keep changes local to the feature.** Keep Vite entry points and public URLs stable. Put feature code under `src/features/` as it lands and colocate tests. Test through visible UI and role/name queries. Check keyboard use and responsive layout when UI changes.
- **Verify behavior.** Start behavior changes with a failing test where supported, make it pass, then refactor. Run `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm build`. Report observed results and checks left open.
