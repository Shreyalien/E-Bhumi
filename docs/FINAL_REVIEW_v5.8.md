# Final ZIP integration and Bangladesh land-service review — v5.8.0

Reviewed on 18 October 2026 (Bangladesh). The supplied archive contained an outer workspace and a nested deployable project. The maintained repository root is still `LANDFINAL`, with the application in `ebhumi-platform`. The outer GSAP-only package is not the Vercel project. Test fixture stores inside the archive were excluded.

## Research applied to the platform

| Subject | Official reference and implementation |
| --- | --- |
| Mutation | [Applicant guidance](https://mutation.land.gov.bd/nirdeshika) and [official stages](https://mutation.land.gov.bd/namjari-steps) distinguish filing, the initial AC Land order, local enquiry, decision and DCR. The library and service pages now explicitly identify the demo desk queue as a simplified model, not a statutory investigation order. Filing 70 and decision 1100 remain separate demo phases. |
| Khatian and map requests | The [Ministry fee page](https://land.gov.bd/vumisheba-fee?lang=bn) supports reference fixtures of 100 for a copy, 40 where postal copy delivery applies, and 520 plus applicable 110 postal delivery for a Mouza map. Demo quotes now itemise postal charges and bind the selected delivery to the revision/digest. These are not live government demands. The official indexed page was readable; direct retrieval failed. |
| Land development tax | The [official manual index](https://ldtax.gov.bd/manual) remains the source entry point. Approved holding, current unpaid demand, payment and Dakhila remain separate. No universal tax rate is fabricated. Existing finance revision, privacy and duplicate-payment tests are retained. |
| Survey appeals | [DLRS limitation guidance](https://dlrs.gov.bd/pages/static-pages/6922ddd1933eb65569e166b7) addresses survey objection appeals and delay applications. This is added as jurisdiction-specific guidance; the app does not apply that period to every revenue, civil or acquisition case. |
| Lease and tender | A [2026 Rangpur notice](https://file-rangpur.portal.gov.bd/uploads/05a906cf-c5b8-44f9-b576-0700b30b6c42/695/bcf/bd1/695bcfbd10f5f187026468.pdf) illustrates notice-specific waterbody leasing. It is not displayed as a currently open auction. Local eligibility, authority, security and submission channel must come from the chosen notice. |
| Procurement boundary | [BPPA e-GP guidance](https://bangla.bppa.gov.bd/e-gp.html) describes public procurement. New guidance prevents treating every government land lease as an e-GP procurement process or a bid submitted by this app. |
| CHT | The [CHT Regulation 1900](https://bdlaws.minlaw.gov.bd/act-print-1313.html) is linked alongside case-specific authority guidance. Choosing a circle/headman does not resolve title or replace district, customary and other applicable institutions. |

Six dated source entries were added to every role's law library and linked to the relevant service detail pages. Original references retain their individual review dates. This is a curated reading aid, not an exhaustive consolidated statute book or legal opinion.

## ZIP features completed and repaired

- SVG controls, favicon, optional colour variants and reduced-motion-aware transitions were integrated. Original landing/lease/CHT compositions and font stacks were retained; the ZIP's replacement typography was removed.
- Leaflet 1.9.4, its styles, image assets and licence are bundled locally. External map tiles are optional and attributed. If the basemap fails, the synthetic parcel overlays and accessible list remain usable. Shapes are not georeferenced official parcel boundaries; displayed areas are independent sample records.
- Layer visibility, labels, zoom, parcel selection and the GIS-to-calculator action work. Map instances are disposed when the view changes, avoiding stale maps on repeated visits.
- The browser and authenticated API now use the same terrain engine. It validates finite coordinates, polygon intersections, extent, grid workload, resolution and elevation. This prevents unbounded calculations and invalid numeric outputs.
- Terrain elevations are generated surfaces, not measured DEM data. Steep-cell percentages are labelled educational statistics, not landslide probability, safety clearance, legal land gain or hill-cutting permission. Earlier claims about a universal 30-degree legal ban were removed.
- Preset and target grade remain selected after calculation; CSV uses the displayed grade and includes model provenance. GeoJSON closes rings, uses longitude/latitude geometry and distinguishes WGS84 output from the metric calculation CRS.
- The optional Python CLI calls the same Node engine rather than maintaining another divergent calculation.
- Script CSP remains `script-src 'self'`; the ZIP's external-script and inline-script allowances were removed. Terrain API requests require login, origin and CSRF checks.
- Version 5.8.0 is aligned across package, catalog, UI and personal exports. Existing persisted application data and role assignments are retained.

## Verification commands

```powershell
npm ci
npm run build
npm run check
npm test
```

Browser checks require Playwright and Chromium, optionally provided through `PLAYWRIGHT_MODULE` and `CHROMIUM_EXECUTABLE`. `EBHUMI_BROWSER_BRIDGE=1` relays actual server responses when the test browser cannot directly reach loopback; it does not replace APIs with fixtures.

```powershell
node ebhumi-platform/tests/interface-browser.cjs
node ebhumi-platform/tests/release-browser.cjs
```

The automated API suite covers 101 existing lifecycle/security cases plus four hosted-state/terrain/fee cases. Browser checks cover all 24 roles, reversible Bangla/English, retained copy/font emphasis, notifications, user-content preservation, personal exports, new map controls, terrain exports and mobile views. Screenshots of this release are in `docs/screenshots-final/`; the README uses those current images. Browser export-content checks inspect the real generated Blob because file download completion can be restricted in the automation environment.

## Operational boundary

Vercel uses the existing private shared Blob adapter with optimistic conditional writes. Preview and production state remain separate; local private data is never uploaded. This is still a demo using whole-state JSON snapshots, not a transactional database for substantial traffic. Government registry, real identity, payments, official orders and field/engineering data require authorised integrations. A successful demo outcome does not update a government record.
