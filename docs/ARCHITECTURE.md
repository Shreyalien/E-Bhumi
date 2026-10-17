# Application architecture blueprint

This implementation adopts the V5 reference's local application architecture and review flow while retaining the project's existing landing and regional page presentation. This is the running sandbox design; production integrations remain separate.

```mermaid
flowchart TB
    subgraph Presentation
        Landing[Original landing design]
        Auth[Login and registration]
        Citizen[Original citizen navigation and Overview]
        Regional[Original lease and CHT compositions]
        Roles[Ten account-bound role portals]
    end
    subgraph Application
        HTTP[HTTP routing and static allowlist]
        Session[Session and CSRF boundary]
        Access[Owner and service-role policy]
        Engine[Revision-checked state transitions]
        Catalog[Service fields and evidence definitions]
        Output[Sandbox outcomes and notifications]
    end
    subgraph Persistence
        Store[Atomic local JSON store]
        Evidence[Private sample bytes and SHA-256]
        Audit[Hash-linked event history]
    end
    Landing --> Auth --> Roles
    Roles --> Citizen
    Citizen --> Regional
    Citizen --> HTTP
    Regional --> HTTP
    Roles --> HTTP
    HTTP --> Session --> Access --> Engine
    Catalog --> Engine
    Engine --> Store
    Engine --> Evidence
    Engine --> Audit
    Engine --> Output
```

## Module responsibilities

| Module | Responsibility |
| --- | --- |
| `server-v4.cjs` | Loopback HTTP server, allowed static files, security headers and portal routing |
| `lib/land-dossiers.cjs` | Private worksheet persistence, source provenance, graph validation, linked-case access, local review and immutable report snapshots |
| `land-intelligence.js` | Truth Card, interactive relationship SVG, timeline/boundary, tasks, evidence, report and office-routing UI |
| `workflows.js` | Dedicated demand/receipt, case, appointment and calculator UI using the existing design components |
| `lib/platform.cjs` | Account/session operations, API validation, ownership/role policy, transitions and durable local state |
| `lib/catalog.cjs` | 33 service definitions, service-specific questions, evidence, review role and outcome |
| `lib/geography.cjs` | Matching division/district validation data |
| `lib/seed-demo.cjs` | Additive demo scenarios and preference defaults; no reset of existing work |
| `auth.js` | Account UI and safe return to a selected citizen route after login |
| `portal.js` | Workflow UI, authenticated requests, application forms and role views |
| `citizen.js` | Preserved citizen, lease and CHT presentation; preparation tools/preferences |
| `assets/styles.css`, `assets/landing.css` | Original design and font declarations |
| `preserved.css` | Compatibility styles between the preserved shell and new workflow forms |

## Invariants

1. A UI role label cannot grant API permissions.
2. A citizen/representative may read and edit only their own applicable requests.
3. Staff see submitted requests for their service role and must claim before deciding.
4. Admin oversight cannot bypass service-role decisions; auditors are read-only.
5. Each mutation checks the current revision and legal transition in the sandbox state machine.
6. Required service fields/evidence are validated before submission.
7. Payment success is a local simulation, replay-protected per request, never an external payment confirmation.
8. Only an eligible assigned reviewer may issue a ready outcome.
9. Document hashes concern local byte integrity, not official authenticity.
10. No public static path exposes `.data`, server libraries or account hashes.

## Boundaries and operation

Run one Node process against one local `.data` directory. Passwords use salted scrypt; sessions are memory-only and require login after a restart. User/account data and sample files are held in JSON and are not encrypted. Stop the process before copying/restoring `.data`. The shared demo credentials and loopback deployment are for evaluation, not public hosting.

Government registry/GIS/identity APIs, official signatures, real payments, postal delivery and legal decisions are not integrated. The 460-item feature catalogue remains a roadmap/specification registry. See the [service handbook](SERVICE_HANDBOOK.md), [application flow](APP_FLOW.md) and [validation](../VALIDATION.md).

## Appointment inventory and demo migration

Appointment availability is an aggregate local simulation with four requests per office/date/time. Submission and reschedule recheck capacity on the server. Owner changes require a matching revision and reason; reschedule removes the old outcome and assignment, cancellation removes the old outcome and enters Cancelled. Government inventory is not queried.

Demo edition 7 trims only untouched generated records, retaining user changes and reconciled payments. It preserves all 33 services with three examples per demo owner.

## Land intelligence access

Owners create and edit their private worksheet. Linking a matching own application shares its facts/evidence with the service desk only when that desk can read the application. Only the assigned reviewer of an active linked request can add a local review note. Source labels cannot be upgraded to official verification. Every write checks revision; content changes invalidate the freshness of earlier local notes. Snapshots retain their own SHA-256. See [feature depth and reference mapping](LAND_INTELLIGENCE.md).
