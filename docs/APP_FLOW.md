# Application flow — v5.2

See the [README lifecycle diagram](../README.md#app-flow) and [per-service handbook](SERVICE_HANDBOOK.md).

## Applicant states

Draft → Submitted → UnderReview → CorrectionRequested → owner edits/resubmits → Submitted.

UnderReview may proceed to HearingScheduled. Staff can approve or reject only from UnderReview/HearingScheduled. Staff approval creates AwaitingPayment when a sandbox fee exists, otherwise ReadyForDelivery. Payment failure creates PaymentFailed, which can be retried. Successful payment creates ReadyForDelivery. Assigned staff issuance creates Completed and the watermarked outcome.

The owner can withdraw Draft, Submitted or CorrectionRequested requests. Completed, Rejected and Withdrawn are terminal in that request. Review/appeal preparation uses its own separately created service request.

## Staff states and account changes

Each service has exactly one reviewer role. Staff must claim work before recording decisions. Suspending/changing an assigned reviewer returns active review work to the matching queue; ready deliveries retain their ready state and can be claimed by an eligible replacement.

## Records, tax and support

E-porcha and map workflows include delivery preferences. Tax requests retain holding/year references and generate a sample Dakhila outcome. Appointments check local capacity (four requests per office/date/time), with Dhaka future-slot validation; no government slot inventory is connected. Support requests have no sandbox fee and proceed from approval to staff-issued outcome.

## Audit and permissions

Owners see their records. Service staff see submitted records for their role; they cannot see unsubmitted citizen drafts. Administrators inspect cases but do not bypass role decisions. Auditors inspect without writing. Each transition checks role, ownership, status and revision.

## Appointment changes and linked cases

After support issuance, the owner can download a demo token and UTC calendar event for the chosen Dhaka time. Owner rescheduling invalidates the token/outcome, resets assignment and returns to Submitted for fresh support confirmation. Cancellation creates terminal Cancelled; old tokens are unavailable. Every change checks owner, revision, required reason and slot validity/capacity.

Completed/rejected revenue cases offer a separate review/appeal draft with the source case reference and land context. No source evidence or decision is silently changed.
