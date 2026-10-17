'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {roles,services,capabilities}=require('./catalog.cjs');
const now=()=>new Date().toISOString(),id=p=>p+'-'+crypto.randomBytes(8).toString('hex');
const hash=v=>crypto.createHash('sha256').update(v).digest('hex');
const password=(v,salt=crypto.randomBytes(16).toString('hex'))=>({salt,hash:crypto.scryptSync(v,salt,64).toString('hex')});
const geography=require('./geography.cjs');
const {requestOrigin}=require('./request-security.cjs');
const {handleDeskReferral}=require('./desk-referrals.cjs');
const {handleLawLibrary}=require('./law-library.cjs');
const {handleLegacyCases,canReadLegacy}=require('./legacy-cases.cjs');
const {seedLandDossiers,handleLandDossiers}=require('./land-dossiers.cjs');
const {emptyProcedure,seedHoldings,handleProcedureRequest}=require('./procedure-engine.cjs');
const {currentDesk,createDeskWorkflow,desks,deskProcedure}=require('./desk-routing.cjs');
const validDate=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v+'T00:00:00Z'))&&new Date(v+'T00:00:00Z').toISOString().slice(0,10)===v;
const dhakaDay=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Dhaka',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const safeUser=u=>({id:u.id,name:u.name,email:u.email,role:u.role,active:u.active});
const fail=(status,message)=>{throw Object.assign(new Error(message),{status});};
function createPlatform({dataDir,seedDemo=true,newWorkflowVersion=2,deskRouting=true}){
 fs.mkdirSync(dataDir,{recursive:true});const file=path.join(dataDir,'platform.json');
 let db=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{version:4,users:[],applications:[],documents:[],payments:[],notifications:[],audit:[],settings:{acceptApplications:true,notice:process.env.VERCEL?'Hosted demo — temporary instance data and sessions; resets may occur. Use sample information only.':'Local sandbox — sample information only.'}};
 const save=()=>{fs.writeFileSync(file+'.tmp',JSON.stringify(db,null,2));for(let attempt=0;;attempt++){try{fs.renameSync(file+'.tmp',file);break;}catch(e){if(!['EPERM','EACCES','EBUSY'].includes(e.code)||attempt>=4)throw e;Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,25*(attempt+1));}}};
 const audit=(user,event,resource,details={})=>{const previous=db.audit.at(-1)?.hash||'GENESIS';const row={id:id('AUD'),at:now(),actor:user?.id||'system',role:user?.role||'system',event,resource,details,previous};row.hash=hash(JSON.stringify(row));db.audit.push(row);};
 if(!db.users.length){for(const role of Object.keys(roles)){db.users.push({id:id('USR'),name:roles[role].split(' / ').at(-1)+' Demo',email:role+'@demo.ebhumi.local',role,active:true,password:password('BhumiDemo!2026'),created:now()});}audit(null,'seed-demo-accounts','system');save();}
 if(seedDemo&&require('./seed-demo.cjs').seedDemo(db,audit))save();
 if(seedDemo&&seedLandDossiers(db,audit))save();
 if(seedDemo&&seedHoldings(db,audit))save();
 if(seedDemo){let added=false;for(const role of Object.keys(desks)){if(db.users.some(u=>u.email===role+'@demo.ebhumi.local'))continue;db.users.push({id:id('USR'),name:desks[role],email:role+'@demo.ebhumi.local',role,active:true,password:password('BhumiDemo!2026'),created:now()});added=true;}if(added){audit(null,'seed-new-desk-accounts','system');save();}}
 if(!db.uiLanguageEdition){db.preferences=db.preferences||{};for(const user of db.users)db.preferences[user.id]={...(db.preferences[user.id]||{}),language:'bn'};db.uiLanguageEdition=1;audit(null,'bangla-default-migration','system');save();}
 const sessions=new Map(),attempts=new Map();
 const notify=(userId,title,reference)=>db.notifications.push({id:id('NTF'),userId,title,reference,read:false,at:now()});
 const service=id=>services.find(s=>s.id===id)||fail(400,'Unknown service');
 const text=(v,label,max=4000)=>{if(typeof v!=='string'||!v.trim()||v.length>max)fail(400,label+' is required (maximum '+max+' characters).');return v.trim();};
 const canCreate=u=>['citizen','representative'].includes(u.role);
 const canReview=(u,a)=>u.role===currentDesk(a,service(a.serviceId).reviewer);
 const canRead=(u,a)=>a.ownerId===u.id||(canReview(u,a)&&!['Draft',...(a.workflowVersion===2?['AwaitingApplicationPayment','ApplicationPaymentFailed']:[])].includes(a.status))||a.deskWorkflow?.completed.some(stage=>stage.role===u.role)||a.deskWorkflow?.referrals?.some(r=>r.from===u.role)||['admin','auditor'].includes(u.role);
 const app=(u,key)=>{const a=db.applications.find(a=>a.id===key);if(!a||!canRead(u,a))fail(404,'Application not found');return a;};
 const history=(a,u,event,note)=>a.history.push({at:now(),actor:u.id,role:u.role,event,note,status:a.status});
 const view=a=>({...a,service:{...service(a.serviceId),procedure:deskProcedure(a,service(a.serviceId).procedure),reviewer:currentDesk(a,service(a.serviceId).reviewer)},owner:db.users.find(u=>u.id===a.ownerId)?.name,assignee:db.users.find(u=>u.id===a.assignedTo)?.name,documents:a.documentIds.map(key=>{const d=db.documents.find(d=>d.id===key);return d?(({content,...metadata})=>metadata)(d):null}).filter(Boolean),payments:db.payments.filter(p=>p.applicationId===a.id)});
 const validate=(a,complete=false)=>{const s=service(a.serviceId),d=a.details;
  if(d.region==='CHT'&&['khas','mutation','partition','consolidation',...(a.workflowVersion===2?['inheritance']:[])].includes(a.serviceId))fail(400,'Use the separate CHT request for regional review; plains workflows are not automatically applicable.');
  for(const key of ['applicant','authority','division','district','upazila',...(a.workflowVersion===2?s.procedure.landFields:s.requiresLand?['mouza','khatian','dag','area']:[])])if(complete)text(d[key],key);
  if(complete&&(!geography[d.division]||!geography[d.division].includes(d.district)))fail(400,'Choose a valid division and matching district');
  if(d.region&&!['Plains','CHT'].includes(d.region))fail(400,'Invalid region');
  if(complete&&!['Self','Authorised representative','Organisation representative'].includes(d.authority))fail(400,'Valid authority required');
  if(complete&&db.users.find(u=>u.id===a.ownerId)?.role==='representative')text(d.principal,'Principal/authorisation reference');
  if(d.area!==undefined&&d.area!==''&&(!Number.isFinite(Number(d.area))||Number(d.area)<=0))fail(400,'Area must be a positive number in decimal.');
  if(complete&&!d.eligibility)fail(400,'Confirm the sandbox eligibility and authority checklist.');
  for(const f of s.fields){if(complete&&!(a.workflowVersion===2&&f.key==='address'&&d.delivery!=='Postal demo'))text(d[f.key],f.label);if(d[f.key]&&f.options&&!f.options.includes(d[f.key]))fail(400,'Invalid option for '+f.label);if(d[f.key]&&f.type==='date'&&!validDate(d[f.key]))fail(400,'Invalid date');}
  if(complete&&s.documents.some(category=>!a.documentIds.some(key=>{const doc=db.documents.find(x=>x.id===key);return doc?.ownerId===a.ownerId&&doc.category===category;})))fail(400,'Attach a sample file for every required evidence category.');
  if(complete&&a.serviceId==='appointment'&&(d.visitDate<dhakaDay()||Date.parse(d.visitDate+'T'+d.slot+':00+06:00')<=Date.now()))fail(400,'Appointment slot must be in the future.');
 };
 function reserveAppointment(a){const d=a.details;const used=db.applications.filter(b=>b.id!==a.id&&b.serviceId==='appointment'&&!['Draft','Rejected','Withdrawn','Cancelled'].includes(b.status)&&b.details.office?.trim().toLowerCase()===d.office.trim().toLowerCase()&&b.details.visitDate===d.visitDate&&b.details.slot===d.slot).length;if(used>=4)fail(409,'This local demo slot is full. Choose a different date or time.');}
 function authenticate(req){const cookies=String(req.headers.cookie||'').split(';').map(v=>v.trim());const token=cookies.find(c=>c.startsWith('eb_session='))?.slice(11);const s=sessions.get(token);if(!s||s.expires<Date.now()){if(token)sessions.delete(token);return null;}const u=db.users.find(u=>u.id===s.userId&&u.active);return u?{user:u,session:s,token}:null;}
 async function api(req,res,url){
  const send=(status,body,headers={})=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers});res.end(JSON.stringify(body));};
  try{
   const route=url.pathname.slice(4),method=req.method;let auth=authenticate(req),u=auth?.user;
   const publicRoute=route==='/catalog'||route==='/login'||route==='/register';
   if(!u&&!publicRoute)fail(401,'Please log in.');
   if(!['GET','POST','PATCH'].includes(method))fail(405,'Method not allowed');
   let body={};if(method!=='GET'){
    if(req.headers.origin&&req.headers.origin!==requestOrigin(req))fail(403,'Origin denied');
    if(!String(req.headers['content-type']).startsWith('application/json'))fail(415,'JSON content type required');
    if(!publicRoute&&req.headers['x-csrf-token']!==auth.session.csrf)fail(403,'Invalid CSRF token');
    let raw='',size=0;for await(const chunk of req){size+=chunk.length;if(size>3*1024*1024)fail(413,'Request too large');raw+=chunk;}try{body=JSON.parse(raw||'{}');}catch{fail(400,'Invalid JSON');}if(!body||typeof body!=='object'||Array.isArray(body))fail(400,'JSON object required');
   }
   if(route==='/catalog'&&method==='GET')return send(200,{roles,services,capabilities,mode:'sandbox',deployment:{environment:process.env.VERCEL?'vercel':'local',persistence:process.env.VERCEL?'temporary-instance':'local-disk',sessions:'instance-memory'},version:require('../package.json').version,reviewed:'2026-10-17'});
   if(route==='/register'&&method==='POST'){
    const email=text(body.email,'Email',160).toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))fail(400,'Valid email required');
    const name=text(body.name,'Display name',80),pwd=text(body.password,'Password',128);if(pwd.length<12)fail(400,'Use at least 12 characters');
    if(!['citizen','representative'].includes(body.role))fail(403,'Only citizen or representative self-registration is allowed');
    if(db.users.some(x=>x.email===email))fail(409,'An account already exists');
    const user={id:id('USR'),name,email,role:body.role,active:true,password:password(pwd),created:now()};db.users.push(user);audit(user,'register',user.id);save();return send(201,{user:safeUser(user)});
   }
   if(route==='/login'&&method==='POST'){
    const email=String(body.email||'').toLowerCase().trim(),key=req.socket.remoteAddress+':'+email;let bucket=attempts.get(key);if(!bucket||bucket.until<Date.now())bucket={count:0,until:Date.now()+60000};bucket.count++;attempts.set(key,bucket);if(bucket.count>12)fail(429,'Too many login attempts; wait one minute');
    const found=db.users.find(x=>x.email===email&&x.active);const digest=password(String(body.password||''),found?.password.salt||'dummy').hash;
    if(!found||!crypto.timingSafeEqual(Buffer.from(digest,'hex'),Buffer.from(found.password.hash,'hex')))fail(401,'Invalid credentials');
    if(auth)sessions.delete(auth.token);const token=crypto.randomBytes(32).toString('hex'),csrf=crypto.randomBytes(24).toString('hex');sessions.set(token,{userId:found.id,csrf,expires:Date.now()+8*3600000});audit(found,'login',found.id);save();return send(200,{user:safeUser(found),csrf},{'Set-Cookie':`eb_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${process.env.VERCEL?'; Secure':''}`});
   }
   if(route==='/logout'&&method==='POST'){sessions.delete(auth.token);return send(200,{ok:true},{'Set-Cookie':'eb_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'});}
   if(handleDeskReferral({db,user:u,body,method,route,send,save,audit,notify,fail,app,canReview,view,now}))return;
   if(handleLawLibrary({db,user:u,body,method,route,send,save,audit,fail}))return;
   if(handleLegacyCases({db,user:u,body,method,route,send,save,audit,notify,fail,id,now,validDate}))return;
   if(handleProcedureRequest({db,user:u,body,method,route,send,save,audit,notify,app,view,service,validate,canReview,fail,id,now,history,reserveAppointment}))return;
   if(handleLandDossiers({db,user:u,body,method,route,url,send,save,audit,notify,canRead,canReview,fail,id,now,validDate,services}))return;
   if(route==='/me'&&method==='GET')return send(200,{user:safeUser(u),csrf:auth.session.csrf,capabilities:capabilities[u.role],settings:db.settings});
   if(route==='/preferences'&&method==='GET')return send(200,{preferences:{language:'bn',...(db.preferences?.[u.id]||{})}});
   if(route==='/preferences'&&method==='PATCH'){
    const plain=v=>v&&typeof v==='object'&&!Array.isArray(v);
    if(body.chat!==undefined&&(!Array.isArray(body.chat)||body.chat.some(m=>!plain(m)||!['user','assistant'].includes(m.role)||typeof m.text!=='string'||m.text.length>6000||(m.serviceId!==undefined&&m.serviceId!==null&&!services.some(s=>s.id===m.serviceId)))))fail(400,'Invalid conversation entries');
    if(body.savedSearches!==undefined&&(!Array.isArray(body.savedSearches)||body.savedSearches.some(s=>!plain(s)||typeof s.query!=='string'||s.query.length>500||typeof s.survey!=='string')))fail(400,'Invalid saved searches');
    if(body.favorites!==undefined&&(!Array.isArray(body.favorites)||body.favorites.some(s=>typeof s!=='string'||s.length>200)))fail(400,'Invalid favorite routes');
    if(body.watches!==undefined&&(!Array.isArray(body.watches)||body.watches.some(s=>typeof s!=='string'||s.length>150)))fail(400,'Invalid watch references');
    if(body.shares!==undefined&&(!Array.isArray(body.shares)||body.shares.some(s=>!plain(s)||typeof s.reference!=='string'||typeof s.recipient!=='string'||typeof s.access!=='string')))fail(400,'Invalid sharing drafts');
    if(body.language!==undefined&&!['en','bn'].includes(body.language))fail(400,'Invalid language');
    if(body.checks!==undefined&&(!plain(body.checks)||Object.values(body.checks).some(v=>typeof v!=='boolean')))fail(400,'Checklist values must be booleans');
    if(body.notes!==undefined&&(!plain(body.notes)||Object.values(body.notes).some(v=>typeof v!=='string'||v.length>4000)))fail(400,'Invalid page notes');
    if(body.notificationSettings!==undefined&&(!plain(body.notificationSettings)||Object.values(body.notificationSettings).some(v=>typeof v!=='boolean')))fail(400,'Invalid notification settings');
for(const key of ['chat','savedSearches','watches','shares','favorites'])if(body[key]!==undefined&&(!Array.isArray(body[key])||body[key].length>100))fail(400,'Invalid preference list');for(const key of ['checks','notes','notificationSettings'])if(body[key]!==undefined&&(!body[key]||typeof body[key]!=='object'||Array.isArray(body[key])))fail(400,'Invalid preference object');if(JSON.stringify(body).length>100000)fail(400,'Preference payload too large');db.preferences=db.preferences||{};const allowed=['chat','checks','savedSearches','watches','shares','favorites','notes','language','notificationSettings'];db.preferences[u.id]={...(db.preferences[u.id]||{}),...Object.fromEntries(Object.entries(body).filter(([k])=>allowed.includes(k)))};save();return send(200,{preferences:db.preferences[u.id]});}
   if(route==='/profile'&&method==='PATCH'){const name=text(body.name,'Display name',80);let nextPassword;if(body.password){if(typeof body.password!=='string'||body.password.length<12||body.password.length>128)fail(400,'Password must be 12–128 characters');const check=password(String(body.currentPassword||''),u.password.salt);if(check.hash!==u.password.hash)fail(403,'Current password is incorrect');nextPassword=password(body.password);}u.name=name;if(nextPassword){u.password=nextPassword;for(const [key,s]of sessions)if(s.userId===u.id&&key!==auth.token)sessions.delete(key);}audit(u,'update-profile',u.id);save();return send(200,{user:safeUser(u)});}
   if(route==='/applications'&&method==='GET')return send(200,{applications:db.applications.filter(a=>canRead(u,a)).map(view)});
   if(route==='/applications'&&method==='POST'){
    if(!canCreate(u))fail(403,'Your role cannot create citizen applications');if(!db.settings.acceptApplications)fail(409,'New applications are temporarily paused');
    const s=service(body.serviceId),a={workflowVersion:newWorkflowVersion,...(newWorkflowVersion===2?{procedureData:emptyProcedure(),...(deskRouting?{deskWorkflow:createDeskWorkflow(s.id)}:{})}:{}),id:id('EB'),ownerId:u.id,serviceId:s.id,status:'Draft',details:{},documentIds:[],assignedTo:null,history:[],created:now(),updated:now(),revision:1};db.applications.push(a);history(a,u,'created','Draft started');audit(u,'create-draft',a.id);save();return send(201,{application:view(a)});
   }
   if(route==='/appointment-slots'&&method==='GET'){
    const day=url.searchParams.get('date'),office=text(url.searchParams.get('office'),'Office',200);if(!validDate(day)||day<dhakaDay())fail(400,'Choose a current or future date');
    return send(200,{slots:service('appointment').fields.find(f=>f.key==='slot').options.map(slot=>({slot,available:Date.parse(day+'T'+slot+':00+06:00')>Date.now()&&db.applications.filter(a=>a.serviceId==='appointment'&&!['Draft','Rejected','Withdrawn','Cancelled'].includes(a.status)&&a.details.office?.trim().toLowerCase()===office.toLowerCase()&&a.details.visitDate===day&&a.details.slot===slot).length<4})),mode:'Local sandbox capacity: four requests per office slot; no government inventory.'});
   }
   const appointmentMatch=route.match(/^\/applications\/([^/]+)\/appointment$/);
   if(appointmentMatch&&method==='POST'){
    const a=app(u,appointmentMatch[1]);if(a.ownerId!==u.id)fail(403,'Only the appointment owner can change this booking');if(a.serviceId!=='appointment')fail(400,'This is not an appointment');if(body.revision!==a.revision)fail(409,'Appointment changed; reload before acting');
    if(['Cancelled','Rejected','Withdrawn','Draft'].includes(a.status))fail(409,'This appointment cannot be changed from its current state');
    const reason=text(body.note,'Reason');
    if(body.action==='cancel'){a.status='Cancelled';delete a.outcome;delete a.hearingAt;history(a,u,'appointment-cancel',reason);}
    else if(body.action==='reschedule'){
     const candidate={...a,details:{...a.details,visitDate:body.visitDate,slot:body.slot}};validate(candidate,true);reserveAppointment(candidate);a.details=candidate.details;if(a.workflowVersion===2)a.procedureData.reviewTasks={};a.status='Submitted';a.assignedTo=null;delete a.outcome;delete a.hearingAt;history(a,u,'appointment-reschedule',reason+'; previous token invalidated; support must confirm again.');
    }else fail(400,'Unknown appointment action');
    a.revision++;a.updated=now();notify(u.id,'Appointment '+body.action,a.id);audit(u,'appointment-'+body.action,a.id);save();return send(200,{application:view(a)});
   }
   const match=route.match(/^\/applications\/([^/]+)(?:\/(action|outcome|export))?$/);
   if(match){const a=app(u,match[1]),s=service(a.serviceId);
    if(method==='GET'){
     if(match[2]==='outcome'){if(a.status!=='Completed')fail(409,'Outcome is not available');return send(200,{outcome:a.outcome,application:view(a)});}
     return send(200,{application:view(a)});
    }
    if(method==='PATCH'&&!match[2]){
     if(a.ownerId!==u.id||!['Draft','CorrectionRequested'].includes(a.status))fail(403,'Only the owner can edit a draft or returned application');
     if(body.revision!==a.revision)fail(409,'This application changed; reload before saving');
     const details=body.details;if(!details||typeof details!=='object'||Array.isArray(details))fail(400,'Details object required');
     const allowed=['applicant','authority','principal','division','district','upazila','mouza','jl','khatian','dag','area','region','eligibility',...s.fields.map(f=>f.key)];
     const candidate={...a,details:Object.fromEntries(allowed.filter(k=>details[k]!==undefined).map(k=>[k,k==='eligibility'?details[k]===true:String(details[k]).slice(0,4000)])),documentIds:Array.isArray(body.documentIds)?[...new Set(body.documentIds)]:a.documentIds};
     if(candidate.documentIds.length>30)fail(400,'Maximum 30 evidence references per request');
     if(candidate.documentIds.some(key=>!db.documents.some(d=>d.id===key&&d.ownerId===u.id)))fail(403,'Evidence must belong to this account');validate(candidate);a.details=candidate.details;a.documentIds=candidate.documentIds;a.revision++;a.updated=now();history(a,u,'draft-saved','Preparation updated');audit(u,'save-draft',a.id);save();return send(200,{application:view(a)});
    }
    if(method==='POST'&&match[2]==='action'){
     if(body.revision!==a.revision)fail(409,'This application changed; reload before acting');const action=body.action;let note=String(body.note||'').trim().slice(0,4000);
     if(['submit','withdraw'].includes(action)){
      if(a.ownerId!==u.id)fail(403,'Only the application owner can do this');
      if(action==='submit'){if(!['Draft','CorrectionRequested'].includes(a.status))fail(409,'Cannot submit from current state');validate(a,true);if(a.serviceId==='appointment')reserveAppointment(a);a.status='Submitted';a.assignedTo=null;notify(u.id,'Application submitted to sandbox queue',a.id);}
      else{if(!['Draft','Submitted','CorrectionRequested'].includes(a.status))fail(409,'Cannot withdraw at this stage');a.status='Withdrawn';}
     }else{
      if(!canReview(u,a))fail(403,'This service belongs to another role queue');if(a.assignedTo&&a.assignedTo!==u.id)fail(403,'Assigned to another reviewer');
      if(action==='claim'){if(a.status!=='Submitted'&&!(a.status==='ReadyForDelivery'&&!a.assignedTo))fail(409,'Only submitted or unassigned ready work can be claimed');a.assignedTo=u.id;if(a.status==='Submitted')a.status='UnderReview';}
      else{if(!a.assignedTo||a.assignedTo!==u.id)fail(403,'Claim the application first');text(note,'Reason / review note');
       if(action==='correction'){if(!['UnderReview','HearingScheduled'].includes(a.status))fail(409,'Cannot return for correction');a.status='CorrectionRequested';}
       else if(action==='hearing'){if(a.status!=='UnderReview')fail(409,'Cannot schedule hearing');text(body.hearingAt,'Hearing date');if(!Number.isFinite(Date.parse(body.hearingAt))||Date.parse(body.hearingAt)<Date.now())fail(400,'Choose a future hearing date/time');a.hearingAt=body.hearingAt;a.status='HearingScheduled';}
       else if(action==='approve'){if(!['UnderReview','HearingScheduled'].includes(a.status))fail(409,'Cannot approve from current state');a.status=s.sandboxFee?'AwaitingPayment':'ReadyForDelivery';}
       else if(action==='reject'){if(!['UnderReview','HearingScheduled'].includes(a.status))fail(409,'Cannot reject from current state');a.status='Rejected';}
       else if(action==='issue'){if(a.status!=='ReadyForDelivery')fail(409,'Payment/approval is incomplete');a.status='Completed';const outcome={id:id('OUT'),applicationId:a.id,title:s.outcome,issuedAt:now(),issuedBy:u.id,note,watermark:'DEMO / NOT OFFICIAL / NO LEGAL EFFECT',details:a.details,documents:a.documentIds};outcome.sha256=hash(JSON.stringify(outcome));a.outcome=outcome;}
       else fail(400,'Unknown transition');
      }notify(a.ownerId,service(a.serviceId).name+' · '+a.status,a.id);
     }a.updated=now();a.revision++;history(a,u,action,note);audit(u,'application-'+action,a.id,{status:a.status});save();return send(200,{application:view(a)});
    }fail(405,'Unsupported application action');
   }
   if(route==='/documents/verify'&&method==='POST'){const documents=db.documents.filter(d=>d.ownerId===u.id);const results=documents.map(d=>({id:d.id,name:d.name,valid:hash(Buffer.from(d.content,'base64'))===d.sha256}));audit(u,'verify-local-integrity',u.id,{count:results.length,valid:results.filter(r=>r.valid).length});save();return send(200,{results,boundary:'Local file integrity only, not official authenticity verification.'});}
   if(route==='/documents'&&method==='GET')return send(200,{documents:db.documents.filter(d=>d.ownerId===u.id).map(({content,...d})=>d)});
   if(route==='/documents'&&method==='POST'){
    if(!canCreate(u))fail(403,'Only applicants can upload sample evidence');const name=text(body.name,'Filename',120),category=text(body.category,'Evidence category',160);if(!/\.(txt|pdf|png|jpe?g)$/i.test(name))fail(400,'Use sample TXT, PDF, PNG or JPEG');
    if(typeof body.content!=='string'||!/^[A-Za-z0-9+/]*={0,2}$/.test(body.content))fail(400,'Invalid base64 file');const bytes=Buffer.from(body.content,'base64');if(!bytes.length||bytes.length>2*1024*1024)fail(400,'File must be 1 byte to 2 MiB');
    const ext=path.extname(name).toLowerCase();if(ext==='.pdf'&&!bytes.subarray(0,5).equals(Buffer.from('%PDF-')))fail(400,'Invalid PDF signature');if(ext==='.png'&&bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')fail(400,'Invalid PNG');if(['.jpg','.jpeg'].includes(ext)&&bytes.subarray(0,3).toString('hex')!=='ffd8ff')fail(400,'Invalid JPEG');
    const d={id:id('DOC'),ownerId:u.id,name,category,content:body.content,size:bytes.length,sha256:hash(bytes),created:now()};db.documents.push(d);audit(u,'upload-sample',d.id,{size:d.size});save();const {content,...metadata}=d;return send(201,{document:metadata});
   }
   const dm=route.match(/^\/documents\/([^/]+)$/);if(dm&&method==='GET'){
    const d=db.documents.find(d=>d.id===dm[1]);if(!d||!(d.ownerId===u.id||(db.legacyCases||[]).some(a=>canReadLegacy(u,a)&&(a.details.documentIds||[]).includes(d.id))||db.applications.some(a=>a.documentIds.includes(d.id)&&canRead(u,a))||(db.landDossiers||[]).some(l=>l.linkedApplicationIds.some(key=>db.applications.some(a=>a.id===key&&canRead(u,a)))&&[...l.owners,...l.facts,...l.timeline].some(item=>item.documentIds.includes(d.id)))))fail(404,'Document not found');audit(u,'download-evidence',d.id);save();return send(200,{document:d});
   }
   if(route==='/payments'&&method==='GET')return send(200,{payments:db.payments.filter(p=>p.ownerId===u.id||['finance','auditor'].includes(u.role))});
   if(route==='/payments'&&method==='POST'){
    const a=app(u,body.applicationId);if(a.ownerId!==u.id)fail(403,'Only the owner can simulate payment');const previous=db.payments.find(p=>p.applicationId===a.id&&p.status==='Successful');if(previous)return send(200,{payment:previous,application:view(a)});
    if(!['AwaitingPayment','PaymentFailed'].includes(a.status))fail(409,'No payable sandbox demand');if(!['success','fail'].includes(body.result))fail(400,'Choose sandbox success or failure');
    const p={id:id('PAY'),applicationId:a.id,ownerId:u.id,amount:service(a.serviceId).sandboxFee,currency:'SANDBOX_BDT',status:body.result==='success'?'Successful':'Failed',at:now(),reconciled:false,receipt:id('DEMO-RECEIPT')};db.payments.push(p);a.status=body.result==='success'?'ReadyForDelivery':'PaymentFailed';a.revision++;a.updated=now();history(a,u,'sandbox-payment',p.status);audit(u,'sandbox-payment',a.id,{payment:p.id,status:p.status});notify(u.id,'Sandbox payment '+p.status,a.id);save();return send(201,{payment:p,application:view(a)});
   }
   const pm=route.match(/^\/payments\/([^/]+)\/reconcile$/);if(pm&&method==='POST'){if(u.role!=='finance')fail(403,'Finance role required');const p=db.payments.find(p=>p.id===pm[1]);if(!p)fail(404,'Payment not found');if(p.status!=='Successful')fail(409,'Only successful payments can be reconciled');p.reconciled=true;p.reconciledAt=now();p.reconciledBy=u.id;audit(u,'reconcile',p.id);save();return send(200,{payment:p});}
   if(route==='/notifications'&&method==='GET')return send(200,{notifications:db.notifications.filter(n=>n.userId===u.id)});
   if(route==='/notifications/read'&&method==='POST'){db.notifications.filter(n=>n.userId===u.id).forEach(n=>n.read=true);save();return send(200,{ok:true});}
   if(route==='/audit'&&method==='GET'){
    if(!['admin','auditor'].includes(u.role))fail(403,'Audit permission required');let previous='GENESIS',valid=true;for(const row of db.audit){const {hash:digest,...payload}=row;if(row.previous!==previous||hash(JSON.stringify(payload))!==digest)valid=false;previous=digest;}return send(200,{events:db.audit,chainValid:valid});
   }
   if(route==='/users'&&method==='GET'){if(u.role!=='admin')fail(403,'Admin required');return send(200,{users:db.users.map(safeUser)});}
   if(route==='/users'&&method==='POST'){
    if(u.role!=='admin')fail(403,'Admin required');if(!roles[body.role])fail(400,'Unknown role');const email=text(body.email,'Email',160).toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))fail(400,'Valid email required');if(db.users.some(x=>x.email===email))fail(409,'Account exists');if(typeof body.password!=='string'||body.password.length<12||body.password.length>128)fail(400,'Password must be 12–128 characters');const n={id:id('USR'),name:text(body.name,'Name',80),email,role:body.role,active:true,password:password(body.password),created:now()};db.users.push(n);audit(u,'create-user',n.id,{role:n.role});save();return send(201,{user:safeUser(n)});
   }
   const um=route.match(/^\/users\/([^/]+)$/);if(um&&method==='PATCH'){
    if(u.role!=='admin')fail(403,'Admin required');const n=db.users.find(x=>x.id===um[1]);if(!n)fail(404,'User not found');if(n.id===u.id)fail(409,'Cannot change your own role/access here');if(!roles[body.role]||typeof body.active!=='boolean')fail(400,'Valid role and active flag required');n.role=body.role;n.active=body.active;for(const a of db.applications){if(a.assignedTo===n.id&&(!n.active||currentDesk(a,service(a.serviceId).reviewer)!==n.role)&&['UnderReview','HearingScheduled','ReadyForDelivery'].includes(a.status)){a.assignedTo=null;if(a.status!=='ReadyForDelivery')a.status='Submitted';delete a.hearingAt;a.revision++;a.updated=now();history(a,u,'reviewer-access-changed','Returned to the role queue; previous reviewer access changed');notify(a.ownerId,'Reviewer changed; application returned to role queue',a.id);}}for(const[key,s]of sessions)if(s.userId===n.id)sessions.delete(key);for(const a of db.legacyCases||[]){if(a.assignedTo===n.id&&(!n.active||a.stages[a.index]!==n.role)&&a.status==='UnderReview'){a.assignedTo=null;a.status='Submitted';a.revision++;a.updated=now();a.history.push({at:a.updated,actor:u.id,role:u.role,event:'reviewer-access-changed',note:'Returned to specialist queue'});}}audit(u,'update-user',n.id,{role:n.role,active:n.active});save();return send(200,{user:safeUser(n)});
   }
   if(route==='/settings'&&method==='PATCH'){if(u.role!=='admin')fail(403,'Admin required');if(typeof body.acceptApplications!=='boolean')fail(400,'Boolean acceptApplications required');db.settings={acceptApplications:body.acceptApplications,notice:text(body.notice,'Notice',500)};audit(u,'settings','system');save();return send(200,{settings:db.settings});}
   if(route==='/parcels'&&method==='GET')return send(200,{parcels:Array.from({length:24},(_,i)=>({id:'DAG-'+(1842+i),mouza:['Amin Bazar','Baipayl','Kalighat','Lohagara','Kusumpura','Harian'][i%6],district:['Dhaka','Dhaka','Moulvibazar','Narail','Chattogram','Rajshahi'][i%6],upazila:['Savar','Savar','Sreemangal','Lohagara','Patiya','Paba'][i%6],khatian:String(731+i),survey:['RS','SA','CS','BS/BRS'][i%4],area:i===0?12.5:Number((5+i*1.25).toFixed(2)),source:'DEMO',timeline:[{year:'1940',label:'Sample CS record'},{year:'1962',label:'Sample SA comparison'},{year:'2002',label:'Sample survey reference'},{year:'2026',label:'User preparation snapshot — not official verification'}]}))});
   fail(404,'API route not found');
  }catch(e){send(e.status||500,{error:e.status?e.message:'Server error. Check local server logs.'});if(!e.status)console.error(e);}
 }
 return {api,authenticate,roles,close(){sessions.clear();},dataFile:file};
}
module.exports={createPlatform};
