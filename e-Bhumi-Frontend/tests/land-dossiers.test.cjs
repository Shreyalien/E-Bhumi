'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
const {createServer}=require('../server-v4.cjs');
const keys=['title','narrative','recordArea','deedArea','owners','facts','timeline','obligations','boundary','linkedApplicationIds'];
const content=d=>Object.fromEntries(keys.map(key=>[key,structuredClone(d[key])]));
test('Truth Cards: graph validation, source provenance, private evidence sharing, assigned review, immutable reports and restart',async t=>{
  const root=process.env.EBHUMI_TEST_ROOT||os.tmpdir();fs.mkdirSync(root,{recursive:true});const dir=fs.mkdtempSync(path.join(root,'land-dossiers-'));
  let run=createServer({newWorkflowVersion:1,dataDir:dir});await new Promise(r=>run.server.listen(0,'127.0.0.1',r));let base='http://127.0.0.1:'+run.server.address().port;t.after(async()=>{if(run.server.listening)await new Promise(r=>run.server.close(r));});
  async function request(route,who,body,status=200,method=body?'POST':'GET'){
    const response=await fetch(base+'/api'+route,{method,headers:{'Content-Type':'application/json',...(who?{Cookie:who.cookie,'X-CSRF-Token':who.csrf}:{})},...(body?{body:JSON.stringify(body)}:{})});const data=await response.json();assert.equal(response.status,status,route+': '+JSON.stringify(data));return {data,response};
  }
  async function login(role){const {data,response}=await request('/login',null,{email:role+'@demo.ebhumi.local',password:'BhumiDemo!2026'});return {...data,cookie:response.headers.get('set-cookie').split(';')[0]};}
  const owner=await login('citizen'),other=await login('representative'),officer=await login('officer'),records=await login('records'),auditor=await login('auditor');
  await request('/land-dossiers',null,undefined,401);let own=(await request('/land-dossiers',owner)).data.dossiers;assert.equal(own.length,3);assert(!(await request('/land-dossiers',officer)).data.dossiers.some(d=>d.id==='LAND-CITIZEN-1842'));assert.equal((await request('/land-dossiers',auditor)).data.dossiers.length,6);
  let d=own.find(d=>d.parcelId==='DAG-1842');const key=d.id;
  await request('/land-dossiers/'+key,other,undefined,404);
  await request('/land-dossiers',officer,{parcelId:'DAG-1842',title:'Denied'},403);
  await request('/land-dossiers',owner,{parcelId:'DAG-9999',title:'Invalid parcel'},400);
  const created=(await request('/land-dossiers',owner,{parcelId:'DAG-1865',title:'Private new preparation'},201)).data.dossier;assert.equal(created.owners.length,0);assert.equal((await request('/land-dossiers',owner,{parcelId:'DAG-1865',title:'Same parcel'})).data.dossier.id,created.id);
  const patch=async(details,status=200,revision=d.revision)=>(await request('/land-dossiers/'+key,owner,{revision,details},status,'PATCH')).data.dossier;
  await patch(null,400);let malicious=content(d);malicious.owners[0].id='bad"<id';await patch(malicious,400);
  let bad=content(d);bad.owners[0].parentId=bad.owners[1].id;await patch(bad,400);assert.equal((await request('/land-dossiers/'+key,owner)).data.dossier.revision,d.revision);
  bad=content(d);bad.owners[1].parentId='missing';await patch(bad,400);bad=content(d);bad.owners[1].sharePercent=-1;await patch(bad,400);bad=content(d);bad.timeline[0].date='2026-02-30';await patch(bad,400);
  const otherDoc=(await request('/documents',other)).data.documents[0];bad=content(d);bad.owners[1].documentIds=[otherDoc.id];await patch(bad,403);
  bad=content(d);bad.linkedApplicationIds=['DEMO-REPRESENTATIVE-MUTATION-01'];await patch(bad,403);bad=content(d);bad.linkedApplicationIds=['DEMO-CITIZEN-MUTATION-02'];await patch(bad,400);
  bad=content(d);bad.facts[0].value='Edited source claim';bad.facts[0].source='OFFICIALLY_VERIFIED';d=await patch(bad);assert.equal(d.facts[0].source,'USER_REPORTED');await patch(content(d),409,d.revision-1);
  const doc=(await request('/documents',owner,{name:'dossier-only.txt',category:'Land Passport evidence',content:Buffer.from('DEMO dossier-only evidence').toString('base64')},201)).data.document;
  let next=content(d);next.facts.push({id:'new-evidence',label:'Evidence question',value:'Needs review',source:'VERIFIED',documentIds:[doc.id]});next.linkedApplicationIds=['DEMO-CITIZEN-MUTATION-01'];d=await patch(next);assert.equal(d.facts.at(-1).source,'USER_REPORTED');
  await request('/land-dossiers/'+key,officer,undefined,404);await request('/documents/'+doc.id,officer,undefined,404);
  let a=(await request('/applications/DEMO-CITIZEN-MUTATION-01',owner)).data.application;
  a=(await request('/applications/'+a.id+'/action',owner,{action:'submit',revision:a.revision})).data.application;
  let visible=(await request('/land-dossiers/'+key,officer)).data.dossier;assert.equal(visible.canEdit,false);await request('/documents/'+doc.id,officer);await request('/land-dossiers/'+key,records,undefined,404);
  await request('/land-dossiers/'+key,officer,{revision:d.revision,details:content(d)},403,'PATCH');await request('/land-dossiers/'+key+'/report',auditor,{revision:d.revision},403);
  await request('/land-dossiers/'+key+'/review',officer,{revision:d.revision,applicationId:a.id,status:'LOCAL_REVIEWED',note:'Not assigned'},403);
  a=(await request('/applications/'+a.id+'/action',officer,{action:'claim',revision:a.revision})).data.application;
  d=(await request('/land-dossiers/'+key+'/review',officer,{revision:d.revision,applicationId:a.id,status:'CLARIFICATION_REQUESTED',note:'Compare the predecessor reference and proposed interests'})).data.dossier;assert.equal(d.reviewNotes.length,1);assert.equal(d.reviewNotes[0].contentRevision,d.contentRevision);
  const report=(await request('/land-dossiers/'+key+'/report',owner,{revision:d.revision},201)).data;d=report.dossier;const {id:reportId,sha256,...snapshot}=report.report;assert.equal(crypto.createHash('sha256').update(JSON.stringify(snapshot)).digest('hex'),sha256);assert(!JSON.stringify(snapshot).includes('OFFICIALLY_VERIFIED'));
  next=content(d);next.recordArea=10;next.deedArea=12;next.owners[1].sharePercent=20;next.obligations[0].done=true;d=await patch(next);assert(d.analysis.findings.some(f=>f.code==='AREA_DIFFERENCE'));assert(d.analysis.findings.some(f=>f.code==='SHARE_GAP'));assert.equal(d.analysis.tasks.done,1);assert(d.reviewNotes[0].contentRevision<d.contentRevision);assert.equal(d.reports[0].sha256,sha256,'Snapshot hash changed after editing current worksheet');assert.equal(d.reports[0].analysis.shareTotal,100);
  next=content(d);next.linkedApplicationIds=[];d=await patch(next);await request('/land-dossiers/'+key,officer,undefined,404);await request('/documents/'+doc.id,officer,undefined,404);
  await new Promise(r=>run.server.close(r));run=createServer({newWorkflowVersion:1,dataDir:dir});await new Promise(r=>run.server.listen(0,'127.0.0.1',r));base='http://127.0.0.1:'+run.server.address().port;const again=await login('citizen');const saved=(await request('/land-dossiers/'+key,again)).data.dossier;assert.equal(saved.obligations[0].done,true);assert.equal(saved.reports[0].sha256,sha256);assert.equal((await request('/land-dossiers',again)).data.dossiers.length,4);
});
