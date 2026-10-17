# দপ্তরভিত্তিক সেবা পরিচালনা / Role workflows

নতুন আবেদনে ২৪টি ভূমিকার স্থানীয় প্ল্যাটফর্ম ব্যবহৃত হয়। সব দপ্তর সরকারি কর্তৃত্বের simulation; প্রকৃত jurisdiction, notice, delegation বা কমিটির quorum এই তালিকা নির্ধারণ করে না।

## ভূমিকা ও প্রবেশ

| ভূমিকা | ডেমো ইমেইল |
| --- | --- |
| নাগরিক / Citizen | citizen@demo.ebhumi.local |
| অনুমোদিত প্রতিনিধি / Representative | representative@demo.ebhumi.local |
| ভূমি কর্মকর্তা / Land officer | officer@demo.ebhumi.local |
| রেকর্ড অফিস / Records officer | records@demo.ebhumi.local |
| সার্ভেয়ার / Surveyor | surveyor@demo.ebhumi.local |
| দলিল ডেস্ক / Registration desk | registrar@demo.ebhumi.local |
| হিসাব ও পেমেন্ট / Finance | finance@demo.ebhumi.local |
| সহায়তা ডেস্ক / Support | support@demo.ebhumi.local |
| প্রশাসক / Administrator | admin@demo.ebhumi.local |
| নিরীক্ষক / Auditor | auditor@demo.ebhumi.local |
| ইউনিয়ন ভূমি অফিস / Union land desk | union_land@demo.ebhumi.local |
| সহকারী কমিশনার (ভূমি) / AC Land desk | ac_land@demo.ebhumi.local |
| উপজেলা প্রশাসন / UNO desk | uno@demo.ebhumi.local |
| জেলা প্রশাসন / DC land desk | dc@demo.ebhumi.local |
| ইজারা যাচাই কমিটি / Lease review committee | lease_committee@demo.ebhumi.local |
| কানুনগো / Technical records desk | kanungo@demo.ebhumi.local |
| সেটেলমেন্ট কর্মকর্তা / Settlement desk | settlement_officer@demo.ebhumi.local |
| ভূমি অধিগ্রহণ শাখা / Land acquisition desk | la_officer@demo.ebhumi.local |
| অর্পিত সম্পত্তি শাখা / Vested property desk | vp_officer@demo.ebhumi.local |
| আইনগত সমন্বয় / Legal coordination desk | legal_officer@demo.ebhumi.local |
| পার্বত্য ভূমি সমন্বয় / CHT liaison desk | cht_liaison@demo.ebhumi.local |
| মন্ত্রণালয় সমন্বয় / Ministry consultation desk | ministry_officer@demo.ebhumi.local |
| বিভাগীয় সমন্বয় / Divisional consultation desk | divisional_officer@demo.ebhumi.local |
| আপিল প্রস্তুতি ডেস্ক / Appeals preparation desk | appeals_officer@demo.ebhumi.local |

ডেমো পাসওয়ার্ড: `BhumiDemo!2026`। সাধারণ নিবন্ধন থেকে কেবল নাগরিক/প্রতিনিধি তৈরি হয়। কর্মকর্তা তৈরির অধিকার প্রশাসকের। সরকারি পাসওয়ার্ড বা আসল পরিচয় ব্যবহার করবেন না। একই browser profile-এর tab-গুলো একই session cookie ব্যবহার করে; একাধিক ভূমিকা একসঙ্গে পরীক্ষায় আলাদা browser profile/private context ব্যবহার করুন।

## ৩৩টি সেবার স্থানীয় দায়িত্ব বণ্টন

| সেবা | নির্ধারিত স্থানীয় পথ |
| --- | --- |
| নামজারি / ই-মিউটেশন | ইউনিয়ন ভূমি অফিস / Union land desk → ভূমি কর্মকর্তা / Land officer → সহকারী কমিশনার (ভূমি) / AC Land desk |
| ওয়ারিশসূত্রে নামজারি | ইউনিয়ন ভূমি অফিস / Union land desk → ভূমি কর্মকর্তা / Land officer → সহকারী কমিশনার (ভূমি) / AC Land desk |
| জমাভাগ / পৃথক খতিয়ান | ইউনিয়ন ভূমি অফিস / Union land desk → সহকারী কমিশনার (ভূমি) / AC Land desk |
| জমা একত্রিকরণ | ইউনিয়ন ভূমি অফিস / Union land desk → সহকারী কমিশনার (ভূমি) / AC Land desk |
| রেকর্ড সংশোধন | রেকর্ড অফিস / Records officer → সহকারী কমিশনার (ভূমি) / AC Land desk |
| ই-পর্চা / সার্টিফাইড খতিয়ান | রেকর্ড অফিস / Records officer |
| খতিয়ানের অনলাইন কপি | রেকর্ড অফিস / Records officer |
| মৌজা ম্যাপ / নকশা | রেকর্ড অফিস / Records officer |
| হোল্ডিং নিবন্ধন ও সমন্বয় | ইউনিয়ন ভূমি অফিস / Union land desk → সহকারী কমিশনার (ভূমি) / AC Land desk |
| ভূমি উন্নয়ন কর / খাজনা | হিসাব ও পেমেন্ট / Finance |
| কর দাবি সংশোধন / আপত্তি | হিসাব ও পেমেন্ট / Finance → সহকারী কমিশনার (ভূমি) / AC Land desk |
| খাস জমি বন্দোবস্ত | ইউনিয়ন ভূমি অফিস / Union land desk → সহকারী কমিশনার (ভূমি) / AC Land desk → ইজারা যাচাই কমিটি / Lease review committee → জেলা প্রশাসন / DC land desk |
| চা বাগান ইজারা / নবায়ন | ভূমি কর্মকর্তা / Land officer → জেলা প্রশাসন / DC land desk |
| জলমহাল ইজারা | সহকারী কমিশনার (ভূমি) / AC Land desk → ইজারা যাচাই কমিটি / Lease review committee → উপজেলা প্রশাসন / UNO desk |
| শিল্প/বাণিজ্যিক ইজারা | ভূমি কর্মকর্তা / Land officer → ইজারা যাচাই কমিটি / Lease review committee → জেলা প্রশাসন / DC land desk |
| অধিগ্রহণ ক্ষতিপূরণ দাবি | ভূমি অধিগ্রহণ শাখা / Land acquisition desk → জেলা প্রশাসন / DC land desk |
| অধিগ্রহণ আপত্তি | ভূমি অধিগ্রহণ শাখা / Land acquisition desk → জেলা প্রশাসন / DC land desk |
| হুকুমদখল সংক্রান্ত আবেদন | ভূমি অধিগ্রহণ শাখা / Land acquisition desk → জেলা প্রশাসন / DC land desk |
| ভূমি রাজস্ব বিবিধ মামলা | ভূমি কর্মকর্তা / Land officer → সহকারী কমিশনার (ভূমি) / AC Land desk |
| রিভিউ আবেদন | ভূমি কর্মকর্তা / Land officer → সহকারী কমিশনার (ভূমি) / AC Land desk |
| আপিল আবেদন | ভূমি কর্মকর্তা / Land officer → আইনগত সমন্বয় / Legal coordination desk → আপিল প্রস্তুতি ডেস্ক / Appeals preparation desk |
| রেন্ট সার্টিফিকেট মামলা | ভূমি কর্মকর্তা / Land officer → সহকারী কমিশনার (ভূমি) / AC Land desk |
| জরিপ আপত্তি / আপিল প্রস্তুতি | সার্ভেয়ার / Surveyor → কানুনগো / Technical records desk → সেটেলমেন্ট কর্মকর্তা / Settlement desk |
| সীমানা ও মাঠ জরিপ | সার্ভেয়ার / Surveyor → কানুনগো / Technical records desk |
| দলিল তল্লাশ ও নকল | দলিল ডেস্ক / Registration desk |
| দলিল নিবন্ধন প্রস্তুতি | দলিল ডেস্ক / Registration desk |
| ক্রয়পূর্ব যাচাই | সার্ভেয়ার / Surveyor |
| অভিযোগ ও প্রতিকার | সহায়তা ডেস্ক / Support → ভূমি কর্মকর্তা / Land officer |
| অফিস সাক্ষাৎ / assisted service | সহায়তা ডেস্ক / Support |
| পার্বত্য অঞ্চলের ভূমি অনুরোধ | পার্বত্য ভূমি সমন্বয় / CHT liaison desk → জেলা প্রশাসন / DC land desk |
| ভূমি তথ্য ব্যাংক অনুরোধ | ভূমি কর্মকর্তা / Land officer |
| ভূমি ব্যবহার ও zoning তথ্য | ভূমি কর্মকর্তা / Land officer → জেলা প্রশাসন / DC land desk |
| সংস্থার অধিগ্রহণ প্রস্তাব | ভূমি অধিগ্রহণ শাখা / Land acquisition desk → জেলা প্রশাসন / DC land desk |

নামজারির ইউনিয়ন প্রতিবেদনের পর সিদ্ধান্তের desk আলাদা করার ভিত্তি: [সরকারি সেবার ধাপ](https://mutation.land.gov.bd/namjari-steps), [কারণসহ সিদ্ধান্ত/ব্যাখ্যার নির্দেশনা](https://mutation.land.gov.bd/notification_and_rules/notification/E_namjari_system_application_dismiss.pdf)। একটি স্থানীয় ভূমি-কর্মকর্তা desk নথি প্রক্রিয়াকরণের উদাহরণ হিসেবে আছে; এটি প্রতিটি সরকারি মামলার বাধ্যতামূলক আলাদা আইনগত ধাপ নয়। আপিল, CHT ও অধিগ্রহণের প্রকৃত কর্তৃপক্ষ/ফরম সংশ্লিষ্ট বিধি অনুযায়ী নিশ্চিত করতে হবে।

## নিয়ন্ত্রণ

- দাখিল/প্রযোজ্য filing payment-এর পর কেবল বর্তমান desk-এর সক্রিয় অ্যাকাউন্ট কাজ পায় এবং বিজ্ঞপ্তি পায়।
- Claim ছাড়া staff সিদ্ধান্ত বা checks লিখতে পারে না। একই ভূমিকায় অন্য কর্মকর্তার claimed কাজ বদলানো যায় না।
- মধ্যবর্তী desk-এর তিনটি check ও কারণ পূরণ করে forward করতে হয়; approval/rejection কেবল শেষ desk-এর।
- Forward-এর পরে assignment ও checks reset হয়; আগের checks, actor, সময় ও কারণ immutable handoff history-তে থাকে।
- আগের desk read-only পর্যবেক্ষণ করতে পারে; পরের desk-এর claim বা পরিবর্তন করতে পারে না। নাগরিক নিজের পুরো যাত্রা দেখতে পারেন।
- Administrator/auditor পর্যবেক্ষণ করতে পারেন; workflow decision bypass করতে পারেন না।
- ভূমি করের বর্তমান unpaid holding demand পরিশোধের ডেমো ফল স্বয়ংক্রিয়; finance সেটি assess/reconcile করে।

পুরোনো saved/demo cases তাদের সংরক্ষিত lifecycle রাখে। নতুন cases-এ routing default চালু; `deskRouting:false` কেবল server-side compatibility test option, citizen request থেকে এটি নির্বাচন করা যায় না। অফিসভিত্তিক jurisdiction scoping, multi-signature committee, real notice delivery এবং official integrations production-এর আলাদা কাজ। [ইজারা গবেষণা](BD_LEASE_AUCTION_RESEARCH.md)।

## শর্তসাপেক্ষ বিশেষায়িত পরামর্শ — v5.6

মন্ত্রণালয় ও বিভাগীয় desk বাধ্যতামূলক অতিরিক্ত ধাপ নয়। বর্তমান assigned reviewer প্রযোজ্য আইন/বিজ্ঞপ্তির reference ও কারণ লিখে অনুমোদিত দপ্তরে consultation পাঠায়। পরামর্শকারী শুধু intermediate handoff করতে পারে; review শেষে মূল দপ্তরে ফেরে। duplicate/অসংশ্লিষ্ট role গ্রহণ হয় না। মূল reviewer পরামর্শ চলাকালে monitor করতে পারে, mutation নয়।

| সেবা | অতিরিক্ত পরামর্শের দপ্তর |
| --- | --- |
| অধিগ্রহণ ক্ষতিপূরণ দাবি | মন্ত্রণালয় সমন্বয় / Ministry consultation desk, বিভাগীয় সমন্বয় / Divisional consultation desk, আইনগত সমন্বয় / Legal coordination desk |
| অধিগ্রহণ আপত্তি | আইনগত সমন্বয় / Legal coordination desk, বিভাগীয় সমন্বয় / Divisional consultation desk |
| হুকুমদখল সংক্রান্ত আবেদন | মন্ত্রণালয় সমন্বয় / Ministry consultation desk, আইনগত সমন্বয় / Legal coordination desk |
| সংস্থার অধিগ্রহণ প্রস্তাব | মন্ত্রণালয় সমন্বয় / Ministry consultation desk, বিভাগীয় সমন্বয় / Divisional consultation desk |
| আপিল আবেদন | বিভাগীয় সমন্বয় / Divisional consultation desk, আইনগত সমন্বয় / Legal coordination desk |
| খাস জমি বন্দোবস্ত | মন্ত্রণালয় সমন্বয় / Ministry consultation desk, আইনগত সমন্বয় / Legal coordination desk |
| জলমহাল ইজারা | মন্ত্রণালয় সমন্বয় / Ministry consultation desk, আইনগত সমন্বয় / Legal coordination desk |
| শিল্প/বাণিজ্যিক ইজারা | মন্ত্রণালয় সমন্বয় / Ministry consultation desk, আইনগত সমন্বয় / Legal coordination desk |
| চা বাগান ইজারা / নবায়ন | মন্ত্রণালয় সমন্বয় / Ministry consultation desk, আইনগত সমন্বয় / Legal coordination desk |
| পার্বত্য অঞ্চলের ভূমি অনুরোধ | আইনগত সমন্বয় / Legal coordination desk |
| নামজারি / ই-মিউটেশন | কানুনগো / Technical records desk |
| ওয়ারিশসূত্রে নামজারি | কানুনগো / Technical records desk, আইনগত সমন্বয় / Legal coordination desk |

অর্পিত সম্পত্তি শাখা ও আইনগত সমন্বয়ের নিজস্ব private preparation register আছে। আইন-পাঠাগার সব রোলে। Courts/tribunals, Ministry statutory approvals, payment providers, identity services, CHT traditional/regional bodies and requesting agencies retain their real-world authority; local desk labels do not replace them. Representative with organisation authority supports agency preparation. These 24 are application permission groups, not an exhaustive national civil-service organogram. Exact office/territory delegation, appellate forum and live identity verification require production configuration.

## v5.7 ডেস্ক ও ভাষা

আপিল প্রস্তুতির বিশেষায়িত ডেস্ক যুক্ত হয়েছে; ২৪ permission group-এর display descriptions বাংলায়/English-এ পাওয়া যায়। VP/legal/DC/records এবং oversight dashboard-এ readable legacy-file register-এর link ও active count আছে। আদালত/ট্রাইব্যুনালের আইনগত এখতিয়ার সৃষ্টি করা হয়নি। আপিলের source ও boundary: [coverage audit](BD_COVERAGE_AUDIT_v5.7.md)।
