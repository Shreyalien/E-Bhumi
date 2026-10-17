'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {createServer}=require('../server-v4.cjs'),{roles}=require('../lib/catalog.cjs');
test('all-role law library and private evidence preparation with guarded specialist handoffs',async t=>{
 const root=process.env.EBHUMI_TEST_ROOT||__dirname;fs.mkdirSync(root,{recursive:true});const dataDir=fs.mkdtempSync(path.join(root,'lawbook-'));let {server}=createServer({dataDir});await new Promise(r=>server.listen(0,'127.0.0.1',r));let base='http://127.0.0.1:'+server.address().port;
 t.after(async()=>{if(server.listening)await new Promise(r=>server.close(r));fs.rmSync(dataDir,{recursive:true,force:true});});
 async function req(url,user,method='GET',body,status=200){const r=await fetch(base+'/api'+url,{method,headers:{'Content-Type':'application/json',...(user?{Cookie:user.cookie,'X-CSRF-Token':user.csrf}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})});const d=await r.json();assert.equal(r.status,status,method+' '+url+': '+JSON.stringify(d));return {d,r};}
 const users={};for(const role of Object.keys(roles)){const {r,d}=await req('/login',null,'POST',{email:role+'@demo.ebhumi.local',password:'BhumiDemo!2026'});users[role]={...d,cookie:r.headers.get('set-cookie').split(';')[0]};const lib=(await req('/law-library',users[role])).d;assert(lib.entries.length>=28);assert(lib.entries.every(e=>/^https:\/\//.test(e.url)));assert(lib.entries.some(e=>e.id==='vested-kha'));}
 const citizen=users.citizen,other=users.representative;
 await req('/law-library',null,'GET',undefined,401);
 await req('/law-library/preferences',citizen,'PATCH',{bookmarks:['not-real']},400);
 await req('/law-library/preferences',citizen,'PATCH',{notes:{vested:'<script>private</script>'},read:['vested'],bookmarks:['vested-kha']});
 assert.equal((await req('/law-library',other)).d.preferences.notes.vested,undefined);
 assert.equal((await req('/law-library',citizen)).d.preferences.notes.vested,'<script>private</script>');
 await req('/legacy-cases',users.admin,'POST',{},403);
 const document=(await req('/documents',citizen,'POST',{name:'legacy-evidence.txt',category:'Historical source',content:Buffer.from('DEMO independent legacy evidence').toString('base64')},201)).d.document;
 let a=(await req('/legacy-cases',citizen,'POST',{},201)).d.case;
 const patch=async details=>(await req('/legacy-cases/'+a.id,citizen,'PATCH',{revision:a.revision,details})).d.case;
 const act=async(who,action,extra={},status=200)=>{const result=await req('/legacy-cases/'+a.id+'/action',who,'POST',{revision:a.revision,action,...extra},status);if(status===200)a=result.d.case;return result;};
 await req('/legacy-cases/'+a.id,other,'GET',undefined,404);
 await req('/legacy-cases/'+a.id,users.vp_officer,'GET',undefined,404);
 await act(citizen,'submit',{},400);
 a=await patch({title:'DEMO historic Kha file',district:'Dhaka',upazila:'Savar',mouza:'Demo',khatian:'731',dag:'1842',documentIds:[document.id],schedule:'HistoricalKha',heirs:'All known and unknown shares unresolved',timeline:'1940: DEMO reference; 2013: law amendment; current status unverified',mappings:'CS 30 → RS 1842 / user reported'});
 assert(a.assessment[0].includes('বাতিল'));assert.equal(a.documents.length,1);assert.equal(a.documents[0].content,undefined);
 await req('/legacy-cases/'+a.id,citizen,'PATCH',{revision:a.revision,details:{documentIds:['foreign-document']}},400);
 await req('/legacy-cases/'+a.id,citizen,'PATCH',{revision:a.revision-1,details:{}},409);
 await req('/legacy-cases/'+a.id,citizen,'PATCH',{revision:a.revision,details:{linkedApplicationIds:['somebody-elses']}},400);
 await req('/documents/'+document.id,users.vp_officer,'GET',undefined,404);
 await act(citizen,'submit');
 assert.equal((await req('/documents/'+document.id,users.vp_officer)).d.document.sha256,document.sha256);
 await req('/documents/'+document.id,other,'GET',undefined,404);
 await act(users.legal_officer,'claim',{},404);
 await act(users.vp_officer,'claim');
 await act(citizen,'forward',{note:'cannot act as official'},403);
 await act(users.vp_officer,'forward',{note:'Missing evidence checkboxes'},400);
 await act(users.vp_officer,'correction',{note:'Please clarify missing historical source'});
 a=await patch({conflicts:'Historical gazette reference pending; no ownership inferred'});await act(citizen,'submit');
 for(const role of ['vp_officer','legal_officer','dc','records']){
  const desk=users[role];await act(desk,'claim');
  if(role==='dc'){await act(desk,'forward',{note:'Cannot proceed without reported authority',checks:[true,true,true]},409);await act(desk,'correction',{note:'Provide the external order authority and evidence reference'});a=await patch({externalOrder:'DEMO reference ONLY: external court / 2099 / sample; not verified'});await act(citizen,'submit');await act(desk,'claim');}
  await act(desk,'forward',{note:'Sources and discrepancies reviewed; local preparation only',checks:[true,true,true]});
 }
 assert.equal(a.status,'PreparationComplete');assert.equal(a.completed.length,4);assert(!a.titleDecision);assert(!a.outcome);
 await req('/legacy-cases/'+a.id,users.vp_officer);
 await req('/legacy-cases/'+a.id,users.support,'GET',undefined,404);
 assert((await req('/legacy-cases/'+a.id+'/report',citizen)).d.report.label.includes('NOT A TITLE'));
 await act(users.records,'claim',{},403);
 await req('/legacy-cases/'+a.id,citizen,'PATCH',{revision:a.revision,details:{title:'Changed after completion'}},403);
 assert((await req('/notifications',citizen)).d.notifications.some(n=>n.reference===a.id));
 await new Promise(r=>server.close(r));({server}=createServer({dataDir}));await new Promise(r=>server.listen(0,'127.0.0.1',r));base='http://127.0.0.1:'+server.address().port;
 const {r,d}=await req('/login',null,'POST',{email:'citizen@demo.ebhumi.local',password:'BhumiDemo!2026'});const again={...d,cookie:r.headers.get('set-cookie').split(';')[0]};assert.equal((await req('/legacy-cases/'+a.id,again)).d.case.status,'PreparationComplete');assert.deepEqual((await req('/law-library',again)).d.preferences.bookmarks,['vested-kha']);
});
