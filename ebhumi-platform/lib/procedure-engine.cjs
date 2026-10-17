'use strict';
const crypto=require('node:crypto');
const {profiles,sources,RESEARCH_DATE}=require('./procedures.cjs');
const {currentDesk,deskProcedure}=require('./desk-routing.cjs');
const hash=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
const emptyProcedure=()=>({acknowledgements:{},plots:[],records:[],parties:[],heirs:[],reviewTasks:{},messages:[]});
function seedHoldings(db,audit){
 if(db.holdingEdition>=1)return false;db.holdings=db.holdings||[];
 for(const role of ['citizen','representative']){const u=db.users.find(u=>u.email===role+'@demo.ebhumi.local');if(!u)continue;for(let i=0;i<2;i++)db.holdings.push({id:'HOLD-'+role.toUpperCase()+'-'+(i+1),ownerId:u.id,reference:'DEMO-HOLDING-'+(i+1),mouza:i?'Kalighat':'Amin Bazar',khatian:String(731+i),status:'Active local demo',revision:1,created:new Date().toISOString(),demands:[{id:'DEMAND-'+role.toUpperCase()+'-'+(i+1),year:'2026-2027',amount:i?220:150,paid:false,revision:1,basis:'Seeded demonstration demand; not a statutory tax calculation'}],demo:true});}
 db.holdingEdition=1;audit(null,'seed-local-holdings','holding-edition-1');return true;
}
function normalizeData(input,fail){
 if(!input||typeof input!=='object'||Array.isArray(input))fail(400,'Procedure data object required');
 const str=(v,label,max=250,empty=false)=>{if(typeof v!=='string'||v.length>max||(!empty&&!v.trim()))fail(400,label+' is required / invalid');return v.trim();};
 const num=(v,label,zero=false)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<(zero?0:.000001)||v>1e9)fail(400,label+' must be a valid nonnegative number');return v;};
 const list=(name,max,fn)=>{if(!Array.isArray(input[name])||input[name].length>max)fail(400,'Invalid '+name+' list');return input[name].map(v=>{if(!v||typeof v!=='object'||Array.isArray(v))fail(400,'Invalid '+name+' row');return fn(v);});};
 const plots=list('plots',30,p=>{const item={mouza:str(p.mouza,'Plot Mouza'),khatian:str(p.khatian,'Plot Khatian'),dag:str(p.dag,'Plot Dag'),recordedArea:num(p.recordedArea,'Recorded area'),requestedArea:num(p.requestedArea,'Requested area'),landClass:str(p.landClass,'Land class')};if(item.requestedArea>item.recordedArea+.000001)fail(400,'Requested plot area cannot exceed supplied recorded area');return item;});
 const records=list('records',20,r=>({mouza:str(r.mouza,'Record Mouza'),khatian:str(r.khatian,'Record Khatian',250,true),sheet:str(r.sheet,'Map sheet',250,true),survey:str(r.survey,'Survey',80)}));
 const parties=list('parties',30,p=>({name:str(p.name,'Party name'),role:str(p.role,'Party role',80),reference:str(p.reference,'Authority / interest reference')}));
 const heirs=list('heirs',30,p=>({name:str(p.name,'Heir name'),relationship:str(p.relationship,'Heir relationship',80),reference:str(p.reference,'Supporting reference'),proposedPercent:num(p.proposedPercent,'Proposed percent',true)}));if(heirs.some(p=>p.proposedPercent>100)||heirs.reduce((n,p)=>n+p.proposedPercent,0)>100.000001)fail(400,'Proposed interests cannot exceed 100%; no legal inheritance calculation is performed');
 const ack=input.acknowledgements;if(!ack||typeof ack!=='object'||Array.isArray(ack)||Object.values(ack).some(v=>typeof v!=='boolean'))fail(400,'Acknowledgements must be booleans');
 return {plots,records,parties,heirs,acknowledgements:{sourceRead:ack.sourceRead===true,jurisdiction:ack.jurisdiction===true}};
}
function procedurePreflight(a,s,db){
 const p=deskProcedure(a,profiles[s.id]),data=a.procedureData||emptyProcedure(),missing=[];
 if(!data.acknowledgements.sourceRead)missing.push('Read the service procedure and source limitations');if(!data.acknowledgements.jurisdiction)missing.push('Confirm the proposed jurisdiction / authority context');
 for(const key of p.structured){if(key==='sheets'){if(!data.records.length||data.records.some(r=>!r.sheet))missing.push('Add at least one Mouza map / sheet request');}else if(key==='records'){if(!data.records.length||data.records.some(r=>!r.khatian))missing.push('Add at least one survey / Khatian record request');}else if(!data[key]?.length)missing.push('Add the required '+key+' schedule');}
 if(p.structured.includes('plots')&&data.plots.length){if(data.plots.some(r=>r.mouza!==a.details.mouza))missing.push('Keep requested plots within the supplied Mouza context');const total=data.plots.reduce((n,r)=>n+r.requestedArea,0);if(a.details.area&&Math.abs(total-Number(a.details.area))>.000001)missing.push('Main requested area must equal the structured plot total');}
 if(p.delivery&&a.details.delivery==='Postal demo'&&!String(a.details.address||'').trim())missing.push('Postal delivery needs a sample delivery address');
 if(p.autoTax){const h=(db.holdings||[]).find(h=>h.ownerId===a.ownerId&&(h.id===a.details.holding||h.reference===a.details.holding));if(!h)missing.push('Choose your active local holding, or complete holding registration first');else if(!h.demands.some(d=>!d.paid&&d.year===a.details.year&&d.amount>0))missing.push('No unpaid local demand matches this holding and tax year');}
 return missing;
}
function handleProcedureRequest(ctx){
 const {db,user:u,body,method,route,send,save,audit,notify,app,view,service,validate,canReview,fail,id,now,history,reserveAppointment}=ctx;
 db.holdings=db.holdings||[];
 if(route==='/procedures'&&method==='GET'){send(200,{researchDate:RESEARCH_DATE,profiles,sources,scope:'Researched local workflow mappings. Official identity, payment, registration and issuing systems are not connected.'});return true;}
 if(route==='/holdings'&&method==='GET'){
  if(!['citizen','representative','finance','admin','auditor'].includes(u.role))fail(403,'Holding workspace is not available for this role');send(200,{holdings:db.holdings.filter(h=>h.ownerId===u.id||['finance','admin','auditor'].includes(u.role))});return true;
 }
 const hm=route.match(/^\/holdings\/([^/]+)\/demand$/);
 if(hm&&method==='POST'){
  if(u.role!=='finance')fail(403,'Finance role required');const h=db.holdings.find(h=>h.id===hm[1]);if(!h)fail(404,'Holding not found');if(body.revision!==h.revision)fail(409,'Holding changed; reload');if(typeof body.year!=='string'||!body.year.trim()||body.year.length>40||typeof body.amount!=='number'||!Number.isFinite(body.amount)||body.amount<=0||body.amount>1e9||typeof body.note!=='string'||!body.note.trim()||body.note.length>2000)fail(400,'Valid year, positive local demand and reason required');
  const old=h.demands.find(d=>d.year===body.year);if(old?.paid)fail(409,'A paid demand cannot be overwritten; use a separate correction request');const demand={id:old?.id||id('DEMAND'),year:body.year,amount:body.amount,paid:false,revision:(old?.revision||0)+1,basis:body.note,by:u.id,at:now()};h.demands=old?h.demands.map(d=>d.id===old.id?demand:d):[...h.demands,demand];h.revision++;audit(u,'local-tax-demand',h.id,{year:demand.year,amount:demand.amount});notify(h.ownerId,'Local holding demand updated',null);save();send(200,{holding:h});return true;
 }
 const match=route.match(/^\/applications\/([^/]+)(?:\/(procedure|preflight|review-task|payment-quote|message|verify-outcome|action))?$/);
 let a;if(match){a=app(u,match[1]);if(a.workflowVersion!==2)return false;}else if(route==='/payments'&&method==='POST'){a=app(u,body.applicationId);if(a.workflowVersion!==2)return false;}else return false;
 const s=service(a.serviceId),p=deskProcedure(a,profiles[s.id]),data=a.procedureData||(a.procedureData=emptyProcedure());
 const notifyDesk=()=>{const role=currentDesk(a,s.reviewer);for(const person of db.users.filter(person=>person.active&&person.role===role))notify(person.id,'নতুন কাজ / New task: '+s.name,a.id);};
 const owner=()=>{if(a.ownerId!==u.id)fail(403,'Only the application owner can do this');};
 const revision=()=>{if(body.revision!==a.revision)fail(409,'Application changed; reload before acting');};
 const assigned=()=>{if(!canReview(u,a)||a.assignedTo!==u.id)fail(403,'Assigned service reviewer required');};
 const commit=(event,note)=>{a.revision++;a.updated=now();history(a,u,event,note);audit(u,'procedure-'+event,a.id,{status:a.status});save();return view(a);};
 const note=()=>{if(typeof body.note!=='string'||!body.note.trim()||body.note.length>4000)fail(400,'A reasoned note is required');return body.note.trim();};
 const getDemand=()=>{const h=db.holdings.find(h=>h.ownerId===a.ownerId&&(h.id===a.details.holding||h.reference===a.details.holding));const demand=h?.demands.find(d=>d.year===a.details.year&&!d.paid&&d.amount>0);if(!demand)fail(409,'No current unpaid local holding demand; review the holding or file an objection');return {h,demand};};
 const quote=phase=>{
  const expected=['AwaitingApplicationPayment','ApplicationPaymentFailed'].includes(a.status)?'filing':['AwaitingPayment','PaymentFailed'].includes(a.status)?'decision':null;if(!expected||phase&&phase!==expected)fail(409,'No payable demand for this phase');
  let amount=expected==='filing'?p.filingFee:p.decisionFee,holding;
  if(p.autoTax){const result=getDemand();amount=result.demand.amount;holding={id:result.h.id,demandId:result.demand.id,revision:result.demand.revision,year:result.demand.year};}
  const value={applicationId:a.id,phase:expected,amount,currency:'SANDBOX_BDT',applicationRevision:a.revision,...(holding?{holding}:{}),label:expected==='filing'?(p.family==='mutation'?'Application / notice simulation':'Record request checkout simulation'):p.autoTax?'Local holding demand':p.family==='mutation'?'Post-decision DCR simulation':'Local service demand',mode:'No real money / not a live official fee quote'};return {...value,digest:hash(value)};
 };
 const issue=(actor,n)=>{
  if(s.id==='holding'&&db.holdings.some(h=>h.ownerId===a.ownerId&&h.reference===a.details.holding))fail(409,'This holding reference already exists; use the existing holding workspace');
  const output={id:id('OUT'),applicationId:a.id,title:s.outcome,issuedAt:now(),issuedBy:actor,note:n,watermark:'DEMO / NOT OFFICIAL / NO LEGAL EFFECT',details:structuredClone(a.details),documents:[...a.documentIds],procedureVersion:2,artifacts:p.outputs.map((title,i)=>({id:id('ART'),title,index:i+1,landSchedule:structuredClone(data.plots),recordRequests:structuredClone(data.records),parties:structuredClone(data.parties),heirs:structuredClone(data.heirs),payments:db.payments.filter(pay=>pay.applicationId===a.id&&pay.status==='Successful').map(({id,amount,phase,receipt})=>({id,amount,phase,receipt}))}))};output.sha256=hash(output);a.outcome=output;
  if(s.id==='holding')db.holdings.push({id:id('HOLD'),ownerId:a.ownerId,reference:a.details.holding,mouza:a.details.mouza,khatian:a.details.khatian,status:'Active local demo',revision:1,created:now(),applicationId:a.id,demands:[]});
 };
 if(match?.[2]==='preflight'&&method==='GET'){
  const missing=procedurePreflight(a,s,db);try{validate(a,true);}catch(e){missing.unshift(e.message);}send(200,{ready:missing.length===0,missing:[...new Set(missing)],procedure:p,scope:'Local completeness checks only'});return true;
 }
 if(match?.[2]==='procedure'&&method==='PATCH'){
  owner();revision();if(!['Draft','CorrectionRequested'].includes(a.status))fail(409,'Only an editable draft / correction can change schedules');const normalized=normalizeData(body.data,fail);a.procedureData={...data,...normalized,reviewTasks:{}};send(200,{application:commit('schedules-saved','Structured preparation schedules updated')});return true;
 }
 if(match?.[2]==='review-task'&&method==='POST'){
  assigned();revision();if(!['UnderReview','HearingScheduled','ReadyForDelivery'].includes(a.status))fail(409,'No active review task at this stage');if(!p.reviewTasks.some(t=>t.id===body.taskId)||!['done','needs-correction'].includes(body.result))fail(400,'Invalid review task / result');const reason=note();data.reviewTasks={...data.reviewTasks,[body.taskId]:{result:body.result,note:reason,by:u.id,role:u.role,at:now()}};send(200,{application:commit('review-task',body.taskId+': '+reason)});return true;
 }
 if(match?.[2]==='message'&&method==='POST'){
  revision();if(a.ownerId!==u.id&&!canReview(u,a))fail(403,'Case participant required');const reason=note();if(['Completed','Rejected','Withdrawn','Cancelled'].includes(a.status))fail(409,'Closed cases cannot receive new clarification');data.messages=[...data.messages,{id:id('MSG'),text:reason,by:u.id,role:u.role,at:now()}].slice(-100);notify(a.ownerId,'Application clarification recorded',a.id);send(200,{application:commit('clarification',reason)});return true;
 }
 if(match?.[2]==='payment-quote'&&method==='GET'){owner();send(200,{quote:quote()});return true;}
 if(match?.[2]==='verify-outcome'&&method==='GET'){
  if(!a.outcome)fail(409,'No local outcome issued');const {sha256,...payload}=a.outcome;send(200,{valid:hash(payload)===sha256,reference:a.id,sha256,scope:'Local payload integrity only; not official document verification'});return true;
 }
 if(route==='/payments'&&method==='POST'){
  owner();if(!['filing','decision'].includes(body.phase)||!['success','fail'].includes(body.result))fail(400,'Choose a valid payment phase and simulation result');const previous=db.payments.find(pay=>pay.applicationId===a.id&&pay.phase===body.phase&&pay.status==='Successful');if(previous){send(200,{payment:previous,application:view(a)});return true;}
  const q=quote(body.phase);if(body.quoteDigest!==q.digest)fail(409,'Payment quote changed; reopen checkout');
  const payment={id:id('PAY'),applicationId:a.id,ownerId:a.ownerId,phase:q.phase,amount:q.amount,currency:q.currency,status:body.result==='success'?'Successful':'Failed',receipt:id('DEMO-RECEIPT'),at:now(),reconciled:false};
  const demand=p.autoTax?getDemand():null;db.payments.push(payment);
  if(body.result==='fail')a.status=q.phase==='filing'?'ApplicationPaymentFailed':'PaymentFailed';else if(q.phase==='filing'){a.status='Submitted';a.submittedAt=now();notifyDesk();}else{a.status='ReadyForDelivery';if(p.autoTax){data.reviewTasks=Object.fromEntries(p.reviewTasks.map(t=>[t.id,{result:'done',note:'Server checked owned holding, unpaid demand and successful local payment; not an official verification',by:'local-holding-ledger',role:'system',at:now()}]));demand.demand.paid=true;demand.demand.paymentId=payment.id;demand.demand.revision++;demand.h.revision++;issue('local-holding-ledger','Dakhila generated from the successful local holding payment');a.status='Completed';}}
  notify(a.ownerId,'Sandbox '+q.phase+' payment '+payment.status,a.id);send(201,{payment,application:commit('payment-'+q.phase,payment.status+'; no real money')});return true;
 }
 if(match?.[2]==='action'&&method==='POST'){
  revision();const action=body.action;
  if(action==='submit'){
   owner();if(!['Draft','CorrectionRequested'].includes(a.status))fail(409,'Cannot submit from this stage');validate(a,true);const missing=procedurePreflight(a,s,db);if(missing.length)fail(400,missing.join('; '));if(s.id==='appointment')reserveAppointment(a);data.reviewTasks={};a.assignedTo=null;
   const filingPaid=db.payments.some(pay=>pay.applicationId===a.id&&pay.phase==='filing'&&pay.status==='Successful');a.status=p.filingFee&&!filingPaid?'AwaitingApplicationPayment':p.autoTax?'AwaitingPayment':'Submitted';if(a.status==='Submitted'){a.submittedAt=now();notifyDesk();}notify(a.ownerId,'Application: '+a.status,a.id);
  }else if(action==='withdraw'){
   owner();if(!['Draft','Submitted','CorrectionRequested','AwaitingApplicationPayment','ApplicationPaymentFailed'].includes(a.status))fail(409,'Cannot withdraw from this stage');a.status='Withdrawn';
  }else if(action==='acknowledge-delivery'){
   owner();if(!['DeliveryInTransit','ReadyForCollection'].includes(a.status))fail(409,'No delivery ready for acknowledgement');a.delivery={...a.delivery,acknowledgedAt:now(),acknowledgedBy:u.id};a.status='Completed';
  }else if(action==='claim'){
   if(!canReview(u,a))fail(403,'This service belongs to another desk');if(a.assignedTo&&a.assignedTo!==u.id)fail(403,'Assigned to another reviewer');if(!['Submitted','ReadyForDelivery'].includes(a.status))fail(409,'No claimable work');a.assignedTo=u.id;if(a.status==='Submitted')a.status='UnderReview';
  }else{
   assigned();const reason=note();
   if(action==='forward'){
    if(!a.deskWorkflow||a.deskWorkflow.index>=a.deskWorkflow.stages.length-1)fail(409,'No next desk');if(!['UnderReview','HearingScheduled'].includes(a.status))fail(409,'Active review required');if(p.reviewTasks.some(t=>data.reviewTasks[t.id]?.result!=='done'))fail(409,'Complete desk review checks before forwarding');
    a.deskWorkflow.completed.push({index:a.deskWorkflow.index,role:currentDesk(a,s.reviewer),by:u.id,at:now(),note:reason,checks:structuredClone(data.reviewTasks)});a.deskWorkflow.index++;a.status='Submitted';a.assignedTo=null;data.reviewTasks={};delete a.hearingAt;notifyDesk();
   }else if(action==='correction'){if(!['UnderReview','HearingScheduled'].includes(a.status))fail(409,'Not under active review');a.status='CorrectionRequested';}
   else if(action==='hearing'){if(a.deskWorkflow&&a.deskWorkflow.index<a.deskWorkflow.stages.length-1)fail(403,'Final decision desk required to schedule a hearing');if(a.status!=='UnderReview')fail(409,'Not under active review');if(typeof body.hearingAt!=='string'||!Number.isFinite(Date.parse(body.hearingAt))||Date.parse(body.hearingAt)<Date.now())fail(400,'Choose a future hearing time');a.hearingAt=body.hearingAt;a.status='HearingScheduled';}
   else if(action==='reject'){if(a.deskWorkflow&&a.deskWorkflow.index<a.deskWorkflow.stages.length-1)fail(403,'Only the final desk may reject; record a finding and forward or request correction');if(!['UnderReview','HearingScheduled'].includes(a.status))fail(409,'Not under active review');a.status='Rejected';}
   else if(action==='approve'){
    if(a.deskWorkflow&&a.deskWorkflow.index<a.deskWorkflow.stages.length-1)fail(409,'Only the final desk may decide; forward after checks');if(!['UnderReview','HearingScheduled'].includes(a.status))fail(409,'Not under active review');const incomplete=p.reviewTasks.filter(t=>data.reviewTasks[t.id]?.result!=='done');if(incomplete.length)fail(409,'Complete the service review checks: '+incomplete.map(t=>t.label).join('; '));a.status=p.decisionFee?'AwaitingPayment':'ReadyForDelivery';
   }else if(action==='issue'){
    if(a.status!=='ReadyForDelivery')fail(409,'Approval/payment is incomplete');if(p.reviewTasks.some(t=>data.reviewTasks[t.id]?.result!=='done'))fail(409,'Service review checks are incomplete');
    const delivery=p.delivery?a.details.delivery:'Digital demo';if(delivery!=='Digital demo'&&(typeof body.deliveryReference!=='string'||!body.deliveryReference.trim()||body.deliveryReference.length>200))fail(400,'Enter a local dispatch / collection reference');issue(u.id,reason);a.status=delivery==='Postal demo'?'DeliveryInTransit':delivery==='Office collection demo'?'ReadyForCollection':'Completed';if(a.status!=='Completed')a.delivery={channel:delivery,reference:body.deliveryReference,preparedAt:now(),scope:'Local fulfilment simulation; no courier or office contacted'};
   }else fail(400,'Unknown workflow transition');notify(a.ownerId,s.name+' · '+a.status,a.id);
  }
  send(200,{application:commit(action,typeof body.note==='string'?body.note:'Local procedure action')});return true;
 }
 return false;
}
module.exports={emptyProcedure,seedHoldings,normalizeData,procedurePreflight,handleProcedureRequest};
