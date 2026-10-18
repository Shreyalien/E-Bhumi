'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=v=>String(v).replace(/[০-৯]/g,c=>'০১২৩৪৫৬৭৮৯'.indexOf(c)).toLowerCase().trim();
var toBnNum=v=>state.preferences?.language==='en'?String(v??''):String(v??'').replace(/[0-9]/g,d=>'০১২৩৪৫৬৭৮৯'[d]);
if(typeof window!=='undefined')window.toBnNum=toBnNum;
let state={user:null,csrf:'',catalog:null,applications:[],documents:[],payments:[],notifications:[],parcels:[],settings:{},step:0,selectedParcel:'DAG-1842',featureLimit:20,featureQuery:'',featureModule:'all',featurePriority:'all'},renderId=0;
const applicant=()=>['citizen','representative'].includes(state.user.role);
const reviewer=()=>state.catalog?.capabilities[state.user.role]?.includes('review');
const service=id=>state.catalog.services.find(s=>s.id===id);
const getApp=id=>state.applications.find(a=>a.id===id);
const localRole=role=>{const label=state.catalog.roles[role]||role;return label.split(' / ')[state.preferences?.language==='en'?1:0]||label;};
const roleName=()=>localRole(state.user.role);
const divisions={'Dhaka':['Dhaka','Faridpur','Gazipur','Gopalganj','Kishoreganj','Madaripur','Manikganj','Munshiganj','Narayanganj','Narsingdi','Rajbari','Shariatpur','Tangail'],'Chattogram':['Bandarban','Brahmanbaria','Chandpur','Chattogram','Cumilla','Cox’s Bazar','Feni','Khagrachhari','Lakshmipur','Noakhali','Rangamati'],'Rajshahi':['Bogura','Joypurhat','Naogaon','Natore','Chapainawabganj','Pabna','Rajshahi','Sirajganj'],'Khulna':['Bagerhat','Chuadanga','Jashore','Jhenaidah','Khulna','Kushtia','Magura','Meherpur','Narail','Satkhira'],'Barishal':['Barguna','Barishal','Bhola','Jhalokati','Patuakhali','Pirojpur'],'Sylhet':['Habiganj','Moulvibazar','Sunamganj','Sylhet'],'Rangpur':['Dinajpur','Gaibandha','Kurigram','Lalmonirhat','Nilphamari','Panchagarh','Rangpur','Thakurgaon'],'Mymensingh':['Jamalpur','Mymensingh','Netrokona','Sherpur']};
async function api(path,{method='GET',body}={}){const r=await fetch('/api'+path,{method,headers:{'Content-Type':'application/json','X-CSRF-Token':state.csrf},...(body!==undefined?{body:JSON.stringify(body)}:{})});const data=await r.json();if(r.status===401){location.assign('/login.html'+location.hash);throw Error('Session ended');}if(!r.ok)throw Error(BhumiLanguage.text(data.error||'Request failed'));return data;}
function toast(text){const el=$('#toast');if(!el)return;el.textContent=BhumiLanguage.text(text);el.hidden=false;clearTimeout(toast.timer);if(typeof gsap!=='undefined'&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){gsap.killTweensOf(el);gsap.fromTo(el,{y:14,opacity:0,scale:0.96},{y:0,opacity:1,scale:1,duration:0.25,ease:'power2.out',clearProps:'transform'});toast.timer=setTimeout(()=>{gsap.to(el,{y:-8,opacity:0,duration:0.2,ease:'power2.in',onComplete:()=>{el.hidden=true;gsap.set(el,{clearProps:'all'});}});},4000);}else{toast.timer=setTimeout(()=>el.hidden=true,4500);}}
function modal(title,html){const m=$('#modal');$('#modalTitle').textContent=title;$('#modalContent').innerHTML=html;if(!m.open)m.showModal();if(typeof gsap!=='undefined'&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){gsap.fromTo(m,{opacity:0,scale:0.96,y:10},{opacity:1,scale:1,y:0,duration:0.24,ease:'power2.out',clearProps:'transform'});}}
function closeModal(){const m=$('#modal');if(!m.open)return;if(typeof gsap!=='undefined'&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){gsap.to(m,{opacity:0,scale:0.97,y:6,duration:0.16,ease:'power2.in',onComplete:()=>{m.close();gsap.set(m,{clearProps:'all'});}});}else{m.close();}}
function animatePageEntrance(){if(typeof gsap==='undefined'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const elements=document.querySelectorAll('#content .panel, #content .card, #content .table-wrap');if(elements.length)gsap.fromTo(elements,{opacity:0.35,y:8},{opacity:1,y:0,duration:0.25,stagger:0.03,ease:'power1.out',clearProps:'transform,opacity'});const metrics=document.querySelectorAll('#content .panel.metric strong');metrics.forEach(m=>{const v=parseInt(m.textContent,10);if(!isNaN(v)&&v>0){const o={c:0};gsap.to(o,{c:v,duration:0.4,ease:'power1.out',onUpdate:()=>{m.textContent=Math.round(o.c);}});}});}
function download(name,text,type='application/json'){const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function date(v){return v?new Date(v).toLocaleString(state.preferences?.language==='bn'?'bn-BD':'en-GB',{timeZone:'Asia/Dhaka',dateStyle:'medium',timeStyle:'short'}):'—';}
const bnStatuses={Draft:'খসড়া (Draft)',Submitted:'দাখিলকৃত (Submitted)',UnderReview:'পর্যালোচনায় (Under Review)',CorrectionRequested:'সংশোধন প্রয়োজন',HearingScheduled:'শুনানি নির্ধারিত',AwaitingPayment:'ফি অপেক্ষমাণ',ReadyForDelivery:'সরবরাহ প্রস্তুতি',Completed:'সম্পন্ন (Completed)',Rejected:'প্রত্যাখ্যাত (Rejected)',Withdrawn:'প্রত্যাহারকৃত (Withdrawn)',Cancelled:'বাতিল (Cancelled)',PaymentFailed:'পেমেন্ট ব্যর্থ'};
const THEME_SUN_SVG = '<svg class="theme-icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
const THEME_MOON_SVG = '<svg class="theme-icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

function applyTheme(theme){if(theme==='dark'){document.documentElement.setAttribute('data-theme','dark');const b=$('#themeToggle');if(b){b.innerHTML=THEME_SUN_SVG;b.title=state.preferences?.language==='bn'?'লাইট মোড চালু করুন':'Switch to light mode';b.setAttribute('aria-label',b.title);}}else{document.documentElement.removeAttribute('data-theme');const b=$('#themeToggle');if(b){b.innerHTML=THEME_MOON_SVG;b.title=state.preferences?.language==='bn'?'ডার্ক মোড চালু করুন':'Switch to dark mode';b.setAttribute('aria-label',b.title);}}if(typeof syncAppearance==='function')syncAppearance();}
function initTheme(){const saved=localStorage.getItem('ebhumi_theme')||(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');applyTheme(saved);}
function toggleTheme(){const cur=document.documentElement.getAttribute('data-theme')==='dark'?'dark':'light';const next=cur==='dark'?'light':'dark';localStorage.setItem('ebhumi_theme',next);applyTheme(next);toast(next==='dark'?(state.preferences?.language==='bn'?'ডার্ক মোড চালু করা হয়েছে':'Dark mode enabled'):(state.preferences?.language==='bn'?'লাইট মোড চালু করা হয়েছে':'Light mode enabled'));}
function applyColorVariant(variant){const valid=['padma','meghna','sundarban','surma'];const v=valid.includes(variant)?variant:'padma';document.documentElement.setAttribute('data-color-variant',v);const sel=$('#colorVariantSelect');if(sel&&sel.value!==v)sel.value=v;if(typeof syncAppearance==='function')syncAppearance();}
function initColorVariant(){const saved=localStorage.getItem('ebhumi_color_variant')||'padma';applyColorVariant(saved);if(typeof initAppearance==='function')initAppearance();}
function setColorVariant(variant){localStorage.setItem('ebhumi_color_variant',variant);applyColorVariant(variant);const labels={padma:{bn:'পদ্মা সবুজ থিম সক্রিয় করা হয়েছে',en:'Padma Green theme enabled'},meghna:{bn:'মেঘনা নীল থিম সক্রিয় করা হয়েছে',en:'Meghna Blue theme enabled'},sundarban:{bn:'মৃত্তিকা থিম সক্রিয় করা হয়েছে',en:'Earth Clay theme enabled'},surma:{bn:'সুরমা স্লেট থিম সক্রিয় করা হয়েছে',en:'Surma Slate theme enabled'}};const msg=(state.preferences?.language==='bn'?labels[variant]?.bn:labels[variant]?.en)||'Theme updated';if(typeof toast==='function')toast(msg);}
function badge(status){const tone=['Rejected','Withdrawn','Cancelled','PaymentFailed','ApplicationPaymentFailed'].includes(status)?'red':['CorrectionRequested','AwaitingPayment','AwaitingApplicationPayment','HearingScheduled','DeliveryInTransit','ReadyForCollection'].includes(status)?'amber':['Completed','ReadyForDelivery'].includes(status)?'':'blue';const label=(state.preferences?.language==='bn'?bnStatuses[status]:null)||status;return `<span class="badge ${tone}">${esc(label)}</span>`;}
function heading(kicker,title,description,buttons=''){return `<div class="heading"><div><span class="eyebrow">${esc(kicker)}</span><h1>${esc(title)}</h1><p>${esc(description)}</p></div>${buttons?`<div class="actions">${buttons}</div>`:''}</div>`;}
function btn(label,action,attributes='',primary=false){return `<button class="btn${primary?' primary':''}" data-action="${action}" ${attributes}>${label}</button>`;}
function field(key,label,value='',options={}){const name='d_'+key;return `<label ${options.full?'class="full"':''} for="${name}">${esc(label)}${options.options?`<select id="${name}" name="${name}" ${options.required?'required':''}><option value="">Select…</option>${options.options.map(v=>`<option ${String(value)===String(v)?'selected':''}>${esc(v)}</option>`).join('')}</select>`:options.type==='textarea'?`<textarea id="${name}" name="${name}" ${options.required?'required':''} maxlength="4000">${esc(value)}</textarea>`:`<input id="${name}" name="${name}" type="${options.type||'text'}" value="${esc(value)}" ${options.required?'required':''} ${options.type==='number'?'min="0.000001" step="any"':''} maxlength="4000">`}</label>`;}
function applicationTable(list){return list.length?`<div class="table-wrap"><table><thead><tr><th>Reference</th><th>Service</th><th>Applicant</th><th>Status</th><th>Updated</th><th></th></tr></thead><tbody>${list.map(a=>`<tr><td><b>${esc(a.id)}</b><br><small>${esc(a.details.dag||'No parcel linked')}</small></td><td data-i18n>${esc(a.service.name)}</td><td>${esc(a.details.applicant||a.owner)}</td><td>${badge(a.status)}</td><td>${date(a.updated)}</td><td><a class="btn" href="#application/${a.id}">Open ↗</a></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty"><h3>No applications here yet.</h3><p>New work appears when an applicant submits to the relevant service queue.</p></div>';}
async function refresh(){const [a,d,p,n,l,prefs]=await Promise.all([api('/applications'),api('/documents'),api('/payments'),api('/notifications'),api('/parcels'),api('/preferences')]);Object.assign(state,{applications:a.applications,documents:d.documents,payments:p.payments,notifications:n.notifications,parcels:l.parcels,preferences:prefs.preferences});$('#unread').textContent=state.notifications.filter(n=>!n.read).length||'';}
let menuItems=()=>{const shared=[['notifications','♧ Notifications'],['knowledge','ⓘ Service guidance'],['profile','⚙ My account']];if(applicant())return [['dashboard','▦ Overview'],['services','▤ All land services'],['applications','▣ My applications'],['documents','▧ Documents & evidence'],['payments','৳ Payments & receipts'],['land','⌂ My land & timeline'],['gis','⌖ Parcel map'],['tools','◈ Review & calculators'],['support','? Assisted service'],['features','⊞ Feature registry'],...shared];if(reviewer())return [['dashboard','▦ Role overview'],['queue','▣ Service work queue'],['hearings','◷ Hearings & visits'],...(state.user.role==='finance'?[['payments','৳ Payment reconciliation']]:[]),['land','⌂ Parcel context'],['gis','⌖ Parcel map'],['reports','▥ Operational reports'],...shared];if(state.user.role==='admin')return [['dashboard','▦ Administration'],['users','♙ Accounts & access'],['settings','⚙ Platform settings'],['applications','▣ All applications (read only)'],['audit','◈ Audit log'],['reports','▥ Reports'],['features','⊞ Feature registry'],...shared];return [['dashboard','▦ Audit overview'],['audit','◈ Audit log'],['applications','▣ Application inspection'],['reports','▥ Read-only reports'],...shared];};
function nav(){const route=location.hash.slice(1).split('/')[0]||'dashboard';$('#navigation').innerHTML=menuItems().map(([id,label])=>`<a href="#${id}" class="${id===route?'active':''}" ${id===route?'aria-current="page"':''}>${esc(label)}</a>`).join('');$('#roleName').textContent=roleName();$('#userName').textContent=state.user.name;$('#avatar').textContent=state.user.name.split(' ').map(x=>x[0]).slice(0,2).join('');$('#breadcrumb').textContent=menuItems().find(([id])=>id===route)?.[1].slice(2)||'Service workspace';$('#sidebar').classList.remove('open');$('#menu').setAttribute('aria-expanded','false');}
function dashboard(){const role=state.user.role,apps=state.applications,active=apps.filter(a=>!['Completed','Rejected','Withdrawn','Cancelled'].includes(a.status)),submitted=apps.filter(a=>a.status==='Submitted');const descriptions={"citizen":"Keep applications, evidence and next steps together.","representative":"Prepare authorised requests and track them within your own account.","officer":"Inspect assigned land-service requests and record reasoned recommendations.","records":"Prepare record copies, maps, corrections and local delivery evidence.","surveyor":"Compare parcel, survey and boundary evidence without claiming registry verification.","registrar":"Review deed-copy preparation and registration readiness; no official registration occurs here.","finance":"Review holding demands, local payments and reconciliation evidence.","support":"Handle service grievances and local appointment preparation.","admin":"Manage account access, intake settings and oversight without bypassing service decisions.","auditor":"Inspect visible histories and local audit integrity with read-only access.","union_land":"Compare application details with field information and forward a reasoned report.","ac_land":"Review applicable local mutation and revenue cases after the required desk checks.","uno":"Review scoped local lease preparation; verify the current notice and jurisdiction.","dc":"Review final local desk recommendations and external-order context where required.","lease_committee":"Compare notice conditions, eligibility and evidence; record a local recommendation.","kanungo":"Review technical record and boundary discrepancies and requested consultations.","settlement_officer":"Review local survey-objection preparation; statutory stage and forum need separate confirmation.","la_officer":"Review acquisition notices, affected interests and agency proposal preparation.","vp_officer":"Use the private vested-property register to compare historical schedules and evidence.","legal_officer":"Record forum and evidence questions; coordinate local consultations and legacy files.","cht_liaison":"Prepare regional land context with traditional and competent authorities identified separately.","ministry_officer":"Respond to reasoned local consultations and return them to the requesting desk.","divisional_officer":"Review scoped divisional consultations without substituting a statutory appeal order.","appeals_officer":"Check appeal preparation and unresolved forum questions; no official appeal is filed or decided."};
return heading('ROLE PLATFORM',roleName(),descriptions[role],applicant()?'<a class="btn primary" href="#services">＋ নতুন সেবার আবেদন</a>':reviewer()?'<a class="btn primary" href="#queue">Open my queue →</a>':'<a class="btn primary" href="#audit">View audit events →</a>')+`<div class="grid four"><div class="panel metric"><span>Visible applications</span><strong>${apps.length}</strong><small>Restricted by your role</small></div><div class="panel metric"><span>Active work</span><strong>${active.length}</strong><small>Current database records</small></div><div class="panel metric"><span>${applicant()?'Needs correction':'Awaiting review'}</span><strong>${applicant()?apps.filter(a=>a.status==='CorrectionRequested').length:submitted.length}</strong><small>Actionable next steps</small></div><div class="panel metric"><span>Completed outcomes</span><strong>${apps.filter(a=>a.status==='Completed').length}</strong><small>Sandbox only</small></div></div><section class="panel"><h2>${applicant()?'আপনার পরবর্তী কাজ':'Your role responsibilities'}</h2><p>${applicant()?'Choose a service, complete its evidence checklist, submit, respond to correction/hearing, simulate payment when requested, and download the completed outcome.':reviewer()?'Claim a submitted request. Inspect its evidence, return it for correction or schedule a hearing, record a reasoned decision, and issue the outcome after any sandbox payment.':role==='admin'?'Provision and suspend accounts with the correct role. Application content is visible for oversight, but administrators cannot bypass service-review transitions.':'Inspect case histories, computed reports and audit events. Read-only access cannot edit cases, issue decisions or change accounts.'}</p><div class="actions">${applicant()?'<a class="btn" href="#services">Browse all 33 workflows</a><a class="btn" href="#support">Assisted digital help</a>':reviewer()?'<a class="btn" href="#hearings">View hearing schedule</a><a class="btn" href="#reports">Operational report</a>':role==='admin'?'<a class="btn" href="#users">Manage access</a><a class="btn" href="#settings">Platform settings</a>':'<a class="btn" href="#applications">Inspect applications</a>'}</div></section><section class="panel"><h2>Recent application activity</h2>${applicationTable([...apps].sort((a,b)=>b.updated.localeCompare(a.updated)).slice(0,6))}</section>`;}
function servicesPage(){return heading('BANGLADESH LAND-SERVICE COVERAGE','Services for your needs','Every service includes its own details, evidence, reviewing desks and complete sample outcome.',btn('Compare services','compare-services'))+`<div class="toolbar"><input id="serviceSearch" type="search" placeholder="নামজারি, e-porcha, tax…" aria-label="Search services"><select id="serviceCategory" aria-label="Service category"><option value="all">All categories</option>${[...new Set(state.catalog.services.map(s=>s.category))].map(c=>`<option>${esc(c)}</option>`).join('')}</select></div><div id="serviceGrid" class="grid">${serviceCards(state.catalog.services)}</div>`;}
function serviceCards(list){return list.map(s=>`<article class="card"><span class="badge">${esc(s.category)}</span><h3>${esc(s.name)}</h3><small class="muted">${esc(s.en)}</small><p>${esc(s.description)}</p><a class="btn" href="#service/${s.id}">Requirements & complete process ↗</a></article>`).join('')||'<p class="empty">No matching service. Try another term.</p>';}
function serviceDetail(s){return heading(s.category,s.name,s.en)+`<section class="panel"><h2>এই সেবাটি কী করে?</h2><p>${esc(s.description)}</p><div class="notice">${esc(s.boundary)} Official fees and deadlines are not configured. New applications use ${s.procedure.filingFee} filing and ${s.procedure.autoTax?'holding demand':s.procedure.decisionFee} decision simulation units. These are not live official fees.</div><div class="grid two"><div><h3>Evidence checklist</h3><ul>${s.documents.map(d=>`<li><p>${esc(d)}</p></li>`).join('')}</ul><p class="help">Each category requires a sample file. Upload TXT/PDF/PNG/JPEG, maximum 2 MiB each. Do not use real identity or land documents.</p></div><div><h3>Service-specific information</h3><ul>${s.fields.map(f=>`<li><p>${esc(f.label)}</p></li>`).join('')}</ul><p>Review desk: <b>${esc(localRole(s.reviewer))}</b></p></div></div><h3>সম্পূর্ণ local process</h3><div class="progress-steps">${['Prepare & validate',...(s.procedure.filingFee?['Filing checkout']:[]),...(s.procedure.autoTax?['Holding demand','Payment','Dakhila']:['Staff review','Correction / hearing as needed','Decision',...(s.procedure.decisionFee?['Decision checkout']:[]),'Issue / delivery'])].map((v,i)=>`<button type="button" disabled>${i+1}. ${esc(v)}</button>`).join('')}</div><p>আপনি submission-এর পরে status ও timeline দেখতে পারবেন। প্রয়োজন হলে correction দিয়ে আবার submit করবেন। সংশ্লিষ্ট staff account থেকে review/decision এবং issue সম্পন্ন হবে।</p><div class="actions">${btn('＋ Start this service','start',`data-service="${s.id}"`,true)}<a class="btn" href="${esc(s.source)}" target="_blank" rel="noopener">Official starting point ↗</a></div></section>`;}
function applicationsPage(queue=false){return heading(queue?'ROLE QUEUE':'APPLICATIONS',queue?'My service queue':'Applications and case tracking',queue?'Only applications assigned to your service role appear here.':'Status, evidence, correction, hearing, payment and outcome stay linked to one reference.')+`<div class="toolbar"><input id="applicationSearch" type="search" aria-label="Filter applications" placeholder="Reference, service, applicant…"><select id="applicationStatus" aria-label="Application status"><option value="all">All statuses</option>${[...new Set(state.applications.map(a=>a.status))].map(s=>`<option>${s}</option>`).join('')}</select></div><section class="panel" id="applicationResults">${applicationTable(queue?state.applications.filter(a=>a.service.reviewer===state.user.role):state.applications)}</section>`;}
function detail(a){const own=a.ownerId===state.user.id,review=a.service.reviewer===state.user.role,editable=own&&['Draft','CorrectionRequested'].includes(a.status),assigned=a.assignedTo===state.user.id;
let actions='';if(editable)actions+=`<a class="btn primary" href="#wizard/${a.id}">Edit / complete application →</a>`;if(own&&['Draft','Submitted','CorrectionRequested'].includes(a.status))actions+=btn('Withdraw','transition',`data-id="${a.id}" data-transition="withdraw"`);
if(review&&(a.status==='Submitted'||(a.status==='ReadyForDelivery'&&!a.assignedTo)))actions+=btn('Claim & start review','transition',`data-id="${a.id}" data-transition="claim"`,true);
if(review&&assigned&&['UnderReview','HearingScheduled'].includes(a.status)){actions+=btn('Return for correction','review-dialog',`data-id="${a.id}" data-transition="correction"`);if(a.status==='UnderReview')actions+=btn('Schedule hearing','review-dialog',`data-id="${a.id}" data-transition="hearing"`);actions+=btn('Approve in sandbox','review-dialog',`data-id="${a.id}" data-transition="approve"`,true)+btn('Reject with reason','review-dialog',`data-id="${a.id}" data-transition="reject"`);}
if(own&&['AwaitingPayment','PaymentFailed'].includes(a.status))actions+=btn('Sandbox checkout','checkout',`data-id="${a.id}"`,true);
if(review&&assigned&&a.status==='ReadyForDelivery')actions+=btn('Issue & complete outcome','review-dialog',`data-id="${a.id}" data-transition="issue"`,true);
if(a.status==='Completed')actions+=btn('Download outcome HTML','outcome',`data-id="${a.id}"`,true)+btn('Download outcome JSON','outcome-json',`data-id="${a.id}"`);
actions+=btn('Export case file','export-case',`data-id="${a.id}"`);
return heading('APPLICATION / '+a.id,a.service.name,'Created '+date(a.created)) +`<section class="panel"><div class="actions">${badge(a.status)}<span class="muted">Assigned: ${esc(a.assignee||'Not yet claimed')}</span></div><div class="actions">${actions}</div>${a.hearingAt?`<div class="notice">Sandbox hearing: ${date(a.hearingAt)}. No real office appointment is confirmed.</div>`:''}${a.status==='CorrectionRequested'?`<div class="notice"><b>Correction requested</b><p>${esc([...a.history].reverse().find(h=>h.event==='correction')?.note||'Review the timeline.')}</p></div>`:''}<p class="help">Revision ${a.revision} · Reviewer: ${esc(localRole(a.service.reviewer))} · ${esc(a.service.boundary)}</p></section><div class="grid two"><section class="panel"><h2>Submitted information</h2><div class="detail-grid">${Object.entries(a.details).map(([k,v])=>`<div><small>${esc(labelFor(a.service,k))}</small><b>${esc(k==='eligibility'?v?'Confirmed':'Not confirmed':v)}</b></div>`).join('')||'<p>No details saved yet.</p>'}</div></section><section class="panel"><h2>Evidence & integrity</h2>${a.documents.map(d=>`<div class="evidence"><b>${esc(d.category)}</b><p>${esc(d.name)} · ${d.size} bytes</p><p class="help">SHA-256: ${esc(d.sha256)}</p>${btn('Download sample evidence','document',`data-id="${d.id}"`)}</div>`).join('')||'<p class="muted">No evidence attached yet.</p>'}</section></div><section class="panel"><h2>Activity & decision timeline</h2><div class="timeline">${[...a.history].reverse().map(h=>`<article><b>${esc(h.event)} · ${badge(h.status)}</b><p>${esc(h.note||'Status updated')}</p><small>${date(h.at)} · ${esc(state.catalog.roles[h.role]||h.role)}</small></article>`).join('')}</div></section>${a.payments.length?`<section class="panel"><h2>Payment attempts</h2>${paymentTable(a.payments)}</section>`:''}${a.outcome?`<section class="panel outcome"><h3>DEMO / NOT OFFICIAL</h3><h2>${esc(a.outcome.title)}</h2><p>${esc(a.outcome.note)}</p><p class="help">Integrity digest: ${esc(a.outcome.sha256)}</p><p>No legal effect. No government registry was updated.</p></section>`:''}`;
}
function labelFor(s,key){return s.fields.find(f=>f.key===key)?.label||({applicant:'আবেদনকারী',authority:'আবেদনের authority',principal:'প্রতিনিধিত্বের sample reference',division:'বিভাগ',district:'জেলা',upazila:'উপজেলা',mouza:'মৌজা',jl:'JL',khatian:'খতিয়ান',dag:'দাগ',area:'Area (decimal)',region:'Region',eligibility:'Sandbox confirmation'})[key]||key;}
function wizard(a){if(a.ownerId!==state.user.id||!['Draft','CorrectionRequested'].includes(a.status))return '<div class="panel"><h1>This application is not editable.</h1><a href="#applications">Return to applications</a></div>';const s=a.service,d=a.details,i=state.step;
let html='';if(i===0)html=`<h2>Eligibility & authority check</h2><p>${esc(s.description)}</p><label class="check"><input type="checkbox" name="d_eligibility" ${d.eligibility?'checked':''} required><span>I am using sample information, have authority to prepare this request, and understand this is a sandbox—not an official application.</span></label><div class="notice">${esc(s.officialFee)} No real money is collected. Every required evidence category must be attached before submission.</div>`;
if(i===1)html=`<h2>আবেদনকারী ও authority</h2><div class="form-grid">${field('applicant','Applicant / organisation sample name',d.applicant,{required:true})}${field('authority','Authority / relationship',d.authority,{options:['Self','Authorised representative','Organisation representative'],required:true})}${state.user.role==='representative'?field('principal','Principal & authorisation sample reference',d.principal,{required:true,full:true}):''}</div><p class="help">No NID or real birthdate is collected in this sandbox.</p>`;
if(i===2)html=`<h2>জমি ও service details</h2><div class="form-grid">${field('division','বিভাগ / Division',d.division,{options:Object.keys(divisions),required:true})}${field('district','জেলা / District',d.district,{options:divisions[d.division]||[],required:true})}${field('upazila','উপজেলা / Thana',d.upazila,{required:true})}${field('mouza','মৌজা / Mouza (optional for support)',d.mouza,{required:a.workflowVersion===2?s.procedure.landFields.includes('mouza'):s.requiresLand})}${field('jl','JL reference (optional)',d.jl)}${field('region','প্রযোজ্য অঞ্চল',d.region||'Plains',{options:['Plains','CHT'],required:true})}${field('khatian','খতিয়ান reference (optional for support)',d.khatian,{required:a.workflowVersion===2?s.procedure.landFields.includes('khatian'):s.requiresLand})}${field('dag','দাগ reference (multiple comma separated)',d.dag,{required:a.workflowVersion===2?s.procedure.landFields.includes('dag'):s.requiresLand})}${field('area','আবেদনকৃত area (decimal, optional for support)',d.area,{type:'number',required:a.workflowVersion===2?s.procedure.landFields.includes('area'):s.requiresLand})}${s.fields.map(f=>field(f.key,f.label,d[f.key],{...f,required:!(a.workflowVersion===2&&f.key==='address'&&d.delivery!=='Postal demo'),full:f.type==='textarea'})).join('')}</div><p class="help">8 divisions / 64 district options. Upazila and Mouza are user-entered references, not official registry lookups. Use separate CHT service when relevant.</p>`;
if(i===3)html=`<h2>প্রতিটি evidence category পূরণ করুন</h2><p class="help">TXT/PDF/PNG/JPEG sample files, maximum 2 MiB. Server retains bytes and computes SHA-256. No real private documents.</p>${s.documents.map((category,index)=>{const attached=a.documents.filter(d=>d.category===category);return `<div class="evidence"><b>${index+1}. ${esc(category)}</b>${attached.map(d=>`<p>✓ ${esc(d.name)} · ${d.size} bytes ${btn('Remove from application','detach',`data-id="${a.id}" data-document="${d.id}"`)}</p>`).join('')}<label>Attach sample file<input type="file" data-upload-category="${esc(category)}" data-application="${a.id}" accept=".txt,.pdf,.png,.jpg,.jpeg"></label>${btn('Generate sample TXT evidence','sample-evidence',`data-id="${a.id}" data-category="${esc(category)}"`)}</div>`;}).join('')}`;
if(i===4)html=`<h2>Review & submit</h2><div class="detail-grid">${Object.entries(d).map(([k,v])=>`<div><small>${esc(labelFor(s,k))}</small><b>${esc(v)}</b></div>`).join('')}</div><h3>Evidence: ${a.documents.length} sample files</h3>${s.documents.map(category=>`<p>${a.documents.some(d=>d.category===category)?'✓':'○'} ${esc(category)}</p>`).join('')}<div class="notice">Submission enters the ${esc(localRole(s.reviewer))} local queue. It does not contact any government portal.</div>`;
return heading('APPLICATION WIZARD',s.name,a.id)+`<div class="progress-steps">${s.steps.map((step,j)=>`<button data-action="wizard-step" data-step="${j}" data-id="${a.id}" class="${i===j?'active':j<i?'done':''}">${j+1}. ${esc(step)}</button>`).join('')}</div><form id="wizardForm" data-id="${a.id}" class="panel"><div id="formError" class="error" role="alert"></div>${html}<div class="actions">${i>0?btn('← Back','wizard-step',`data-step="${i-1}" data-id="${a.id}"`):''}<button class="btn" name="saveOnly" type="submit" value="yes" formnovalidate>Save draft</button>${i<4?'<button class="btn primary" type="submit" value="next">Save & continue →</button>':'<button class="btn primary" type="submit" value="submit">Submit to sandbox queue →</button>'}<a class="btn" href="#application/${a.id}">View case</a></div></form>`;
}
function paymentTable(list){return list.length?`<div class="table-wrap"><table><thead><tr><th>Receipt</th><th>Application</th><th>Sandbox units</th><th>Result</th><th>Reconciled</th><th></th></tr></thead><tbody>${list.map(p=>`<tr><td>${esc(p.receipt)}${p.phase?'<br><small>'+esc(p.phase)+'</small>':''}</td><td>${esc(p.applicationId)}</td><td>${p.amount} (not real BDT)</td><td>${badge(p.status)}</td><td>${p.reconciled?'Yes':'No'}</td><td>${btn('Receipt','receipt',`data-id="${p.id}"`)}${state.user.role==='finance'&&p.status==='Successful'&&!p.reconciled?btn('Reconcile','reconcile',`data-id="${p.id}"`):''}</td></tr>`).join('')}</tbody></table></div>`:'<p class="empty">No sandbox payment attempts yet.</p>';}
function paymentsPage(){return heading('SANDBOX FINANCE',state.user.role==='finance'?'Payment reconciliation':'পেমেন্ট ও দাখিলা','No bank, mobile wallet or real money is connected.')+`<section class="panel">${paymentTable(state.payments)}<div class="actions">${btn('Download ledger CSV','export-payments')}</div></section>`;}
function documentsPage(){return heading('EVIDENCE VAULT','Documents and sample evidence','Files are stored on this local server, with server-computed SHA-256. This is not a production document vault.')+`<section class="panel"><div class="actions">${btn('Verify local file integrity','verify-local-files')}</div><p>Upload evidence within a service application so it has the correct category and ownership. Here you can inspect and download your saved files.</p>${state.documents.length?`<div class="table-wrap"><table><thead><tr><th>File</th><th>Category</th><th>Size</th><th>Uploaded</th><th></th></tr></thead><tbody>${state.documents.map(d=>`<tr><td>${esc(d.name)}<br><small>${esc(d.sha256.slice(0,24))}…</small></td><td>${esc(d.category)}</td><td>${d.size} bytes</td><td>${date(d.created)}</td><td>${btn('Download','document',`data-id="${d.id}"`)}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">No files uploaded. Start a service and open its Evidence step.</div>'}</section>`;}
function hearings(){const list=state.applications.filter(a=>a.status==='HearingScheduled');return heading('CALENDAR','Hearings and office review','Future hearing timestamps come from staff actions; these are not government bookings.')+`<div class="grid">${list.map(a=>`<article class="card"><span class="badge amber">${date(a.hearingAt)}</span><h3>${esc(a.service.name)}</h3><p>${esc(a.id)}<br>${esc(a.details.applicant)}</p><a class="btn" href="#application/${a.id}">Open hearing file →</a></article>`).join('')||'<section class="panel"><p>No hearings scheduled.</p></section>'}</div>`;}
function landPage(){return heading('PARCEL CONTEXT','Land Passport and timeline','Sample record history is kept separate from your submitted evidence and decisions.')+`<div class="grid">${state.parcels.map(p=>`<article class="card"><span class="badge gray">${p.source} · ${p.survey}</span><h3>${p.id} · ${esc(p.mouza)}</h3><p>Khatian ${p.khatian} · ${p.area} decimal<br>${esc(p.upazila)}, ${esc(p.district)}</p><a class="btn" href="#parcel/${p.id}">Timeline & evidence context ↗</a></article>`).join('')}</div>`;}
function parcelDetail(p){const apps=state.applications.filter(a=>normalize(a.details.dag||'').includes(p.id.slice(4)));return heading('LAND PASSPORT',p.id,p.mouza+' · '+p.area+' decimal')+`<div class="grid two"><section class="panel"><h2>Sample record timeline</h2><div class="timeline">${p.timeline.map(t=>`<article><b>${esc(t.year)} · ${esc(t.label)}</b><p>DEMO source, not government verified.</p></article>`).join('')}</div></section><section class="panel"><h2>Evidence & discrepancy review</h2><p>Compare your deed area, record area, names and chain references. A difference signals a question for official review; it does not establish fraud or title.</p><a class="btn" href="#tools">Open comparison tools →</a></section></div><section class="panel"><h2>Visible applications mentioning this Dag</h2>${applicationTable(apps)}</section>`;}
function gisPage(){return heading('SCHEMATIC GIS','Parcel map & list','This is an illustrative sample map with cadastral parcel geometry.')+`<div class="split"><section class="panel"><div class="toolbar"><label class="check"><input id="mapParcels" type="checkbox" checked>Parcels</label><label class="check"><input id="mapWater" type="checkbox" checked>Water</label><label class="check"><input id="mapLabels" type="checkbox" checked>Labels</label><label style="display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;margin-left:6px;"><span>View:</span><select id="mapLayerSelect" style="padding:4px 8px;border-radius:6px;border:1px solid var(--line);font-size:12px;font-family:inherit;background:var(--bg-canvas,#f7faf8);color:inherit;"><option value="satellite" selected>স্যাটেলাইট ভিউ (Esri Satellite)</option><option value="street">মৌজা ও সড়ক নকশা (Street Map)</option></select></label><label style="display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;margin-left:6px;"><span>Site:</span><select id="mapSiteSelect" style="padding:4px 8px;border-radius:6px;border:1px solid var(--line);font-size:12px;font-family:inherit;background:var(--bg-canvas,#f7faf8);color:inherit;"><option value="savar">আমিন বাজার, সাভার (Savar Plain Land)</option><option value="batali-hill">বাটালি পাহাড়, চট্টগ্রাম (Batali Hill 3D Area)</option><option value="chimbuk-hill">চিম্বুক পাহাড়, বান্দরবান (Chimbuk Hill 3D Area)</option><option value="keokradong">কেওক্রাডং শৈলশিরা, রুমা (Keokradong Ridge)</option><option value="chandranath">চন্দ্রনাথ পাহাড়, সীতাকুণ্ড (Chandranath Sitakunda)</option><option value="jaflong-ridge">জাফলং পাহাড় ও টিলা, সিলেট (Jaflong Sylhet)</option></select></label>${btn('−','map-zoom','data-scale="0.9"')}${btn('+','map-zoom','data-scale="1.1"')}${btn('Hill 3D Topographic Area','hill-gis-btn')}</div><div id="leafletMap" style="height:400px; width:100%; border-radius:10px; margin-bottom:12px; border:1px solid var(--line); z-index:1; overflow:hidden;"></div><div class="map-canvas" id="mapCanvas" style="display:none"><div class="map-river"></div>${state.parcels.map((p,i)=>`<button style="left:${5+(i%6)*15}%;top:${10+Math.floor(i/6)*21}%;width:13%;height:17%" class="plot ${p.id===state.selectedParcel?'selected':''}" data-action="select-parcel" data-id="${p.id}" aria-label="Select ${p.id}">${p.id}</button>`).join('')}</div></section><section class="panel" id="mapInfo">${mapInfo()}</section></div><section class="panel"><h2>Accessible parcel list</h2><div class="actions">${state.parcels.map(p=>btn(p.id+' · '+p.area+' decimal','select-parcel',`data-id="${p.id}"`)).join('')}</div></section>`;}
let _leafletMapInstance = null, _leafletPolygons = {}, _leafletBaseLayers = {}, _leafletHillLayer = null;
function initLeafletMap(containerId = 'leafletMap') {
  const container = document.getElementById(containerId);
  if (!container || typeof L === 'undefined') return;
  if (container._leaflet_id && _leafletMapInstance) {
    setTimeout(() => _leafletMapInstance.invalidateSize(), 100);
    return;
  }
  try {
    const map = L.map(containerId, {
      center: [23.7848, 90.3348],
      zoom: 16,
      zoomControl: true,
      attributionControl: true
    });
    _leafletMapInstance = map;

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri, Earthstar Geographics | e-Bhumi Satellite'
    });

    const streetLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors © CARTO | e-Bhumi GIS'
    });

    satelliteLayer.addTo(map);
    _leafletBaseLayers = {
      satellite: satelliteLayer,
      street: streetLayer
    };

    L.control.layers({
      'স্যাটেলাইট ভিউ (Satellite)': satelliteLayer,
      'মৌজা নকশা (Street Map)': streetLayer
    }, null, { position: 'topright' }).addTo(map);

    map.on('baselayerchange', (e) => {
      const sel = document.getElementById('mapLayerSelect');
      if (sel) sel.value = e.name.includes('Satellite') ? 'satellite' : 'street';
    });

    const select = document.getElementById('mapLayerSelect');
    if (select) {
      select.onchange = (e) => {
        if (e.target.value === 'street') {
          if (map.hasLayer(satelliteLayer)) map.removeLayer(satelliteLayer);
          if (!map.hasLayer(streetLayer)) map.addLayer(streetLayer);
        } else {
          if (map.hasLayer(streetLayer)) map.removeLayer(streetLayer);
          if (!map.hasLayer(satelliteLayer)) map.addLayer(satelliteLayer);
        }
      };
    }

    const siteSelect = document.getElementById('mapSiteSelect');
    if (siteSelect) {
      siteSelect.onchange = (e) => {
        const val = e.target.value;
        if (_leafletHillLayer) {
          map.removeLayer(_leafletHillLayer);
          _leafletHillLayer = null;
        }

        if (val === 'savar') {
          map.flyTo([23.7848, 90.3348], 16, { duration: 1.2 });
          Object.values(_leafletPolygons).forEach(poly => {
            if (!map.hasLayer(poly)) map.addLayer(poly);
          });
          const mi = document.getElementById('mapInfo');
          if (mi) mi.innerHTML = mapInfo();
        } else if (typeof HILL_PRESETS !== 'undefined' && HILL_PRESETS[val]) {
          const hill = HILL_PRESETS[val];
          const r = typeof runClientTerrainAnalysis === 'function' ? runClientTerrainAnalysis(val) : null;
          
          map.flyTo(hill.center || hill.polygon[0], 15, { duration: 1.5 });

          Object.values(_leafletPolygons).forEach(poly => {
            if (map.hasLayer(poly)) map.removeLayer(poly);
          });

          _leafletHillLayer = L.polygon(hill.polygon, {
            color: '#f59e0b',
            fillColor: '#10b981',
            fillOpacity: 0.45,
            weight: 3.5
          }).addTo(map);

          const hillInfoHtml = `
            <div style="font-family:'Hind Siliguri','Plus Jakarta Sans',sans-serif;font-size:13px;line-height:1.5;">
              <b style="color:#173e33;font-size:14px;">${hill.name}</b><br>
              <span style="color:#527367;">${hill.region || 'বাংলাদেশ'} · Metric UTM 46N</span><br>
              <hr style="border:0;border-top:1px solid #e2e8f0;margin:6px 0;">
              <span>আনুভূমিক রেকর্ড (Projected): <b>${r ? Number(r.projected_m2).toLocaleString('en-US', {maximumFractionDigits:1}) : ''} m²</b> (${r ? (r.units.projected.decimal).toFixed(2) : ''} শতক)</span><br>
              <span>প্রকৃত ৩ডি পৃষ্ঠতল (True 3D): <b style="color:#2d6a4f;">${r ? Number(r.surface_m2).toLocaleString('en-US', {maximumFractionDigits:1}) : ''} m²</b> (${r ? (r.units.surface.decimal).toFixed(2) : ''} শতক)</span><br>
              <span>পাহাড়ে অতিরিক্ত জমি: <b style="color:#b45309;">+${r ? r.diff_pct.toFixed(1) : ''}% (+${r ? Number(r.diff_m2).toLocaleString('en-US', {maximumFractionDigits:1}) : ''} m²)</b></span><br>
              <span>উচ্চতা ব্যবধান: <b>${hill.baseElevation}m</b> - <b>${hill.peakElevation}m</b> (গড় ঢাল: ${r ? r.slope.mean.toFixed(1) : ''}°)</span>
            </div>
          `;

          _leafletHillLayer.bindPopup(hillInfoHtml).openPopup();

          const mi = document.getElementById('mapInfo');
          if (mi && r) {
            mi.innerHTML = `
              <h2>${hill.name}</h2>
              <div class="badge green">Mountain 3D Topographic Analysis</div>
              <p style="margin:8px 0;font-size:13px;color:#527367;">${hill.desc}</p>
              <div class="panel metric" style="margin:8px 0;border-left:4px solid #2d6a4f;background:#f0fff4;">
                <span style="color:#22543d;">প্রকৃত ৩ডি পাহাড় পৃষ্ঠতল ক্ষেত্রফল</span>
                <strong style="color:#22543d;">${Number(r.surface_m2).toLocaleString('en-US', {maximumFractionDigits:1})} m²</strong>
                <small style="color:#22543d;font-weight:600;">${(r.units.surface.decimal).toFixed(2)} শতক (${(r.units.surface.acre).toFixed(3)} একর)</small>
              </div>
              <div class="panel metric" style="margin:8px 0;border-left:4px solid #b7791f;background:#fffaf0;">
                <span style="color:#7b341e;">পাহাড়ে অতিরিক্ত বাস্তব জমি (Topographic Gain)</span>
                <strong style="color:#7b341e;">+${r.diff_pct.toFixed(1)}% (+${Number(r.diff_m2).toLocaleString('en-US', {maximumFractionDigits:1})} m²)</strong>
                <small style="color:#7b341e;">খতিয়ানের চেয়ে +${(r.units.surface.decimal - r.units.projected.decimal).toFixed(2)} শতক অতিরিক্ত ভূমি</small>
              </div>
              <div class="actions" style="margin-top:10px;">
                <button class="btn primary" data-action="hill-gis-btn">বিস্তারিত ঢাল ও মাটি কাটার হিসাব ↗</button>
              </div>
            `;
          }
        }
      };
    }

    const parcelDefs = [
      { id: 'DAG-1842', coords: [[23.7850, 90.3330], [23.7855, 90.3345], [23.7848, 90.3350], [23.7842, 90.3335]], color: '#2d6a4f', name: 'DAG-1842', area: '12.50 decimal' },
      { id: 'DAG-1843', coords: [[23.7855, 90.3345], [23.7860, 90.3360], [23.7852, 90.3365], [23.7848, 90.3350]], color: '#1d4ed8', name: 'DAG-1843', area: '8.00 decimal' },
      { id: 'DAG-1844', coords: [[23.7842, 90.3335], [23.7848, 90.3350], [23.7840, 90.3355], [23.7835, 90.3338]], color: '#b45309', name: 'DAG-1844', area: '15.20 decimal' },
      { id: 'DAG-1845', coords: [[23.7848, 90.3350], [23.7852, 90.3365], [23.7845, 90.3370], [23.7840, 90.3355]], color: '#047857', name: 'DAG-1845', area: '6.75 decimal' }
    ];

    _leafletPolygons = {};
    parcelDefs.forEach(p => {
      const isSel = p.id === state.selectedParcel;
      const poly = L.polygon(p.coords, {
        color: isSel ? '#ffffff' : p.color,
        fillColor: p.color,
        fillOpacity: isSel ? 0.65 : 0.42,
        weight: isSel ? 3.5 : 2.2
      }).addTo(map);

      poly.bindPopup(`
        <div style="font-family:'Hind Siliguri','Plus Jakarta Sans',sans-serif;font-size:13px;line-height:1.5;">
          <b style="font-size:14px;color:#173e33">${p.name}</b><br>
          <span>মৌজা: আমিন বাজার (Savar)</span><br>
          <span>পরিমাপ: <b>${p.area}</b></span><br>
          <div style="margin-top:6px;"><a href="#parcel/${p.id}" style="color:#266b56;font-weight:600;text-decoration:underline;">Open Land Passport ↗</a></div>
        </div>
      `);

      poly.on('click', () => {
        state.selectedParcel = p.id;
        $$('.plot').forEach(btn => btn.classList.toggle('selected', btn.dataset.id === state.selectedParcel));
        const mi = document.getElementById('mapInfo');
        if (mi) mi.innerHTML = mapInfo();
        updateLeafletSelection();
      });

      _leafletPolygons[p.id] = poly;
    });

    setTimeout(() => map.invalidateSize(), 150);
  } catch (err) {
    console.warn('Leaflet initialization notice:', err);
  }
}

function updateLeafletSelection() {
  if (!_leafletPolygons) return;
  Object.entries(_leafletPolygons).forEach(([id, poly]) => {
    const isSel = id === state.selectedParcel;
    poly.setStyle({
      fillOpacity: isSel ? 0.65 : 0.28,
      weight: isSel ? 3 : 1.5
    });
    if (isSel && poly.getBounds && _leafletMapInstance) {
      _leafletMapInstance.panTo(poly.getBounds().getCenter());
    }
  });
}
function mapInfo(){const p=state.parcels.find(p=>p.id===state.selectedParcel)||state.parcels[0];return `<span class="eyebrow">SELECTED DEMO PARCEL</span><h2>${p.id}</h2><p>Mouza: ${esc(p.mouza)}<br>Khatian: ${p.khatian}<br>Area: ${p.area} decimal<br>Source: DEMO</p><a class="btn" href="#parcel/${p.id}">Open Land Passport →</a><div class="actions">${btn('Export schematic SVG','map-export')}</div>`;}
function toolsPage(){return heading('LAND PREPARATION TOOLS','Evidence checks, area and proposed shares','Calculations support preparation; they do not determine legal shares or title.')+`<div class="grid two"><form id="areaForm" class="panel"><h2>Area converter</h2><div class="form-grid"><label>Area<input name="area" type="number" min="0" step="any" value="1" required></label><label>Unit<select name="unit"><option value="1">Decimal</option><option value="100">Acre</option><option value="247.105381">Hectare</option><option value="0.0022956841">Square foot</option></select></label></div><div class="actions"><button class="btn primary">Convert</button></div><div id="areaResult" class="result" role="status">1 decimal = 435.6 square feet</div><p class="help">Katha/bigha depend on local convention and are not hardcoded.</p></form><form id="compareForm" class="panel"><h2>Deed / record area comparison</h2><div class="form-grid"><label>Deed area (decimal)<input name="deed" type="number" min="0" step="any" required></label><label>Record area (decimal)<input name="record" type="number" min="0" step="any" required></label></div><div class="actions"><button class="btn primary">Compare</button></div><div id="compareResult" role="status" class="result">Enter two sample values.</div><a href="#service/due-diligence" class="source-link">Start a complete due-diligence review →</a></form><form id="shareForm" class="panel"><h2>Proposed share worksheet</h2><label>Total area (decimal)<input name="area" type="number" min="0.0001" step="any" required></label><label>Proposed shares, one per line: label, percent<textarea name="shares" placeholder="Person A, 50&#10;Person B, 50" required></textarea></label><div class="actions"><button class="btn primary">Check proposal</button></div><div id="shareResult" role="status"></div><p class="help">User-proposed percentages only. No Faraiz or other legal inheritance determination is performed.</p></form><section class="panel"><h2>Evidence checklist before a purchase</h2>${['Seller identity and authority','Deed chain and predecessor references','Khatian, Dag, Mouza and survey','Recorded area and boundary context','Co-owner and inheritance questions','Tax evidence','Litigation and encumbrance questions','Official/legal review of discrepancies'].map(v=>`<p>○ ${esc(v)}</p>`).join('')}<a class="btn" href="#service/due-diligence">Open tracked review →</a></section></div>`+(typeof renderHillTerrainHTML==='function'?renderHillTerrainHTML():'');}
function supportPage(){return heading('INCLUSIVE ACCESS','Support and assisted services','For users who need help completing digital steps. No SMS, IVR or external office is contacted.')+`<div class="grid">${['complaint','appointment','cht'].map(id=>{const s=service(id);return `<article class="card"><h3>${esc(s.name)}</h3><p>${esc(s.description)}</p><a class="btn" href="#service/${id}">Start full process →</a></article>`;}).join('')}</div><section class="panel"><h2>Assisted digital route</h2><p>Register a representative account, record the applicant authority and sample principal reference, complete the same evidence checklist, and track the outcome in that account. A representative cannot see another account's private cases.</p><a class="btn" href="#knowledge">Service guidance & official handoff →</a></section>`;}
function knowledge(){return heading('SERVICE CHARTER','Official sources and service guidance','Sources identify service scope. They do not make this independent sandbox an official service.')+`<section class="panel"><p>Official scope was researched on 16 October 2026 from the Ministry of Land portal, mutation guidance, LD Tax and related government service pages. Current official fees, legal procedures and deadlines must be confirmed there.</p><div class="grid">${Object.entries({land:'https://land.gov.bd/',mutation:'https://mutation.land.gov.bd/nirdeshika',tax:'https://ldtax.gov.bd/',cases:'https://case.land.gov.bd/',registration:'https://registration.gov.bd/'}).map(([name,url])=>`<article class="card"><h3>${esc(name)}</h3><p>Official starting point. Government availability and access requirements are independent of this app.</p><a class="btn" href="${url}" target="_blank" rel="noopener">Open official source ↗</a></article>`).join('')}</div></section><section class="panel"><h2>Guided service finder</h2><form id="guideForm"><label>Your problem or question<textarea name="question" placeholder="নামজারি করতে চাই / need a Khatian copy" required></textarea></label><div class="actions"><button class="btn primary">Find a relevant service</button></div></form><div id="guideResult" role="status"></div><p class="help">This is a deterministic keyword guide, not a live AI model or legal adviser.</p></section>`;}
async function featurePage(){if(!state.manifest){const r=await fetch('/data/features.json');if(!r.ok)throw Error('Feature registry unavailable');state.manifest=await r.json();state.featureIndex=new Map(state.manifest.features.map(f=>[f.id,normalize(Object.values(f).join(' '))]));}return heading('REQUIREMENT REGISTRY',state.manifest.features.length+' tracked requirements','The registry includes roadmap requirements. Only the 33 service workflows are implemented as complete local simulations.')+`<div class="toolbar"><input id="featureSearch" value="${esc(state.featureQuery)}" placeholder="Name, ID, API, module…" aria-label="Feature search"><select id="featureModule" aria-label="Feature module"><option value="all">All modules</option>${[...new Set(state.manifest.features.map(f=>f.module))].map(m=>`<option ${state.featureModule===m?'selected':''}>${esc(m)}</option>`).join('')}</select><select id="featurePriority" aria-label="Feature priority"><option value="all">All priorities</option>${['P0','P1','P2'].map(p=>`<option ${state.featurePriority===p?'selected':''}>${p}</option>`).join('')}</select></div><div id="featureResults">${featureCards()}</div>${btn('Load 20 more','more-features')}`;}
function featureCards(){const list=state.manifest.features.filter(f=>(state.featureModule==='all'||f.module===state.featureModule)&&(state.featurePriority==='all'||f.priority===state.featurePriority)&&(state.featureIndex?.get(f.id)||normalize(Object.values(f).join(' '))).includes(normalize(state.featureQuery)));return `<p class="help">Showing ${Math.min(state.featureLimit,list.length)} of ${list.length}</p>`+list.slice(0,state.featureLimit).map(f=>`<article class="panel catalog-item"><span class="badge gray">${esc(f.id)} · Requirement / roadmap</span><h3>${esc(f.name)}</h3><p>${esc(f.module)} · ${esc(f.frontend||'')}</p>${btn('Inspect requirement','feature-detail',`data-id="${esc(f.id)}"`)}</article>`).join('');}
function reports(){const counts=state.applications.reduce((m,a)=>(m[a.status]=(m[a.status]||0)+1,m),{}),total=state.applications.length;return heading('CURRENT DATABASE REPORT','Operational reports','Computed only from the applications visible to your account role.')+`<section class="panel"><h2>Status distribution</h2>${Object.entries(counts).map(([key,value])=>`<p>${esc(key)} <b>${value}</b></p><div class="bar"><span style="width:${total?value/total*100:0}%"></span></div>`).join('')||'<p>No applications yet.</p>'}<div class="actions">${btn('Export JSON report','export-report')}${btn('Print view','print')}</div></section>`;}
async function auditPage(){const data=await api('/audit');state.audit=data;return heading('READ-ONLY EVENT HISTORY','Audit & integrity','Events are linked using SHA-256. Local disk owners can still alter the store; this is not a certified external audit trail.')+`<section class="panel"><p>${badge(data.chainValid?'Chain valid':'Chain mismatch')} ${data.events.length} events</p><div class="actions">${btn('Export audit JSON','export-audit')}</div><div class="table-wrap"><table><thead><tr><th>Time</th><th>Role</th><th>Event</th><th>Resource</th><th>Digest</th></tr></thead><tbody>${[...data.events].reverse().map(e=>`<tr><td>${date(e.at)}</td><td>${esc(e.role)}</td><td>${esc(e.event)}</td><td>${esc(e.resource)}</td><td>${e.hash.slice(0,16)}…</td></tr>`).join('')}</tbody></table></div></section>`;}
async function usersPage(){state.users=(await api('/users')).users;return heading('ADMINISTRATION','Accounts & role access','Staff roles can only be provisioned by an administrator. Role changes revoke existing sessions.')+`<section class="panel"><form id="userForm"><h2>Create an account</h2><div class="form-grid"><label>Display name<input name="name" required maxlength="80"></label><label>Email<input name="email" type="email" required></label><label>Temporary local password<input name="password" type="password" minlength="12" maxlength="128" required autocomplete="new-password"></label><label>Role<select name="role">${Object.entries(state.catalog.roles).map(([k,v])=>`<option value="${k}">${esc(v)}</option>`).join('')}</select></label></div><div class="actions"><button class="btn primary">Create account</button></div></form></section><section class="panel"><h2>Current accounts</h2><div class="table-wrap"><table><thead><tr><th>Name / email</th><th>Role</th><th>Access</th><th></th></tr></thead><tbody>${state.users.map(u=>`<tr><td>${esc(u.name)}<br><small>${esc(u.email)}</small></td><td>${esc(state.catalog.roles[u.role])}</td><td>${u.active?'Active':'Suspended'}</td><td>${u.id!==state.user.id?btn('Edit access','edit-user',`data-id="${u.id}"`):'Your account'}</td></tr>`).join('')}</tbody></table></div></section>`;}
function settingsPage(){return heading('PLATFORM CONTROL','Sandbox settings','Changes are saved server-side and recorded in the audit log.')+`<form id="settingsForm" class="panel"><label class="check"><input name="acceptApplications" type="checkbox" ${state.settings.acceptApplications?'checked':''}>Accept new application drafts</label><label>Platform notice<textarea name="notice" maxlength="500" required>${esc(state.settings.notice)}</textarea></label><div class="actions"><button class="btn primary">Save settings</button></div></form>`;}
function profile(){const isBn=state.preferences?.language==='bn';return heading(isBn?'আপনার একাউন্ট':'YOUR ACCOUNT',state.user.name,roleName()).replace('<h1>','<h1 data-user-content>')+`<form id="profileForm" class="panel"><div class="form-grid"><label>${isBn?'নাম / Display name':'Display name'}<input name="name" value="${esc(state.user.name)}" required maxlength="80"></label><label>${isBn?'ইমেইল (রিড অনলি)':'Email (read only)'}<input value="${esc(state.user.email)}" readonly></label><label>${isBn?'বর্তমান পাসওয়ার্ড':'Current password (for password change)'}<input name="currentPassword" type="password" autocomplete="current-password"></label><label>${isBn?'নতুন পাসওয়ার্ড (ঐচ্ছিক, ১২+ অক্ষর)':'New password (optional, 12+ characters)'}<input name="password" type="password" autocomplete="new-password" minlength="12" maxlength="128"></label></div><p class="help">${isBn?'রোল পরিবর্তন কেবলমাত্র অ্যাডমিনিস্ট্রেটর করতে পারেন।':'Role changes require an administrator; there is no client-side role switch.'}</p><div class="actions"><button class="btn primary">${isBn?'সংরক্ষণ করুন':'Save account'}</button></div></form><section class="panel" style="border-color:#e4bcb2"><h2 style="color:#b84e47">${isBn?'সেশন সমাপ্তি / লগআউট':'Sign out of session'}</h2><p class="muted">${isBn?'এই ডিভাইসের বর্তমান সেশন সমাপ্ত করে লগইন পৃষ্ঠায় ফিরে যান।':'End your active session on this device and return to the login screen.'}</p><div class="actions">${btn(isBn?'সেশন সমাপ্তি / লগআউট':'Sign out of this session','logout','class="btn danger"')}</div></section>`;}
function notificationTitle(n){
 const en=state.preferences?.language==='en',title=String(n.title||'');
 if(title==='নমুনা নিষ্পত্তি পাওয়া গেছে')return en?'Example outcome available':title;
 if(title.startsWith('নমুনা আবেদন: ')){const label=title.slice('নমুনা আবেদন: '.length).trim(),parts=label.split(' / ');return (en?'Example request: ':'নমুনা আবেদন: ')+(parts[en?1:0]||label);}
 const a=getApp(n.reference),s=a&&service(a.serviceId);
 if(s&&title==='ডেমো queue: '+s.name)return (en?'Example work queue: ':'নমুনা কাজের তালিকা: ')+(en?s.en:s.name);
 if(s&&title.startsWith(s.name+' · '))return (en?s.en:s.name)+' · '+flowStatus(title.slice(s.name.length+3));
 return title;
}
function notificationsPage(){return heading('UPDATES','বিজ্ঞপ্তি','Notifications are created from actual local case transitions.')+`<section class="panel"><div class="actions">${btn('Mark all read','read-notices')}</div>${[...state.notifications].reverse().map(n=>`<article class="evidence"><b>${n.read?'':'● '}${esc(notificationTitle(n))}</b><p>${date(n.at)}</p><a class="source-link" href="#${String(n.reference).startsWith('LEG-')?'legacy-cases':'application'}/${n.reference}">Open application →</a></article>`).join('')||'<p class="empty">No notifications yet.</p>'}</section>`;}
async function render(){const revision=++renderId;nav();const [page='dashboard',id]=location.hash.slice(1).split('/');const allowed=new Set(menuItems().map(([key])=>key));if(!allowed.has(page)&&!['service','wizard','application','parcel','land-search','my-land','land-lease','ctg-zone','due-diligence','ai-assistant','casebook','appointments','calculator','truth-card','land-dossier','analytics','feature-catalog','admin','land','tools','features'].includes(page)){location.hash='dashboard';return;}let html;
try{if((['service','wizard','land-lease','ctg-zone','casebook','appointments','ai-assistant','due-diligence','land-search'].includes(page)&&!applicant())||(page==='admin'&&!applicant()&&state.user.role!=='admin'))throw Error('This portal cannot create citizen applications.');switch(page){case'demo-flows':html=await demoFlowsPage();break;case'truth-card':html=landDossiersPage();break;case'land-dossier':html=await landDossierPage(id);break;case'land-search':html=landSearchPage();break;case'my-land':html=landPage();break;case'land-lease':html=leaseWorkspace();break;case'ctg-zone':html=chtWorkspace();break;case'due-diligence':html=diligenceWorkspace();break;case'ai-assistant':html=assistantWorkspace();break;case'casebook':html=caseRegister('Cases & Complaints','Track evidence, decisions and next steps for each case.',['revenue-case','review','appeal','rent-case','complaint']);break;case'appointments':html=appointmentsWorkspace();break;case'calculator':html=calculatorWorkspace();break;case'analytics':html=citizenAnalytics();break;case'feature-catalog':html=await featurePage();break;case'admin':html=applicant()?citizenAdministration():await usersPage();break;case'dashboard':html=dashboard();break;case'services':html=servicesPage();break;case'service':{const s=service(id);if(!s)throw Error('Service not found');html=serviceDetail(s);break;}case'wizard':{const a=getApp(id);if(!a)throw Error('Application not found');html=wizard(a);break;}case'application':{const a=getApp(id);if(!a)throw Error('Application not found');html=detail(a);break;}case'applications':case'queue':html=applicationsPage(page==='queue');break;case'documents':html=documentsPage();break;case'payments':html=paymentsPage();break;case'hearings':html=hearings();break;case'land':html=landPage();break;case'parcel':{const p=state.parcels.find(p=>p.id===id);if(!p)throw Error('Parcel not found');html=parcelDetail(p);break;}case'gis':html=gisPage();break;case'tools':html=toolsPage();break;case'support':html=supportPage();break;case'knowledge':html=knowledge();break;case'features':html=await featurePage();break;case'reports':html=reports();break;case'audit':html=await auditPage();break;case'users':html=await usersPage();break;case'settings':html=settingsPage();break;case'profile':html=profile();break;case'notifications':html=notificationsPage();break;default:html=dashboard();}if(revision!==renderId)return;$('#content').innerHTML=html+(applicant()?pageNotes(): '');animatePageEntrance();document.title=($('#content h1')?.textContent||'Workspace')+' | '+state.user.role+' | e-Bhumi';if(page==='gis')setTimeout(()=>initLeafletMap('leafletMap'),50);if((page==='tools'||page==='calculator')&&typeof attachHillTerrainListeners==='function')setTimeout(()=>attachHillTerrainListeners(),50);}catch(error){$('#content').innerHTML=`<section class="panel"><h1>Unable to open this view</h1><p class="error">${esc(error.message)}</p><a href="#dashboard" class="btn">Return to overview</a></section>`;}}
async function replaceApp(a){const index=state.applications.findIndex(x=>x.id===a.id);if(index>=0)state.applications[index]=a;else state.applications.unshift(a);}
async function saveWizard(a){const form=$('#wizardForm');if(!form)return a;const details={...a.details};for(const [name,value]of new FormData(form)){if(name.startsWith('d_'))details[name.slice(2)]=String(value);}if(state.step===0)details.eligibility=Boolean(form.querySelector('[name=d_eligibility]')?.checked);if(details.area)details.area=normalize(details.area);const data=await api('/applications/'+a.id,{method:'PATCH',body:{revision:a.revision,details,documentIds:a.documentIds}});await replaceApp(data.application);return data.application;}
async function uploadEvidence(a,category,name,content){const {document:d}=await api('/documents',{method:'POST',body:{name,category,content}});state.documents.unshift(d);const {application}=await api('/applications/'+a.id,{method:'PATCH',body:{revision:a.revision,details:a.details,documentIds:[...a.documentIds,d.id]}});await replaceApp(application);toast('Sample evidence saved & hashed');render();}
function outcomeHTML(a){return `<!doctype html><html lang="en"><meta charset="utf-8"><title>DEMO outcome</title><body style="font-family:Arial;padding:40px;max-width:900px;margin:auto"><h1 style="color:#ad4535">DEMO / NOT OFFICIAL</h1><h2>${esc(a.outcome.title)}</h2><p>Independent e-Bhumi simulation. No legal effect. No government system was updated.</p><hr><p>Reference: ${esc(a.id)}<br>Issued: ${esc(a.outcome.issuedAt)}</p><h3>Reviewer note</h3><p>${esc(a.outcome.note)}</p><h3>Sample request details</h3><dl>${Object.entries(a.details).map(([k,v])=>`<dt>${esc(labelFor(a.service,k))}</dt><dd>${esc(v)}</dd>`).join('')}</dl><p>SHA-256 of outcome payload: ${esc(a.outcome.sha256)}</p></body></html>`;}
const actionHandlers={
 async start(el){const data=await api('/applications',{method:'POST',body:{serviceId:el.dataset.service}});await replaceApp(data.application);state.step=0;location.hash='wizard/'+data.application.id;},
 async 'wizard-step'(el){const a=getApp(el.dataset.id);await saveWizard(a);state.step=Number(el.dataset.step);render();},
 async 'sample-evidence'(el){const a=getApp(el.dataset.id),category=el.dataset.category;await uploadEvidence(a,category,'sample-evidence.txt',btoa('DEMO SAMPLE ONLY\nApplication '+a.id+'\nEvidence placeholder for sandbox review.'));},
 async detach(el){const a=getApp(el.dataset.id);const data=await api('/applications/'+a.id,{method:'PATCH',body:{revision:a.revision,details:a.details,documentIds:a.documentIds.filter(id=>id!==el.dataset.document)}});await replaceApp(data.application);render();},
 async transition(el){const a=getApp(el.dataset.id);if(el.dataset.transition==='withdraw'){modal('Withdraw local application',`<p>This marks the draft/request Withdrawn. Its history is retained.</p>${btn('Confirm withdrawal','confirm-withdraw',`data-id="${a.id}"`)}`);return;}await doTransition(a,el.dataset.transition);},
 async 'confirm-withdraw'(el){await doTransition(getApp(el.dataset.id),'withdraw');closeModal();},
 'review-dialog'(el){modal('Record '+el.dataset.transition,`<form id="reviewForm" data-id="${el.dataset.id}" data-transition="${el.dataset.transition}"><label>Reason / review note<textarea name="note" required maxlength="4000" placeholder="Explain the evidence reviewed and next action…"></textarea></label>${el.dataset.transition==='hearing'?'<label>Future hearing date/time<input type="datetime-local" name="hearingAt" required></label>':''}<p class="help">This records a sandbox action by your logged-in role.</p><button class="btn primary">Confirm ${esc(el.dataset.transition)}</button><p class="error" id="modalError" role="alert"></p></form>`);},
 checkout(el){const a=getApp(el.dataset.id);modal('Sandbox checkout',`<p>Request ${esc(a.id)}</p><h2>${a.service.sandboxFee} sandbox units</h2><div class="notice">Not an official fee. No wallet, bank, card or real money is used.</div><div class="actions">${btn('Simulate successful payment','pay',`data-id="${a.id}" data-result="success"`,true)}${btn('Simulate failure / retry path','pay',`data-id="${a.id}" data-result="fail"`)}</div>`);},
 async pay(el){const data=await api('/payments',{method:'POST',body:{applicationId:el.dataset.id,result:el.dataset.result}});await replaceApp(data.application);await refresh();closeModal();toast('Sandbox payment '+data.payment.status);render();},
 async document(el){const data=await api('/documents/'+el.dataset.id);const d=data.document,bytes=Uint8Array.from(atob(d.content),c=>c.charCodeAt(0));download(d.name,bytes,'application/octet-stream');},
 outcome(el){const a=getApp(el.dataset.id);download(a.id+'-DEMO-outcome.html',outcomeHTML(a),'text/html;charset=utf-8');},
 'outcome-json'(el){download(el.dataset.id+'-outcome.json',JSON.stringify(getApp(el.dataset.id).outcome,null,2));},
 'export-case'(el){download(el.dataset.id+'-case.json',JSON.stringify(getApp(el.dataset.id),null,2));},
 receipt(el){const p=state.payments.find(p=>p.id===el.dataset.id);modal('Sandbox receipt',`<h3>DEMO / NO REAL PAYMENT</h3><p>${esc(p.receipt)}<br>${p.amount} simulation units<br>${badge(p.status)}<br>${date(p.at)}</p>${btn('Download receipt JSON','receipt-download',`data-id="${p.id}"`)}`);},
 'receipt-download'(el){download(el.dataset.id+'-receipt.json',JSON.stringify({...state.payments.find(p=>p.id===el.dataset.id),watermark:'DEMO / NO REAL PAYMENT'},null,2));},
 async reconcile(el){await api('/payments/'+el.dataset.id+'/reconcile',{method:'POST',body:{}});await refresh();toast('Payment reconciled in sandbox');render();},
 'export-payments'(){const cols=['id','applicationId','amount','currency','status','reconciled','at'];download('sandbox-ledger.csv',cols.join(',')+'\n'+state.payments.map(p=>cols.map(k=>'"'+String(p[k]).replaceAll('"','""')+'"').join(',')).join('\n'),'text/csv;charset=utf-8');},
 'select-parcel'(el){state.selectedParcel=el.dataset.id;$$('.plot').forEach(p=>p.classList.toggle('selected',p.dataset.id===state.selectedParcel));$('#mapInfo').innerHTML=mapInfo();updateLeafletSelection();},
 'map-zoom'(el){state.zoom=Math.max(.7,Math.min(1.5,(state.zoom||1)*Number(el.dataset.scale)));$$('.plot').forEach(p=>p.style.scale=state.zoom);if(_leafletMapInstance){if(Number(el.dataset.scale)>1)_leafletMapInstance.zoomIn();else _leafletMapInstance.zoomOut();}},
 'map-export'(){const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 400"><rect width="700" height="400" fill="#e4eedc"/><text x="20" y="30">DEMO SCHEMATIC — NO SURVEY ACCURACY</text>'+state.parcels.map((p,i)=>`<rect x="${25+i*220}" y="90" width="190" height="190" fill="#b6d1a2" stroke="#51734b"/><text x="${40+i*220}" y="180">${p.id} / ${p.area} decimal</text>`).join('')+'</svg>';download('demo-parcel-map.svg',svg,'image/svg+xml');},
 'more-features'(){state.featureLimit+=20;$('#featureResults').innerHTML=featureCards();},
 'feature-detail'(el){const f=state.manifest.features.find(f=>f.id===el.dataset.id);modal('Requirement '+f.id,`<h3>${esc(f.name)}</h3><p class="notice">This is a tracked requirement. Its presence does not imply backend or official integration implementation.</p><dl>${Object.entries(f).map(([k,v])=>`<dt><b>${esc(k)}</b></dt><dd><p>${esc(v)}</p></dd>`).join('')}</dl>${applicant()?'<a class="btn" href="#services" data-close-modal>Browse implemented sandbox services →</a>':''}`);},
 'export-report'(){download('role-report.json',JSON.stringify({generated:new Date().toISOString(),role:state.user.role,mode:'SANDBOX',applications:state.applications,payments:state.payments},null,2));},
  'export-audit'(){download('audit-log.json',JSON.stringify(state.audit,null,2));},
  print(){window.print();},
  'edit-user'(el){const u=state.users.find(u=>u.id===el.dataset.id);modal('Edit role/access',`<form id="accessForm" data-id="${u.id}"><p>${esc(u.name)} · ${esc(u.email)}</p><label>Role<select name="role">${Object.entries(state.catalog.roles).map(([k,v])=>`<option value="${k}" ${k===u.role?'selected':''}>${esc(v)}</option>`).join('')}</select></label><label class="check"><input type="checkbox" name="active" ${u.active?'checked':''}>Account active</label><p class="help">Saving revokes this account's current login sessions.</p><button class="btn primary">Save access</button><p class="error" id="modalError" role="alert"></p></form>`);},
  async 'read-notices'(){await api('/notifications/read',{method:'POST',body:{}});await refresh();render();},
  'hill-gis-btn'(){modal('পাহাড় ৩ডি পৃষ্ঠতল ও ঢাল বিশ্লেষক (3D Hill Surface & Slope Analyzer)', typeof renderHillTerrainHTML==='function'?renderHillTerrainHTML():'');if(typeof attachHillTerrainListeners==='function')attachHillTerrainListeners();},
  async logout(){try{await api('/logout',{method:'POST',body:{}});}catch(e){}location.assign('/login.html');}
};
async function doTransition(a,action,extra={}){const data=await api('/applications/'+a.id+'/action',{method:'POST',body:{action,revision:a.revision,...extra}});await replaceApp(data.application);await refresh();toast('Saved: '+data.application.status);render();}
document.addEventListener('click',async e=>{const close=e.target.closest('[data-close-modal]');if(close)closeModal();const el=e.target.closest('[data-action]');if(!el)return;e.preventDefault();const handler=actionHandlers[el.dataset.action];if(!handler)return;el.disabled=true;try{await handler(el);}catch(error){toast(error.message);const target=$('#modalError')||$('#formError');if(target)target.textContent=error.message;if(/changed/.test(error.message)){await refresh();render();}}finally{el.disabled=false;}});
document.addEventListener('change',async e=>{try{if(e.target.id==='d_division'){const district=$('#d_district');district.innerHTML='<option value="">Select…</option>'+(divisions[e.target.value]||[]).map(d=>`<option>${esc(d)}</option>`).join('');}if(e.target.dataset.uploadCategory){const file=e.target.files[0];if(!file)return;if(file.size>2*1024*1024)throw Error('Maximum sample file size is 2 MiB');const content=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result.split(',')[1]);r.onerror=reject;r.readAsDataURL(file);});await uploadEvidence(getApp(e.target.dataset.application),e.target.dataset.uploadCategory,file.name,content);}if(e.target.id==='applicationStatus')filterApplications();if(e.target.id==='serviceCategory')filterServices();if(e.target.id==='featurePriority'){state.featurePriority=e.target.value;state.featureLimit=20;$('#featureResults').innerHTML=featureCards();}if(e.target.id==='featureModule'){state.featureModule=e.target.value;state.featureLimit=20;$('#featureResults').innerHTML=featureCards();}if(e.target.id==='mapWater')$('.map-river').hidden=!e.target.checked;if(e.target.id==='mapParcels')$$('.plot').forEach(p=>p.classList.toggle('hidden',!e.target.checked));if(e.target.id==='mapLabels')$$('.plot').forEach(p=>p.textContent=e.target.checked?p.dataset.id:'');}catch(error){toast(error.message);}});
function filterServices(){const q=normalize($('#serviceSearch').value),cat=$('#serviceCategory').value;$('#serviceGrid').innerHTML=serviceCards(state.catalog.services.filter(s=>(cat==='all'||s.category===cat)&&normalize(s.name+' '+s.en+' '+s.description).includes(q)));}
function filterApplications(){const q=normalize($('#applicationSearch').value),status=$('#applicationStatus').value;$('#applicationResults').innerHTML=applicationTable(state.applications.filter(a=>(location.hash!=='#queue'||a.service.reviewer===state.user.role)&&(status==='all'||a.status===status)&&normalize(a.id+' '+a.service.name+' '+a.owner+' '+Object.values(a.details).join(' ')).includes(q)));}
document.addEventListener('input',e=>{if(e.target.id==='serviceSearch')filterServices();if(e.target.id==='applicationSearch')filterApplications();if(e.target.id==='featureSearch'){state.featureQuery=e.target.value;state.featureLimit=20;$('#featureResults').innerHTML=featureCards();}});
document.addEventListener('submit',async e=>{if(e.target.id==='globalSearchForm')return;e.preventDefault();const form=e.target,data=Object.fromEntries(new FormData(form)),submit=e.submitter;if(submit)submit.disabled=true;try{
 if(form.id==='wizardForm'){if(submit?.name!=='saveOnly'&&!form.reportValidity())return;const a=await saveWizard(getApp(form.dataset.id));if(submit?.value==='submit'){await doTransition(a,'submit');location.hash='application/'+a.id;}else if(submit?.name==='saveOnly'){toast('Draft saved on the server');render();}else{state.step=Math.min(4,state.step+1);render();}}
 if(form.id==='reviewForm'){const extra={note:data.note};if(data.deliveryReference)extra.deliveryReference=data.deliveryReference;if(data.hearingAt)extra.hearingAt=new Date(data.hearingAt).toISOString();await doTransition(getApp(form.dataset.id),form.dataset.transition,extra);closeModal();}
 if(form.id==='areaForm'){const d=Number(data.area)*Number(data.unit);if(!Number.isFinite(d)||d<0)throw Error('Enter a nonnegative area');$('#areaResult').textContent=`${d.toFixed(4)} decimal · ${(d/100).toFixed(6)} acres · ${(d*435.6).toFixed(2)} sq ft`;}
 if(form.id==='compareForm'){if(![data.deed,data.record].every(v=>v!==''&&Number.isFinite(Number(v))&&Number(v)>=0))throw Error('Enter two nonnegative finite areas');const delta=Number(data.deed)-Number(data.record);$('#compareResult').textContent=Math.abs(delta)<.000001?'Areas match numerically. This does not verify ownership.':`Difference: ${delta.toFixed(4)} decimal. Record this discrepancy for official review.`;}
 if(form.id==='shareForm'){const area=Number(data.area),lines=data.shares.split('\n').filter(l=>l.trim()),shares=lines.map(line=>{const at=line.lastIndexOf(',');if(at<1||!line.slice(at+1).trim())throw Error('Use label, percent for each proposed share');return {name:line.slice(0,at).trim(),percent:Number(line.slice(at+1))};});if(!Number.isFinite(area)||area<=0||!shares.length||shares.some(s=>!s.name||!Number.isFinite(s.percent)||s.percent<0)||Math.abs(shares.reduce((n,s)=>n+s.percent,0)-100)>.000001)throw Error('Enter label, percent lines whose percentages total 100.');$('#shareResult').innerHTML='<h3>Proposed allocation (not legal shares)</h3>'+shares.map(s=>`<p>${esc(s.name)}: ${s.percent}% = ${(area*s.percent/100).toFixed(4)} decimal</p>`).join('');}
 if(form.id==='guideForm'){const q=normalize(data.question),keywords=[['নামজারি','mutation'],['namjari','mutation'],['mutation','mutation'],['ওয়ারিশ','inheritance'],['inherit','inheritance'],['পর্চা','eporcha'],['porcha','eporcha'],['khatian','eporcha'],['খাজনা','land-tax'],['tax','land-tax'],['ম্যাপ','mouza-map'],['map','mouza-map'],['অভিযোগ','complaint'],['complaint','complaint'],['lease','tea-lease'],['দলিল','deed-copy']];const id=keywords.find(([word])=>q.includes(word))?.[1];$('#guideResult').innerHTML=id?`<p>Suggested starting point: <a class="btn" href="#service/${id}">${esc(service(id).name)} →</a></p>`:'<p>No exact match. Browse the service directory or request assisted support.</p>';}
 if(form.id==='profileForm'){const result=await api('/profile',{method:'PATCH',body:data});state.user=result.user;toast('Account saved');render();}
 if(form.id==='userForm'){await api('/users',{method:'POST',body:data});toast('Account created');render();}
 if(form.id==='accessForm'){await api('/users/'+form.dataset.id,{method:'PATCH',body:{role:data.role,active:Boolean(form.querySelector('[name=active]').checked)}});closeModal();toast('Role/access saved; existing sessions revoked');render();}
 if(form.id==='settingsForm'){const result=await api('/settings',{method:'PATCH',body:{notice:data.notice,acceptApplications:Boolean(form.querySelector('[name=acceptApplications]').checked)}});state.settings=result.settings;toast('Platform settings saved');render();}
}catch(error){const out=$('#modalError')||$('#formError');if(out)out.textContent=error.message;toast(error.message);}finally{if(submit)submit.disabled=false;}});
$('#globalSearchForm').onsubmit=e=>{e.preventDefault();const q=normalize($('#globalSearch').value);if(!q)return;const services=state.catalog.services.filter(s=>(applicant()||s.reviewer===state.user.role)&&normalize(s.name+' '+s.en).includes(q)),apps=state.applications.filter(a=>normalize(a.id+' '+a.service.name+' '+Object.values(a.details).join(' ')).includes(q));modal('Workspace search',`<p>Results for “${esc($('#globalSearch').value)}”</p>${services.map(s=>`<p><a class="btn" data-close-modal href="#${applicant()?'service/'+s.id:'queue'}">${esc(s.name)}</a></p>`).join('')}${apps.map(a=>`<p><a class="btn" data-close-modal href="#application/${a.id}">${esc(a.id)} · ${esc(a.service.name)}</a></p>`).join('')}${!services.length&&!apps.length?'<p>No matching service/reference.</p>':''}`);};
const doLogout=()=>actionHandlers.logout();
$('#logout')?.addEventListener('click',doLogout);
$('#topLogoutBtn')?.addEventListener('click',doLogout);
$('#sidebarLogout')?.addEventListener('click',doLogout);
$('#themeToggle')?.addEventListener('click',toggleTheme);
$('#colorVariantSelect')?.addEventListener('change',e=>setColorVariant(e.target.value));
$('#closeModal').onclick=closeModal;$('#modal').addEventListener('click',e=>{if(e.target===$('#modal'))closeModal();});
$('#menu').onclick=()=>{const open=$('#sidebar').classList.toggle('open');$('#menu').setAttribute('aria-expanded',String(open));};
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#globalSearch').focus();}});
window.addEventListener('hashchange',async()=>{closeModal();$('#content').setAttribute('aria-busy','true');$('#content').inert=true;try{await flushPageNotes();await refresh();await render();window.scrollTo(0,0);}catch(error){toast(error.message);}finally{$('#content').inert=false;$('#content').removeAttribute('aria-busy');}});
setInterval(async()=>{if(!state.user||document.hidden||document.activeElement?.matches('input,textarea,select')||$('#modal').open||location.hash.startsWith('#wizard')||location.hash.startsWith('#land-dossier/')||['#profile','#users','#settings','#tools','#knowledge'].includes(location.hash))return;try{await refresh();if(['#dashboard','#queue','#applications','#notifications','#payments'].includes(location.hash)||location.hash.startsWith('#application/'))await render();}catch{}},15000);
function initAiFloatingChatbot(){
  const container=document.getElementById('aiFloatingContainer');
  const btn=document.getElementById('aiFloatingBtn');
  const card=document.getElementById('aiFloatingCard');
  const close=document.getElementById('aiCardClose');
  const form=document.getElementById('aiFloatingForm');
  const input=document.getElementById('aiFloatingInput');
  const messages=document.getElementById('aiFloatingMessages');
  if(!container||!btn||!card||!form||!input||!messages)return;

  function toggleCard(open){
    const isCurrentlyHidden = card.hidden || card.classList.contains('hidden') || card.style.display === 'none';
    const shouldOpen = open !== undefined ? open : isCurrentlyHidden;
    card.hidden = !shouldOpen;
    card.classList.toggle('hidden', !shouldOpen);
    card.style.display = shouldOpen ? 'flex' : 'none';
    if(shouldOpen){
      setTimeout(()=>input.focus(),50);
      messages.scrollTop=messages.scrollHeight;
    }
  }

  btn.onclick=e=>{e.stopPropagation();toggleCard();};
  if(close)close.onclick=e=>{e.preventDefault();e.stopPropagation();toggleCard(false);};

  document.addEventListener('click',e=>{
    const isCurrentlyHidden = card.hidden || card.classList.contains('hidden') || card.style.display === 'none';
    if(!isCurrentlyHidden&&!container.contains(e.target)){
      toggleCard(false);
    }
  });

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      const isCurrentlyHidden = card.hidden || card.classList.contains('hidden') || card.style.display === 'none';
      if(!isCurrentlyHidden)toggleCard(false);
    }
  });

  container.addEventListener('click',e=>{
    const chip=e.target.closest('.ai-chip');
    if(chip&&chip.dataset.ask){
      e.preventDefault();
      handleUserQuery(chip.dataset.ask);
    }
    const closeAi=e.target.closest('[data-close-ai]');
    if(closeAi)toggleCard(false);
    const hillBtn=e.target.closest('[data-open-hill]');
    if(hillBtn){
      toggleCard(false);
      if(actionHandlers['hill-gis-btn'])actionHandlers['hill-gis-btn']();
    }
  });

  function getAssistantResponse(query){
    if(typeof assistantReply==='function')return assistantReply(query);
    const q=normalize(query);
    if(/পাহাড়|hill|terrain|ঢাল/.test(q)){
      return {text:'পাহাড় ও ভূমির ৩ডি পৃষ্ঠতল ক্ষেত্রফল ও ঢাল বিশ্লেষণে বাস্তব জমি মানচিত্রের চেয়ে বেশি থাকে। GIS ম্যাপে স্যাটেলাইট ভিউ ও "Hill 3D Topographic Area" ব্যবহার করে বাস্তব পৃষ্ঠতল পরিমাপ করুন।',serviceId:'gis'};
    }
    if(/নামজারি|namjari|mutation/.test(q)){
      return {text:'ই-নামজারি (Mutation) আবেদনের জন্য মালিকানা দলিল, খতিয়ান, ওয়ারিশ সনদ ও ভূমি কর দাখিলা প্রয়োজন। আবেদন প্রস্তুত করতে সরাসরি নামজারি সেবায় যান।',serviceId:'mutation'};
    }
    if(/পর্চা|porcha|khatian|খতিয়ান/.test(q)){
      return {text:'ই-পর্চা বা সার্টিফাইড খতিয়ান কপির জন্য আপনার মৌজা, খতিয়ান নম্বর ও দাগ নম্বর দিয়ে অনলাইন রেকর্ড অনুসন্ধান করুন।',serviceId:'eporcha'};
    }
    if(/tax|খাজনা|কর|dakhila/.test(q)){
      return {text:'ভূমি উন্নয়ন কর (LD Tax) প্রদানের জন্য হোল্ডিং নম্বর ও কর পরিশোধের বছর নির্বাচন করুন। পেমেন্ট সম্পন্ন হলে ডিজিটাল দাখিলা পাওয়া যাবে।',serviceId:'land-tax'};
    }
    return {text:'আপনার প্রশ্নের জন্য সংশ্লিষ্ট সেবায় আবেদন করতে পারেন। e-Bhumi প্ল্যাটফর্মে নামজারি, পর্চা, খাজনা ও পাহাড়ি জমির ৩ডি পরিমাপ উপলব্ধ রয়েছে।',serviceId:null};
  }

  function handleUserQuery(query){
    if(!query||!query.trim())return;
    const cleanQuery=query.trim();
    const userBubble=document.createElement('div');
    userBubble.className='ai-bubble ai-bubble-user';userBubble.dataset.userContent='';
    userBubble.textContent=cleanQuery;
    messages.appendChild(userBubble);
    messages.scrollTop=messages.scrollHeight;

    setTimeout(()=>{
      const resp=getAssistantResponse(cleanQuery);
      const isBn=state.preferences?.language==='bn';
      const assistantBubble=document.createElement('div');
      assistantBubble.className='ai-bubble ai-bubble-assistant';
      assistantBubble.innerHTML=`<div>${esc(BhumiLanguage?.text(resp.text)||resp.text)}</div>`+
        (resp.serviceId?`<div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
          <a class="btn small primary" href="#service/${esc(resp.serviceId)}" data-close-ai="true">${isBn?'সেবায় সরাসরি যান ↗':'Go to service ↗'}</a>
          ${resp.serviceId==='gis'?'<button type="button" class="btn small" data-open-hill="true">'+(isBn?'পাহাড় ৩ডি বিশ্লেষক ↗':'Open 3D Hill Tool ↗')+'</button>':''}
        </div>`:'');
      messages.appendChild(assistantBubble);
      messages.scrollTop=messages.scrollHeight;
    },120);
  }

  form.onsubmit=e=>{
    e.preventDefault();
    const val=input.value;
    input.value='';
    handleUserQuery(val);
  };
}

async function init(){initTheme();initColorVariant();initAiFloatingChatbot();try{const [catalog,me]=await Promise.all([api('/catalog'),api('/me')]);state.catalog=catalog;state.user=me.user;state.csrf=me.csrf;state.settings=me.settings;if(location.pathname!=='/portal/'+state.user.role)history.replaceState(null,'','/portal/'+state.user.role+(location.hash||'#dashboard'));if(!['Local sandbox — sample information only.','Hosted demo — shared private storage. Use sample information only.','Hosted demo — temporary instance data and sessions; resets may occur. Use sample information only.'].includes(state.settings.notice))$('#sandboxBanner').append(' '+state.settings.notice);await refresh();state.preferences.language=state.preferences.language||'bn';document.documentElement.lang=state.preferences.language;initTheme();initColorVariant();await render();}catch(error){$('#content').innerHTML=`<section class="panel"><h1>Workspace unavailable</h1><p>${esc(error.message)}</p><a class="btn" href="/login.html">Sign in again</a></section>`;}}
installPreservedFeatures();
installWorkflowFeatures();
installLandIntelligence();
installProcedureFeatures();
installDeskInterface();
installLawWorkspace();
installDemoFlows();
init();

