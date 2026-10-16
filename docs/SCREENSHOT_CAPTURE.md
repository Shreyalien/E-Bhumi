# Version 4 capture and test method

The optional tests/browser.cjs starts the actual Node server and uses Playwright Chromium with isolated contexts for each role. Because direct browser loopback navigation was denied in this environment, a route bridge forwarded browser requests to the actual local HTTP server, including real API/session/cookie responses. It did not inject fixture page content or fake application state.

Captured 16 desktop/mobile views. Tested all 10 role logins; citizen wizard, generated sample files, submission, officer review/approval, citizen sandbox payment, staff issue and actual outcome download; administrator user view; auditor chain view; citizen tools; 33 service cards and mobile horizontal overflow. No page errors were observed.

Runtime app has no Playwright dependency. To rerun browser checks, provide Playwright and a compatible Chromium via PLAYWRIGHT_MODULE and CHROMIUM_EXECUTABLE if they are not installed in standard locations. EBHUMI_BROWSER_DATA selects an isolated test-store root. Set EBHUMI_BROWSER_BRIDGE=1 only when direct browser loopback requires the Node request bridge. Run node tests/browser.cjs. Test account data stays in that test root, not in the distributed app store.

This is bounded workflow verification, not a production security, legal-process, performance or accessibility certification. Historical screenshots/ under docs are retained from the earlier frontend edition but are not current documentation views.


## Preserved edition — 17 October 2026

tests/preserved-browser.cjs starts an isolated server with the actual additive demo seeder enabled. It captures all 18 original routes and mobile Overview/sidebar, verifies the exact original font-family names, checks navigation count and exercises saved search, checklist, chat, page notes, pagination and mobile overflow. Screenshots disable finite animations to avoid capturing a sidebar mid-transition. The bridge still forwards to the actual Node API.
