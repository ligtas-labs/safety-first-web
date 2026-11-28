# Safety First Web dashboard PRD

The responsive browser dashboard supports O1 and O2 by assigning reviewed activities and exposing their confirmed evidence. It supports O3 by presenting criterion results, distinct attempt kinds and teacher comments. The foundation is a Vite starter at `/`. TanStack Router and Query are installed; the starter has no application router, dashboard routes, API client or authentication.

## Sources and delivery status

Paper 33 is *OSH CASPTONE RESEARCH PAPER (33).pdf*, Chapters 1–3. Page numbers below refer to printed pages. C4 identifies the separate *Chapter 4 FOR PLANNING.pdf* draft. Paper 33 §1.3.2 defines O1 (repeatable 3D practice before OJT), O2 (reassessment after changing conditions) and O3 (expert-reviewed feedback and distinct corrective attempts). Chapter 2 §§2.1.6–8 and 2.4 inform the learning design. Paper 33 §3.8 reports needs-validation evidence. The draft user stories give implementation examples and the draft Gantt gives sequencing.

Safety First supplements Civil Engineering instruction and supervised practice. Simulation scores confer no certification or evidence of real-site competence. Rows are proposed backlog requirements unless marked implemented. Signed approvals and completed product evaluation were not verified. Appendix A–I entries appear in the Paper 33 contents but their bodies are absent from the available copy.

## Users and responsibilities

Teachers manage their classes, approve membership requests, assign reviewed material, review explicit submissions and leave comments. Students use the online dashboard for their own assignments, confirmed progress and feedback. Browser views depend on API authorization. Simulation, rubric editing and score overrides are outside web scope.

## Requirements and acceptance

### Learning, evidence and progression

| ID | Capability and source | Acceptance criteria for this repo |
| --- | --- | --- |
| SF-05 | Sequence tutorial, work at height and temporary works with provisional offline unlock and confirmed credit. 33 §3.3 item 5 (pp. 38–39); C4 §4.5.5, §4.7.2. | Display server-confirmed progression. A mobile-only provisional unlock does not appear as confirmed completion. |
| SF-06 | Version reviewed rubrics and assess initial, corrective and independent attempts separately. 33 §3.3 items 6–7, Tables 6–7 (pp. 39–41); C4 §4.5.5, §4.5.7. | Display the API result and versions without recomputing the grade. Initial, corrective and independent attempts each remain identifiable. |
| SF-07 | Explain criterion-level results, omissions and corrective practice. 33 §3.3 items 7–8 (pp. 41–42); C4 §4.3.7–8. | Show confirmed counts, overall result, explanations and missed essentials when available. Distinguish unavailable feedback from an empty result list. |
| SF-08 | Show learner-owned progress, separated attempt types and practice recommendations. 33 §3.3 item 8 (p. 42), §3.6; C4 §4.4.1. | Show a student's own history, relevant follow-up practice and comments. A failed refresh offers retry; no other learner's records appear. |

### Access, classroom and synchronization

| ID | Capability and source | Acceptance criteria for this repo |
| --- | --- | --- |
| SF-09 | Authenticate students and provision teachers operationally; scope first deployment to one school with multiple classes. 33 §1.7, §3.6; C4 §4.1, §4.5.6. | Render role-appropriate views after session verification. Expiration routes to sign-in and logout clears cached private views. |
| SF-10 | Manage classes and approve enrollment requests from class codes. 33 §3.3 item 9 (p. 42); C4 §4.6.4, §4.7.1. | Show class rosters and pending requests. Approve a valid request, refresh and see it move to the roster. Invalid and revoked class access shows a permission state. |
| SF-11 | Assign published activities and show eligible work and status. 33 §3.3 item 9 (p. 42), §3.6; C4 §4.6.4. | Select reviewed content for an authorized class and display the assignment to enrolled students. Failed save preserves user input and permits retry. Deadlines and resubmission behavior remain open. |
| SF-12 | Durably save and synchronize attempt evidence with repeat-safe server acceptance. 33 §1.7.2, §3.6.I; C4 §4.5.6, §4.7.2–3. | Use confirmed API state when displaying progress. During stale or failed refresh identify the state and recover through a later fetch. |
| SF-13 | Explicitly submit an eligible confirmed attempt and restrict teacher review to that class. 33 §3.3 item 9 (p. 42); C4 §4.5.6, §4.7.4. | Teacher view lists explicit eligible submissions, including attempt kind and confirmed result. Private or merely synchronized practice stays hidden. Revoked access removes cached data. |
| SF-14 | Store classroom comments separately from assessment and return feedback to the student. 33 §3.3 item 9 (p. 42), §3.6; C4 §4.7.4. | Save a separate instructional comment or practice recommendation. It becomes visible to the student on refresh and leaves scoring unchanged. A failed save retains the draft. |
| SF-15 | Control account/record access and retain historical versions and finalized evidence. 33 §3.6; C4 §4.3.11, §4.5.4, §4.5.6. | Once archival is defined, present accessible historical records with their original version references. Handle forbidden or missing records without exposing names or cached details. |

### Quality, research and operations

| ID | Capability and source | Acceptance criteria for this repo |
| --- | --- | --- |
| SF-16 | Verify product quality, accessibility to intended devices and operational behavior. 33 §1.7, §3.1–2, §3.8.5; C4 §4.5.3. | Verify navigation, refresh and transient failures at phone and desktop widths, then tablet/supported browsers. Cover keyboard access and loading, empty, denied and error states. Browser matrix and performance targets need approval. |
| SF-17 | Keep approved study procedures and records separate from classroom use. 33 §3.2, §3.10–11. | Use synthetic accounts in screenshots and walkthroughs. Individual study scores, consent and instrument responses stay outside normal classroom pages. |

## Linear delivery scope

Paper 33 Chapter 1 defines the pre-OJT practice objectives and supplementary-learning scope. Chapter 2 motivates guided practice, changing conditions and explanatory feedback. Chapter 3 defines the modules and proposed evaluation and reports needs validation. Chapter 4 specifies the proposed platform and workflows. Linear tracks delivery and acceptance evidence for these requirements.

| Capability | Linear epic | PRD requirements |
| --- | --- | --- |
| Accounts and authentication | [LIG-124](https://linear.app/ligtas-labs/issue/LIG-124/epic-user-authentication-and-account-management), [LIG-127](https://linear.app/ligtas-labs/issue/LIG-127/authweb-integrate-neon-sign-in-protected-routes-profile-and-recovery) | SF-09 |
| Modules and assignments | [LIG-131](https://linear.app/ligtas-labs/issue/LIG-131/epic-learning-module-and-assignment-management) | SF-05, SF-11, SF-13 |
| Assessment and feedback | [LIG-133](https://linear.app/ligtas-labs/issue/LIG-133/epic-rubric-based-assessment-scoring-and-feedback) | SF-06–07, SF-12 |
| Progress and monitoring | [LIG-134](https://linear.app/ligtas-labs/issue/LIG-134/epic-learning-progress-tracking-and-student-monitoring) | SF-08, SF-13 |
| Classes and enrollment | [LIG-135](https://linear.app/ligtas-labs/issue/LIG-135/epic-class-and-enrollment-management) | SF-10, SF-15 |
| Offline learning and synchronization | [LIG-136](https://linear.app/ligtas-labs/issue/LIG-136/epic-offline-learning-and-synchronization) | SF-05, SF-12, SF-15 |
| Submission review and feedback | [LIG-137](https://linear.app/ligtas-labs/issue/LIG-137/epic-submission-review-and-teacher-feedback) | SF-13–15 |

### Account acceptance

Resolve role and onboarding state from the API before showing protected routes. Support sign-in, sign-out, permitted profile edits, and email recovery. Clear private query state on sign-out and denied sessions. Verify both roles, expired sessions and recovery links, and sign-in with the same synthetic account created on Android. The web registration entry point is an open decision.

All three components use the same environment-specific Neon Auth identity. A class code requests membership after account activation. Student eligibility, email verification and cross-device sign-out remain open. Test with synthetic student and teacher accounts in a shared non-production environment, with the API available before client smoke tests.

### Planning acceptance details

Show reviewed objectives and prerequisites. Let teachers create, update and archive assignments with instructions and deadlines, and manage owned classes, codes and enrollment decisions. Show class completion and commonly missed requirements from authorized submissions. Let teachers edit or remove their own comments and let students read comments on their submissions.

SF-14 covers comment authoring and ownership. Apply the same access boundary to comment reads as to the associated submission.

## Cross-app workflow

Mobile pins the content and rubric versions and saves an attempt ID, attempt kind, relevant parent attempt ID, and ordered evidence locally before upload. On reconnection it retries pending evidence under the same learner and client attempt ID. API validates ownership, content compatibility and evidence, persists results, and returns the existing confirmation on a matching repeat. A changed payload for the same ID produces a conflict. Mobile holds on timeout, pauses for renewed authentication, and retains rejected or discrepant evidence with its reason. Only server acknowledgment establishes confirmed credit.

Synchronization and classroom submission are distinct. Confirmed practice remains private. An explicit submission identifies the assignment and a confirmed attempt. API checks learner ownership, current enrollment and assignment eligibility before linking it. Web shows the result to the authorized teacher after the submission succeeds and the view refreshes. Teacher comments are separate records. The study protocol controls access to research instruments and outcomes separately.

This is the proposed behavior from Chapter 4 §§4.5.4–7 and 4.7.1–4. Endpoint names, payload shape and canonical comparison, credential validation and client handoff, retry timing, offline session expiry, deadline/resubmission policies, and archive/recovery semantics require a shared decision.

## Data and access

Planned browser state contains the signed-in session, API responses for classes, students, assignments, submissions and comments, and unsaved form input. Keep caches scoped by identity and resource and clear them on logout or revoked access. Store no database credentials or study exports in browser storage. API owns authoritative records. Session storage and approved browser range are open.

## Verification evidence

Capture responsive synthetic screenshots and task outcomes for enrollment, assignment, review, comments, denied access and recovery. Confirm back/forward navigation and direct URL refresh when product routes land. Nginx serves the Vite build inside the Docker image behind Caddy on the Ubuntu VPS. The API base URL is public build configuration.

## Study evidence and open decisions

Use synthetic accounts and reviewed fixture data for development. Paper 33 §§3.2 and 3.10–11 describe content/functional verification, a rubric-based pilot, pretest, post-test and usability assessment. These are distinct from the needs survey and ordinary classroom scoring. Study participation is voluntary with informed consent and confidential withdrawal handling. Coded individual study records are limited to the research team and adviser, with aggregate reporting. The paper's August 2027 disposal date concerns the specified survey/interview materials. Confirm the applicable retention and disposal rules for platform and pilot records before collection.

Confirm approved pilot instruments, eligibility and participant counts, consent and withdrawal handling, linkage/retention, reviewer authorization, and the current ethics/panel/adviser approval records. Leave evaluation outcomes open until measured. Confirm reviewed criterion applicability, essential items, accepted alternatives, guidance rules, weights or rounding, and golden fixtures before releasing assessment logic.
