# Final application and research audit — 18 October 2026

Scope: maintained `LANDFINAL` source, the linked Vercel deployment and official Bangladesh land-service references. The existing green/white identity, compact palette picker, typography, role platforms and service features are retained.

## Bugs reproduced and fixed

| Trigger | Previous result | Corrected behaviour |
| --- | --- | --- |
| Register a Unicode password with leading/trailing spaces, then enter the same password | Registration silently trimmed it; login failed | Registration hashes the exact submitted password; login and password changes preserve it |
| A Bangla UTF-8 character is split across request chunks | The character was replaced with corrupted text | Request bytes are bounded, collected and decoded once before JSON parsing |
| Sign in to a law-library entry, calculator or staff queue after session expiry | The older route whitelist returned users to the dashboard | Safe internal route fragments survive re-login for every role; external/malformed destinations fall back to the dashboard |
| Submit oversized/non-string login credentials or an oversized current password | Inputs could be coerced or unnecessarily hashed | Types/lengths are checked before hashing; login still returns a generic credential error |

Existing password hashes and application/payment state are not rewritten. The new registration behaviour applies to newly submitted passwords. Old accounts keep their existing credentials.

## Verification

- `npm run check` and `npm run build` validate source and deployment assets.
- `npm test` contains 145 cases after adding six authentication/UTF-8 cases. Existing suites exercise all 33 service workflows, roles, permissions, CSRF, evidence, payment retries, appointment capacity/rescheduling/cancellation, outcome integrity and persistence.
- `npm --prefix ebhumi-platform run test:auth-browser` checks actual browser registration/login with a spaced Bangla password, translated invalid-login feedback, private empty new accounts, expired-session return, staff queue return and nested law-library routes.
- The interface browser audit checks login and navigation across all 24 roles, English/Bangla, tablet notification alignment, mobile overflow and browser errors.
- Live verification checks all 24 role accounts and scoped examples, plus the configured mutation desk sequence, filing/decision payments, a completed outcome/hash, protected pages and origin rejection. Synthetic validation applications are visibly labelled `DEMO`.
- An existing production login and the pre-deployment application identities/statuses/revisions are checked after promotion. Build readiness alone is not treated as application verification.

The current results and source archive are delivered with this audit. These checks establish the tested paths; they are not a claim that every possible bug or statutory exception has been eliminated.

## Official research and implemented guidance

| Official reference | Finding | Application treatment |
| --- | --- | --- |
| [Ministry circular register](https://minland.gov.bd/pages/static-pages/694032df35ce18e1c0563b8d), updated September 2026 | Lists the 17 February 2026 record/map fee revision | Links to the original circular in the shared law library and relevant service guidance |
| [Original fee circular, 17 February 2026](https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-minland/2026/1/474d0828-7c66-4f0d-98c3-78105e0009d9.pdf) | Visually read the complete scanned page: Khatian government fee 100 + service fee 20 = 120 taka; map per sheet 520 + 25 = 545 taka. This circular does not specify postal charges | Corrected the law-library guidance. Historical 100/520 filing and 40/110 postage simulation fixtures are explicitly distinguished from current government demands; saved quotes, payments and receipts are not silently repriced |
| [LD Tax citizen/manual entry](https://ldtax.gov.bd/manual) and [linked citizen manual](https://admin.ldtax.gov.bd/storage/Manual/nNqBZ0Z3b01mszO7PWmy2ZY1jCG3alcEo91Pov7a.pdf) | Official citizen/organisation guidance is available | Retains holding/demand/payment/Dakhila preparation context; real tax assessment and government payment are external |
| [DLRS survey portal](https://settlement.gov.bd/) | Explicitly identifies displayed ongoing-survey records as drafts that may change | Added draft/final-record guidance to copy, map, correction and survey-objection services; sample search results do not prove title |
| [Waterbody online lease notice](https://minland.gov.bd/pages/notices/6940379335ce18e1c058a14f) | The opened notice was published in 2021 and archived in 2022 | Historical process context only; current local notices determine deadlines, eligibility, deposits and submission methods |
| [Mutation stages](https://mutation.land.gov.bd/namjari-steps) and [applicant guidance](https://mutation.land.gov.bd/nirdeshika) | Direct requests returned 403 during this audit | The existing official indexed guidance and initial AC Land → union enquiry → review → final AC Land mapping remain bounded demo mappings; no newly verified statutory deadline is asserted |
| [OWASP authentication guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) | Password characters/whitespace should be preserved; hash comparisons need type and length controls | Exact password handling and bounded input validation are tested. This demo is not claimed to satisfy every OWASP/NIST production requirement |

No government deadline, blanket lease deposit, inheritance determination or title decision was invented from an inaccessible or historical source.

## Remaining integration limits

This is an independent local/hosted sandbox. Official NID/OTP identity, email password recovery, government filing, certified signatures, official records, real payment settlement, external SMS/email and office appointments are not connected. The shared private Blob snapshot supports the hosted demo; a transactional database and production identity/territorial controls are required for sensitive or substantial public traffic. These are deployment boundaries, not completed integrations.

GitHub publishing must be verified separately from Vercel promotion. In this environment Git's credential helper has failed to launch; a locally committed change or a successful Vercel deployment does not imply that `origin/main` has been updated.
