# Browser capture and test method — v5.2

The optional tests/browser.cjs starts the actual Node server and uses Playwright Chromium with isolated contexts for each role. Because direct browser loopback navigation was denied in this environment, a route bridge forwarded browser requests to the actual local HTTP server, including real API/session/cookie responses. It did not inject fixture page content or fake application state.

Captured 16 desktop/mobile views. Tested all 10 role logins; citizen wizard, generated sample files, submission, officer review/approval, citizen sandbox payment, staff issue and actual outcome download; administrator user view; auditor chain view; citizen tools; 33 service cards and mobile horizontal overflow. No page errors were observed.

Runtime app has no Playwright dependency. To rerun browser checks, provide Playwright and a compatible Chromium via PLAYWRIGHT_MODULE and CHROMIUM_EXECUTABLE if they are not installed in standard locations. EBHUMI_BROWSER_DATA selects an isolated test-store root. Set EBHUMI_BROWSER_BRIDGE=1 only when direct browser loopback requires the Node request bridge. Run node tests/browser.cjs. Test account data stays in that test root, not in the distributed app store.

This is bounded workflow verification, not a production security, legal-process, performance or accessibility certification. Historical screenshots/ under docs are retained from the earlier frontend edition but are not current documentation views.


## Preserved edition — 17 October 2026

tests/preserved-browser.cjs starts an isolated server with the actual additive demo seeder enabled. It captures all 18 original routes plus Calculator and mobile Overview/sidebar, verifies the exact original font-family names, checks navigation count and exercises saved search, checklist, chat, page notes, pagination and mobile overflow. Screenshots disable finite animations to avoid capturing a sidebar mid-transition. The bridge still forwards to the actual Node API.

## Dedicated workflow checks

Run node tests/workflows-browser.cjs with the same Playwright environment. It verifies payment retry/receipt filtering, all five calculator worksheets, appointment token/calendar and reschedule/cancel, case follow-up drafts and tracked diligence. Download content is captured from actual app-generated Blobs because browser filesystem downloads may be canceled by the sandbox. No request/application state is mocked.

## v5.4 procedure captures

The new default-v2 procedure browser suite covers the full mutation and tax UI and all 33 procedure pages. Captures scroll to the top, blur active controls, wait for transient toasts and disable animations. The preserved route gallery uses distinct query URLs for fresh navigation so each screenshot depicts its named route. Current API result: 49 passing tests. See VALIDATION.md for bounded coverage and source limitations.

## v5.6 capture

Run tests/lawbook-browser.cjs with the same optional Playwright environment as the other browser suites. It launches a disposable store and records docs/screenshots-lawbook/*.png. Only synthetic fixtures and the test's DEMO preparation file appear. Library screenshots show 33 reading sources, not 33 full statutes. Existing preserved page screenshots are refreshed by tests/preserved-browser.cjs with the added navigation.
