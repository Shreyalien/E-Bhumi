# Role demonstrations and day/night palettes — v5.9.0

Reviewed 18 October 2026. Existing fonts, layout, citizen features and saved user applications remain intact.

## How to explore

1. On the login page, choose a demo role and sign in.
2. Open **ডেমো আবেদন প্রবাহ / Demo workflows & examples**, available in every role's sidebar. The dashboard also links to this library and role-appropriate cases.
3. Find a service. Its ordered desks, expected outputs, source link and role-visible examples are shown together.
4. Open an active example, claim it as the current desk, record all required checks and a reason, then forward. Only the final desk can approve or reject. Applicable demo payment precedes issue/delivery.
5. Choose the next demo role on the login page to continue. The citizen/representative can track the same application's desk and history. Completed examples provide downloadable artifacts and hash verification.

There are **104 v2 application examples**: 69 regular desk-stage examples, two bounded consultations and 33 completed examples, plus **four separate vested-property preparation cases**. The previous compact examples remain. Initial sample counts can change as people operate the demo.

| Role family | Example work |
| --- | --- |
| Citizen / representative | Own requests, schedules, sample evidence, corrections, payments and completed outcomes |
| AC Land / union / officer | Initial mutation order, local enquiry, technical review, return to final AC Land desk |
| Records / registrar / surveyor / kanungo / settlement | Copy requests, deed preparation, survey evidence and appropriate handoffs |
| Lease committee / UNO / DC | Notice-specific eligibility, evidence, recommendation and competent local decision stages |
| Acquisition / legal / appeals | Claim or objection evidence, reasons, scoped consultation and return handoffs |
| Ministry / divisional consultation | A routed acquisition example that returns to the referring LA desk after checks |
| Finance | Holding demands, tax-correction example and reconciliation; citizen tax payment generates the demo Dakhila without an invented manual approval |
| Support | Service grievance and appointment examples |
| VP desk | Separate evidence-preparation cases through VP → legal → DC → records, with external-authority references explicitly unverified |
| Administrator / auditor | Read-only application examples, outcomes and history; admin manages accounts/settings, auditor inspects; neither receives service approval powers |

## Research and workflow boundaries

The official [mutation stages](https://mutation.land.gov.bd/namjari-steps) describe the AC Land initial order before union enquiry. New mutation/inheritance examples and applications therefore start at AC Land, proceed to union and technical review, and return to AC Land for final disposition. Partition/consolidation use the same initial-order distinction. Existing applications retain their stored desk sequence and history; they are not silently rerouted. Technical review and consultations are local demonstration mappings, not universal statutory mandates. Hearing, evidence, authority and service-specific current requirements must be confirmed case by case.

The [official tax manuals](https://ldtax.gov.bd/manual) and [published fee reference](https://land.gov.bd/vumisheba-fee?lang=bn) remain linked from service guidance. Samples do not submit to government portals or take real payments. A completed report proves only the integrity of the local payload.

## Data preservation

The one-time `roleDemoEdition` migration adds deterministic IDs without resetting existing applications, edited examples, accounts or uploaded documents. Example content is generated independently; it never copies a user's edited request or uploaded evidence. New citizen registrations remain empty and private. Demo cases respect ownership, current desk, prior handoff and oversight permissions. Old v1-only configurations retain the compact v1 seed rather than receiving v2 workflows.

## Original colours restored

The owner requested the previous colours after reviewing the theme update. The original Padma, Meghna, Sundarban and Surma palettes, sidebar fills, component colours and day/night appearance are restored from the pre-update styles. The demo stylesheet now contains layout rules only. Original font stacks, composition, reduced-motion support and all role/workflow additions remain intact.

| Blue day | Blue night |
| --- | --- |
| ![Light blue](screenshots-role-themes/meghna-light.png) | ![Blue night](screenshots-role-themes/meghna-dark.png) |
| Clay day | Clay night |
| ![Original clay](screenshots-role-themes/sundarban-light.png) | ![Clay night](screenshots-role-themes/sundarban-dark.png) |

## Verification

- 139 automated test cases passed: prior lifecycle/security regressions plus all 33 new service examples resolved using actual APIs, consultations returned to LA, VP handoff, outcome hashes, owner isolation and idempotent restart.
- All 24 roles passed the 33-service example-library and mobile checks.
- The browser regression checks all 192 role/theme/mode combinations against the original alternate sidebar colours, selected palette/mode and preserved font stack. The previous contrast results applied to the replaced palette and are not claims about the restored colours.
- Screenshot renders are in `docs/screenshots-role-themes/`. Browser automation relays actual local responses when loopback is isolated; no fake API results are substituted.

```powershell
npm run check
npm run build
npm test
# With Playwright/Chromium installed or configured:
node ebhumi-platform/tests/role-themes-browser.cjs
```
