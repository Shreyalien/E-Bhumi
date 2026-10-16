# e-Bhumi Frontend — Maximum Feature Edition

A modern, responsive, citizen-first frontend implementation for the e-Bhumi Bangladesh land-services platform. This edition combines an illustrated public landing page with an interactive 18-module workspace covering all 460 tracked requirements from the specification manifest.

**Edition:** Merged Maximum Edition · **Runtime:** Zero-dependency static HTML/CSS/JavaScript · **Catalogue:** 460 tracked requirements · **Dependencies:** Zero external libraries.

## Quick start

Requires Node.js 18 or newer (or Python 3). No external installation, build, database, or API keys are required.

### Via Node.js
```bash
# In e-Bhumi-Frontend folder:
npm start
# or:
node server.cjs
```
Open **[http://127.0.0.1:8080](http://127.0.0.1:8080)** in your browser.

- **Public Landing Page:** `http://127.0.0.1:8080/`
- **Interactive Workspace:** `http://127.0.0.1:8080/workspace.html#dashboard`

### Via Python (Alternative)
```bash
python -m http.server 8080
```

### Syntax & Self-Check
```bash
npm run check
```

## Highlights & Capabilities

- **Landing Page (`index.html`):** CSS parcel geometry landscape, service overview cards, onboarding walkthrough, FAQ disclosure accordions, and direct links to workspace modules.
- **18 Interactive Workspaces (`workspace.html`):**
  1. Overview / Dashboard (`#dashboard`)
  2. Land Search & Record Verification (`#land-search`)
  3. My Land & Land Passport (`#my-land`)
  4. Land Services Directory (`#services`)
  5. Applications & Tracking (`#applications`)
  6. Government Land Lease & Bandobasto (`#land-lease`)
  7. Chattogram Hill Tracts Special Zone (`#ctg-zone`)
  8. GIS & Parcel Map (`#gis`)
  9. Document Vault (`#documents`)
  10. Payments & Receipts (`#payments`)
  11. Due Diligence Checklist (`#due-diligence`)
  12. AI Land Assistant (`#ai-assistant`)
  13. Cases & Dispute Register (`#casebook`)
  14. Appointments & Queues (`#appointments`)
  15. Notification Centre (`#notifications`)
  16. Analytics & Reports (`#analytics`)
  17. Feature Catalogue (`#feature-catalog`)
  18. Service Administration & Health (`#admin`)
- **Local Persistence & Workspace Tools:**
  - Autosaved per-page notes and favorites.
  - Land area unit converter (decimals, acres, hectares, sq ft).
  - Real file exports: JSON full report, CSV transaction receipts, SVG schematic parcel map.
  - Local application draft creation, document metadata intake, and due-diligence checklist tracking.
- **Accessibility & UX:**
  - Full keyboard focus trap and restore in modal dialogs.
  - Skip-to-content links.
  - High-contrast focus rings and `@media print` layout formatting.
  - Reduced-motion support.

## Project Structure

```text
e-Bhumi-Frontend/
├── index.html             # Public landing page with service entry points
├── workspace.html         # Interactive 18-module citizen workspace shell
├── app.js                 # Complete client runtime, routes, persistence, and tools
├── server.cjs             # Zero-dependency local development server (port 8080)
├── server.js              # Alternative local development server
├── package.json           # npm start and npm run check scripts
├── run_local.bat          # Windows launcher
├── run_local.sh           # Unix/Linux launcher
├── assets/
│   ├── landing.css        # Landing page styling
│   └── styles.css         # Workspace styling, focus rings, and print media rules
├── data/
│   └── features.json      # Complete catalogue of 460 tracked requirements
├── FEATURE_COVERAGE.md    # Detailed specification coverage notes
└── README.md              # Frontend documentation
```

## Legal Boundary & Disclaimer

All data shown in this frontend is sample/sandbox data for design and demonstration purposes. It is **not** an official Government of Bangladesh service, and records do not represent legal proof of land title or ownership.
