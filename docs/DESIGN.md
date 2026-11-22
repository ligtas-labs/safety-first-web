# Safety First Web technical design

## Implemented foundation and feature layout

Keep `index.html`, `src/main.tsx`, global styles and assets in their Vite locations. The starter view has no product route definitions. When routing lands, use a route tree composed at the app entry and preserve URLs and deep-link refresh. Place owned UI, queries and validation under `src/features/<feature>/` as classes, assignments, progress and feedback land. Add shared UI and API client configuration in `src/shared/ui/` and `src/shared/api/` when a caller needs them.

## Planned integration

Use TanStack Router for navigation, Query for server state and Zod where contract validation is needed. Scope queries by account, class or assignment as relevant. Clear protected cached data on logout or revoked access. Use the API for authority and retain Nginx’s SPA fallback.

See the [PRD](PRD.md) for stable requirement IDs, the proposed cross-app workflow and unresolved contracts. Add planned folders with their first implementation.

## Verification

Preserve Vite entry points and route URLs. Verify keyboard use, phone/desktop layout, navigation and loading, empty, denied and failure states when editing dashboard features. See the [README](../README.md) for current commands and the [PRD](PRD.md) for acceptance checks.
