'use strict';
const crypto=require('node:crypto');
const {routes}=require('./desk-routing.cjs');
const {profiles}=require('./procedures.cjs');
const hash=v=>crypto.createHash('sha256').update(JSON.stringify(v)).digest('hex');
function seedDemoFlows(db,services,audit){
 if(db.roleDemoEdition>=1)return false;
 const owners=['citizen','representative'].map(role=>db.users.find(u=>u.email===role+'@demo.ebhumi.local'));
 if(owners.some(u=>!u))return false;
 const at='2026-10-18T03:00:00.000Z',roleLabels=require('./catalog.cjs').roles;let added=0;
 const add=(s,si,index,{complete=false,consultation}={})=>{
  const key='DEMO-FLOW-'+s.id.toUpperCase()+'-'+(consultation|| (complete?'DONE':index+1));
  if(db.applications.some(a=>a.id===key))return;
  const owner=owners[si%2];
  // Generate sample-only content independently; never copy an edited request or uploaded evidence.
  const details={eligibility:true,authority:owner.role==='representative'?'Authorised representative':'Self',principal:'DEMO authorisation only',applicant:'নমুনা আবেদনকারী / DEMO '+owner.role,division:'Dhaka',district:'Dhaka',upazila:'Savar',mouza:'Amin Bazar',khatian:'731',dag:'1842',area:'12.5',region:'Plains'};
  for(const field of s.fields)details[field.key]=field.options?.[0]||(field.type==='date'?'2026-01-15':'DEMO '+field.key+' reference');
  const documentIds=s.documents.map((category,i)=>{const id='DEMO-FLOW-DOC-'+owner.role+'-'+s.id+'-'+i;
   if(!db.documents.some(d=>d.id===id)){const bytes=Buffer.from('DEMO SAMPLE ONLY\n'+s.id+'\n'+category+'\nNo real person, land document or official verification.');db.documents.push({id,ownerId:owner.id,name:s.id+'-workflow-example-'+i+'.txt',category,content:bytes.toString('base64'),size:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),created:at,demo:true});}return id;});
  if(s.id==='cht')Object.assign(details,{division:'Chattogram',district:'Rangamati',upazila:'Kaptai',mouza:'DEMO CHT Mouza',region:'CHT'});
  if('delivery'in details)details.delivery='Digital demo';
  if(s.id==='holding')details.holding=key+'-HOLDING';
  if(s.id==='land-tax'){
   details.holding=key+'-ACTIVE-HOLDING';details.year='2026-2027';
   if(!complete&&!db.holdings.some(h=>h.reference===details.holding&&h.ownerId===owner.id))db.holdings.push({id:key+'-ACTIVE-HOLD',ownerId:owner.id,reference:details.holding,mouza:details.mouza,khatian:details.khatian,status:'Active local demo',revision:1,created:at,demands:[{id:key+'-ACTIVE-DEMAND',year:details.year,amount:150,paid:false,revision:1,basis:'Independent synthetic example demand; no existing user ledger changed'}],demo:true});
  }
  if(s.id==='appointment')details.visitDate='2099-12-30';
  const stages=[...routes[s.id]],p=profiles[s.id];
  const w={index,stages,completed:[],scope:'DEMO: official authority, current notice and jurisdiction must be confirmed; no government record is changed.'};
  if(consultation){stages.splice(1,0,consultation,stages[0]);w.index=1;w.referrals=[{from:stages[0],to:consultation,actor:db.users.find(u=>u.role===stages[0])?.id,at,note:'DEMO: প্রযোজ্য কর্তৃত্ব যাচাইয়ের জন্য সীমিত পরামর্শ; ফিরে মূল ডেস্কে যাবে।',index:1}];}
  const current=stages[w.index],staff=db.users.find(u=>u.email===current+'@demo.ebhumi.local');
  const data={acknowledgements:{sourceRead:true,jurisdiction:true},plots:[{mouza:details.mouza,khatian:details.khatian,dag:details.dag,recordedArea:15,requestedArea:12.5,landClass:'Homestead'}],records:[{mouza:details.mouza,khatian:details.khatian,sheet:'DEMO-SHEET-1',survey:'RS'}],parties:[{name:'নমুনা পক্ষ / DEMO party',role:'Transferor',reference:'DEMO evidence reference'}],heirs:[{name:'নমুনা ওয়ারিশ / DEMO heir',relationship:'User-supplied example',reference:'DEMO heir reference',proposedPercent:100}],reviewTasks:{},messages:[]};
  const a={id:key,ownerId:owner.id,serviceId:s.id,workflowVersion:2,status:complete?'Completed':p.autoTax?'AwaitingPayment':'Submitted',details,procedureData:data,deskWorkflow:w,documentIds,assignedTo:complete?staff?.id:null,created:at,updated:at,revision:1,demo:true,demoExample:{edition:1,kind:complete?'resolved':consultation?'consultation':'desk-work',instructions:'এটি চালানো যায় এমন নমুনা। প্রয়োজনীয় যাচাই পূরণ করে পরবর্তী ডেস্কে পাঠান; কেবল শেষ ডেস্ক সিদ্ধান্ত দেয়।'},history:[{at,actor:owner.id,role:owner.role,event:'created',status:'Draft',note:'DEMO: নমুনা নথি ও তফসিল প্রস্তুত।'},{at,actor:owner.id,role:owner.role,event:'submit',status:'Submitted',note:'DEMO: আবেদন ও প্রয়োজনীয় নমুনা নথি দাখিল।'}]};
  for(let i=0;i<w.index;i++){const role=stages[i],by=db.users.find(u=>u.role===role)?.id,note='DEMO: নথি ও এখতিয়ার পর্যালোচনার পর পরবর্তী ডেস্কে প্রেরণ।';w.completed.push({index:i,role,by,at,note,checks:Object.fromEntries(p.reviewTasks.map(t=>[t.id,{result:'done',note,by,role,at}]))});a.history.push({at,actor:by,role,event:'forward',status:'Submitted',note});}
  const pay=(phase,amount)=>{if(!amount)return;db.payments.push({id:key+'-PAY-'+phase,applicationId:key,ownerId:owner.id,phase,amount,currency:'SANDBOX_BDT',status:'Successful',receipt:key+'-RECEIPT-'+phase,at,reconciled:false,demo:true});a.history.push({at,actor:owner.id,role:owner.role,event:'payment-'+phase,status:phase==='filing'?'Submitted':'ReadyForDelivery',note:'DEMO: সফল নমুনা পেমেন্ট; বাস্তব অর্থ নয়।'});};
  pay('filing',p.filingFee);
  if(complete){
   data.reviewTasks=Object.fromEntries(p.reviewTasks.map(t=>[t.id,{result:'done',note:'DEMO: নথিভুক্ত নমুনা যাচাই সম্পন্ন।',by:staff?.id,role:current,at}]));
   a.history.push({at,actor:staff?.id,role:current,event:'approve',status:p.decisionFee?'AwaitingPayment':'ReadyForDelivery',note:'DEMO: চূড়ান্ত ডেস্কের কারণসহ নমুনা সিদ্ধান্ত।'});
   pay('decision',p.autoTax?150:p.decisionFee);
   if(s.id==='holding')db.holdings.push({id:key+'-HOLD',ownerId:owner.id,reference:details.holding,mouza:details.mouza,khatian:details.khatian,status:'Active local demo',revision:1,created:at,applicationId:key,demands:[],demo:true});
   if(p.autoTax){details.holding=key+'-PAID-HOLDING';db.holdings.push({id:key+'-HOLD',ownerId:owner.id,reference:details.holding,mouza:details.mouza,khatian:details.khatian,status:'Active local demo',revision:1,created:at,demands:[{id:key+'-DEMAND',year:details.year,amount:150,paid:true,paymentId:key+'-PAY-decision',revision:1,basis:'Completed synthetic example; not a statutory assessment'}],demo:true});}
   const output={id:key+'-OUT',applicationId:key,title:s.outcome,issuedAt:at,issuedBy:staff?.id,note:'DEMO: কারণসহ নমুনা নিষ্পত্তি; সরকারি সিদ্ধান্ত বা স্বত্বের প্রমাণ নয়।',watermark:'DEMO / NOT OFFICIAL / NO LEGAL EFFECT',details:structuredClone(details),documents:[...a.documentIds],procedureVersion:2,artifacts:p.outputs.map((title,i)=>({id:key+'-ART-'+i,title,index:i+1,landSchedule:structuredClone(data.plots),recordRequests:structuredClone(data.records),parties:structuredClone(data.parties),heirs:structuredClone(data.heirs),payments:db.payments.filter(pay=>pay.applicationId===key).map(({id,amount,phase,receipt})=>({id,amount,phase,receipt}))}))};output.sha256=hash(output);a.outcome=output;a.history.push({at,actor:staff?.id,role:current,event:'issue',status:'Completed',note:output.note});
  }
  db.applications.push(a);added++;
  db.notifications.push({id:key+'-OWNER-NOTICE',userId:owner.id,title:complete?'নমুনা নিষ্পত্তি পাওয়া গেছে':'নমুনা আবেদন: '+(roleLabels[current]||current),reference:key,read:complete,at,demo:true});
  if(!complete&&staff)db.notifications.push({id:key+'-DESK-NOTICE',userId:staff.id,title:'ডেমো queue: '+s.name,reference:key,read:false,at,demo:true});
 };
 for(const [si,s]of services.entries()){for(let index=0;index<routes[s.id].length;index++)add(s,si,index);add(s,si,routes[s.id].length-1,{complete:true});}
 for(const role of ['ministry_officer','divisional_officer'])add(services.find(s=>s.id==='acquisition'),0,1,{consultation:role});
 // The VP desk has its own preparation process, rather than an invented generic approval power.
 db.legacyCases=db.legacyCases||[];
 for(const [index,role]of ['vp_officer','legal_officer','dc','records'].entries()){
  const key='DEMO-LEGACY-DESK-'+role;if(db.legacyCases.some(a=>a.id===key))continue;
  db.legacyCases.push({id:key,ownerId:owners[0].id,revision:1,status:'Submitted',details:{title:'নমুনা অর্পিত সম্পত্তি নথি / DEMO '+role,district:'Dhaka',upazila:'Savar',mouza:'Amin Bazar',jl:'100',khatian:'731',dag:'1842',schedule:'Unknown',gazette:'DEMO reference — not a verified listing',externalOrder:'DEMO external authority reference — unverified; no title determination',documentIds:[],linkedApplicationIds:[]},stages:['vp_officer','legal_officer','dc','records'],index,completed:Array.from({length:index},(_,i)=>({role:['vp_officer','legal_officer','dc'][i],at,note:'DEMO: পরবর্তী সীমিত প্রমাণ-প্রস্তুতি review-তে পাঠানো হয়েছে।'})),assignedTo:null,history:[{at,actor:owners[0].id,role:'citizen',event:'submit',note:'নমুনা প্রমাণ-প্রস্তুতি; সরকারি মামলা নয়।'}],created:at,updated:at,demo:true,demoExample:true});
 }
 db.roleDemoEdition=1;audit(null,'seed-role-workflow-examples','role-demo-1',{applications:added,legacyCases:4});return true;
}
module.exports={seedDemoFlows};
