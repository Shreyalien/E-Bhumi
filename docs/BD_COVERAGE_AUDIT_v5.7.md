# বাংলাদেশ ভূমিসেবার পুনঃযাচাই — v5.7.0

পরীক্ষার তারিখ: ১৭ অক্টোবর ২০২৬। ভূমি মন্ত্রণালয়ের সমন্বিত সেবার শ্রেণি, অধিগ্রহণের সরকারি সাইট, ভূমি নকশা ও আপিল বোর্ডের সূত্র মিলিয়ে নিচের coverage map করা হয়েছে। এটি আইনজীবী-প্রত্যয়িত জাতীয় প্রক্রিয়া বা সব বিধানের পূর্ণ সংকলন নয়।

| সেবার পরিবার | প্ল্যাটফর্মের কাজ | বাস্তব ব্যবহারের বাকি সংযোগ / সীমা |
| --- | --- | --- |
| নামজারি, ওয়ারিশ, জমাভাগ, একত্রীকরণ | আবেদন, তফসিল, প্রমাণ, ইউনিয়ন/কারিগরি review, AC Land স্থানীয় সিদ্ধান্ত, নমুনা ফি ও artifact | সরকারি নামজারি API, নোটিশ জারি, NID ও আইনগত আদেশ |
| খতিয়ান/ই-পর্চা ও সংশোধন | রেকর্ড/জরিপ নির্বাচন, আবেদন, স্থানীয় checkout, records review, dispatch/collection ও acknowledgement | সত্যায়িত সরকারি রেকর্ড ও সরবরাহকারী |
| মৌজা নকশা, জমির সীমানা | নকশা প্রস্তুতি, জিআইএস নমুনা, সার্ভেয়ার→কানুনগো review | authoritative cadastral dataset, licensed/live GIS ও মাঠ জরিপ |
| হোল্ডিং ও ভূমি উন্নয়ন কর | নিজস্ব দাবি, quote, পেমেন্ট retry, দাখিলা-নমুনা, finance assessment/reconciliation | সরকারি কর নির্ধারণ, বাস্তব gateway ও সরকারি দাখিলা |
| ইজারা, বন্দোবস্ত, জলমহাল, চা, শিল্প | যোগ্যতা/বিজ্ঞপ্তি/প্রমাণ ও স্থানীয় দপ্তরক্রম, শর্তসাপেক্ষ মন্ত্রণালয় পরামর্শ | ইজারা দলিল, বর্তমান মহালতালিকা, গোপন bid, tender opening, live auction, জামানত ও সরকারি অনুমোদন |
| অধিগ্রহণ ও হুকুমদখল | LA শাখা, ক্ষতিপূরণ/আপত্তি/সংস্থার LAP-প্রস্তুতি ও DC review | LARMS integration, স্বাক্ষরিত নোটিশ, যৌথ তালিকা, আইনগত award ও সরকারি পেমেন্ট |
| রাজস্ব মামলা ও রিভিউ | প্রমাণ, কারণসহ স্থানীয় review, সংশোধন, শুনানি ও নমুনা ফলাফল | কার্যকর আদালত/রাজস্ব ফোরাম, দাখিল, limitation ও summons |
| আপিল | নতুন ফাইলে কর্মকর্তা→আইনগত সমন্বয়→আপিল প্রস্তুতি ডেস্ক; ২০২৫ গেজেটের link | statutory forum যাচাই, আদালত/ট্রাইব্যুনাল/বোর্ডের পৃথক jurisdiction; সফটওয়্যার বিচার করে না |
| দলিল ও নিবন্ধন | তল্লাশ/কপি ও registration-readiness-এর পৃথক ডেস্ক | অনুমোদিত ই-নিবন্ধন, সরকারি বই/সূচি, stamp/fee rules, স্বাক্ষর |
| অভিযোগ ও সহায়তা | অভিযোগ, সহায়তা ডেস্ক, স্থানীয় সাক্ষাৎ, সময় বদল/বাতিল ও token | সরকারি GRS, SMS/IVR, বাস্তব office scheduling |
| পার্বত্য অঞ্চল | পৃথক CHT অনুরোধ, আঞ্চলিক তথ্য, liaison review; সাধারণ plains form-এর সীমা | প্রথাগত/আঞ্চলিক কর্তৃপক্ষ, নির্দিষ্ট জমির প্রযোজ্য বিধি ও বাস্তব সম্মতি |
| অর্পিত সম্পত্তি ও ওয়ারিশ | ব্যক্তিগত চার-স্তরের প্রমাণ ফাইল, তালিকার ইতিহাস, সম্পর্ক/বিরোধ, চার দপ্তর, রিপোর্ট | tribunal/court filing, সত্যায়িত order/gazette, স্বয়ংক্রিয় title বা heirs determination নেই |
| ভূমি তথ্য ব্যাংক, ব্যবহার ও zoning | তথ্য-অনুরোধ, plot context ও স্থানীয় review | সরকারি planning layer, ভূমি-ব্যবহার অনুমোদন ও সংস্থার dataset |
| পরিচয়, নিরাপত্তা ও বিজ্ঞপ্তি | স্থানীয় login, CSRF, role/owner access, revision checks, account suspension, স্থানীয় audit | production identity/OTP, office/territory scoping, signature/retention policy ও বাহ্যিক notification |

## সরকারি সূত্র ও যাচাইয়ের সীমা

- [সমন্বিত ভূমিসেবা](https://lsg-portal.land.gov.bd/): search-indexed official service categories; direct page returned 403 during review.
- [LARMS](https://larms.land.gov.bd/): indexed LAP, plan and tracking scope; direct access returned 403. Local preparation does not submit to it.
- [ভূমি নকশা](https://map.land.gov.bd/): official map entry with geographic availability caveats; not imported into the schematic sample map.
- [ভূমি আপিল বোর্ডের সরকারি পরিচিতি](https://minland.gov.bd/pages/static-pages/694032e535ce18e1c0564036): service/forum context, with older rules mentioned on the page.
- [১৭ এপ্রিল ২০২৫ গেজেট: ভূমি আপিল বোর্ড বিধিমালা](https://www.dpp.gov.bd/upload_file/gazettes/57288_41476.pdf): official PDF; legacy text encoding is poor. Linked for original reading; no automatic filing deadline or authority rule is inferred from corrupted text.
- [ভূমিসেবার প্রকাশিত ফি](https://www.land.gov.bd/vumisheba-fee) ও [DLRMS staging](https://dlrms-stg.land.gov.bd/): indexed copy-price notices differ. Staging is not a production tariff; existing local quote amounts remain labelled simulations.

## কী বদলেছে

আপিলের জন্য generic DC-only routing বাদ দিয়ে **শুধু নতুন স্থানীয় প্রস্তুতি ফাইলে** বিশেষায়িত legal/appeals desks এসেছে। আগের ফাইলের সংরক্ষিত দপ্তরক্রম পরিবর্তন করা হয়নি। নতুন কোনো judge login বা অননুমোদিত সরকারি filing তৈরি হয়নি। সব ২৪ role-এর নিজের queue/permissions, পাঠাগার ও দায়িত্বের directory আছে।

অবশিষ্ট production কাজগুলো উপরের টেবিলে প্রকাশ করা হয়েছে। সেবার family coverage থাকা আর বাংলাদেশের প্রতিটি আইনগত কাজ অনলাইনে সম্পন্ন করতে পারা সমান দাবি নয়।
