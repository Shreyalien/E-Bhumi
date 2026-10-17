'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {createServer}=require('../server-v4.cjs'),{services}=require('../lib/catalog.cjs');
test('procedure v2: all 33 services, phased payments, schedules, review and delivery',async t=>{
 const root=process.env.EBHUMI_TEST_ROOT||__dirname;fs.mkdirSync(root,{recursive:true});const dataDir=fs.mkdtempSync(path.join(root,'procedures-'));let run=createServer({dataDir});await new Promise(r=>run.server.listen(0,'127.0.0.1',r));let base='http://127.0.0.1:'+run.server.address().port;t.after(()=>new Promise(r=>run.server.close(r)));
 async function req(route,who,method='GET',body,expected=200){const r=await fetch(base+'/api'+route,{method,headers:{'Content-Type':'application/json',...(who?{Cookie:who.cookie,'X-CSRF-Token':who.csrf}:{})},...(body?{body:JSON.stringify(body)}:{})});const data=await r.json();assert.equal(r.status,expected,method+' '+route+': '+JSON.stringify(data));return {data,r};}
 const users={};async function login(role){const {data,r}=await req('/login',null,'POST',{email:role+'@demo.ebhumi.local',password:'BhumiDemo!2026'});return {...data,cookie:r.headers.get('set-cookie').split(';')[0]};}for(const role of ['citizen','representative','officer','records','surveyor','registrar','finance','support','admin','auditor'])users[role]=await login(role);const me=users.citizen;
 let retained;
 const act=async(a,who,action,extra={})=>(await req('/applications/'+a.id+'/action',who,'POST',{revision:a.revision,action,...extra})).data.application;
 const pay=async(a,result='success',expected=201)=>{const q=(await req('/applications/'+a.id+'/payment-quote',me)).data.quote;const data=(await req('/payments',me,'POST',{applicationId:a.id,phase:q.phase,quoteDigest:q.digest,result},expected)).data;return {a:data.application,payment:data.payment,q};};
 const prepare=async s=>{
  let a=(await req('/applications',me,'POST',{serviceId:s.id},201)).data.application;assert.equal(a.workflowVersion,2);const details={eligibility:true,applicant:'Sample Citizen',authority:'Self',division:'Dhaka',district:'Dhaka',upazila:'Savar',mouza:'Amin Bazar',khatian:'731',dag:'1842',area:'12.5',region:'Plains'};
  for(const f of s.fields)details[f.key]=f.options?.[0]||(f.type==='date'?'2099-12-30':'Sample '+f.key);if(s.id==='land-tax'){details.holding='HOLD-CITIZEN-1';details.year='2026-2027';}if(s.procedure.delivery){details.delivery=s.id==='eporcha'?'Postal demo':'Office collection demo';details.address='Sample collection / delivery context';}
  const documentIds=[];for(const category of s.documents){documentIds.push((await req('/documents',me,'POST',{name:'sample.txt',category,content:Buffer.from('DEMO / not an official document').toString('base64')},201)).data.document.id);}
  a=(await req('/applications/'+a.id,me,'PATCH',{revision:a.revision,details,documentIds})).data.application;
  const d={acknowledgements:{sourceRead:true,jurisdiction:true},plots:[],records:[],parties:[],heirs:[]};for(const key of s.procedure.structured){if(key==='plots')d.plots.push({mouza:'Amin Bazar',khatian:'731',dag:'1842',recordedArea:15,requestedArea:12.5,landClass:'Homestead'});if(['records','sheets'].includes(key))d.records.push({mouza:'Amin Bazar',khatian:'731',sheet:'2',survey:'RS'});if(key==='parties')d.parties.push({name:'Sample transferor',role:'Transferor',reference:'Sample deed'});if(key==='heirs')d.heirs.push({name:'Sample heir',relationship:'User supplied relationship',reference:'Sample certificate',proposedPercent:50});}
  a=(await req('/applications/'+a.id+'/procedure',me,'PATCH',{revision:a.revision,data:d})).data.application;return {a,d};
 };
 for(const s of services)await t.test(s.id,async()=>{
  let {a,d}=await prepare(s);const desk=users[s.reviewer];assert((await req('/applications/'+a.id+'/preflight',me)).data.ready);
  if(s.id==='mutation'){
   await req('/applications/'+a.id+'/procedure',me,'PATCH',{revision:a.revision,data:{...d,plots:[{...d.plots[0],requestedArea:16}]}},400);
   await req('/applications/'+a.id+'/procedure',users.representative,'PATCH',{revision:a.revision,data:d},404);
   await req('/applications/'+a.id+'/review-task',me,'POST',{revision:a.revision,taskId:'review-1',result:'done',note:'Forged review'},403);
  }
  a=await act(a,me,'submit');
  if(s.procedure.filingFee){assert.equal(a.status,'AwaitingApplicationPayment');await req('/applications/'+a.id,desk,'GET',undefined,404);if(s.id==='mutation'){let r=await pay(a,'fail');a=r.a;assert.equal(a.status,'ApplicationPaymentFailed');await req('/payments',me,'POST',{applicationId:a.id,phase:'filing',quoteDigest:r.q.digest,result:'success'},409);}const r=await pay(a);a=r.a;assert.equal(r.payment.amount,s.procedure.filingFee);assert.equal(a.status,'Submitted');const again=await req('/payments',me,'POST',{applicationId:a.id,phase:'filing',result:'success'});assert.equal(again.data.payment.id,r.payment.id);}
  if(s.procedure.autoTax){assert.equal(a.status,'AwaitingPayment');const r=await pay(a);a=r.a;assert.equal(r.payment.amount,150);assert.equal(a.status,'Completed');const h=(await req('/holdings',me)).data.holdings.find(h=>h.id==='HOLD-CITIZEN-1');assert(h.demands[0].paid);}
  else{
   a=await act(a,desk,'claim');await req('/applications/'+a.id+'/action',desk,'POST',{revision:a.revision,action:'approve',note:'Premature approval'},409);
   if(s.id==='mutation'){a=await act(a,desk,'correction',{note:'Clarify area source'});a=await act(a,me,'submit');assert.equal(a.status,'Submitted','Paid filing must not be charged again');a=await act(a,desk,'claim');a=await act(a,desk,'hearing',{note:'Discrepancy needs discussion',hearingAt:'2099-12-30T10:00:00Z'});}
   for(const task of s.procedure.reviewTasks)a=(await req('/applications/'+a.id+'/review-task',desk,'POST',{revision:a.revision,taskId:task.id,result:'done',note:'Sample evidence checked; applicable authority noted'})).data.application;
   a=await act(a,desk,'approve',{note:'Reasoned local decision after recorded checks'});
   if(s.procedure.decisionFee){assert.equal(a.status,'AwaitingPayment');if(s.id==='mutation')a=(await pay(a,'fail')).a;const r=await pay(a);a=r.a;assert.equal(r.payment.amount,s.procedure.decisionFee);}
   assert.equal(a.status,'ReadyForDelivery');if(s.procedure.delivery)await req('/applications/'+a.id+'/action',desk,'POST',{revision:a.revision,action:'issue',note:'Missing dispatch'},400);
   a=await act(a,desk,'issue',{note:'Local artifact prepared',deliveryReference:'DEMO-DISPATCH-123'});if(s.procedure.delivery){assert(['DeliveryInTransit','ReadyForCollection'].includes(a.status));a=await act(a,me,'acknowledge-delivery');}
  }
  assert.equal(a.status,'Completed');assert.equal(a.outcome.artifacts.length,s.procedure.outputs.length);assert((await req('/applications/'+a.id+'/verify-outcome',me)).data.valid);if(s.id==='mutation'){assert.equal(a.payments.filter(p=>p.status==='Successful').length,2);retained=a.id;}
 });
 await t.test('holding demand privacy, role checks, stale assessment and duplicate paid year',async()=>{
  const h=(await req('/holdings',me)).data.holdings.find(h=>h.id==='HOLD-CITIZEN-2');await req('/holdings',users.officer,'GET',undefined,403);assert(!(await req('/holdings',users.representative)).data.holdings.some(x=>x.id===h.id));await req('/holdings/'+h.id+'/demand',me,'POST',{revision:h.revision,year:'2027-2028',amount:20,note:'not allowed'},403);await req('/holdings/'+h.id+'/demand',users.finance,'POST',{revision:h.revision,year:'2027-2028',amount:20,note:'Local assessment'});await req('/holdings/'+h.id+'/demand',users.finance,'POST',{revision:h.revision,year:'2027-2028',amount:30,note:'Stale assessment'},409);
  const paid=(await req('/holdings',me)).data.holdings.find(h=>h.id==='HOLD-CITIZEN-1');await req('/holdings/'+paid.id+'/demand',users.finance,'POST',{revision:paid.revision,year:'2026-2027',amount:20,note:'Overwrite paid'},409);
 });
 await t.test('new registered holding can receive a finance demand; stale quotes cannot pay changed demand',async()=>{
  const holdings=(await req('/holdings',me)).data.holdings;const h=holdings.find(h=>h.applicationId);assert(h,'Completed holding registration creates an owned ledger entry');assert.equal(h.demands.length,0);
  let result=await req('/holdings/'+h.id+'/demand',users.finance,'POST',{revision:h.revision,year:'2027-2028',amount:350,note:'Illustrative assessment after holding registration'});let holding=result.data.holding;
  let {a}=await prepare(services.find(s=>s.id==='land-tax'));a=(await req('/applications/'+a.id,me,'PATCH',{revision:a.revision,details:{...a.details,holding:h.id,year:'2027-2028'},documentIds:a.documentIds})).data.application;a=await act(a,me,'submit');const old=(await req('/applications/'+a.id+'/payment-quote',me)).data.quote;
  await req('/holdings/'+h.id+'/demand',users.finance,'POST',{revision:holding.revision,year:'2027-2028',amount:375,note:'Corrected illustrative assessment before payment'});
  await req('/payments',me,'POST',{applicationId:a.id,phase:'decision',quoteDigest:old.digest,result:'success'},409);const paid=await pay(a);assert.equal(paid.payment.amount,375);assert.equal(paid.a.status,'Completed');
  let duplicate=(await prepare(services.find(s=>s.id==='land-tax'))).a;duplicate=(await req('/applications/'+duplicate.id,me,'PATCH',{revision:duplicate.revision,details:{...duplicate.details,holding:h.id,year:'2027-2028'},documentIds:duplicate.documentIds})).data.application;await req('/applications/'+duplicate.id+'/action',me,'POST',{revision:duplicate.revision,action:'submit'},400);
 });
 await t.test('new registrations have no fabricated holdings; restart retains completed and legacy cases',async()=>{
  await req('/register',null,'POST',{name:'Fresh applicant',email:'fresh@example.test',password:'FreshPassword!2026',role:'citizen'},201);const r=await req('/login',null,'POST',{email:'fresh@example.test',password:'FreshPassword!2026'});const fresh={...r.data,cookie:r.r.headers.get('set-cookie').split(';')[0]};assert.equal((await req('/holdings',fresh)).data.holdings.length,0);
  await new Promise(r=>run.server.close(r));run=createServer({dataDir});await new Promise(r=>run.server.listen(0,'127.0.0.1',r));base='http://127.0.0.1:'+run.server.address().port;const again=await login('citizen');assert.equal((await req('/applications/'+retained,again)).data.application.status,'Completed');assert.equal((await req('/applications',again)).data.applications.filter(a=>a.demo).length,99);
 });
});
