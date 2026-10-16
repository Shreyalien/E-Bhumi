# Version 4 validation — 16 October 2026

## Passed checks

- npm run check: syntax checks for portal.js, auth.js, server-v4.cjs, platform.cjs and catalog.cjs.
- npm test: 7 tests passed (parent and 6 subtests), zero failures. The service lifecycle subtest completes **all 33 service types**.
- Lifecycle: required evidence, upload hash, valid submission, correct staff claim, approval, sandbox payment where applicable, issuance and outcome retrieval.
- Correction/resubmission and hearing, premature issuance rejected, payment failure/retry, successful replay returns the same payment.
- Authentication, CSRF/origin, public staff-registration prohibition, ownership, private evidence, negative-area validation, stale revisions, role write restrictions and static .data/source blocking.
- Administrator suspension revokes session, intake pause blocks new drafts, restart preserves records but invalidates in-memory sessions, audit chain verifies.
- Browser check passed: all 10 role logins; mutation wizard through actual outcome download; generated sample files; administrator account view; auditor chain; citizen tool views; 33 cards; mobile page overflow absent; no uncaught page errors.

## Test environment and limits

Node API tests used an isolated writable fixture directory because the tool sandbox did not support renaming files in its redirected temporary directory. Ordinary test runs default to OS temp; EBHUMI_TEST_ROOT overrides this. Browser verification used a request bridge to the actual local server because direct Chromium loopback was denied. See docs/SCREENSHOT_CAPTURE.md.

These tests do not validate official rules, fee schedules, statutory deadlines, government/provider integrations, production scaling, malware detection, disaster recovery or complete accessibility/localisation. The suite also verifies replacement after reviewer suspension, rejection/withdrawal terminal states, malformed JSON-object rejection, failed profile updates leaving the profile unchanged and logout invalidation. It does not claim exhaustive organisation workflow coverage.


# Preserved edition validation — 17 October 2026

- Syntax checks cover citizen.js and seed-demo.cjs in addition to the role platform.
- npm test: 8 tests passed, zero failures. Existing 33-service lifecycle/security tests remain.
- New data test verifies 660 demo requests, all 33 services/ten scenarios/two demo owners, evidence categories, repeat-start idempotence, 24 parcels, protected preference persistence and every seeded file integrity digest.
- Existing role-browser suite passed all 10 logins and a full mutation journey after restoring the shell.
- New browser suite checks all 18 original menu routes and exact original font stack, actual seeded Overview, Bengali record search, saved searches, persistent diligence/chat/page notes, 30-to-60-row application pagination, responsive Overview and sidebar, and no uncaught page errors.
- Snapshot samples are in docs/screenshots-preserved. No production integration or exhaustive bug-free guarantee is claimed.


## Reviewed integration — 17 October 2026

Syntax checks and API tests passed: 9 tests, zero failures. Coverage includes all 33 service lifecycles plus strict calendar dates, division/district combinations and nested preference validation. Both browser suites passed: all ten role logins; complete mutation outcome download; all 18 citizen routes; original typography; lease category filtering/detail; CHT circle switching and full-service handoff; saved search/checklist/chat/notes; mobile layout. Selected-route login return and favorite persistence are also covered by the final citizen browser run.

Original landing/workspace stylesheet hashes are preserved. README edits are targeted rather than adopting the supplied reference README wholesale. See docs/REVIEW_NOTES.md and docs/ARCHITECTURE.md.
