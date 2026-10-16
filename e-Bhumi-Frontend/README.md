# e-Bhumi Frontend — Maximum Feature Edition

A responsive, original frontend implementation for the e-Bhumi Bangladesh land-services platform. This is a frontend-only demonstration build with 460 tracked features available in the Feature Catalogue. It is designed as a runnable starting point for backend integration, not as an official government service.

## Run locally

**Recommended:** serve this directory over HTTP so the browser can load `data/features.json`.

```bash
python -m http.server 8080
```

Then open <http://localhost:8080>.

You can also use any static file server. Opening `index.html` directly via `file://` may prevent loading the JSON manifest because of browser security restrictions.

## Included

- Citizen workspace dashboard
- Land search with filters and demo record results (now covering Sylhet, Chattogram and CHT districts)
- Government Land Lease & Bandobasto workspace (tea-garden leases, khas land bandobasto, industrial/commercial leases)
- Chattogram Hill Tracts (CHT) special land-zone workspace (Chakma/Bomang/Mong circles, Headman/Karbari/Council workflow)
- My Land / Land Passport workspace
- Land-service catalogue and service guidance
- Application tracker and draft creation
- Schematic GIS parcel map with layer toggles, parcel selection, zoom controls, map tools
- Document vault UI and local file-selection validation
- Payment history and demo receipt views
- Due-diligence checklist
- AI assistant interface with bounded, rule-based demo responses
- Complaints / cases, appointments / queue, notifications
- Analytics and admin dashboards
- Searchable feature catalogue generated from the 460-feature package manifest
- Feature traceability detail: frontend, backend, database, API, integration and phase fields
- Responsive layout, keyboard shortcuts, basic accessibility, Bengali navigation labels

## Important boundaries

- Sample records and metrics are illustrative and are not official land records or government statistics.
- No backend, authentication server, database, real file upload, payment gateway, SMS/email provider, official GIS data, or live AI service is connected.
- The UI marks those dependencies instead of pretending to have live government access.
- Production use requires backend integration, security review, legal/government validation, authoritative datasets, accessibility testing, and end-to-end testing.

## Structure

```text
index.html
app.js
assets/styles.css
data/features.json
README.md
```

## Suggested integration sequence

1. Replace demo account state with authenticated user/profile APIs and server-side RBAC/ABAC.
2. Integrate the API contracts and service catalogue.
3. Connect land search and parcel detail to authorised record APIs.
4. Replace schematic GIS with a real GIS client and authoritative spatial service.
5. Connect applications, workflow, documents, audit, notifications, payments and complaint APIs.
6. Add server-side validation, automated tests, CI/CD, monitoring and production security controls.
