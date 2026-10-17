# Validation — v5.5, 17 October 2026

## Automated checks

npm run check passes all runtime module syntax checks. npm test passes **98 tests, zero failures** across six API suites and the upstream service-router unit suite.

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

The procedure implementation preserves the original font stack, landing CSS, preserved.css and citizen.js. The upstream Record Reconciliation and Service Router commits were merged without conflicts, retaining their additive styles and legacy app.js work. Their 12 router unit checks also pass. Existing original menu entries and Calculator/Truth Card remain; Holdings is additive. The blue architecture style remains, with a new family-specific flow diagram and current screenshots.

The live local store was backed up before restart. Its **203 existing applications, including 5 non-demo records**, retained IDs, states and revisions. Four private sample holdings were added without generating more applications. Server serves the updated code at port 8081.

This is scenario-based local verification, not a guarantee of zero defects or production/legal certification. Official government submissions, NID, real gateways, registry updates, lawful decisions and operational office/courier work are not connected. See [source register and procedure boundaries](docs/BD_SERVICE_RESEARCH.md).

## v5.5 routing and language checks

The production-default routing suite completes all 33 services with their current desk roles, verifies intermediate approval rejection, required handoff checks, prior-desk monitoring without mutation, next-role notification and full payment/output paths. The earlier single-desk v2 fixtures explicitly select `deskRouting:false` for compatibility coverage; production creation defaults to routed cases.

`tests/bangla-browser.cjs` verifies Bangla-first landing/login/workspace, English switching and reload, unchanged authority option values, notification SVG/accessible name, union → officer → AC Land handoffs, citizen tracking, all five added role portals and mobile overflow. Other browser suites explicitly choose English to retain translation-path coverage. All six browser suites pass. Service instructions are translated; source titles, research excerpts, codes and user evidence retain their source language. This is interface localization, not automated translation of private material.

A transient Windows file-lock failure appeared under repeated JSON-store writes. Save now retries only EPERM/EACCES/EBUSY rename failures within a bounded 250 ms, retaining atomic replacement. The full routing/API suite passed afterwards. This remains a single-process local store, not production database concurrency control.

## v5.6 law library, roles and research implementation

2026-10-17: npm run check passes; npm test passes **99 tests, 0 failures**. The production routing suite still completes all 33 service workflows with the specialist routes. New API checks cover all-role law access, authenticated access, private reading notes, invalid IDs, foreign evidence rejection, draft evidence privacy, assigned/past specialist access, stale revisions, required external-order reference, correction/resubmission, four-desk completion, report labelling and restart persistence.

The new lawbook browser suite logs in all 23 roles, exercises search/bookmark/read/private notes/reload, completes the four-desk legacy preparation through the UI with vault documents, verifies evidence downloads, sends a ministry consultation and returns to the acquisition desk, checks mobile overflow and captures 10 new screenshots. No page errors. The preserved-browser suite also passes with the original 21 pages plus 3 additive links, unchanged fonts, lease/CHT controls and mobile checks.

The installed local store was backed up before restart. All **203 applications and 318 documents** compare byte-for-byte as parsed JSON with the pre-migration snapshot; the 8 added specialist accounts bring the role count to 23. The local server runs on port 8081. Original assets/styles.css, assets/landing.css, preserved.css, citizen.js and app.js match the previous committed sources.

Legal coverage is a curated 33-source/11-topic library, not an exhaustive A–Z legal consolidation. Official texts open at their source; explanations are reading aids. The shared research's unverified 2026 judgment is not applied as a rule. No government, court, bank or registry integration has been added.
