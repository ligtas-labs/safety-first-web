# Technical design — web

## Proposed implementation

Use TanStack Router for navigation and Query for server state. Key requests by class, assignment and account where relevant. Clear cached private data on logout. The API enforces access on every request. Build Vite assets once per target API origin and serve them with Nginx SPA fallback.

## Verification

Test two classes, an empty class, a failed request and a revoked membership. Show pending, empty and error states separately. Verify navigation at phone and desktop widths. Attach responsive screenshots and describe loading, empty and failure states.
