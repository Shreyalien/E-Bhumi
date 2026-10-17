'use strict';
const crypto=require('node:crypto');
const digest=value=>crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const relationships=['Predecessor','Child','Spouse','Co-owner','Buyer','Seller','Other'];
const mutationStates=['Unresolved','Preparing','Linked request','User-reported complete'];
const directions=['north','east','south','west'];

function seedLandDossiers(db,audit){
  if(db.landDossierEdition>=1)return false;
  db.landDossiers=db.landDossiers||[];
  for(const role of ['citizen','representative']){
    const owner=db.users.find(u=>u.email===role+'@demo.ebhumi.local');if(!owner)continue;
    for(let i=0;i<3;i++){
      const parcelId='DAG-'+(1842+i),key='LAND-'+role.toUpperCase()+'-'+(1842+i);if(db.landDossiers.some(d=>d.id===key))continue;
      const doc=db.applications.find(a=>a.ownerId===owner.id&&a.details.dag===String(1842+i))?.documentIds[0];
      const created=new Date().toISOString();
      db.landDossiers.push({id:key,ownerId:owner.id,parcelId,revision:1,contentRevision:1,demo:true,title:['Family land preparation','Purchase evidence comparison','Co-owner tax preparation'][i],narrative:['Sample family wishes to organise predecessor records, proposed shares and mutation preparation.','Sample buyer sees a difference between the deed area and a survey reference. Evidence needs comparison.','Sample co-owners are organising tax evidence and their proposed interests.'][i],recordArea:i===0?12.5:5+i*1.25,deedArea:i===1?9: i===0?12.5:7.5,
        owners:[{id:'person-root',name:'Sample predecessor',relationship:'Predecessor',parentId:'',sharePercent:0,mutationStatus:'Unresolved',documentIds:doc?[doc]:[]},...['A','B','C'].slice(0,i===2?2:3).map((name,j)=>({id:'person-'+name,name:'Sample Person '+name,relationship:i===1?'Buyer':i===2?'Co-owner':'Child',parentId:'person-root',sharePercent:i===2?50:[40,35,25][j],mutationStatus:j===0?'Preparing':'Unresolved',documentIds:j===0&&doc?[doc]:[]}))],
        facts:[{id:'fact-record',label:'Survey / Khatian context',value:'Illustrative record '+(731+i)+'; no registry lookup performed',source:'DEMO',documentIds:doc?[doc]:[]},{id:'fact-possession',label:'Possession narrative',value:'Reported by the sample household; requires independent review',source:'USER_REPORTED',documentIds:[]}],
        timeline:[{id:'event-cs',date:'1940-01-01',label:'Sample CS reference',source:'DEMO',documentIds:[]},{id:'event-deed',date:'1995-04-12',label:'Sample predecessor deed reference',source:'DEMO',documentIds:doc?[doc]:[]},{id:'event-rs',date:'2002-08-21',label:'Sample RS comparison',source:'DEMO',documentIds:[]},{id:'event-now',date:'2026-10-17',label:'Citizen preparation worksheet started',source:'DEMO',documentIds:[]}],
        obligations:[{id:'task-1',title:'Compare predecessor record and deed references',assignee:'Sample household',dueDate:'2026-11-01',done:false,serviceId:'deed-copy'},{id:'task-2',title:'Collect proposed co-owner evidence',assignee:'Sample Person A',dueDate:'2026-11-03',done:false,serviceId:'inheritance'},{id:'task-3',title:'Prepare the appropriate review request',assignee:'Applicant',dueDate:'2026-11-05',done:false,serviceId:'due-diligence'}],
        boundary:{north:'DAG-'+(1845+i),east:'DAG-'+(1846+i),south:'DAG-'+(1847+i),west:'DAG-'+(1848+i)},linkedApplicationIds:i===0?[]:db.applications.filter(a=>a.ownerId===owner.id&&a.serviceId==='mutation'&&a.status!=='Draft'&&a.details.dag===String(1842+i)).slice(0,1).map(a=>a.id),reviewNotes:[],reports:[],created,updated:created});
    }
  }
  db.landDossierEdition=1;audit(null,'seed-land-dossiers','land-dossier-edition-1',{accounts:2,parcelsPerAccount:3});return true;
}

function analyseDossier(d){
  const claimants=d.owners.filter(o=>o.relationship!=='Predecessor'),total=claimants.reduce((n,o)=>n+o.sharePercent,0);
  const findings=[];
  if(d.recordArea!==null&&d.deedArea!==null&&Math.abs(d.recordArea-d.deedArea)>0.000001)findings.push({code:'AREA_DIFFERENCE',label:'Deed / record area differs',detail:Math.abs(d.deedArea-d.recordArea).toFixed(4)+' decimal difference; compare the source documents.',serviceId:'record-correction'});
  if(!claimants.length||Math.abs(total-100)>0.000001)findings.push({code:'SHARE_GAP',label:'Proposed interests do not total 100%',detail:'Worksheet total: '+total+'%. These are proposed percentages, not legal entitlements.',serviceId:'inheritance'});
  for(const o of claimants){if(!o.documentIds.length)findings.push({code:'MISSING_EVIDENCE',label:o.name+': no linked evidence',detail:'Attach an account-owned sample document or record an unresolved evidence question.',serviceId:'deed-copy'});if(o.mutationStatus!=='User-reported complete')findings.push({code:'MUTATION_OPEN',label:o.name+': mutation preparation remains open',detail:o.mutationStatus+'; no official mutation status was queried.',serviceId:'mutation'});}
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Dhaka',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  for(const task of d.obligations)if(!task.done&&task.dueDate&&task.dueDate<today)findings.push({code:'TASK_OVERDUE',label:task.title,detail:'Your preparation deadline has passed; this is not a statutory deadline.',serviceId:task.serviceId||'appointment'});
  return {shareTotal:Number(total.toFixed(6)),proposedArea:claimants.map(o=>({id:o.id,name:o.name,sharePercent:o.sharePercent,area:d.recordArea===null?null:Number((d.recordArea*o.sharePercent/100).toFixed(6))})),findings,evidenceCoverage:{ownersWithEvidence:claimants.filter(o=>o.documentIds.length).length,owners:claimants.length},tasks:{done:d.obligations.filter(t=>t.done).length,total:d.obligations.length},sourceCounts:d.facts.reduce((n,f)=>(n[f.source]=(n[f.source]||0)+1,n),{})};
}

function handleLandDossiers(ctx){
  const {db,user:u,body,method,route,send,save,audit,notify,canRead,canReview,fail,id,now,validDate}=ctx;
  if(!route.startsWith('/land-dossiers'))return false;
  db.landDossiers=db.landDossiers||[];
  const applicant=['citizen','representative'].includes(u.role);
  const readable=d=>d.ownerId===u.id||['admin','auditor'].includes(u.role)||d.linkedApplicationIds.some(key=>db.applications.some(a=>a.id===key&&canRead(u,a)));
  const view=d=>({...d,evidence:db.documents.filter(doc=>[...d.owners,...d.facts,...d.timeline].some(item=>item.documentIds.includes(doc.id))).map(({content,...meta})=>meta),analysis:analyseDossier(d),canEdit:d.ownerId===u.id,reviewableApplications:d.linkedApplicationIds.filter(key=>db.applications.some(a=>a.id===key&&canReview(u,a)&&a.assignedTo===u.id&&['UnderReview','HearingScheduled','ReadyForDelivery'].includes(a.status)))});
  const str=(v,label,max=4000,empty=false)=>{if(typeof v!=='string'||(!empty&&!v.trim())||v.length>max)fail(400,label+' is invalid');return v.trim();};
  const number=(v,label)=>{if(v===null||v==='')return null;if(typeof v!=='number'||!Number.isFinite(v)||v<0||v>1e9)fail(400,label+' must be a finite nonnegative number');return v;};
  const list=(v,label,max)=>{if(!Array.isArray(v)||v.length>max)fail(400,'Invalid '+label);return v;};
  const evidence=ids=>list(ids,'evidence links',30).map(key=>{if(typeof key!=='string'||!db.documents.some(d=>d.id===key&&d.ownerId===u.id))fail(403,'Evidence must belong to this account');return key;});
  const entryId=v=>{if(typeof v!=='string'||!/^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/.test(v))fail(400,'Entry ID must use letters, numbers, dots, underscores or hyphens');return v;};
  const validate=(input,previous)=>{
    if(!input||typeof input!=='object'||Array.isArray(input))fail(400,'Worksheet details object required');
    const candidate={...previous,title:str(input.title,'Title',150),narrative:str(input.narrative,'Narrative',6000,true),recordArea:number(input.recordArea,'Record area'),deedArea:number(input.deedArea,'Deed area')};
    candidate.owners=list(input.owners,'people',40).map(o=>{if(!o||typeof o!=='object')fail(400,'Invalid person');const key=entryId(o.id);if(!relationships.includes(o.relationship)||!mutationStates.includes(o.mutationStatus))fail(400,'Invalid relationship or preparation state');if(typeof o.sharePercent!=='number'||!Number.isFinite(o.sharePercent)||o.sharePercent<0||o.sharePercent>100)fail(400,'Proposed percentage must be 0–100');return {id:key,name:str(o.name,'Name',150),relationship:o.relationship,parentId:str(o.parentId,'Parent ID',80,true),sharePercent:o.relationship==='Predecessor'?0:o.sharePercent,mutationStatus:o.mutationStatus,documentIds:evidence(o.documentIds)};});
    const people=new Map(candidate.owners.map(o=>[o.id,o]));if(people.size!==candidate.owners.length)fail(400,'Person IDs must be unique');
    for(const owner of candidate.owners){const visited=new Set([owner.id]);let key=owner.parentId;while(key){if(visited.has(key)||!people.has(key))fail(400,'Relationships must reference existing people and cannot form a cycle');visited.add(key);key=people.get(key).parentId;}}
    const sourceEntries=(entries,old,dateRequired)=>list(entries,'source entries',80).map(f=>{if(!f||typeof f!=='object')fail(400,'Invalid source entry');const key=entryId(f.id),label=str(f.label,'Entry label',200);const item={id:key,label,documentIds:evidence(f.documentIds),...(dateRequired?{date:str(f.date,'Event date',10)}:{value:str(f.value,'Fact value',2000)})};if(dateRequired&&!validDate(item.date))fail(400,'Invalid event date');const prior=old.find(x=>x.id===key);item.source=prior&&prior.label===item.label&&prior.value===item.value&&prior.date===item.date&&JSON.stringify(prior.documentIds)===JSON.stringify(item.documentIds)?prior.source:'USER_REPORTED';return item;});
    candidate.facts=sourceEntries(input.facts,previous.facts,false);candidate.timeline=sourceEntries(input.timeline,previous.timeline,true);
    candidate.obligations=list(input.obligations,'tasks',80).map(t=>{if(!t||typeof t!=='object')fail(400,'Invalid task');if(typeof t.done!=='boolean')fail(400,'Task completion must be boolean');if(t.dueDate&&!validDate(t.dueDate))fail(400,'Invalid task date');if(t.serviceId&&!ctx.services.some(s=>s.id===t.serviceId))fail(400,'Unknown task service');return {id:entryId(t.id),title:str(t.title,'Task title',300),assignee:str(t.assignee,'Assignee',150,true),dueDate:str(t.dueDate,'Due date',10,true),done:t.done,serviceId:str(t.serviceId,'Task service',80,true)};});
    for(const entries of [candidate.facts,candidate.timeline,candidate.obligations])if(new Set(entries.map(x=>x.id)).size!==entries.length)fail(400,'Entry IDs must be unique within each list');
    if(!input.boundary||typeof input.boundary!=='object')fail(400,'Boundary references required');candidate.boundary=Object.fromEntries(directions.map(k=>[k,str(input.boundary[k],k+' boundary',150,true)]));
    candidate.linkedApplicationIds=[...new Set(list(input.linkedApplicationIds,'linked applications',20).map(key=>{const a=db.applications.find(a=>a.id===key&&a.ownerId===u.id);if(!a)fail(403,'Linked application must belong to this account');const dag=String(a.details.dag||'').replace(/^DAG-/i,'').trim();if(dag!==previous.parcelId.slice(4))fail(400,'Linked application must refer to this parcel Dag');return key;}))];
    return candidate;
  };
  if(route==='/land-dossiers'){
    if(method==='GET'){send(200,{dossiers:db.landDossiers.filter(readable).map(d=>({...view(d),reports:d.reports.map(({id,at,contentRevision,sha256})=>({id,at,contentRevision,sha256}))}))});return true;}
    if(method==='POST'){
      if(!applicant)fail(403,'Only applicants can create a land worksheet');if(!/^DAG-(18[4-5][0-9]|186[0-5])$/.test(body.parcelId)||Number(body.parcelId.slice(4))<1842)fail(400,'Choose an available demo parcel');
      const existing=db.landDossiers.find(d=>d.ownerId===u.id&&d.parcelId===body.parcelId);if(existing){send(200,{dossier:view(existing)});return true;}
      const d={id:id('LAND'),ownerId:u.id,parcelId:body.parcelId,revision:1,contentRevision:1,title:str(body.title,'Title',150),narrative:'',recordArea:null,deedArea:null,owners:[],facts:[],timeline:[],obligations:[],boundary:{north:'',east:'',south:'',west:''},linkedApplicationIds:[],reviewNotes:[],reports:[],created:now(),updated:now()};db.landDossiers.push(d);audit(u,'land-dossier-create',d.id);save();send(201,{dossier:view(d)});return true;
    }
  }
  const match=route.match(/^\/land-dossiers\/([^/]+)(?:\/(report|review))?$/);if(!match)fail(404,'Land worksheet route not found');
  const d=db.landDossiers.find(d=>d.id===match[1]);if(!d||!readable(d))fail(404,'Land worksheet not found');
  if(method==='GET'&&!match[2]){send(200,{dossier:view(d)});return true;}
  if(body.revision!==d.revision)fail(409,'Land worksheet changed; reload before saving');
  if(method==='PATCH'&&!match[2]){
    if(d.ownerId!==u.id)fail(403,'Only the owner can edit the worksheet');const candidate=validate(body.details,d);Object.assign(d,candidate,{revision:d.revision+1,contentRevision:d.contentRevision+1,updated:now()});audit(u,'land-dossier-update',d.id,{contentRevision:d.contentRevision});save();send(200,{dossier:view(d)});return true;
  }
  if(method==='POST'&&match[2]==='report'){
    if(d.ownerId!==u.id)fail(403,'Only the owner can save a preparation report');const snapshot={parcelId:d.parcelId,title:d.title,contentRevision:d.contentRevision,at:now(),analysis:analyseDossier(d),sources:d.facts,people:d.owners,timeline:d.timeline,boundary:d.boundary,obligations:d.obligations,linkedApplicationIds:d.linkedApplicationIds,watermark:'LOCAL PREPARATION / NOT OWNERSHIP VERIFICATION / NO LEGAL EFFECT'};const report={id:id('LAND-REPORT'),...snapshot,sha256:digest(snapshot)};d.reports=[...d.reports,report].slice(-20);d.revision++;d.updated=now();audit(u,'land-dossier-report',d.id,{digest:report.sha256});save();send(201,{report,dossier:view(d)});return true;
  }
  if(method==='POST'&&match[2]==='review'){
    const a=db.applications.find(a=>a.id===body.applicationId&&d.linkedApplicationIds.includes(a.id));if(!a||!canReview(u,a)||a.assignedTo!==u.id||!['UnderReview','HearingScheduled','ReadyForDelivery'].includes(a.status))fail(403,'Review requires a linked active application assigned to your role account');
    if(!['LOCAL_REVIEWED','CLARIFICATION_REQUESTED'].includes(body.status))fail(400,'Invalid local review status');const note={id:id('LAND-NOTE'),applicationId:a.id,contentRevision:d.contentRevision,status:body.status,note:str(body.note,'Review note'),by:u.name,role:u.role,at:now(),boundary:'Local desk note, not official verification'};d.reviewNotes=[...d.reviewNotes,note].slice(-100);d.revision++;d.updated=now();audit(u,'land-dossier-review',d.id,{applicationId:a.id,status:note.status});notify(d.ownerId,'Land worksheet: '+note.status,a.id);save();send(200,{dossier:view(d)});return true;
  }
  fail(405,'Unsupported land worksheet action');
}
module.exports={seedLandDossiers,analyseDossier,handleLandDossiers,relationships,mutationStates};
