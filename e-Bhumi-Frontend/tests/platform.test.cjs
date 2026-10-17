'use strict';
const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {createServer}=require('../server-v4.cjs');const {services}=require('../lib/catalog.cjs');
test('all service lifecycles, permissions, persistence and failure paths',async t=>{
 const testRoot=process.env.EBHUMI_TEST_ROOT||os.tmpdir();fs.mkdirSync(testRoot,{recursive:true});const dir=fs.mkdtempSync(path.join(testRoot,'ebhumi-test-'));let running=createServer({newWorkflowVersion:1,dataDir:dir,seedDemo:false});await new Promise(r=>running.server.listen(0,'127.0.0.1',r));let base='http://127.0.0.1:'+running.server.address().port;
 t.after(async()=>{if(running.server.listening)await new Promise(r=>running.server.close(r));});
 const accounts={};
 async function request(route,{method='GET',body,who,csrf=true,expect=200,headers={}}={}){const r=await fetch(base+route,{method,headers:{'Content-Type':'application/json',...(who?{Cookie:who.cookie,...(csrf?{'X-CSRF-Token':who.csrf}:{})}:{}),...headers},...(body!==undefined?{body:JSON.stringify(body)}:{})});const data=await r.json();assert.equal(r.status,expect,method+' '+route+': '+JSON.stringify(data));return {data,response:r};}
 async function login(role){const {data,response}=await request('/api/login',{method:'POST',body:{email:role+'@demo.ebhumi.local',password:'BhumiDemo!2026'}});return accounts[role]={...data,cookie:response.headers.get('set-cookie').split(';')[0]};}
 const me=await login('citizen');for(const role of ['officer','records','surveyor','registrar','finance','support','admin','auditor','representative'])await login(role);
 try{
  await t.test('authentication, staff registration and CSRF guards',async()=>{
   await request('/api/applications',{expect:401});await request('/api/users',{who:me,expect:403});
   await request('/api/register',{method:'POST',body:{email:'intruder@example.test',name:'Test',password:'LongPassword!123',role:'admin'},expect:403});
   await request('/api/applications',{method:'POST',who:me,csrf:false,body:{serviceId:'mutation'},expect:403});
   await request('/api/applications',{method:'POST',who:me,body:{serviceId:'mutation'},headers:{Origin:'https://untrusted.example'},expect:403});
   const r=await fetch(base+'/.data/platform.json');assert.equal(r.status,404);const source=await fetch(base+'/lib/platform.cjs');assert.equal(source.status,404);
  });
  let retained;
  await t.test('33 complete distinct service journeys',async()=>{
   for(const s of services){
    let a=(await request('/api/applications',{method:'POST',who:me,body:{serviceId:s.id},expect:201})).data.application;const reviewer=accounts[s.reviewer];
    await request('/api/applications/'+a.id,{who:reviewer,expect:404});
    await request('/api/applications/'+a.id+'/action',{method:'POST',who:me,body:{action:'submit',revision:a.revision},expect:400});
    const details={eligibility:true,applicant:'Sample Citizen',authority:'Self',division:'Dhaka',district:'Dhaka',upazila:'Savar',mouza:'Amin Bazar',khatian:'731',dag:'1842',area:'12.5',region:'Plains'};
    for(const f of s.fields)details[f.key]=f.options?.[0]||(f.type==='date'?'2099-12-30':'Sample '+f.key+' reference');
    const documentIds=[];for(const category of s.documents){const d=(await request('/api/documents',{method:'POST',who:me,body:{name:'sample.txt',category,content:Buffer.from('DEMO evidence for '+s.id).toString('base64')},expect:201})).data.document;assert.equal(d.sha256.length,64);documentIds.push(d.id);}
    a=(await request('/api/applications/'+a.id,{method:'PATCH',who:me,body:{revision:a.revision,details,documentIds}})).data.application;
    await request('/api/applications/'+a.id,{method:'PATCH',who:me,body:{revision:1,details,documentIds},expect:409});
    a=(await request('/api/applications/'+a.id+'/action',{method:'POST',who:me,body:{action:'submit',revision:a.revision}})).data.application;assert.equal(a.status,'Submitted');
    await request('/api/applications/'+a.id+'/action',{method:'POST',who:accounts.auditor,body:{action:'claim',revision:a.revision},expect:403});
    await request('/api/applications/'+a.id+'/action',{method:'POST',who:accounts.admin,body:{action:'claim',revision:a.revision},expect:403});
    a=(await request('/api/applications/'+a.id+'/action',{method:'POST',who:reviewer,body:{action:'claim',revision:a.revision}})).data.application;
    if(s.id==='mutation'){
     a=(await request('/api/applications/'+a.id+'/action',{method:'POST',who:reviewer,body:{action:'correction',note:'Clarify sample deed reference',revision:a.revision}})).data.application;assert.equal(a.status,'CorrectionRequested');
     a=(await request('/api/applications/'+a.id,{method:'PATCH',who:me,body:{revision:a.revision,details:{...details,deed:'Corrected sample reference'},documentIds}})).data.application;
     a=(await request('/api/applications/'+a.id+'/action',{method:'POST',who:me,body:{action:'submit',revision:a.revision}})).data.application;
     a=(await request('/api/applications/'+a.id+'/action',{method:'POST',who:reviewer,body:{action:'claim',revision:a.revision}})).data.application;
     a=(await request('/api/applications/'+a.id+'/action',{method:'POST',who:reviewer,body:{action:'hearing',note:'Review discrepancy at sandbox hearing',hearingAt:'2099-12-30T09:00:00Z',revision:a.revision}})).data.application;assert.equal(a.status,'HearingScheduled');
    }
    a=(await request('/api/applications/'+a.id+'/action',{method:'POST',who:reviewer,body:{action:'approve',note:'Sample evidence reviewed; sandbox approval only',revision:a.revision}})).data.application;
    if(s.sandboxFee){
     assert.equal(a.status,'AwaitingPayment');await request('/api/applications/'+a.id+'/action',{method:'POST',who:reviewer,body:{action:'issue',note:'Premature outcome',revision:a.revision},expect:409});
     if(s.id==='mutation'){const failed=await request('/api/payments',{method:'POST',who:me,body:{applicationId:a.id,result:'fail'},expect:201});assert.equal(failed.data.application.status,'PaymentFailed');}
     const result=await request('/api/payments',{method:'POST',who:me,body:{applicationId:a.id,result:'success'},expect:201});a=result.data.application;assert.equal(a.status,'ReadyForDelivery');
     const replay=await request('/api/payments',{method:'POST',who:me,body:{applicationId:a.id,result:'success'}});assert.equal(replay.data.payment.id,result.data.payment.id);
     await request('/api/payments/'+result.data.payment.id+'/reconcile',{method:'POST',who:accounts.finance,body:{}});
    }else assert.equal(a.status,'ReadyForDelivery');
    a=(await request('/api/applications/'+a.id+'/action',{method:'POST',who:reviewer,body:{action:'issue',note:'Demo outcome prepared for this service',revision:a.revision}})).data.application;
    assert.equal(a.status,'Completed');assert(a.outcome.title.includes('DEMO')||a.outcome.title.includes('OFFICIAL')||a.outcome.title.includes('SIMULATION'));assert.equal(a.outcome.sha256.length,64);
    const outcome=(await request('/api/applications/'+a.id+'/outcome',{who:me})).data.outcome;assert.equal(outcome.applicationId,a.id);retained=a;
   }
   assert.equal((await request('/api/applications',{who:me})).data.applications.filter(a=>a.status==='Completed').length,services.length);
  });
  await t.test('ownership, evidence validation, foreign queue and write permissions',async()=>{
   const other=accounts.representative;await request('/api/applications/'+retained.id,{who:other,expect:404});
   await request('/api/documents/'+retained.documents[0].id,{who:other,expect:404});
   await request('/api/documents',{method:'POST',who:me,body:{name:'bad.pdf',category:'Sample',content:Buffer.from('not a PDF').toString('base64')},expect:400});
   await request('/api/applications',{method:'POST',who:accounts.officer,body:{serviceId:'mutation'},expect:403});
   const a=(await request('/api/applications',{method:'POST',who:other,body:{serviceId:'mutation'},expect:201})).data.application;
   await request('/api/applications/'+a.id,{method:'PATCH',who:other,body:{revision:a.revision,details:{area:'-1'},documentIds:[]},expect:400});
   await request('/api/applications/'+a.id,{method:'PATCH',who:other,body:{revision:a.revision,details:{},documentIds:[retained.documents[0].id]},expect:403});
   await request('/api/settings',{method:'PATCH',who:accounts.auditor,body:{acceptApplications:false,notice:'Test'},expect:403});
   const users=(await request('/api/users',{who:accounts.admin})).data.users;assert(users.every(u=>!u.password));
   const audit=(await request('/api/audit',{who:accounts.auditor})).data;assert.equal(audit.chainValid,true);assert(audit.events.length>100);
  });
  await t.test('reviewer replacement, terminal states, malformed input and logout',async()=>{
   const source=(await request('/api/applications',{who:me})).data.applications.find(a=>a.serviceId==='mutation');
   let a=(await request('/api/applications',{method:'POST',who:me,body:{serviceId:'mutation'},expect:201})).data.application;
   a=(await request('/api/applications/'+a.id,{method:'PATCH',who:me,body:{revision:a.revision,details:source.details,documentIds:source.documentIds}})).data.application;
   a=(await request('/api/applications/'+a.id+'/action',{method:'POST',who:me,body:{action:'submit',revision:a.revision}})).data.application;
   a=(await request('/api/applications/'+a.id+'/action',{method:'POST',who:accounts.officer,body:{action:'claim',revision:a.revision}})).data.application;
   await request('/api/users/'+accounts.officer.user.id,{method:'PATCH',who:accounts.admin,body:{role:'officer',active:false}});
   a=(await request('/api/applications/'+a.id,{who:me})).data.application;assert.equal(a.status,'Submitted');assert.equal(a.assignedTo,null);
   await request('/api/users',{method:'POST',who:accounts.admin,body:{name:'Replacement reviewer',email:'replacement@example.test',password:'Replacement!12345',role:'officer'},expect:201});
   const logged=await request('/api/login',{method:'POST',body:{email:'replacement@example.test',password:'Replacement!12345'}});const replacement={...logged.data,cookie:logged.response.headers.get('set-cookie').split(';')[0]};
   a=(await request('/api/applications/'+a.id+'/action',{method:'POST',who:replacement,body:{action:'claim',revision:a.revision}})).data.application;
   a=(await request('/api/applications/'+a.id+'/action',{method:'POST',who:replacement,body:{action:'reject',note:'Sandbox evidence does not support request',revision:a.revision}})).data.application;assert.equal(a.status,'Rejected');
   await request('/api/applications/'+a.id+'/action',{method:'POST',who:me,body:{action:'submit',revision:a.revision},expect:409});
   const draft=(await request('/api/applications',{method:'POST',who:me,body:{serviceId:'mutation'},expect:201})).data.application;await request('/api/applications/'+draft.id+'/action',{method:'POST',who:me,body:{action:'withdraw',revision:draft.revision}});
   await request('/api/applications',{method:'POST',who:me,body:null,expect:400});
   await request('/api/profile',{method:'PATCH',who:me,body:{name:'Must not be applied',password:'NewPassword!12345',currentPassword:'wrong'},expect:403});assert.equal((await request('/api/me',{who:me})).data.user.name,me.user.name);
   await request('/api/logout',{method:'POST',who:replacement,body:{}});await request('/api/me',{who:replacement,expect:401});
  });
  await t.test('invalid calendar dates, geography and nested preference data are rejected',async()=>{
   let draft=(await request('/api/applications',{method:'POST',who:me,body:{serviceId:'mutation'},expect:201})).data.application;
   await request('/api/applications/'+draft.id,{method:'PATCH',who:me,body:{revision:draft.revision,details:{transferDate:'2026-02-30'},documentIds:[]},expect:400});
   await request('/api/applications/'+draft.id,{method:'PATCH',who:me,body:{revision:draft.revision,details:{transferDate:'2026-99-01'},documentIds:[]},expect:400});
   const source=(await request('/api/applications',{who:me})).data.applications.find(a=>a.serviceId==='mutation'&&a.status==='Completed');
   draft=(await request('/api/applications/'+draft.id,{method:'PATCH',who:me,body:{revision:draft.revision,details:{...source.details,division:'Dhaka',district:'Sylhet'},documentIds:source.documentIds}})).data.application;
   await request('/api/applications/'+draft.id+'/action',{method:'POST',who:me,body:{revision:draft.revision,action:'submit'},expect:400});
   for(const body of [{chat:[null]},{chat:[{role:'staff',text:'Bad role'}]},{savedSearches:[{query:'x'}]},{watches:[{}]},{checks:{x:'true'}},{notes:{dashboard:{text:'bad'}}},{notificationSettings:{sms:'yes'}},{language:'other'}])await request('/api/preferences',{method:'PATCH',who:me,body,expect:400});
   await request('/api/preferences',{method:'PATCH',who:me,body:{language:'bn',notes:{dashboard:'Valid sample note'},chat:[{role:'user',text:'Valid question'}]}});
   const prefs=(await request('/api/preferences',{who:me})).data.preferences;assert.equal(prefs.notes.dashboard,'Valid sample note');
  });
  await t.test('administrator suspension revokes sessions and intake switch persists',async()=>{
   await request('/api/settings',{method:'PATCH',who:accounts.admin,body:{acceptApplications:false,notice:'Test maintenance'}});await request('/api/applications',{method:'POST',who:me,body:{serviceId:'mutation'},expect:409});
   await request('/api/settings',{method:'PATCH',who:accounts.admin,body:{acceptApplications:true,notice:'Local sandbox'}});
   await request('/api/users/'+accounts.representative.user.id,{method:'PATCH',who:accounts.admin,body:{role:'representative',active:false}});await request('/api/me',{who:accounts.representative,expect:401});
  });
  await t.test('restart keeps records and invalidates memory-only sessions',async()=>{
   await new Promise(r=>running.server.close(r));running=createServer({newWorkflowVersion:1,dataDir:dir,seedDemo:false});await new Promise(r=>running.server.listen(0,'127.0.0.1',r));base='http://127.0.0.1:'+running.server.address().port;await request('/api/me',{who:me,expect:401});const again=await login('citizen');const list=(await request('/api/applications',{who:again})).data.applications;assert.equal(list.filter(a=>a.status==='Completed').length,services.length);
  });
 }finally{await new Promise(r=>running.server.close(r));/* Test fixture store intentionally retained in OS temp for failure diagnostics. */}
});
