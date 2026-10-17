'use strict';
const crypto=require('node:crypto');const {services}=require('./catalog.cjs');
const hash=v=>crypto.createHash('sha256').update(v).digest('hex');
function seedDemo(db,audit){
 if(db.demoEdition>=7)return false;
 // Trim only untouched generated scenarios. User-created and edited requests survive.
 const keep=new Set();for(const role of ['citizen','representative'])for(const [si,s] of services.entries())for(const vi of [0,1,2+si%8])keep.add('DEMO-'+role.toUpperCase()+'-'+s.id.toUpperCase()+'-'+String(vi+1).padStart(2,'0'));
 const removed=new Set(db.applications.filter(a=>a.demo&&a.revision===1&&!keep.has(a.id)&&!db.payments.some(p=>p.applicationId===a.id&&p.reconciledBy)).map(a=>a.id));
 db.applications=db.applications.filter(a=>!removed.has(a.id));const linked=new Set(db.applications.flatMap(a=>a.documentIds));
 db.documents=db.documents.filter(d=>!d.demo||linked.has(d.id));db.payments=db.payments.filter(p=>!removed.has(p.applicationId));db.notifications=db.notifications.filter(n=>!n.demo||!removed.has(n.reference));
 const statuses=['Draft','Submitted','UnderReview','CorrectionRequested','HearingScheduled','AwaitingPayment','PaymentFailed','ReadyForDelivery','Completed','Rejected'];
 const places=[['Dhaka','Dhaka','Savar','Amin Bazar'],['Sylhet','Moulvibazar','Sreemangal','Kalighat'],['Khulna','Narail','Lohagara','Lohagara'],['Chattogram','Chattogram','Patiya','Kusumpura'],['Rajshahi','Rajshahi','Paba','Harian'],['Rangpur','Rangpur','Mithapukur','Baldipukur'],['Barishal','Barishal','Bakerganj','Dudhal'],['Mymensingh','Mymensingh','Trishal','Kanthal']];
 const at=n=>new Date(Date.now()-n*86400000).toISOString();
 for(const role of ['citizen','representative']){
  const owner=db.users.find(u=>u.email===role+'@demo.ebhumi.local');if(!owner)continue;
  db.preferences=db.preferences||{};
  db.preferences[owner.id]={chat:[{role:'assistant',text:'Welcome to the demo assistant. I can explain the Namjari, e-porcha, tax and evidence preparation flows.'},{role:'user',text:'What should I prepare before requesting a Khatian copy?'},{role:'assistant',text:'Prepare the survey, Mouza, Khatian reference and sample evidence. The records desk can review, request corrections and issue a watermarked outcome.',serviceId:'eporcha'},{role:'user',text:'Can this prove ownership?'},{role:'assistant',text:'No. All shown records are samples and no official registry is connected. Use the official source links for authoritative verification.'}],checks:{1:true,2:true},savedSearches:[{query:'1842',survey:'all',date:'2026-10-16'},{query:'Amin Bazar',survey:'RS',date:'2026-10-16'},{query:'Kalighat',survey:'all',date:'2026-10-16'}],favorites:['land-search','applications','documents'],watches:['DAG-1842','DAG-1848','DAG-1854'],shares:[{reference:'DAG-1842',recipient:'sample-family@example.test',access:'View only'},{reference:'DAG-1848',recipient:'sample-adviser@example.test',access:'Representative'}],language:'bn',...(db.preferences[owner.id]||{})};
  for(const [si,s]of services.entries())for(const [vi,initial]of statuses.entries()){
   if(![0,1,2+si%8].includes(vi))continue;
   const key='DEMO-'+role.toUpperCase()+'-'+s.id.toUpperCase()+'-'+String(vi+1).padStart(2,'0');if(db.applications.some(a=>a.id===key))continue;
   const staff=db.users.find(u=>u.email===s.reviewer+'@demo.ebhumi.local'),location=places[(si+vi)%places.length];
   let status=!s.sandboxFee&&['AwaitingPayment','PaymentFailed'].includes(initial)?'ReadyForDelivery':initial;
   const details={eligibility:true,applicant:role==='citizen'?'Sample Citizen Household '+(vi+1):'Represented Sample Applicant '+(vi+1),authority:role==='representative'?'Authorised representative':'Self',principal:'DEMO authority letter '+(vi+1),division:location[0],district:location[1],upazila:location[2],mouza:location[3],jl:String(100+si),khatian:String(731+vi),dag:String(1842+vi),area:String(5+vi*1.25),region:s.id==='cht'?'CHT':'Plains'};
   for(const field of s.fields)details[field.key]=field.options?.[vi%field.options.length]||(field.type==='date'?(s.id==='appointment'||field.key==='visitDate'?'2099-12-30':'2026-01-15'):'DEMO '+field.key+' reference '+(si+1)+'/'+(vi+1));
   const a={id:key,ownerId:owner.id,serviceId:s.id,status,details,documentIds:[],assignedTo:!['Draft','Submitted','CorrectionRequested'].includes(status)?staff?.id:null,history:[],created:at(30+vi),updated:at(vi),revision:1,demo:true};
   for(const [di,category]of s.documents.entries()){
    const docId=key+'-DOC-'+(di+1),bytes=Buffer.from('DEMO SAMPLE ONLY\nService: '+s.en+'\nCategory: '+category+'\nNot an official document.\nScenario: '+initial);
    db.documents.push({id:docId,ownerId:owner.id,name:s.id+'-sample-'+(di+1)+'.txt',category,content:bytes.toString('base64'),size:bytes.length,sha256:hash(bytes),created:a.created,demo:true});a.documentIds.push(docId);
   }
   const event=(event,status,note,actor=owner)=>a.history.push({at:a.created,actor:actor?.id||'demo-system',role:actor?.role||'system',event,status,note});
   event('created','Draft','Seeded sample scenario; fully editable according to current state.');
   if(status!=='Draft')event('submit','Submitted','Required sample evidence prepared.');
   if(!['Draft','Submitted'].includes(status))event('claim','UnderReview','Sample assigned review.',staff);
   if(status==='CorrectionRequested')event('correction',status,'Please clarify the predecessor record reference and compare the sample area.',staff);
   if(status==='HearingScheduled'){a.hearingAt=new Date(Date.now()+86400000*(vi+1)).toISOString();event('hearing',status,'Discuss the sample record discrepancy. No real office booking.',staff);}
   if(['AwaitingPayment','PaymentFailed','ReadyForDelivery','Completed'].includes(status))event('approve',s.sandboxFee?'AwaitingPayment':'ReadyForDelivery','Sample evidence reviewed for sandbox approval only.',staff);
   if(s.sandboxFee&&['PaymentFailed','ReadyForDelivery','Completed'].includes(status)){
    const successful=status!=='PaymentFailed',p={id:key+'-PAY',applicationId:key,ownerId:owner.id,amount:s.sandboxFee,currency:'SANDBOX_BDT',status:successful?'Successful':'Failed',at:a.updated,reconciled:status==='Completed',receipt:key+'-RECEIPT',demo:true};db.payments.push(p);event('sandbox-payment',successful?'ReadyForDelivery':'PaymentFailed','Seeded payment scenario, no real money.');
   }
   if(status==='Completed'){a.outcome={id:key+'-OUT',applicationId:key,title:s.outcome,issuedAt:a.updated,issuedBy:staff?.id,note:'Completed sample outcome for '+s.en+'. No government record was changed.',watermark:'DEMO / NOT OFFICIAL / NO LEGAL EFFECT',details:a.details,documents:a.documentIds};a.outcome.sha256=hash(JSON.stringify(a.outcome));event('issue','Completed','Sample outcome available for download.',staff);}
   if(status==='Rejected')event('reject',status,'Sample evidence does not support this request. Prepare a separate review or appeal request if relevant.',staff);
   db.applications.push(a);
   if(status!=='Draft')db.notifications.push({id:key+'-NTF',userId:owner.id,title:s.name+' · '+status,reference:key,read:vi%3===0,at:a.updated,demo:true});
  }
 }
 db.demoEdition=7;audit(null,'seed-demo-scenarios','demo-edition-7',{serviceCount:services.length,scenarioCount:3,accounts:['citizen-demo','representative-demo']});return true;
}
module.exports={seedDemo};
