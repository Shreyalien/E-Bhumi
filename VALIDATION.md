# Validation — v5.4, 17 October 2026

## Automated checks

npm run check passes all runtime module syntax checks. npm test passes **49 tests, zero failures** across five API suites.

- Default production creation uses procedure v2 for all 33 services. Each journey is tested through evidence, acknowledgements, required schedules, submission, relevant filing/payment phase, review checks, decision, output artifacts and delivery acknowledgement.
- Mutation filing failure/retry, correction without another filing charge, post-decision DCR payment and per-phase idempotence are covered.
- Owned holding/demand/year validation, direct tax payment to Dakhila, private ledgers, finance-only assessment, stale demand/quote rejection, paid-year protection, new holding registration and later demand payment are covered.
- Premature approval, fabricated owner review, foreign edits, excessive plot area, missing dispatch reference and local artifact digest checks are covered.
- Legacy v1 fixtures retain all 33 older lifecycles, role/session/CSRF/origin guards, evidence ownership, stale revisions, administration, audit and restart coverage.
- Existing appointment capacity/reschedule/cancel/token and compact demo-migration checks pass; Truth Card source/graph/evidence/reviewer/report tests pass.

## Browser verification

Five Playwright suites ran against actual isolated Node servers. The environment requires a Node request bridge for Chromium loopback; this forwards real HTTP/API/cookie responses and does not mock page content or application state.

- tests/procedures-browser.cjs: all 33 researched procedure pages; full mutation UI with structured plot/party schedules, confirmations, evidence, preflight, two payment phases with retry, three reviewer checks, issuance, two artifact entries and local integrity; owned holding prefill, payment and Dakhila; mobile overflow.
- tests/preserved-browser.cjs: all 21 citizen routes, including Holdings; original font stack, populated Overview, lease/CHT controls, saved search/checklist/chat/notes, pagination, mobile Overview/menu. Gallery capture forces a fresh navigation for each route to avoid old-page screenshots.
- tests/browser.cjs: ten role logins and the retained v1 browser lifecycle, evidence/outcome, admin/auditor views, 33 service cards and mobile layout.
- tests/workflows-browser.cjs: legacy payment retry/receipt filters, five calculators and exports, appointment support review/token/ICS/reschedule/cancel, linked follow-up and diligence.
- tests/land-dossiers-browser.cjs: facts, relationship graph/edit/cycle rejection/SVG, timeline, boundaries, tasks, evidence, reports, linked-case assigned review, stale edits, office routing, mobile and dark theme.

No uncaught page errors were observed in passing runs. The older four fixtures explicitly select server-side legacy creation to preserve compatibility coverage; the new procedure suite uses the default v2 mode. No HTTP client may select the legacy mode.

## Preservation and local run

Original assets/styles.css, assets/landing.css, preserved.css, citizen.js and legacy app.js have no changes in this revision. Existing original menu entries and Calculator/Truth Card remain; Holdings is additive. The blue architecture style remains, with a new family-specific flow diagram and current screenshots.

The live local store was backed up before restart. Its **201 existing applications, including 3 non-demo records**, retained IDs, states and revisions. Four private sample holdings were added without generating more applications. Server serves the updated code at port 8081.

This is scenario-based local verification, not a guarantee of zero defects or production/legal certification. Official government submissions, NID, real gateways, registry updates, lawful decisions and operational office/courier work are not connected. See [source register and procedure boundaries](docs/BD_SERVICE_RESEARCH.md).
