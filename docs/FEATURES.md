# Feature inventory

The current source contains **460 catalogue entries** across **19 module labels**, and **18 workspace routes**. Counts below are calculated directly from the supplied JSON. No module labels have been merged or renamed.

A catalogue entry is a requirement, not evidence that the frontend implements its backend, API, storage or integration fields. The README's page matrix describes what is actually available.

| Module | Tracked requirements |
| --- | ---: |
| Citizen & Service | 53 |
| Land & Parcel | 21 |
| GIS / Cadastral | 50 |
| Applications & Workflows | 22 |
| Documents & Verification | 12 |
| Payments & Tax | 11 |
| Notifications | 8 |
| Support | 7 |
| Government & Administration | 18 |
| Land Intelligence & Anti-Fraud | 19 |
| AI / OCR | 16 |
| Advanced / Field / Security | 28 |
| Land & Parcel / Records | 30 |
| Applications & Workflows / Government | 30 |
| Documents / Trust | 25 |
| Payments & Finance | 20 |
| Notifications / Support / Inclusive Access | 25 |
| AI / Data Quality / Intelligence | 40 |
| Government & Knowledge | 25 |
| **Total** | **460** |

## Source and identifiers

- Registry: [features.json](../e-Bhumi-Frontend/data/features.json).
- Preserve existing CORE and MX identifiers when making changes.
- Catalogue filtering uses module, priority and indexed text; results load incrementally.
- Frontend/API/database/integration fields describe intended traceability; they are not evidence of deployed services.

## Status vocabulary

| Status | Meaning |
| --- | --- |
| Local | Working browser interaction; storage and effects stay on this device |
| Preview | Sample records, metrics, explanatory copy or fixture detail screens |
| Planned | Requires new implementation, provider access or official authorisation |

The JSON is not being rewritten to imply implementation status. [Return to the feature guide](../README.md#features-and-page-guide).
