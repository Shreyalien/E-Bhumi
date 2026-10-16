# Screenshot capture notes

## Provenance

Captured on 16 October 2026 with an installed Playwright-controlled Chromium headless runtime. Images show the included source rather than generated mockups. No app styling or sample content was changed for capture.

- Desktop viewport: 1440 × 1000 CSS pixels, scale factor 1.
- Mobile viewport: 390 × 844 CSS pixels.
- 22 images: desktop landing, 18 workspace pages, application dialog, mobile landing and mobile workspace.
- Mobile landing uses a full-page capture; other images use viewport captures.
- Font rendering uses the browser environment's available fonts and may differ on other devices.

## Environment adaptation

The screenshot tool could launch the installed Chromium runtime, but loopback navigation was denied. Pages were therefore opened from their local HTML files. A browser init script served the **unchanged** local data/features.json as the response to that one fetch request. This allowed the complete 460-entry catalogue to render without modifying the application source.

Normal users should run npm start and use HTTP. The capture adaptation is not part of the app and does not verify the HTTP server or deployment.

## Observed checks

- All 18 routes rendered a page heading.
- No uncaught page errors observed during route captures.
- A sample page note survived reload and was then cleared.
- The catalogue displayed 460 entries; CORE-001 returned one card.
- Landing and dashboard had no horizontal page overflow at the captured mobile width.

These are bounded observations, not a full end-to-end, accessibility, legal-copy, security or performance audit. Screenshots show sample data; verification badges inside fixtures do not establish real document validity.

## Refreshing images

1. Start the app with npm start in e-Bhumi-Frontend.
2. Use a clean browser profile with sample data only.
3. Set the desktop viewport to 1440 × 1000 and mobile to 390 × 844.
4. Capture index.html, each route listed in APP_FLOW.md and the application form dialog.
5. Preserve screenshot filenames from SCREENSHOTS.md so links stay valid.
6. Review representative desktop and mobile images and update capture date/method.

See [gallery](SCREENSHOTS.md).
