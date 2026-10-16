'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {createServer}=require('../server-v4.cjs');
const {services}=require('../lib/catalog.cjs');

test('appointment capacity, owner reschedule/cancel, token invalidation and permission boundaries',async t=>{
  const root=process.env.EBHUMI_TEST_ROOT||os.tmpdir();fs.mkdirSync(root,{recursive:true});
  const dir=fs.mkdtempSync(path.join(root,'appointment-'));const {server}=createServer({dataDir:dir,seedDemo:false});await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));
  const base='http://127.0.0.1:'+server.address().port;
  async function req(route,who,body,status=200,method=body?'POST':'GET'){
    const response=await fetch(base+'/api'+route,{method,headers:{'Content-Type':'application/json',...(who?{Cookie:who.cookie,'X-CSRF-Token':who.csrf}:{})},...(body?{body:JSON.stringify(body)}:{})});const data=await response.json();assert.equal(response.status,status,JSON.stringify(data));return {data,response};
  }
  async function login(role){const {data,response}=await req('/login',null,{email:role+'@demo.ebhumi.local',password:'BhumiDemo!2026'});return {...data,cookie:response.headers.get('set-cookie').split(';')[0]};}
  const owner=await login('citizen'),other=await login('representative'),support=await login('support');
  const category=services.find(s=>s.id==='appointment').documents[0];
  const doc=(await req('/documents',owner,{name:'sample.txt',category,content:Buffer.from('DEMO appointment reference').toString('base64')},201)).data.document;
  async function draft(){let a=(await req('/applications',owner,{serviceId:'appointment'},201)).data.application;return (await req('/applications/'+a.id,owner,{revision:a.revision,details:{eligibility:true,applicant:'Sample Citizen',authority:'Self',division:'Dhaka',district:'Dhaka',upazila:'Savar',office:'Savar demo office',visitDate:'2099-12-30',slot:'09:30',assistance:'None'},documentIds:[doc.id]},200,'PATCH')).data.application;}
  async function act(a,who,action){return (await req('/applications/'+a.id+'/action',who,{action,revision:a.revision,note:'Reviewed demo reference'})).data.application;}
  let a=await draft();a=await act(a,owner,'submit');a=await act(a,support,'claim');a=await act(a,support,'approve');a=await act(a,support,'issue');assert(a.outcome);
  await req('/applications/'+a.id+'/appointment',other,{action:'cancel',revision:a.revision,note:'Other account'},404);
  await req('/applications/'+a.id+'/appointment',support,{action:'cancel',revision:a.revision,note:'Staff cannot act as owner'},403);
  await req('/applications/'+a.id+'/appointment',owner,{action:'cancel',revision:a.revision,note:''},400);
  assert.equal((await req('/applications/'+a.id,owner)).data.application.status,'Completed','Invalid cancellation mutated memory');
  await req('/applications/'+a.id+'/appointment',owner,{action:'reschedule',revision:a.revision,note:'Invalid date',visitDate:'2099-02-30',slot:'10:30'},400);
  const oldRevision=a.revision;
  a=(await req('/applications/'+a.id+'/appointment',owner,{action:'reschedule',revision:a.revision,note:'Need another time',visitDate:'2099-12-30',slot:'10:30'})).data.application;assert.equal(a.status,'Submitted');assert.equal(a.assignedTo,null);assert.equal(a.outcome,undefined);
  await req('/applications/'+a.id+'/outcome',owner,undefined,409);
  await req('/applications/'+a.id+'/appointment',owner,{action:'cancel',revision:oldRevision,note:'Stale write'},409);
  a=(await req('/applications/'+a.id+'/appointment',owner,{action:'cancel',revision:a.revision,note:'Plans changed'})).data.application;assert.equal(a.status,'Cancelled');
  await req('/applications/'+a.id+'/appointment',owner,{action:'reschedule',revision:a.revision,note:'Already final',visitDate:'2099-12-30',slot:'11:30'},409);
  for(let i=0;i<4;i++)await act(await draft(),owner,'submit');
  let slots=(await req('/appointment-slots?office=Savar%20demo%20office&date=2099-12-30',owner)).data.slots;assert.equal(slots.find(s=>s.slot==='09:30').available,false);assert.equal(slots.find(s=>s.slot==='10:30').available,true);
  const full=await draft();await req('/applications/'+full.id+'/action',owner,{action:'submit',revision:full.revision},409);
  await req('/appointment-slots?office=demo&date=2099-02-30',owner,undefined,400);
});

test('compact seed migration removes untouched fixtures, preserves real edits and remains idempotent',()=>{
  const root=process.env.EBHUMI_TEST_ROOT||os.tmpdir();fs.mkdirSync(root,{recursive:true});const dir=fs.mkdtempSync(path.join(root,'compact-seed-'));
  let run=createServer({dataDir:dir});let db=JSON.parse(fs.readFileSync(run.platform.dataFile));assert.equal(db.applications.length,198);assert.equal(db.documents.length,318);
  const original=db.applications[0],legacy={...structuredClone(original),id:'DEMO-LEGACY-UNTOUCHED',revision:1},edited={...structuredClone(original),id:'DEMO-LEGACY-EDITED',revision:2},real={...structuredClone(original),id:'USER-CREATED',demo:false},reconciled={...structuredClone(original),id:'DEMO-RECONCILED',revision:1};
  db.applications.push(legacy,edited,real,reconciled);db.payments.push({id:'PROTECTED',applicationId:reconciled.id,reconciledBy:'real-finance-user'});db.demoEdition=6;run.platform.close();fs.writeFileSync(path.join(dir,'platform.json'),JSON.stringify(db));
  run=createServer({dataDir:dir});db=JSON.parse(fs.readFileSync(run.platform.dataFile));assert(!db.applications.some(a=>a.id===legacy.id));for(const a of [edited,real,reconciled])assert(db.applications.some(b=>b.id===a.id));assert.equal(db.applications.length,201);assert.equal(db.demoEdition,7);run.platform.close();
  run=createServer({dataDir:dir});assert.equal(JSON.parse(fs.readFileSync(run.platform.dataFile)).applications.length,201);run.platform.close();
});
