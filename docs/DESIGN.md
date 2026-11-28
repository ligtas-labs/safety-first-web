# Safety First Web technical design

## Implemented foundation and feature layout

Keep `index.html`, `src/main.tsx`, global styles and assets in their Vite locations. The starter view has no product route definitions. When routing lands, use a route tree composed at the app entry and preserve URLs and deep-link refresh. Place owned UI, queries and validation under `src/features/<feature>/` as classes, assignments, progress and feedback land. Add shared UI and API client configuration in `src/shared/ui/` and `src/shared/api/` when a caller needs them.

## Planned integration

Use TanStack Router for navigation, Query for server state and Zod where contract validation is needed. Scope queries by account, class or assignment as relevant. Clear protected cached data on logout or revoked access. Use the API for authority and retain Nginx’s SPA fallback.

See the [PRD](PRD.md) for stable requirement IDs, the proposed cross-app workflow and unresolved contracts. Add planned folders with their first implementation.

## Account integration

Resolve role and onboarding state from the API before showing protected routes. Support sign-in, sign-out, permitted profile edits, and email recovery. Clear private query state on sign-out and denied sessions. Verify both roles, expired sessions and recovery links, and sign-in with the same synthetic account created on Android. The web registration entry point is an open decision.

See [Linear delivery scope](PRD.md#linear-delivery-scope) for dependencies and verification.

## Verification

Preserve Vite entry points and route URLs. Verify keyboard use, phone/desktop layout, navigation and loading, empty, denied and failure states when editing dashboard features. See the [README](../README.md) for current commands and the [PRD](PRD.md) for acceptance checks.
