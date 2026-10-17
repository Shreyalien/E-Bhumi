'use strict';
// Local role simulations based on service-family research. Competence varies by
// notice, land category and jurisdiction; these are not statutory delegations.
const desks={union_land:'ইউনিয়ন ভূমি অফিস / Union land desk',ac_land:'সহকারী কমিশনার (ভূমি) / AC Land desk',uno:'উপজেলা প্রশাসন / UNO desk',dc:'জেলা প্রশাসন / DC land desk',lease_committee:'ইজারা যাচাই কমিটি / Lease review committee'};
const routes={
 mutation:['union_land','officer','ac_land'],inheritance:['union_land','officer','ac_land'],partition:['union_land','ac_land'],consolidation:['union_land','ac_land'],
 'record-correction':['records','ac_land'],eporcha:['records'],'instant-copy':['records'],'mouza-map':['records'],holding:['union_land','ac_land'],'land-tax':['finance'],'tax-correction':['finance','ac_land'],
 khas:['union_land','ac_land','lease_committee','dc'],'tea-lease':['officer','dc'],waterbody:['ac_land','lease_committee','uno'],'industrial-lease':['officer','lease_committee','dc'],
 acquisition:['officer','dc'],'acquisition-objection':['officer','dc'],requisition:['officer','dc'],'revenue-case':['officer','ac_land'],review:['officer','ac_land'],appeal:['officer','dc'],'rent-case':['officer','ac_land'],
 'survey-objection':['surveyor','records'],'boundary-survey':['surveyor'],'deed-copy':['registrar'],'deed-preparation':['registrar'],'due-diligence':['surveyor'],complaint:['support','officer'],appointment:['support'],cht:['officer','dc'],'land-bank':['officer'],zoning:['officer','dc'],'acquisition-proposal':['officer','dc']
};
const currentDesk=(a,fallback)=>a.deskWorkflow?.stages[a.deskWorkflow.index]||fallback;
const createDeskWorkflow=serviceId=>({index:0,stages:[...routes[serviceId]],completed:[],scope:'Local routing model; authority must be confirmed against current rules / notice.'});
function deskProcedure(a,p){if(!a.deskWorkflow||a.deskWorkflow.index===a.deskWorkflow.stages.length-1)return p;const role=currentDesk(a),labels=role==='union_land'?['আবেদন ও ভূমির রেকর্ড মিলিয়ে দেখুন','প্রয়োজনীয় মাঠতথ্য ও অমিল লিখুন','প্রমাণসহ প্রতিবেদন পরবর্তী দপ্তরে পাঠান']:role==='lease_committee'?['বিজ্ঞপ্তি অনুযায়ী আবেদনকারীর যোগ্যতা যাচাই','দাখিলের মাধ্যম, শর্ত ও জামানতের তথ্য যাচাই','তুলনা ও কারণসহ সুপারিশ নথিভুক্ত করুন']:['সেবার প্রয়োজনীয় নথি যাচাই','এখতিয়ার, অমিল ও অতিরিক্ত প্রতিবেদনের প্রয়োজন লিখুন','কারণসহ পরবর্তী দপ্তরে সুপারিশ প্রেরণ করুন'];return {...p,reviewTasks:labels.map((label,i)=>({id:'review-'+(i+1),label}))};}
module.exports={desks,routes,currentDesk,createDeskWorkflow,deskProcedure};
