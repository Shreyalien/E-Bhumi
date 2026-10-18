# Bilingual interface and licence review - 18 October 2026

## Interface behaviour

- Bangla is the initial language. The public headline starts as **আপনার জমি। সেবার পথে স্বচ্ছতা।**; English retains **Your land. A clearer path.** The original green emphasis, font stacks and page composition are preserved.
- Land Passport is consistently **ল্যান্ড পাসপোর্ট** in Bangla. Search results, the parcel link, citizen navigation and passport introduction use the full name.
- **Service workflows / সেবার কার্যপ্রবাহ** has independent Bangla and English copy for all 33 services and all 24 roles: responsible desks, routing, corrections, fees, output types and example statuses.
- The law library has 42 selected sources with separate English reading notes and coverage descriptions. These are explanatory guides, not translated statutory instruments. Follow the linked official original for the law itself.
- Law filters retain their stored values when the visible labels change language. User input, private notes, uploaded evidence, historical records and identifiers are not rewritten for translation.
- Repeated sample-account and sidebar notices were reduced. One prominent workspace notice and output watermarks still distinguish sample activity from official filing and real payment.
- Assistant controls and prepared guidance use the selected language. A user's message remains exactly as entered.

## Licence scope

[LICENSE](../LICENSE) reserves rights in eligible new original additions after `9eb2409b50eb0f893f3ffea2a5561d2264fb9164`. Separate written permission is required to reuse those additions, subject to applicable law and existing rights.

Code previously published under MIT retains its permissions and attribution in [the preserved prior notice](../licenses/MIT-prior-releases.txt). Public GitHub viewing/forking and third-party licences remain applicable. This change cannot revoke permissions already granted over older source. See [GitHub's licensing guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository) and [third-party notices](../THIRD_PARTY_NOTICES.md).

Every role portal links to `/license.html`, with a bilingual summary and unchanged complete operative English and prior MIT texts.

## Verification

- `npm run check` and `npm run build` pass.
- `npm test`: 145 automated cases pass, including all 33 service lifecycles, desk handoffs, payment/delivery simulation, permissions, persistence, login boundaries and session revocation.
- `npm --prefix ebhumi-platform run test:bilingual`: 24 role logins; 33-service pages switch Bangla/English/Bangla; bilingual search; mobile layout; full Land Passport labels; 42-source English notes; working translated law filter; assistant language and preserved user message; public licence route and unchanged legal text.
- `npm --prefix ebhumi-platform run test:interface`: the six original browser comments, original green accent, all 24 role portals, mobile/tablet layout and unchanged form values.
- `npm --prefix ebhumi-platform run test:auth-browser`: Bangla errors, exact Unicode passwords, registration, empty new-account state and return to the intended protected page.
- A broad audit visited every navigation entry for all 24 roles without page errors or horizontal overflow. Saved sample titles, bilingual place names, legal originals, currency symbols and record identifiers are data; they are not evidence that interface translation failed.

## Push and hosting

The linked Vercel project is `e-bhumi`, GitHub repository `Shreyalien/E-Bhumi`, production branch `main`, Node.js 24. `.github/workflows/verify.yml` runs syntax, build, lifecycle and browser translation checks on pushes and pull requests. Vercel's Git integration manages deployment independently; this workflow does not claim to gate production publishing.

Use `git push origin main` from the repository root after a commit. Confirm both the GitHub Actions result and the Vercel deployment result; a successful local build alone does not establish that a remote deployment succeeded. Private data and credentials are excluded from deployment and source archives.
