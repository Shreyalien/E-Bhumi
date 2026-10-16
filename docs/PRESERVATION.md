# Preserved features and demo-data guide

## Scope

The 18 original Citizen Workspace navigation options and previous typography/Overview structure are retained. The 33 backend workflows and all 10 role platforms remain active. The original CSS is unchanged; preserved.css bridges the original shell and the authenticated portal.

## Original route compatibility

| Entry | Route |
| --- | --- |
| Overview | /portal/citizen#dashboard |
| Land Search | /portal/citizen#land-search |
| My Land & Passport | /portal/citizen#my-land |
| Land Services | /portal/citizen#services |
| My Applications | /portal/citizen#applications |
| Govt Land Lease | /portal/citizen#land-lease |
| Hill Tracts Zone (CHT) | /portal/citizen#ctg-zone |
| GIS & Parcel Map | /portal/citizen#gis |
| Documents Vault | /portal/citizen#documents |
| Payments & Receipts | /portal/citizen#payments |
| Due Diligence | /portal/citizen#due-diligence |
| AI Land Assistant | /portal/citizen#ai-assistant |
| Cases & Complaints | /portal/citizen#casebook |
| Appointments & Queue | /portal/citizen#appointments |
| Notifications | /portal/citizen#notifications |
| Analytics & Reports | /portal/citizen#analytics |
| Feature Catalogue | /portal/citizen#feature-catalog |
| Administration | /portal/citizen#admin |

Earlier v4 aliases land/tools/features/reports remain accepted. Role permissions are unchanged. Citizen Administration is personal administration, not a way to create staff accounts.

## Data generation

lib/seed-demo.cjs adds deterministic sample IDs once (demoEdition 5). It only enriches the seeded citizen and representative demo accounts. It never replaces their existing non-seeded cases or clears any account. Restarting twice does not duplicate records. Each service has ten scenarios per demo owner, for 660 total requests and 1,060 sample evidence files. The generated TXT bytes contain demonstration statements, not private documents.

Different states demonstrate the next actionable step: draft editing, queue claim, correction/resubmit, hearing decision, sandbox payment success/failure, outcome issuance and completed download. Support services skip fee states. Reviewer role queues are populated from those same requests.

## Restored preparation options

- Land search with Bengali numerals and saved-search restore/remove.
- Passport timelines, watch references and sharing-preparation drafts.
- Service comparison and individual workflow requirements.
- Document hash verification and protected download.
- Persistent due-diligence checks, area/share comparison and export.
- Deterministic assistant with seeded conversation and clickable service links.
- Case/complaint, lease, regional and appointment registers.
- Account administration and notification preference controls.
- Autosaved per-page notes and personal workspace export.

Sharing drafts do not send email or grant account access. Watch references are not live monitoring. The assistant is not a live AI model. All legal/government integration boundaries remain as documented.

## Maintenance

Do not remove .data to obtain the demo data. Restart the new Node server; the additive migration handles it. Do not publish .data or seed passwords to a public deployment. Backup source is delivered separately and existing local runtime storage is left in place.
