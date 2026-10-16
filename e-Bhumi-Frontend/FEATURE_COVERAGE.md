# Frontend Feature Coverage

The feature catalogue is loaded from `data/features.json`, copied from the Maximum Feature Edition package manifest. The manifest contains **460 tracked feature records across 19 modules, including new Government Land Lease/Bandobasto and Chattogram Hill Tracts (CHT) special-zone features**. Each feature is searchable and exposes the source manifest's frontend, backend, database, API, integration, priority and phase fields.

## Implemented frontend workspaces

- Citizen overview and activity dashboard
- Land discovery/search form, result filtering and record detail entry point
- My Land / Land Passport workspace, watchlist actions and history summary
- Land-service directory, category filtering and service guidance
- Application register, status filters, draft-application form and workflow progress view
- Schematic GIS map, parcel selection, layer toggles, zoom, measurement/coordinate tool entry points
- Document vault, category/search UI, local file selection and validation (not server upload)
- Payment/receipt register with clearly labelled demo/sandbox state
- Due-diligence checklist and screening status workspace
- Bounded rule-based AI assistant demo
- R&D Feature #2: AI Land Case Builder (Bangla-first citizen problem intake, deterministic issue classification with low-confidence handling, category-specific clarifying questions, property linking, interactive document checklists, review draft, and persistent saved cases register)
- Complaint/case workspace and appointment/queue UI
- Notification centre and preference dialog
- Analytics/report dashboard with illustrative data
- Admin/service operations dashboard and integration health states
- Searchable feature catalogue with per-feature traceability details

## Coverage interpretation

A feature being present in the catalogue means it is traceable in the supplied specification; it does **not** mean its backend or external integration is implemented. Some advanced requirements are represented as module entry points, forms, status views, or explicit dependency states pending the backend and authorised data/integrations. Do not describe this frontend-only package as a complete production government platform.
