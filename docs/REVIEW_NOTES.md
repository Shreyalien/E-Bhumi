# V5 flow integration review — 17 October 2026

## What was adopted

The supplied `E-Bhumi-Preserved-v5.zip` is the source for the local server, ten role portals, 33 service definitions, state transitions, additive demo data and preparation tools. Its README was not copied over the current project's README: the original introduction/gallery/page descriptions remain, with targeted updates to flow, architecture, storage and operation.

## Presentation kept

- Original `assets/landing.css` and `assets/styles.css` are retained byte-for-byte.
- The landing HTML retains the original design and wording. Its inline legacy hash redirect is moved to `landing.js` to comply with the self-only Content Security Policy.
- Original lease stats, category-filtered register, guidance cards and detail controls are restored above the tracked application register.
- Original CHT circle selector, authority/context card, illustrated workflow and explanatory cards are restored above the regional request register.
- Original citizen font stack and all 18 navigation options remain.

## Fixes and regression coverage

- Strict real-calendar date validation rejects impossible dates.
- Server submission validates matching division/district and allowed region values.
- Nested conversation, checklist, notes, watch/share and notification preference values are validated before saving.
- Public login safely retains a selected citizen route instead of always discarding it for the dashboard.
- Legacy landing hash links continue through an external CSP-compatible script.
- Saved page shortcuts are available alongside per-page notes and are stored per account.
- The CHT illustrated workflow fits the available panel width.
- Lease category/detail actions and CHT selection/request handoff have dedicated browser assertions.

## Verification boundary

`npm test` covers all 33 service completion paths and the permission/payment/persistence/validation regressions. Two optional Playwright scripts cover all 18 citizen routes, typography, saved preparation tools, restored regional interactions, all ten role logins and a complete mutation process through outcome download.

These are bounded tests, not a claim of a universally bug-free or production-certified system. Government integrations, official legal rules/fees, real payments and legally valid outcomes remain outside this local sandbox.

## v5.2 follow-up

Standalone Calculator restored without replacing the existing 18 menu entries. Dedicated payments/due, case and appointment actions now use the existing panels/buttons/fonts. Appointment changes use owner/revision/capacity checks and invalidate old tokens. Untouched demo fixtures are reduced to three per service/account; edited and real requests are preserved. Current workspace screenshots and README flow diagrams were refreshed. See VALIDATION.md for the current 11-test and three-browser-suite evidence.
