# e-Bhumi role platform

Node.js 18+ required.

```bash
npm start
```

Open http://127.0.0.1:8080/login.html. Select a demo role; password BhumiDemo!2026. Real users can register citizen/representative accounts. Administrator creates staff accounts.

```bash
npm run check
npm test
```

See the [root README](../README.md), [service handbook](../docs/SERVICE_HANDBOOK.md), [role screenshots](../docs/SCREENSHOTS.md) and [research audit](../docs/BD_LAND_RESEARCH.md). Python/static-only hosting cannot run the authenticated API. Do not publish seeded local credentials or .data.


Version 5 preserves the original font stack, all 18 citizen menu entries and original Overview layout. Demo accounts are enriched additively on startup. Stop and restart any previously running Node server to load the changes. Existing .data must remain in place. See ../docs/PRESERVATION.md.


Reviewed version 5.1 retains the original landing/lease/CHT presentation with the V5 role/application architecture. See ../docs/ARCHITECTURE.md and ../docs/REVIEW_NOTES.md.

Version 5.2 restores the standalone Calculator, adds payable demands and receipt filters, linked case follow-ups, local appointment capacity/reschedule/cancel/token/calendar actions, and trims untouched demo scenarios to 99 per account. See the root README for current screenshots and flow.

Version 5.3 adds Truth Card & Ownership as the twentieth citizen navigation entry. Private parcel worksheets include editable relationship graphs, source-aware evidence, timeline/boundaries, obligations, assigned local desk review and versioned report downloads. Original app/landing fonts, regional styling, translations and theme controls remain. See ../docs/LAND_INTELLIGENCE.md.
