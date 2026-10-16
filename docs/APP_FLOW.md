# Version 4 app flow

See the [README lifecycle diagram](../README.md#application-flow) and [per-service handbook](SERVICE_HANDBOOK.md).

## Applicant states

Draft → Submitted → UnderReview → CorrectionRequested → owner edits/resubmits → Submitted.

UnderReview may proceed to HearingScheduled. Staff can approve or reject only from UnderReview/HearingScheduled. Staff approval creates AwaitingPayment when a sandbox fee exists, otherwise ReadyForDelivery. Payment failure creates PaymentFailed, which can be retried. Successful payment creates ReadyForDelivery. Assigned staff issuance creates Completed and the watermarked outcome.

The owner can withdraw Draft, Submitted or CorrectionRequested requests. Completed, Rejected and Withdrawn are terminal in that request. Review/appeal preparation uses its own separately created service request.

## Staff states and account changes

Each service has exactly one reviewer role. Staff must claim work before recording decisions. Suspending/changing an assigned reviewer returns active review work to the matching queue; ready deliveries retain their ready state and can be claimed by an eligible replacement.

## Records, tax and support

E-porcha and map workflows include delivery preferences. Tax requests retain holding/year references and generate a sample Dakhila outcome. Appointments use preferred dates rather than live slot inventory. Support requests have no sandbox fee and proceed from approval to staff-issued outcome.

## Audit and permissions

Owners see their records. Service staff see submitted records for their role; they cannot see unsubmitted citizen drafts. Administrators inspect cases but do not bypass role decisions. Auditors inspect without writing. Each transition checks role, ownership, status and revision.
