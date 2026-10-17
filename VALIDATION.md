# Validation — v5.3, 17 October 2026

## Automated API and persistence checks

`npm run check` passes for the runtime JavaScript modules. `npm test` passes **12 tests, zero failures**:

- All 33 service journeys from evidence preparation to staff-issued sandbox outcome.
- Sessions, CSRF, origin, owner/service-role permissions, stale revisions, corrections and hearings.
- Payment failure/retry/idempotence, finance reconciliation, account suspension and restart persistence.
- Strict calendar dates, geography and nested account preference validation.
- Appointment owner changes, reason validation, stale writes, cancellation, old-token invalidation and four-place local capacity enforcement.
- Compact seeding: 198 requests, 318 files and 24 parcels in a fresh store; all 33 services have three cases per demo owner.
- Migration preserves user-created, edited and finance-reconciled records, and is idempotent.

## Browser verification

Four optional Playwright suites use the actual Node HTTP/API server with isolated stores:

- `tests/preserved-browser.cjs`: all 18 original routes plus Calculator and Truth Card, original font stack, populated Overview, regional controls, preferences, pagination and mobile navigation.
- `tests/browser.cjs`: all ten role logins, full mutation wizard/evidence/submission/review/payment/outcome, admin/auditor access, 33 service cards and mobile layout.
- `tests/workflows-browser.cjs`: demand payment failure/retry, transaction search/status filtering and receipt JSON; five calculator results and export; appointment submission/support approval/token/calendar/reschedule/cancel; linked review draft; tracked diligence and mobile layouts.

The environment isolates browser loopback, so the request bridge forwards browser requests to the actual local HTTP server. Download payloads are observed from the app-generated Blobs; this avoids relying on sandbox-blocked filesystem download completion. No API state or page content is mocked. No uncaught page errors were observed in the passing runs.

- `tests/land-dossiers-browser.cjs`: source-aware facts, editable/keyboard graph, cycle rejection/SVG export, timeline/boundaries, persistent tasks, evidence upload, versioned reports, linked mutation, assigned desk notes, re-review labels, office-assisted appointment preparation, concurrent-edit recovery, mobile layouts and the retained dark theme.

The land API suite also verifies private read/write scopes, foreign evidence/link rejection, malformed IDs/dates/parents, source-label integrity, stale writes, assigned reviewer policy, access revocation, report digests and restart persistence.

## Visual preservation and documentation

Original assets/styles.css and assets/landing.css remain unchanged. The landing, lease/CHT compositions, original fonts and previous 18 sidebar entries remain. Calculator and Truth Card are additional entries. Current workspace screenshots were regenerated; the README keeps its existing structure/gallery treatment and Mermaid diagrams, updated for the actual flows.

This verifies the local sandbox within these scenarios. Official integrations, real payments, production security/load testing and a formal accessibility audit remain outside this implementation.
