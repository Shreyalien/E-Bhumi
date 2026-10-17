# Sandbox service handbook — v5.4

Original fields/evidence below are retained. New cases also require the service-specific schedules and review checks in the [33-service research matrix](BD_SERVICE_RESEARCH.md). Those profiles replace the previous common 100-unit fee assumption: mutation has two simulated phases, records have filing checkout, tax pays an owned holding demand, and other desk services use their configured local fixtures. No amount is a live official fee.

Eligibility and source/jurisdiction confirmations → applicant → service details and structured schedules → sample evidence → preflight → applicable filing/payment stage → assigned desk checks → correction/hearing as needed → decision → local artifacts and delivery.

Old saved cases keep their previous lifecycle for compatibility.

## 1. নামজারি / ই-মিউটেশন

**Service ID:** `mutation` · **Category:** Mutation · **Review platform:** ভূমি কর্মকর্তা / Land officer

Update a sample land-reference holding after a transfer. Compare the deed chain, applicant authority, record and area before a simulated decision.

### Required service information

- দলিল নম্বর / Deed reference
- হস্তান্তরের তারিখ / Transfer date
- হস্তান্তরের ধরন — Purchase / Gift / Exchange / Court order

### Sample evidence categories

- দলিলের sample copy
- পূর্ব খতিয়ানের sample copy

### Completion and outcome

Submit the validated request to the officer queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **নামজারি খতিয়ান ও DCR — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://mutation.land.gov.bd/nirdeshika).

## 2. ওয়ারিশসূত্রে নামজারি

**Service ID:** `inheritance` · **Category:** Mutation · **Review platform:** ভূমি কর্মকর্তা / Land officer

Collect heirs and supporting references for review. This workflow does not calculate or determine legal inheritance shares.

### Required service information

- মৃত ব্যক্তির sample reference
- ওয়ারিশ ও দাবিকৃত অংশের বিবরণ
- ওয়ারিশ সনদ reference

### Sample evidence categories

- ওয়ারিশ সনদের sample
- মৃত্যু সনদের sample
- পূর্ব খতিয়ানের sample

### Completion and outcome

Submit the validated request to the officer queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **ওয়ারিশ নামজারি outcome — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://mutation.land.gov.bd/nirdeshika).

## 3. জমাভাগ / পৃথক খতিয়ান

**Service ID:** `partition` · **Category:** Mutation · **Review platform:** ভূমি কর্মকর্তা / Land officer

Prepare a proposed division with co-sharer and area references. A simulated reviewer may request corrections or a hearing.

### Required service information

- প্রস্তাবিত অংশ ও সহশরিক
- বণ্টন/সম্মতির reference

### Sample evidence categories

- বণ্টন reference sample
- বর্তমান খতিয়ান sample

### Completion and outcome

Submit the validated request to the officer queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **জমাভাগ outcome — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://mutation.land.gov.bd/nirdeshika).

## 4. জমা একত্রিকরণ

**Service ID:** `consolidation` · **Category:** Mutation · **Review platform:** ভূমি কর্মকর্তা / Land officer

Collect references for combining sample holdings. No authoritative record is changed.

### Required service information

- একত্র করার খতিয়ান/হোল্ডিং

### Sample evidence categories

- একাধিক খতিয়ানের sample

### Completion and outcome

Submit the validated request to the officer queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **একত্রিকরণ outcome — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://mutation.land.gov.bd/nirdeshika).

## 5. রেকর্ড সংশোধন

**Service ID:** `record-correction` · **Category:** Records · **Review platform:** রেকর্ড অফিস / Records officer

Describe the discrepancy, requested change and evidence. A reviewer records a reasoned local decision.

### Required service information

- বর্তমান ভুল তথ্য
- প্রস্তাবিত সংশোধন

### Sample evidence categories

- বিদ্যমান রেকর্ড sample
- সংশোধনের প্রমাণ sample

### Completion and outcome

Submit the validated request to the records queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **সংশোধন outcome — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://land.gov.bd/).

## 6. ই-পর্চা / সার্টিফাইড খতিয়ান

**Service ID:** `eporcha` · **Category:** Records · **Review platform:** রেকর্ড অফিস / Records officer

Select survey and Khatian references, choose delivery and complete a sandbox checkout. Records staff prepare and dispatch the sample copy.

### Required service information

- জরিপ ধরন — CS / SA / RS / BS/BRS / Mutation
- ডেলিভারি — Digital demo / Office collection demo / Postal demo
- ডেলিভারি ঠিকানা / sample address

### Sample evidence categories

- খতিয়ান অনুসন্ধান reference sample

### Completion and outcome

Submit the validated request to the records queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **সার্টিফাইড খতিয়ান copy — NOT OFFICIAL**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://land.gov.bd/).

## 7. খতিয়ানের অনলাইন কপি

**Service ID:** `instant-copy` · **Category:** Records · **Review platform:** রেকর্ড অফিস / Records officer

Request an online sample copy using a survey and record reference. The downloaded document is watermarked as demonstration output.

### Required service information

- জরিপ — CS / SA / RS / BS/BRS / Mutation

### Sample evidence categories

- খতিয়ান reference sample

### Completion and outcome

Submit the validated request to the records queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **অনলাইন খতিয়ান copy — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://land.gov.bd/).

## 8. মৌজা ম্যাপ / নকশা

**Service ID:** `mouza-map` · **Category:** GIS · **Review platform:** রেকর্ড অফিস / Records officer

Prepare a Mouza/sheet request and delivery preference. Only illustrative geometry is available.

### Required service information

- শিট নম্বর
- চাহিদার বিবরণ
- ডেলিভারি — Digital demo / Postal demo / Office collection demo

### Sample evidence categories

- মৌজা/শিট reference sample

### Completion and outcome

Submit the validated request to the records queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **মৌজা ম্যাপ request outcome — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://land.gov.bd/).

## 9. হোল্ডিং নিবন্ধন ও সমন্বয়

**Service ID:** `holding` · **Category:** Tax · **Review platform:** ভূমি কর্মকর্তা / Land officer

Link sample Khatian information to a tax holding and send it to a land officer for review.

### Required service information

- হোল্ডিং reference
- ভূমির শ্রেণি — Agricultural / Homestead / Commercial / Other
- বিদ্যমান holding বা নতুন holding

### Sample evidence categories

- খারিজ খতিয়ান sample
- পূর্ব দাখিলা sample

### Completion and outcome

Submit the validated request to the officer queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **হোল্ডিং registration — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://ldtax.gov.bd/).

## 10. ভূমি উন্নয়ন কর / খাজনা

**Service ID:** `land-tax` · **Category:** Tax · **Review platform:** হিসাব ও পেমেন্ট / Finance

Review a sample demand, simulate checkout and download a sample Dakhila after finance review. No live tax is assessed or collected.

### Required service information

- হোল্ডিং reference
- করবর্ষ / tax year
- দাবির reference (not an amount)

### Sample evidence categories

- হোল্ডিং/দাখিলা reference sample

### Completion and outcome

Submit the validated request to the finance queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **দাখিলা — SIMULATION ONLY**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://ldtax.gov.bd/).

## 11. কর দাবি সংশোধন / আপত্তি

**Service ID:** `tax-correction` · **Category:** Tax · **Review platform:** হিসাব ও পেমেন্ট / Finance

Record a tax-demand discrepancy with evidence and receive a reasoned simulated outcome.

### Required service information

- হোল্ডিং reference
- দাবি সংশোধনের কারণ

### Sample evidence categories

- কর দাবি sample
- সমর্থনকারী sample

### Completion and outcome

Submit the validated request to the finance queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **কর দাবি objection outcome — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://ldtax.gov.bd/).

## 12. খাস জমি বন্দোবস্ত

**Service ID:** `khas` · **Category:** Lease · **Review platform:** ভূমি কর্মকর্তা / Land officer

Prepare eligibility and proposed-use information. No allotment, eligibility determination or government grant is made.

### Required service information

- যোগ্যতার দাবির বিবরণ
- ব্যবহারের উদ্দেশ্য

### Sample evidence categories

- যোগ্যতার sample statement
- প্রয়োজনীয় sample evidence

### Completion and outcome

Submit the validated request to the officer queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **বন্দোবস্ত review outcome — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://land.gov.bd/).

## 13. চা বাগান ইজারা / নবায়ন

**Service ID:** `tea-lease` · **Category:** Lease · **Review platform:** ভূমি কর্মকর্তা / Land officer

Organise lease term, rent references and compliance evidence for a simulated renewal review.

### Required service information

- ইজারা নম্বর
- মেয়াদ শেষের তারিখ
- শর্তপালন ও নবায়নের বিবরণ

### Sample evidence categories

- ইজারা দলিল sample
- ভাড়া/শর্তপালন sample

### Completion and outcome

Submit the validated request to the officer queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **ইজারা নবায়ন outcome — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://land.gov.bd/).

## 14. জলমহাল ইজারা

**Service ID:** `waterbody` · **Category:** Lease · **Review platform:** ভূমি কর্মকর্তা / Land officer

Prepare a waterbody lease proposal. Current tender rules, eligibility and terms must be checked with the competent office.

### Required service information

- সংগঠনের sample reference
- জলমহাল reference
- ব্যবহারের প্রস্তাব

### Sample evidence categories

- সমিতি/সংস্থার sample evidence
- চাহিদার sample proposal

### Completion and outcome

Submit the validated request to the officer queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **জলমহাল proposal outcome — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://land.gov.bd/).

## 15. শিল্প/বাণিজ্যিক ইজারা

**Service ID:** `industrial-lease` · **Category:** Lease · **Review platform:** ভূমি কর্মকর্তা / Land officer

Prepare a proposed-use file for simulated administrative review, not an allocation of government land.

### Required service information

- প্রতিষ্ঠানের sample reference
- ব্যবহারের প্রস্তাব

### Sample evidence categories

- প্রস্তাবনার sample
- প্রতিষ্ঠানের sample evidence

### Completion and outcome

Submit the validated request to the officer queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **বাণিজ্যিক ইজারা outcome — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://land.gov.bd/).

## 16. অধিগ্রহণ ক্ষতিপূরণ দাবি

**Service ID:** `acquisition` · **Category:** Acquisition · **Review platform:** ভূমি কর্মকর্তা / Land officer

Organise an acquisition notice and claimant evidence for simulated review. No valuation, entitlement or compensation transfer is made.

### Required service information

- এলএ case reference
- নোটিশ reference
- দাবি ও স্বার্থের বিবরণ

### Sample evidence categories

- নোটিশ sample
- দাবির সমর্থনকারী sample

### Completion and outcome

Submit the validated request to the officer queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **ক্ষতিপূরণ claim outcome — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://land.gov.bd/).

## 17. অধিগ্রহণ আপত্তি

**Service ID:** `acquisition-objection` · **Category:** Acquisition · **Review platform:** ভূমি কর্মকর্তা / Land officer

Prepare notice-linked objections and track a simulated hearing and outcome without asserting statutory deadlines.

### Required service information

- এলএ case reference
- আপত্তির বিস্তারিত

### Sample evidence categories

- নোটিশ sample
- আপত্তির sample evidence

### Completion and outcome

Submit the validated request to the officer queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **অধিগ্রহণ objection outcome — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://land.gov.bd/).

## 18. হুকুমদখল সংক্রান্ত আবেদন

**Service ID:** `requisition` · **Category:** Acquisition · **Review platform:** ভূমি কর্মকর্তা / Land officer

Record a requisition-related representation for review. Current legal procedure requires official confirmation.

### Required service information

- নোটিশ reference
- আবেদনের বিস্তারিত

### Sample evidence categories

- হুকুমদখল notice sample

### Completion and outcome

Submit the validated request to the officer queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **হুকুমদখল outcome — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://land.gov.bd/).

## 19. ভূমি রাজস্ব বিবিধ মামলা

**Service ID:** `revenue-case` · **Category:** Cases · **Review platform:** ভূমি কর্মকর্তা / Land officer

Prepare a case file, evidence and requested relief. Simulate a hearing and reasoned disposition; this is not a judicial decision.

### Required service information

- প্রতিপক্ষের sample reference
- ঘটনা ও দাবির বিবরণ
- প্রার্থিত প্রতিকার

### Sample evidence categories

- বিরোধের sample evidence

### Completion and outcome

Submit the validated request to the officer queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **বিবিধ মামলা disposition — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://case.land.gov.bd/).

## 20. রিভিউ আবেদন

**Service ID:** `review` · **Category:** Cases · **Review platform:** ভূমি কর্মকর্তা / Land officer

Prepare a review against a referenced order. Forum, limitation and admissibility must be confirmed separately.

### Required service information

- পূর্ব আদেশ reference
- রিভিউ grounds

### Sample evidence categories

- পূর্ব আদেশ sample
- রিভিউ grounds sample

### Completion and outcome

Submit the validated request to the officer queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **রিভিউ disposition — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://case.land.gov.bd/).

## 21. আপিল আবেদন

**Service ID:** `appeal` · **Category:** Cases · **Review platform:** ভূমি কর্মকর্তা / Land officer

Organise appeal grounds and the challenged order for a simulated review; the platform does not file a legal appeal.

### Required service information

- চ্যালেঞ্জকৃত আদেশ reference
- প্রস্তাবিত forum
- আপিল grounds

### Sample evidence categories

- আদেশ sample
- আপিল grounds sample

### Completion and outcome

Submit the validated request to the officer queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **আপিল preparation outcome — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://case.land.gov.bd/).

## 22. রেন্ট সার্টিফিকেট মামলা

**Service ID:** `rent-case` · **Category:** Cases · **Review platform:** ভূমি কর্মকর্তা / Land officer

Prepare a response to a sample rent certificate notice and track its local disposition.

### Required service information

- মামলা reference
- জবাবের বিস্তারিত

### Sample evidence categories

- case notice sample
- পরিশোধ/আপত্তি sample

### Completion and outcome

Submit the validated request to the officer queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **রেন্ট certificate response — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://case.land.gov.bd/).

## 23. জরিপ আপত্তি / আপিল প্রস্তুতি

**Service ID:** `survey-objection` · **Category:** GIS · **Review platform:** সার্ভেয়ার / Surveyor

Compare a sample survey entry with supplied evidence and prepare an objection review. No survey record is altered.

### Required service information

- জরিপ পর্যায় reference
- আপত্তি ও প্রস্তাবিত সংশোধন

### Sample evidence categories

- জরিপ record sample
- আপত্তির sample evidence

### Completion and outcome

Submit the validated request to the surveyor queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **জরিপ objection report — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://land.gov.bd/).

## 24. সীমানা ও মাঠ জরিপ

**Service ID:** `boundary-survey` · **Category:** GIS · **Review platform:** সার্ভেয়ার / Surveyor

Arrange a simulated field review and receive a survey report. Schematic map measurements have no legal or cadastral accuracy.

### Required service information

- সীমানা/পরিমাপের বিবরণ
- প্রস্তাবিত তারিখ

### Sample evidence categories

- সীমানা reference sample

### Completion and outcome

Submit the validated request to the surveyor queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **মাঠ জরিপ report — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://land.gov.bd/).

## 25. দলিল তল্লাশ ও নকল

**Service ID:** `deed-copy` · **Category:** Registration · **Review platform:** দলিল ডেস্ক / Registration desk

Prepare a deed-index search and sample copy request. Registration is a separate authority and is not integrated here.

### Required service information

- দলিল নম্বর
- দলিলের বছর
- সাব-রেজিস্ট্রি office reference

### Sample evidence categories

- দলিল index reference sample

### Completion and outcome

Submit the validated request to the registrar queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **দলিল search/copy — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://registration.gov.bd/).

## 26. দলিল নিবন্ধন প্রস্তুতি

**Service ID:** `deed-preparation` · **Category:** Registration · **Review platform:** দলিল ডেস্ক / Registration desk

Review readiness and evidence before a separate official registration process. This app cannot execute or register a deed.

### Required service information

- দলিলের ধরন — Sale / Gift / Partition / Other
- পক্ষসমূহের sample reference

### Sample evidence categories

- খসড়া দলিল sample
- পক্ষসমূহের authority sample

### Completion and outcome

Submit the validated request to the registrar queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **নিবন্ধন readiness report — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://registration.gov.bd/).

## 27. ক্রয়পূর্ব যাচাই

**Service ID:** `due-diligence` · **Category:** Intelligence · **Review platform:** সার্ভেয়ার / Surveyor

Compare source references, area and authority claims. A report lists unresolved issues instead of declaring title valid.

### Required service information

- পর্যালোচনার প্রশ্ন
- দলিল ও record chain

### Sample evidence categories

- record/deed chain sample

### Completion and outcome

Submit the validated request to the surveyor queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **যাচাই checklist report — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://land.gov.bd/).

## 28. অভিযোগ ও প্রতিকার

**Service ID:** `complaint` · **Category:** Support · **Review platform:** সহায়তা ডেস্ক / Support

Submit a service issue to a local support queue and receive a reasoned resolution or correction request.

### Required service information

- অভিযোগের বিষয়
- বিস্তারিত
- কাঙ্ক্ষিত সমাধান

### Sample evidence categories

- অভিযোগের sample evidence

### Completion and outcome

Submit the validated request to the support queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the assigned reviewer issues **অভিযোগ resolution — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://land.gov.bd/).

## 29. অফিস সাক্ষাৎ / assisted service

**Service ID:** `appointment` · **Category:** Support · **Review platform:** সহায়তা ডেস্ক / Support

Request a simulated office appointment and assisted-service preference. It does not reserve inventory at a government office.

### Required service information

- সেবা office reference
- প্রস্তাবিত তারিখ
- সময় — 09:30 / 10:30 / 11:30 / 14:00
- সহায়তার প্রয়োজন — None / Accessibility assistance / Assisted digital / Language assistance

### Sample evidence categories

- সেবা reference sample

### Completion and outcome

Submit the validated request to the support queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the assigned reviewer issues **সাক্ষাৎ token — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://land.gov.bd/).

## 30. পার্বত্য অঞ্চলের ভূমি অনুরোধ

**Service ID:** `cht` · **Category:** Regional · **Review platform:** ভূমি কর্মকর্তা / Land officer

Keep regional preparation separate from plains record assumptions. The competent customary and district authorities must confirm the applicable procedure.

### Required service information

- Circle reference — Chakma / Bomang / Mong
- স্থানীয় record/অনুরোধের বিবরণ

### Sample evidence categories

- স্থানীয় record sample
- অনুরোধের sample evidence

### Completion and outcome

Submit the validated request to the officer queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **CHT request outcome — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://land.gov.bd/).

## 31. ভূমি তথ্য ব্যাংক অনুরোধ

**Service ID:** `land-bank` · **Category:** Information · **Review platform:** রেকর্ড অফিস / Records officer

Prepare a scoped request for land-information references and receive a records-desk response. No authoritative land bank dataset is connected.

### Required service information

- প্রয়োজনীয় তথ্য ও উদ্দেশ্য
- অনুসন্ধানের পরিসর — Parcel context / Government land reference / Record availability

### Sample evidence categories

- তথ্য অনুসন্ধানের sample reference

### Completion and outcome

Submit the validated request to the records queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **ভূমি তথ্য response — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://land.gov.bd/).

## 32. ভূমি ব্যবহার ও zoning তথ্য

**Service ID:** `zoning` · **Category:** Information · **Review platform:** সার্ভেয়ার / Surveyor

Prepare a plot-context enquiry for a surveyor response. No live zoning layer, development permission or land-use clearance is issued.

### Required service information

- তথ্য ব্যবহারের উদ্দেশ্য
- Land-use / zoning প্রশ্ন

### Sample evidence categories

- মৌজা/plot reference sample

### Completion and outcome

Submit the validated request to the surveyor queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **ভূমি ব্যবহার enquiry report — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://land.gov.bd/).

## 33. সংস্থার অধিগ্রহণ প্রস্তাব

**Service ID:** `acquisition-proposal` · **Category:** Acquisition · **Review platform:** ভূমি কর্মকর্তা / Land officer

Collect an organisation representative and project references for simulated proposal review. No land is acquired and no ministry approval is obtained.

### Required service information

- প্রত্যাশী সংস্থার sample reference
- প্রকল্পের উদ্দেশ্য
- প্রস্তাবনা reference

### Sample evidence categories

- সংস্থার authority sample
- প্রস্তাবনা/নকশা sample

### Completion and outcome

Submit the validated request to the officer queue. The reviewer claims it, inspects evidence, requests corrections or a hearing where needed, and records a reasoned approval/rejection. After approval, the applicant must complete sandbox checkout before issuance, the assigned reviewer issues **অধিগ্রহণ proposal review — DEMO**. The applicant can download HTML/JSON and inspect the entire case timeline.

**Boundary:** Local sandbox only. No official submission, legal decision or real payment. [Official starting point](https://land.gov.bd/).
