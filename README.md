<div align="center">

# 🏞️ e-Bhumi

**A citizen-first digital land experience platform for Bangladesh**
Service discovery · Parcel & GIS workspace · Applications · Documents · Verification · Payments · Support · AI assistance

![Status](https://img.shields.io/badge/status-in%20development-orange)
![Stage](https://img.shields.io/badge/stage-pre--alpha-red)
![Features](https://img.shields.io/badge/tracked%20features-460-blue)
![Mode](https://img.shields.io/badge/data-demo%20%2F%20sandbox-lightgrey)
![i18n](https://img.shields.io/badge/lang-বাংলা%20%7C%20English-green)
![License](https://img.shields.io/badge/license-TBD-lightgrey)

</div>

> ⚠️ **Project status: under active development — NOT production-ready.**
> e-Bhumi is currently in the specification/early build stage. APIs, schemas, and UI will change without notice.
> **All data shown is demo/sandbox data.** e-Bhumi is **not** an official Government of Bangladesh system and is **not** connected to any live government land registry.

---

## 📖 Table of Contents
1. [What is e-Bhumi?](#-what-is-e-bhumi)
2. [Government authority boundary](#-government-authority-boundary)
3. [Key capabilities](#-key-capabilities)
4. [Feature scope](#-feature-scope)
5. [Architecture](#-architecture)
6. [Tech stack](#-tech-stack)
7. [Repository structure](#-repository-structure)
8. [Getting started](#-getting-started)
9. [Configuration & feature flags](#-configuration--feature-flags)
10. [Roadmap](#-roadmap)
11. [Security & privacy](#-security--privacy)
12. [Accessibility & localization](#-accessibility--localization)
13. [AI & OCR safety](#-ai--ocr-safety)
14. [Testing](#-testing)
15. [Documentation](#-documentation)
16. [Contributing](#-contributing)
17. [License](#-license)
18. [Disclaimer](#-disclaimer)

---

## 🌾 What is e-Bhumi?

Land services in Bangladesh are spread across many departments, portals, and paper processes. Citizens often cannot tell **which service they need, what documents are required, where their application stands, or whether the information they see is trustworthy.**

e-Bhumi is a **citizen experience, orchestration, intelligence, verification and integration layer** that sits in front of authoritative systems. It is:

- **Task-first** – organised around what people need to do, not around departments.
- **Parcel-aware** – every service, document and application can be tied to a land parcel (Dag / Khatian / Mouza).
- **Provenance-first** – every external or analytical value can show its **source, date, freshness and authority class**.
- **Bilingual & accessible** – Bangla and English, mobile-first, low-bandwidth friendly, WCAG-minded.
- **Modular & adapter-based** – external systems are accessed only through adapters; one upstream outage never takes down the platform.

### Who is it for?
Citizens, landowners, buyers/sellers, heirs, authorised representatives, legal professionals, survey/Amin personnel, land-service officers, support operators, service administrators, auditors, integration operators and system administrators.

---

## 🏛️ Government authority boundary

Existing official systems **remain authoritative**.

| e-Bhumi **may** | e-Bhumi **must not pretend to** |
|---|---|
| Explain official services and requirements | Own authoritative land registry data |
| Prepare users and checklists | Issue legal title by itself |
| Show parcel context from authorised data | Decide court cases |
| Orchestrate application references | Enforce registry/mutation actions without formal authority |
| Store permitted references and receipts | Claim live government API integration without access |
| Provide source-aware analysis and official handoffs | Invent fees, SLAs, official IDs or credentials |

Features that need official data, APIs or legal authority are kept in the architecture and marked
`REQUIRES_OFFICIAL_INTEGRATION`, `REQUIRES_OFFICIAL_VALIDATION`, `MOCKED` or `DEFERRED` — never silently removed, and mocks never masquerade as live systems.

---

## ✨ Key capabilities

| Area | Highlights |
|---|---|
| 🔎 **Discovery & search** | Unified service + parcel search, Dag/Khatian/Mouza/JL lookup, Bangla/English numeral normalisation, natural-language "Problem Finder" |
| 🗺️ **Parcel & GIS workspace** | Interactive cadastral map, layer control, identify/BBOX search, measurement tools, unit converter (decimal, katha, bigha, acre…), **map ⇄ list parity** |
| 📝 **Application engine** | Draft/autosave, dynamic forms, checklists, validation, corrections/queries, tracking, "next best action" |
| 📄 **Documents & verification** | Secure vault, versioning, integrity hashes, share links, public reference verification |
| 💳 **Payments** | Provider adapter, idempotent intents, webhooks, reconciliation, receipts (mock provider in demo mode) |
| 🔔 **Notifications & support** | In-app/SMS/email adapters, complaints, escalation, assisted-digital directory, appointments |
| 🧠 **Land intelligence** | Parcel 360, Truth Card, cross-source reconciliation, due-diligence, inheritance & partition preview, Change Watch |
| 🤖 **AI & OCR** | Retrieval-grounded, source-cited, bilingual assistant; OCR with human review; advisory only |
| 🏢 **Officer & admin workspace** | Queues, assignments, SLA, hearings, casebook, workflow builder, fee rules, integrations health, audit, analytics, feature flags |
| 🧭 **Advanced GIS / field** | Mauza-sheet scanner, georeferencing, multi-epoch cadastre analysis, offline Amin survey sync, KML/KMZ export |

---

## 📊 Feature scope

The machine-readable registry tracks **458 features** (208 baseline + 250 maximum-edition extensions) across 23 delivery phases.

| Module | Features |
|---|---:|
| Citizen & Service | 53 |
| GIS / Cadastral | 50 |
| AI / Data Quality / Intelligence | 40 |
| Land & Parcel / Records (incl. Land & Parcel) | 51 |
| Applications & Workflows (incl. Government) | 52 |
| Advanced / Field / Security | 28 |
| Documents / Trust (incl. Verification) | 37 |
| Notifications / Support / Inclusive Access (incl. base) | 40 |
| Government & Knowledge / Administration | 41 |
| Payments & Finance / Tax | 31 |
| Land Intelligence & Anti-Fraud | 19 |
| AI / OCR | 16 |

> Feature IDs (`CORE-###`, `MX-###`) are stable and must be preserved in code, tests and docs.

---

## 🏗️ Architecture

e-Bhumi starts as a **modular monolith** with clear domain boundaries, asynchronous workers, and adapter-based integrations — designed so heavy domains (GIS, OCR/AI, notifications, integrations) can be extracted later without rewriting the core.

```text
Web / Mobile Web (React + TypeScript)
        ↓
API layer (REST /api/v1, OpenAPI)
        ↓
Application services → Domain modules
        ↓
Repositories / Integration contracts (adapters)
        ↓
PostgreSQL + PostGIS · Object storage · Cache · Job queue
        ↓
Government / external adapters (demo providers by default)
```

**Cross-cutting:** authentication, RBAC/ABAC, provenance, audit (hash-chained), notifications, error model, configuration, feature flags, observability.

**Core rules**
1. No business logic in controllers — domain services own rules.
2. External systems are accessed only through adapters.
3. Every external field can carry provenance + freshness.
4. One upstream failure must not crash the platform.
5. Public map search never exposes sensitive owner data.
6. Every state-changing endpoint authorises server-side.
7. Mock integrations never masquerade as live systems.

**Data authority classes:** `AUTHORITATIVE · OFFICIAL_EXTERNAL · USER_SUBMITTED · MACHINE_EXTRACTED · ANALYTICAL · DEMO · UNKNOWN`

---

## 🧰 Tech stack

| Layer | Choice |
|---|---|
| Frontend | React, TypeScript, Vite, React Router, schema-validated forms, i18n, Leaflet (GeoJSON / vector-tile capable) |
| Backend | Node.js, TypeScript, modular REST API, schema validation, OpenAPI |
| Database | PostgreSQL + PostGIS, versioned migrations |
| Async | Redis (cache), durable job queue, worker process, outbox pattern |
| Storage | S3-compatible abstraction (local FS for dev only) |
| AI / OCR | Provider abstraction, deterministic demo fallback |
| DevOps | Docker, CI/CD, structured logs, metrics, health/readiness checks |

> Stack choices are the recommended baseline and may be refined while keeping the architectural boundaries.

---

## 📁 Repository structure

```text
e-Bhumi/
├── e-Bhumi-Frontend/     # Runnable frontend workspace (Maximum Feature Edition)
│   ├── assets/           # Responsive CSS styles (landing.css & styles.css)
│   ├── data/             # Feature catalogue manifest (460 tracked features)
│   ├── app.js            # Complete frontend logic, 18 modular workspaces & persistence
│   ├── index.html        # Public landing page with parcel landscape & entry points
│   ├── workspace.html    # Full 18-module interactive citizen workspace shell
│   ├── server.cjs        # Zero-dependency local development server (port 8080)
│   ├── server.js         # Alternative local development server
│   ├── package.json      # npm start & npm run check scripts
│   ├── run_local.bat     # Windows one-click local server launcher
│   ├── run_local.sh      # Unix local server launcher
│   ├── FEATURE_COVERAGE.md
│   └── README.md         # Frontend workspace documentation
├── VALIDATION.md         # Automated test & validation report
└── README.md             # Platform specification & architectural blueprint
```

---

## 🚀 Getting started

### Quick start: Running the e-Bhumi Frontend

The demonstration frontend workspace is ready to run immediately:

#### Node.js (Recommended)
```bash
cd e-Bhumi-Frontend
npm start
# or: node server.cjs
```

#### Windows (One-Click)
Navigate to the `e-Bhumi-Frontend` folder and double-click `run_local.bat`, or in terminal:
```cmd
cd e-Bhumi-Frontend
run_local.bat
```

#### Python (Alternative)
```bash
cd e-Bhumi-Frontend
python -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080) in your browser:
- **Landing Page:** [http://localhost:8080/](http://localhost:8080/)
- **Workspace:** [http://localhost:8080/workspace.html#dashboard](http://localhost:8080/workspace.html#dashboard)

> 💡 **Tip:** Serving over HTTP (via `npm start`, `run_local.bat`, or Python) ensures the browser can load the complete 460-feature catalogue from `data/features.json` without browser local file security restrictions.

### Full-Stack Architecture (Targeted Roadmap)
For full-stack production deployment with PostgreSQL + PostGIS, Node.js API adapters, and background workers:
```bash
# 1. Clone repository
git clone https://github.com/<your-username>/E-Bhumi.git
cd E-Bhumi

# 2. Configure environment
cp .env.example .env

# 3. Start infrastructure (Postgres + PostGIS, Redis)
docker compose up -d
```

### Demo mode
With `DEMO_MODE=true` (default locally) all government integrations, payments, SMS/email, AI and OCR use **clearly labelled sandbox providers**. A persistent "Demo data" banner is shown in the UI.

---

## ⚙️ Configuration & feature flags

Configuration is loaded and validated at startup. Secrets are **never** committed — see `.env.example`.


Server-controlled, audited feature flags gate: government integrations · payment providers · AI providers · OCR · advanced GIS · authority-gated modules · experimental workflows.

---

## 🗺️ Roadmap

| Phase | Focus |
|---|---|
| P0 | Foundation: repo, config, docs, CI |
| P1 | Identity, PostGIS, provenance, RBAC, audit foundation |
| P2 | Public pages, i18n shell, service catalogue, citizen account |
| P3 | Unified search, Bangla numerals, permission filters |
| P4 | Parcel workspace, Khatian/Dag/Mouza context |
| P5 | GIS foundation: map, layers, identify, measurement, map/list parity |
| P6 | Application engine: forms, drafts, tracking, next action |
| P7 | Documents & verification |
| P8 | Officer queues, SLA, notices, hearings, admin workflow |
| P9 | Payments (adapter, webhooks, receipts) |
| P10 | Notifications, complaints, assisted digital |
| P11 | Intelligence: Problem Finder, Parcel 360, due diligence |
| P12 | Gov/admin analytics & integration health |
| P13–P14 | Advanced records, lineage, GIS QA, protected land, inheritance |
| P15 | AI assistant & OCR |
| P16 | Mauza scanner, field survey, offline sync, multi-epoch cadastre |
| P17 | Authority-gated modules (sandbox only until authorised) |
| P18–P23 | Hardening, DR, UAT, production readiness |

**Current status:** `P0 — specification complete, implementation starting.`

Track per-feature progress in `docs/feature_status.md` (planned).

---

## 🔐 Security & privacy

- Least privilege, defence in depth, fail-closed for sensitive actions
- RBAC + resource ownership + delegation; **object-level authorisation** server-side
- Adaptive password hashing, rotating sessions, MFA/OTP integration point, brute-force protection
- Strict CORS, security headers, validation, rate limits, request IDs, idempotency keys
- Secure file handling: size/type inspection, randomised keys, checksums, malware-scan hook
- Append-only, tamper-evident audit log (hash chain)
- Identity/ownership data is masked and permissioned; never exposed by public search or map popups
- NID verification is **not** implemented as real without an authorised identity integration

Found a vulnerability? Please **do not** open a public issue — see `SECURITY.md` (to be added) or contact the maintainers privately.

---

## ♿ Accessibility & localization

- Bangla + English, Bengali numerals where appropriate, localised dates/numbers, bilingual official terminology
- Semantic HTML, keyboard navigation, focus management, screen-reader labels, sufficient contrast, reduced motion
- Accessible tables/dialogs, zoom support, and a **list alternative for every critical map action**
- Mobile-first, low-end-Android friendly, minimal initial JS, progressive loading
- Every screen supports: `Loading · Success · Empty · Error · PermissionDenied · SourceUnavailable · Offline · Stale`

---

## 🤖 AI & OCR safety

AI is **advisory only**. It may guide, summarise, extract, explain, classify and flag possible anomalies. It must **not** make unsupported legal, ownership, court or registry decisions.

Controls: retrieval-grounded answers with citations · prompt-injection resistance · untrusted-document isolation · PII minimisation · confidence indicators · human review thresholds · provider abstraction · audit trail.
Analytical GIS/fraud outputs are labelled **"ANALYTICAL SIGNAL — REQUIRES OFFICIAL VERIFICATION"**.

---

## 🧪 Testing

Planned suites: unit · integration · API contract · frontend · E2E · GIS spatial · OCR · AI evaluation · authorisation (IDOR/BOLA) · security · accessibility · performance · offline sync · migration/restore · payment idempotency · integration-failure.

Definition of Done per feature: **implementation + tests + docs + status update.**

```bash
pnpm lint && pnpm typecheck && pnpm test
pnpm test:e2e
```

---

## 📚 Documentation

| Doc | Purpose |
|---|---|
| [`docs/PRD.md`](docs/PRD.md) | Product requirements |
| [`docs/TRD.md`](docs/TRD.md) | Technical architecture |
| [`docs/APP_FLOW.md`](docs/APP_FLOW.md) | User/application flows & screen map |

---

## 🤝 Contributing

The project is not yet open for external contributions. Once it is:
1. Fork and create a feature branch (`feat/<feature-id>-short-name`)
2. Keep feature IDs from the manifest in commits and tests
3. Run lint, typecheck and tests before opening a PR
4. Never commit secrets, real personal data, or copied third-party code/assets

---

## 📜 License

License **to be decided**. Until a `LICENSE` file is added, all rights are reserved.

---

## ⚖️ Disclaimer

e-Bhumi is an independent project. It is not affiliated with, endorsed by, or operated by the Government of Bangladesh or any ministry/department. Nothing in this project constitutes legal advice, an official land record, or legal proof of ownership. Always verify with the relevant official authority.
