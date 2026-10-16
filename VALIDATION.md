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
