'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const {createServer}=require('../ebhumi-platform/server-v4.cjs');
const {services,roles}=require('../ebhumi-platform/lib/catalog.cjs');
test('every role has real scoped demo work; all service examples resolve through their actual desks',async t=>{
 const app=createServer({memoryOnly:true});await new Promise(r=>app.server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>app.server.close(r)));const base='http://127.0.0.1:'+app.server.address().port;
 async function req(path,who,method='GET',body,status=200){const r=await fetch(base+'/api'+path,{method,headers:{Origin:base,'Content-Type':'application/json',...(who?{Cookie:who.cookie,'X-CSRF-Token':who.csrf}:{})},...(body?{body:JSON.stringify(body)}:{})});const data=await r.json();assert.equal(r.status,status,path+' '+JSON.stringify(data));return {r,data};}
 await req('/demo-flows',null,'GET',null,401);const users={};
 for(const role of Object.keys(roles)){const {r,data}=await req('/login',null,'POST',{email:role+'@demo.ebhumi.local',password:'BhumiDemo!2026'});users[role]={cookie:r.headers.get('set-cookie').split(';')[0],csrf:data.csrf};const flows=(await req('/demo-flows',users[role])).data;assert.equal(flows.services.length,33);assert(flows.examples.length+flows.legacyCases.length>0,role+' has no example');}
 const state=app.platform.snapshot().db;
 for(const s of services)await t.test(s.id,async()=>{
  const seeded=state.applications.find(a=>a.id==='DEMO-FLOW-'+s.id.toUpperCase()+'-1'),ownerRole=state.users.find(u=>u.id===seeded.ownerId).role,owner=users[ownerRole];
  const preflight=(await req('/applications/'+seeded.id+'/preflight',owner)).data;assert(preflight.ready,JSON.stringify(preflight.missing));let a=(await req('/applications/'+seeded.id,owner)).data.application;
  const action=async(who,action,extra={})=>a=(await req('/applications/'+a.id+'/action',who,'POST',{revision:a.revision,action,...extra})).data.application;
  const pay=async()=>{const quote=(await req('/applications/'+a.id+'/payment-quote',owner)).data.quote;a=(await req('/payments',owner,'POST',{applicationId:a.id,phase:quote.phase,quoteDigest:quote.digest,result:'success'},201)).data.application;};
  if(s.procedure.autoTax)await pay();else{
   while(true){const role=a.deskWorkflow.stages[a.deskWorkflow.index],who=users[role];await action(who,'claim');
    if(a.deskWorkflow.index<a.deskWorkflow.stages.length-1)await req('/applications/'+a.id+'/action',who,'POST',{revision:a.revision,action:'approve',note:'DEMO premature approval must fail'},409);
    for(const task of a.service.procedure.reviewTasks)a=(await req('/applications/'+a.id+'/review-task',who,'POST',{revision:a.revision,taskId:task.id,result:'done',note:'DEMO evidence and jurisdiction review completed'})).data.application;
    if(a.deskWorkflow.index<a.deskWorkflow.stages.length-1)await action(who,'forward',{note:'DEMO findings and source references sent to next desk'});else{await action(who,'approve',{note:'DEMO reasoned final disposition'});if(a.status==='AwaitingPayment')await pay();await action(who,'issue',{note:'DEMO final artifact, no government record changed'});break;}
   }
  }
  assert.equal(a.status,'Completed');assert((await req('/applications/'+a.id+'/verify-outcome',owner)).data.valid);
  const done=(await req('/applications/DEMO-FLOW-'+s.id.toUpperCase()+'-DONE/verify-outcome',owner)).data;assert(done.valid,'Seeded completed outcome hash');
 });
 for(const h of state.holdings.filter(h=>h.id.startsWith('HOLD-')))assert.deepEqual(app.platform.snapshot().db.holdings.find(x=>x.id===h.id),h,'Example resolution must not alter pre-existing holding ledgers');
 for(const role of ['ministry_officer','divisional_officer']){let a=(await req('/applications/DEMO-FLOW-ACQUISITION-'+role,users[role])).data.application;a=(await req('/applications/'+a.id+'/action',users[role],'POST',{revision:a.revision,action:'claim'})).data.application;for(const task of a.service.procedure.reviewTasks)a=(await req('/applications/'+a.id+'/review-task',users[role],'POST',{revision:a.revision,taskId:task.id,result:'done',note:'DEMO bounded consultation response'})).data.application;a=(await req('/applications/'+a.id+'/action',users[role],'POST',{revision:a.revision,action:'forward',note:'DEMO consultation returned to referring desk'})).data.application;assert.equal(a.deskWorkflow.stages[a.deskWorkflow.index],'la_officer');}
 let legacy=(await req('/legacy-cases/DEMO-LEGACY-DESK-vp_officer',users.vp_officer)).data.case;legacy=(await req('/legacy-cases/'+legacy.id+'/action',users.vp_officer,'POST',{revision:legacy.revision,action:'claim'})).data.case;legacy=(await req('/legacy-cases/'+legacy.id+'/action',users.vp_officer,'POST',{revision:legacy.revision,action:'forward',note:'DEMO bounded evidence review, no title decision',checks:[true,true,true]})).data.case;assert.equal(legacy.stages[legacy.index],'legal_officer');
 const snapshot=app.platform.snapshot().db,count=snapshot.applications.length;const changed=snapshot.applications.find(a=>a.demoExample);changed.details.applicant='USER EDIT - KEEP';changed.revision++;const restarted=createServer({memoryOnly:true,initialState:snapshot});t.after(()=>restarted.platform.close());assert.equal(restarted.platform.snapshot().db.applications.length,count);assert.equal(restarted.platform.snapshot().db.applications.find(a=>a.id===changed.id).details.applicant,'USER EDIT - KEEP');
 await req('/register',null,'POST',{name:'Fresh real account',email:'fresh@example.test',password:'FreshAccount!2026',role:'citizen'},201);const login=await req('/login',null,'POST',{email:'fresh@example.test',password:'FreshAccount!2026'}),fresh={cookie:login.r.headers.get('set-cookie').split(';')[0],csrf:login.data.csrf};assert.equal((await req('/demo-flows',fresh)).data.examples.length,0);await req('/applications/DEMO-FLOW-MUTATION-1',fresh,'GET',null,404);
});
