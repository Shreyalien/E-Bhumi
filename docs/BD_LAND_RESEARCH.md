# Bangladesh land-service research and gap audit

Reviewed **16 October 2026**. This document separates official-source observations, our implementation choices and remaining integrations. It is a product coverage audit, not legal advice or confirmation of every current service rule.

## Sources reviewed

| Source | Observed scope | How used |
| --- | --- | --- |
| [Ministry of Land service portal](https://land.gov.bd/) | Mutation, development tax, records/maps, acquisition/requisition, lease/settlement, revenue cases, land information and grievance services | Broad service-family coverage |
| [Citizen benefits](https://www.land.gov.bd/nagorik-subidha?lang=bn) | Digital service access, mutation/partition/consolidation and record/map context | Separate consolidation/partition workflows instead of a single generic button |
| [Mutation guidance](https://mutation.land.gov.bd/nirdeshika) | Applicant/representative information, record/plot references and supporting evidence | Authority, land references, evidence, correction and review preparation |
| [Mutation tutorials](https://mutation.land.gov.bd/tutorial) | Application preparation and links to registration-related mutation guidance | Deed-readiness kept separate from actual registration |
| [Land development tax portal](https://ldtax.gov.bd/) | Citizen registration, holding/Khatian coordination and tax/Dakhila context | Holding registration, tax demand and sample receipt workflows |
| [Tax manuals](https://ldtax.gov.bd/manual) | Citizen and organisation guides | Organisation/representative intake context |
| [Land revenue case portal](https://case.land.gov.bd/) | Miscellaneous, review and rent-certificate case scope | Separate case, review, appeal-preparation and response requests |
| [Official DLRMS staging page](https://dlrms-stg.land.gov.bd/) | Records/maps UX includes search, request/checkout, preparation and delivery stages | UX reference only; staging figures, fees and timelines are not used as authoritative production rules |
| [Registration Directorate](https://registration.gov.bd/) | Separate official starting point for registration enquiries | External handoff; no claim that land-service login can register a deed |

Some government pages could be retrieved only through indexed extracts. The resulting workflows are therefore a **local design mapping of broad service categories**. Fees, legal eligibility, deadlines, geographic exceptions, official document requirements and approving hierarchy need fresh authoritative validation before any real deployment.

## Findings and changes

| Previous gap | Implemented in this edition | Boundary |
| --- | --- | --- |
| Generic service modal with no persistent submission | Individual wizard, fields/evidence, server record and state transitions | Local sandbox submission only |
| Namjari treated as one generic action | Transfer, inheritance, partition and consolidation services | No legal shares or official mutation |
| E-porcha/map preview without delivery path | Survey/reference, delivery choice, checkout, staff issue and downloaded sample outcome | No authoritative copy or postal service |
| Tax shown as fixed payments | Holding request, demand objection, tax review, checkout and sample Dakhila | No live demand/official fee or payment collection |
| Lease cards did not complete a process | Khas, tea, waterbody and commercial intake/review/outcomes | No allotment or tender/legal eligibility decision |
| Acquisition family incomplete | Agency proposal, claimant request, objection and requisition preparation | No statutory notices, compensation valuation or EFT |
| Case/complaint buttons saved only generic drafts | Distinct revenue case/review/appeal/response and support workflows | Not court filing or official grievance delivery |
| Survey and registration preparation lacked a reviewing desk | Surveyor and registrar roles with relevant queues | No cadastral correction or deed execution |
| Information-bank and zoning context missing | Two request/review/report workflows | No authoritative land-bank/zoning dataset |
| Role switch changed the UI only | Ten actual account roles, protected portals and server API checks | Simplified prototype responsibilities, not a legally approved government organisation chart |
| No staff response path | Claim, correction, hearing, approval/rejection and issue with notes | No real-world office action |
| Fake export/integrity actions | Actual protected evidence, hashes, JSON/CSV/HTML/SVG downloads | Hashes prove local byte integrity only, not legal authenticity |
| Fixed dashboards | Computed role-visible counts, queue status, notifications and reports | Local records only |
| CHT treated as normal plains process | Separate regional request; guard against automatically using selected plains workflows for CHT | No verified customary certificate or complete regional law implementation |

## Ideas from supplied screenshots

- Parcel history is shown as an explicitly labelled sample timeline.
- Evidence obligations appear as required-category checklists with actual uploaded/generated sample files.
- Deed/record area comparisons produce discrepancy questions rather than ownership verdicts.
- A proposed share worksheet checks user-entered allocations without deciding inheritance law.
- Assisted access uses a representative account with authority reference and an appointment request.
- Case history identifies the actor role, status, time and reason for each transition.

The screenshots' personal names, purported official verification, fee figures and time promises were not reused as authoritative information. Their visual style was not adopted.

## What remains outside the completed sandbox

This project is not a complete implementation of Bangladesh land law or every government organisation's workflow. It does not have authorised APIs for NID/OTP, mutation, tax, records, postal delivery, registration, acquisition, GRS or courts. Official fee/payment rules, deadlines, notices, approval hierarchies, signatures, inheritance rules and customary/regional procedures require formal validation and integration.

True cadastral/land-use data, field survey hardware/sync, live appointment inventory, bank/mobile-money settlement, AI/OCR, production security operations and disaster recovery are separate capabilities. The retained **460-item catalogue** continues to describe broader requirements; it must not be presented as 460 working production features.

See [service handbook](SERVICE_HANDBOOK.md) for the 33 local workflows that can be completed and [validation](../VALIDATION.md) for checks run.
