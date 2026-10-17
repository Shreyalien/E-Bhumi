'use strict';
// Evidence preparation and local routing, never a title determination or tribunal filing.
const stages=['vp_officer','legal_officer','dc','records'];
const writable=['title','district','upazila','mouza','jl','khatian','dag','schedule','gazette','custody','lease','court','heirs','mappings','timeline','conflicts','externalOrder','documentIds','linkedApplicationIds'];
function assessment(a){const d=a.details;return [
 d.schedule==='HistoricalKha'?'পুরোনো খ-তফসিল: ধারা ২৮ক অনুযায়ী বাতিলের বিধান পড়ুন; বর্তমান স্বত্ব ও রেকর্ড আলাদা যাচাই করুন।':d.schedule==='Ka'?'ক-তফসিল দাবি: গেজেট, জমির পরিচয়, হেফাজত ও ট্রাইব্যুনালের আদেশ যাচাই প্রয়োজন।':'তালিকার অবস্থা অনিশ্চিত: সরকারি গেজেট ও বর্তমান রেকর্ড সংগ্রহ করুন।',
 'ওয়ারিশের অনুপস্থিতি বা দেশান্তর থেকে তার অংশ স্বয়ংক্রিয়ভাবে অন্যকে দেওয়া যাবে না; প্রযোজ্য ব্যক্তিগত আইন ও প্রমাণ দিয়ে বিশেষজ্ঞ যাচাই প্রয়োজন।',
 d.externalOrder?'বাহ্যিক আদেশের reference ব্যবহারকারী/দপ্তর প্রদত্ত; সরকারি আদালত থেকে অনলাইনে সত্যতা যাচাই করা হয়নি।':'প্রত্যর্পণ বা রেকর্ড বাস্তবায়নের জন্য প্রযোজ্য বাহ্যিক আদেশ/কর্তৃত্বের প্রমাণ নেই।',
 'দখল, ইজারা ও কর রসিদকে চূড়ান্ত মালিকানার সমান ধরা হয়নি। কোনো স্বয়ংক্রিয় স্বত্ব বা ভাগ নির্ধারণ নেই।'
 ];}
const canReadLegacy=(u,a)=>a.ownerId===u.id||['admin','auditor'].includes(u.role)||(a.status!=='Draft'&&(a.stages[a.index]===u.role||a.completed.some(s=>s.role===u.role)));
function handleLegacyCases(c){const {db,user:u,body,method,route,send,save,audit,notify,fail,id,now}=c;if(!route.startsWith('/legacy-cases'))return false;db.legacyCases=db.legacyCases||[];
 const creator=['citizen','representative'].includes(u.role),read=a=>canReadLegacy(u,a),view=a=>({...a,documents:(a.details.documentIds||[]).map(key=>db.documents.find(d=>d.id===key)).filter(Boolean).map(({content,...meta})=>meta),assessment:assessment(a),scope:'স্থানীয় প্রমাণ-প্রস্তুতি; সরকারি ট্রাইব্যুনালের মামলা বা স্বত্বের সিদ্ধান্ত নয়।'});
 const commit=(a,event)=>{a.revision++;a.updated=now();a.history.push({at:a.updated,actor:u.id,role:u.role,event,note:String(body.note||'')});audit(u,'legacy-'+event,a.id);save();send(200,{case:view(a)});return true;};
 if(route==='/legacy-cases'&&method==='GET'){send(200,{cases:db.legacyCases.filter(read).map(view)});return true;}
 if(route==='/legacy-cases'&&method==='POST'){if(!creator)fail(403,'Citizen or authorised representative required');const a={id:id('LEG'),ownerId:u.id,revision:0,status:'Draft',details:{schedule:'Unknown',linkedApplicationIds:[]},stages:[...stages],index:0,completed:[],assignedTo:null,history:[],created:now()};db.legacyCases.push(a);audit(u,'legacy-created',a.id);save();send(201,{case:view(a)});return true;}
 const match=route.match(/^\/legacy-cases\/([\w-]+)(?:\/(action|report))?$/);if(!match)fail(404,'Legacy endpoint not found');const a=db.legacyCases.find(a=>a.id===match[1]);if(!a||!read(a))fail(404,'Case not found');
 if(method==='GET'){if(match[2]&&match[2]!=='report')fail(405,'Use POST for actions');send(200,match[2]==='report'?{report:{label:'DEMO — প্রমাণ প্রস্তুতি প্রতিবেদন / NOT A TITLE CERTIFICATE',case:view(a),exported:now()}}:{case:view(a)});return true;}
 if(body.revision!==a.revision)fail(409,'Case changed. Reload before editing.');
 if(method==='PATCH'&&!match[2]){if(a.ownerId!==u.id||!['Draft','CorrectionRequested'].includes(a.status))fail(403,'Only owner may edit a draft or correction');const d=body.details;if(!d||typeof d!=='object'||Array.isArray(d))fail(400,'Details required');for(const [k,v] of Object.entries(d)){if(!writable.includes(k))fail(400,'Unknown case field');if(k==='documentIds'){if(!Array.isArray(v)||v.length>40||new Set(v).size!==v.length||v.some(key=>!db.documents.some(doc=>doc.id===key&&doc.ownerId===u.id)))fail(400,'Only own evidence documents may be attached');}else if(k==='linkedApplicationIds'){if(!Array.isArray(v)||v.length>30||v.some(key=>!db.applications.some(p=>p.id===key&&p.ownerId===u.id)))fail(400,'Only own applications may be linked');}else if(typeof v!=='string'||v.length>12000)fail(400,'Invalid text field');}if(d.schedule!==undefined&&!['Unknown','Ka','HistoricalKha','ReleasedClaim'].includes(d.schedule))fail(400,'Invalid historical schedule');a.details={...a.details,...d};return commit(a,'saved');}
 if(method!=='POST'||match[2]!=='action')fail(405,'Method not allowed');const action=body.action;
 if(action==='submit'){if(a.ownerId!==u.id||!['Draft','CorrectionRequested'].includes(a.status))fail(403,'Owner draft required');for(const k of ['title','district','upazila','mouza','khatian','dag','heirs','timeline'])if(!a.details[k]?.trim())fail(400,'Required: '+k);a.status='Submitted';a.assignedTo=null;for(const x of db.users.filter(x=>x.active&&x.role===a.stages[a.index]))notify(x.id,'অর্পিত সম্পত্তির প্রমাণ-প্রস্তুতি পর্যালোচনা: '+a.id,a.id);return commit(a,'submitted');}
 if(['withdraw','reopen'].includes(action)){if(a.ownerId!==u.id||(action==='withdraw'?!['Draft','Submitted','CorrectionRequested'].includes(a.status):a.status!=='Withdrawn'))fail(403,'Invalid owner action');a.status=action==='withdraw'?'Withdrawn':'Draft';a.assignedTo=null;return commit(a,action);}
 if(u.role!==a.stages[a.index]||!['Submitted','UnderReview'].includes(a.status))fail(403,'Current review desk required');
 if(action==='claim'){if(a.status!=='Submitted'||a.assignedTo)fail(409,'Already assigned');a.assignedTo=u.id;a.status='UnderReview';return commit(a,'claimed');}
 if(a.assignedTo!==u.id||a.status!=='UnderReview')fail(403,'Assigned reviewer required');if(typeof body.note!=='string'||body.note.trim().length<10||body.note.length>4000)fail(400,'Reasoned note required');
 if(action==='correction'){a.status='CorrectionRequested';a.assignedTo=null;notify(a.ownerId,'প্রমাণ-প্রস্তুতিতে সংশোধন প্রয়োজন: '+a.id,a.id);return commit(a,'correction');}
 if(action!=='forward')fail(400,'Unknown action');
 if(['dc','records'].includes(u.role)&&!a.details.externalOrder?.trim())fail(409,'External order / authority reference required; request correction first');
 const checks=body.checks;if(!Array.isArray(checks)||checks.length!==3||checks.some(v=>v!==true))fail(400,'Complete all three evidence checks');
 a.completed.push({index:a.index,role:u.role,actor:u.id,at:now(),note:body.note,checks:[...checks]});a.assignedTo=null;
 if(a.index<a.stages.length-1){a.index++;a.status='Submitted';for(const x of db.users.filter(x=>x.active&&x.role===a.stages[a.index]))notify(x.id,'প্রমাণ-প্রস্তুতির পরবর্তী পর্যালোচনা: '+a.id,a.id);}else a.status='PreparationComplete';notify(a.ownerId,'প্রমাণ-প্রস্তুতির অগ্রগতি: '+a.status,a.id);return commit(a,'forwarded');
}
module.exports={handleLegacyCases,assessment,canReadLegacy};
