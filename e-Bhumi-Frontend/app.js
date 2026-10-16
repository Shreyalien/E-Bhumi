(() => {
  'use strict';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const state = {
    page: 'dashboard',
    lang: 'en',
    selectedParcel: 'DAG-1842',
    featureQuery: '',
    featureModule: 'all',
    featurePriority: 'all',
    landQuery: '',
    applicationFilter: 'all',
    savedSearches: [],
    chat: [],
    layerState: { parcels: true, mouza: true, roads: true, water: true, labels: true },
    zoom: 1,
    diligenceChecks: {}
  };
  let manifest = { features: [] };

  const nav = [
    {id:'dashboard',label:'Overview',icon:'▦',group:'main'},
    {id:'land-search',label:'Land Search',icon:'⌕',group:'main'},
    {id:'my-land',label:'My Land & Passport',icon:'⌂',group:'main',count:'3'},
    {id:'services',label:'Land Services',icon:'▤',group:'main'},
    {id:'applications',label:'My Applications',icon:'▣',group:'main',count:'2'},
    {id:'gis',label:'GIS & Parcel Map',icon:'⌖',group:'tools'},
    {id:'documents',label:'Documents Vault',icon:'▧',group:'tools'},
    {id:'payments',label:'Payments & Receipts',icon:'৳',group:'tools'},
    {id:'due-diligence',label:'Due Diligence',icon:'◈',group:'tools'},
    {id:'ai-assistant',label:'AI Land Assistant',icon:'✳',group:'tools'},
    {id:'casebook',label:'Cases & Complaints',icon:'⚑',group:'tools'},
    {id:'appointments',label:'Appointments & Queue',icon:'◷',group:'tools'},
    {id:'notifications',label:'Notifications',icon:'♧',group:'manage'},
    {id:'analytics',label:'Analytics & Reports',icon:'▥',group:'manage'},
    {id:'feature-catalog',label:'Feature Catalogue',icon:'⊞',group:'manage'},
    {id:'admin',label:'Administration',icon:'⚙',group:'manage'}
  ];

  const services = [
    {icon:'⌂',title:'Khatian / Porcha',desc:'Search and request certified land records',tag:'Records'},
    {icon:'⇄',title:'Mutation / Namjari',desc:'Apply for a mutation and track progress',tag:'Ownership'},
    {icon:'৳',title:'Land Development Tax',desc:'Review dues and manage payment receipts',tag:'Tax'},
    {icon:'⌖',title:'Mouza & Dag Search',desc:'Find a plot by administrative location',tag:'GIS'},
    {icon:'▤',title:'Record Correction',desc:'Prepare a request to correct record details',tag:'Records'},
    {icon:'◈',title:'Land Verification',desc:'Organise evidence for a due-diligence review',tag:'Verification'},
    {icon:'♧',title:'Certified Copy Request',desc:'Request a copy of an available record',tag:'Documents'},
    {icon:'⚑',title:'Complaint & Grievance',desc:'Submit a service issue for review',tag:'Support'},
    {icon:'◷',title:'Office Appointment',desc:'Book a visit or view queue information',tag:'Citizen'},
    {icon:'⌁',title:'Inheritance / Faraiz',desc:'Organise co-sharer and inheritance information',tag:'Family'},
    {icon:'▣',title:'Land Transfer Readiness',desc:'Prepare a checklist before a transaction',tag:'Transaction'},
    {icon:'✳',title:'AI Document Guide',desc:'Understand document contents with source-aware guidance',tag:'AI'}
  ];

  const applications = [
    {id:'MUT-2026-00481',service:'Mutation / Namjari',parcel:'Dag 1842 · Savar',date:'12 Oct 2026',status:'Under review',tone:'amber',step:2},
    {id:'POR-2026-00317',service:'Certified Porcha',parcel:'Khatian 731 · Savar',date:'08 Oct 2026',status:'Documents verified',tone:'blue',step:3},
    {id:'TAX-2026-00194',service:'Land Development Tax',parcel:'Holding LB-0248',date:'02 Oct 2026',status:'Payment complete',tone:'green',step:4},
    {id:'COR-2026-00061',service:'Record correction',parcel:'Dag 1842 · Savar',date:'28 Sep 2026',status:'Action required',tone:'amber',step:1}
  ];

  const activity = [
    {icon:'✓',title:'Document verification completed',desc:'Your Porcha request POR-2026-00317 passed the document check.',time:'Today · 10:42 AM'},
    {icon:'↗',title:'Mutation application moved to review',desc:'MUT-2026-00481 is now assigned to the reviewing officer.',time:'Yesterday · 3:18 PM'},
    {icon:'৳',title:'Payment receipt available',desc:'A demo receipt is ready for your land tax transaction.',time:'12 Oct · 11:07 AM'}
  ];

  const parcels = [
    ['p1','DAG-1842','12.50 decimal'],
    ['p2','DAG-1843','8.00 decimal'],
    ['p3','DAG-1844','10.25 decimal'],
    ['p4','DAG-1845','6.75 decimal'],
    ['p5','DAG-1846','9.00 decimal'],
    ['p6','DAG-1847','11.20 decimal'],
    ['p7','DAG-1848','7.80 decimal'],
    ['p8','DAG-1849','5.60 decimal']
  ];

  const docs = [
    ['DOC-0081','RS Khatian reference','Land record','Verified','green','12 Oct 2026'],
    ['DOC-0079','Tax receipt · demo','Payment receipt','Verified','green','10 Oct 2026'],
    ['DOC-0072','Deed scan · sample','Uploaded document','Needs review','amber','08 Oct 2026'],
    ['DOC-0065','Applicant identity checklist','Checklist','Draft','gray','04 Oct 2026']
  ];

  const payments = [
    {id:'PAY-DEMO-0019',service:'Land Development Tax',amount:'৳ 1,500',date:'12 Oct 2026',status:'Successful · demo',tone:'green'},
    {id:'PAY-DEMO-0017',service:'Certified Porcha request',amount:'৳ 500',date:'08 Oct 2026',status:'Successful · demo',tone:'green'},
    {id:'PAY-DEMO-0021',service:'Record correction request',amount:'৳ 450',date:'15 Oct 2026',status:'Pending · sandbox',tone:'amber'}
  ];

  const diligenceItems = [
    ['identity','Seller identity and authority checked'],
    ['records','Khatian / Porcha references compared'],
    ['tax','Land tax receipts and dues reviewed'],
    ['map','Dag boundaries and area compared'],
    ['coowners','Co-sharers / inheritance context reviewed'],
    ['litigation','Litigation / injunction check through authorised source'],
    ['encumbrance','Mortgage / encumbrance information checked'],
    ['documents','Deed chain and supporting documents reviewed']
  ];

  const bn = {
    dashboard:'ওভারভিউ',
    'land-search':'জমি অনুসন্ধান',
    'my-land':'আমার জমি ও পাসপোর্ট',
    services:'ভূমি সেবা',
    applications:'আমার আবেদন',
    gis:'জিআইএস ও পার্সেল ম্যাপ',
    documents:'নথির ভল্ট',
    payments:'পেমেন্ট ও রসিদ',
    'due-diligence':'যাচাই-বাছাই',
    'ai-assistant':'এআই ভূমি সহকারী',
    casebook:'মামলা ও অভিযোগ',
    appointments:'অ্যাপয়েন্টমেন্ট ও কিউ',
    notifications:'নোটিফিকেশন',
    analytics:'অ্যানালিটিক্স ও রিপোর্ট',
    'feature-catalog':'ফিচার ক্যাটালগ',
    admin:'প্রশাসন'
  };

  function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function title(id){const n=nav.find(x=>x.id===id);return n?(state.lang==='bn'?(bn[id]||n.label):n.label):id;}
  function toast(message, detail=''){const el=document.createElement('div');el.className='toast';el.innerHTML=`${esc(message)}${detail?`<small>${esc(detail)}</small>`:''}`;$('#toastRegion').append(el);setTimeout(()=>el.remove(),3500);}
  function setPage(id){state.page=id;renderNav();renderPage();$('#crumbCurrent').textContent=title(id);$('.sidebar').classList.remove('open');window.scrollTo({top:0,behavior:'smooth'});}

  function renderNav(){
    const el=$('#mainNav');
    let last='';
    el.innerHTML=nav.map(n=>{
      let label='';
      if(n.group!==last){
        last=n.group;
        label=`<div class="side-label nav-group-label">${n.group==='main'?'OVERVIEW':n.group==='tools'?'LAND TOOLS':'MANAGE'}</div>`;
      }
      return `${label}<button class="nav-item ${state.page===n.id?'active':''}" data-page="${n.id}"><span class="nav-icon">${n.icon}</span><span>${esc(title(n.id))}</span>${n.count?`<span class="nav-count">${n.count}</span>`:''}</button>`;
    }).join('');
  }

  function heading(eyebrow,h1,desc,actions=''){return `<div class="page-heading"><div><span class="eyebrow">${eyebrow}</span><h1>${h1}</h1><p>${desc}</p></div><div class="heading-actions">${actions}</div></div>`;}
  function demoBanner(){return `<div class="demo-banner"><span class="banner-icon">ⓘ</span><div><b>Demonstration environment</b> · Sample land records and transactions are illustrative, not official government records.</div><span>DEMO DATA</span></div>`;}
  function stat(label,value,icon,foot,kind='positive'){return `<article class="stat-card"><div class="stat-top"><span class="stat-label">${label}</span><span class="stat-icon">${icon}</span></div><div class="stat-value">${value}</div><div class="stat-foot"><span class="${kind}">${foot.split('|')[0]}</span><span>${foot.split('|')[1]||''}</span></div></article>`;}
  function panelHead(title,subtitle,link=''){return `<div class="panel-head"><div><h2 class="panel-title">${title}</h2>${subtitle?`<p class="panel-subtitle">${subtitle}</p>`:''}</div>${link?`<button class="inline-link" data-page="${link[1]}">${link[0]} ↗</button>`:''}</div>`;}
  function table(rows,headers){return `<div class="table-wrap"><table class="data-table"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;}

  function appRows(items=applications){
    return items.map(a=>`<tr><td class="table-primary">${esc(a.id)}</td><td><strong>${esc(a.service)}</strong></td><td>${esc(a.parcel)}</td><td>${esc(a.date)}</td><td><span class="pill ${a.tone}">${esc(a.status)}</span></td><td><button class="table-actions" data-action="application-detail" data-id="${esc(a.id)}">View ↗</button></td></tr>`).join('');
  }

  function docRows(items=docs){
    return items.map(d=>`<tr><td class="table-primary">${esc(d[0])}</td><td><strong>${esc(d[1])}</strong></td><td>${esc(d[2])}</td><td><span class="pill ${d[4]}">${esc(d[3])}</span></td><td>${esc(d[5])}</td><td><button class="table-actions" data-action="document-detail" data-id="${esc(d[0])}">Open ↗</button></td></tr>`).join('');
  }

  function paymentRows(items=payments){
    return items.map(p=>`<tr><td class="table-primary">${esc(p.id)}</td><td><strong>${esc(p.service)}</strong></td><td>${esc(p.amount)}</td><td>${esc(p.date)}</td><td><span class="pill ${p.tone}">${esc(p.status)}</span></td><td><button class="table-actions" data-action="receipt" data-id="${esc(p.id)}">Receipt ↗</button></td></tr>`).join('');
  }

  function dashboard(){
    return `${heading('CITIZEN WORKSPACE','Good morning, Citizen <span style="color:#8ab79b">✳</span>','Here is your land-service overview for Friday, 16 October 2026.',`<button class="btn" data-action="download-summary">↓ Export summary</button><button class="btn primary" data-action="new-application">＋ New application</button>`)}
    ${demoBanner()}
    <div class="stats-grid">
      ${stat('Land parcels linked','03','⌂','+1|record added this month')}
      ${stat('Active applications','02','▣','1|needs your attention','warning')}
      ${stat('Documents verified','08','▧','+2|verified this month')}
      ${stat('Outstanding tax dues','৳ 0','৳','✓|No demo dues pending')}
    </div>
    <div class="content-grid">
      <section class="panel">${panelHead('My land at a glance','A quick summary of your linked property records',['View all land','my-land'])}
        <div class="land-summary">
          <div class="land-art">
            <span class="land-art-label">LAND PASSPORT · EB-LP-001842</span>
            <svg viewBox="0 0 300 200" aria-hidden="true">
              <path d="M26 64 L86 34 L144 49 L164 101 L124 143 L52 132 Z" fill="#c4e0c7" stroke="#6a9c78" stroke-width="2"/>
              <path d="M86 34 L94 92 L52 132 M94 92 L164 101 M94 92 L124 143" fill="none" stroke="#6a9c78" stroke-width="1.5"/>
              <path d="M188 27 L264 48 L254 105 L205 119 L176 72 Z" fill="#d9e8c9" stroke="#8bad7d" stroke-width="2"/>
              <path d="M188 27 L216 75 L254 105 M216 75 L176 72" fill="none" stroke="#8bad7d" stroke-width="1.5"/>
              <circle cx="95" cy="92" r="5" fill="#246a50"/>
              <circle cx="216" cy="75" r="4" fill="#246a50"/>
            </svg>
            <div class="land-art-bottom">Savar · Dhaka · Bangladesh</div>
          </div>
          <div class="land-details">
            <div class="detail-row"><div><div class="detail-label">Mouza</div><div class="detail-value">Amin Bazar</div></div><span class="pill green">Linked</span></div>
            <div class="detail-row"><div><div class="detail-label">Khatian no.</div><div class="detail-value">731 · RS</div></div><div><div class="detail-label">Dag no.</div><div class="detail-value">1842</div></div></div>
            <div class="detail-row"><div><div class="detail-label">Recorded area</div><div class="detail-value">12.50 decimal</div></div><span class="pill blue">Demo record</span></div>
            <button class="btn small" data-action="land-passport">Open Land Passport ↗</button>
          </div>
        </div>
      </section>
      <section class="panel">${panelHead('Recent activity','Latest updates across your services',['View all','notifications'])}
        <div class="activity-list">${activity.map(a=>`<div class="activity-item"><div class="activity-icon">${a.icon}</div><div class="activity-copy"><b>${a.title}</b><p>${a.desc}</p><p style="font-size:9px;color:#a0aca5">${a.time}</p></div></div>`).join('')}</div>
      </section>
    </div>
    <div class="section-row"><div><h2>Popular land services</h2><p>Start a service or learn what you need before applying.</p></div><button class="inline-link" data-page="services">Explore all services ↗</button></div>
    <div class="service-grid">${services.slice(0,8).map(s=>`<button class="service-card" data-action="service" data-service="${esc(s.title)}"><span class="service-icon">${s.icon}</span><b>${s.title}</b><small>${s.desc}</small></button>`).join('')}</div>
    <div class="section-row"><div><h2>Applications in progress</h2><p>Track status, required actions, and service history.</p></div><button class="inline-link" data-page="applications">All applications ↗</button></div>
    <section class="panel" style="padding:0;overflow:hidden">${table(appRows(applications.slice(0,3)),['Reference ID','Service','Land reference','Submitted','Current status',''])}</section>`;
  }

  function landSearch(){
    return `${heading('LAND DISCOVERY','Search land records','Find a land record using administrative location, Khatian, Dag, owner reference, or map location.',`<button class="btn" data-action="save-search">♡ Save search</button><button class="btn primary" data-page="gis">⌖ Open map</button>`)}
    ${demoBanner()}
    <section class="panel">
      <div class="form-grid" id="landSearchForm">
        <div class="form-field"><label>Division</label><select id="division"><option value="">Select division</option><option>Dhaka</option><option>Chattogram</option><option>Khulna</option><option>Rajshahi</option><option>Barishal</option><option>Sylhet</option><option>Rangpur</option><option>Mymensingh</option></select></div>
        <div class="form-field"><label>District</label><select id="district"><option value="">Select district</option><option>Dhaka</option><option>Narail</option><option>Gazipur</option><option>Manikganj</option></select></div>
        <div class="form-field"><label>Upazila / Thana</label><input id="upazila" placeholder="e.g. Savar" value="Savar"/></div>
        <div class="form-field"><label>Mouza</label><input id="mouza" placeholder="Mouza name" value="Amin Bazar"/></div>
        <div class="form-field"><label>Survey type</label><select id="surveyType"><option>Any survey</option><option>CS</option><option>SA</option><option>RS</option><option>BS / BRS</option></select></div>
        <div class="form-field"><label>Search by</label><select id="searchBy"><option>Dag number</option><option>Khatian number</option><option>Record reference</option><option>Coordinate / GPS</option></select></div>
        <div class="form-field"><label>Dag / Khatian / Reference</label><input id="recordNumber" placeholder="Enter record number" value="1842"/></div>
        <div class="form-field"><label>Owner name (optional)</label><input id="ownerName" placeholder="Enter name as recorded"/></div>
        <div class="form-field full"><div class="form-note">Search results are permission-filtered. A result in this demo is not proof of title or legal ownership. Official records must be verified with the competent authority.</div></div>
        <div class="form-field full" style="flex-direction:row;justify-content:flex-end"><button class="btn" data-action="reset-land-search">Reset</button><button class="btn primary" data-action="run-land-search">⌕ Search records</button></div>
      </div>
    </section>
    <div id="landResults" style="margin-top:18px">${landResults()}</div>`;
  }

  function landResults(){
    return `<section class="panel">${panelHead('Search results','3 illustrative records match the current search',['View map','gis'])}
      <div class="toolbar"><label class="field-search"><span>⌕</span><input id="landFilter" placeholder="Filter results by Dag, Khatian or Mouza…" value="${esc(state.landQuery)}"/></label><select class="select-field" id="recordSurveyFilter"><option value="all">All survey types</option><option>RS</option><option>SA</option><option>CS</option></select></div>
      <div id="landTable">${table(`<tr><td class="table-primary">DAG-1842</td><td><strong>Amin Bazar</strong></td><td>731</td><td>RS</td><td>12.50 decimal</td><td><span class="pill blue">Demo data</span></td><td><button class="table-actions" data-action="view-parcel" data-id="DAG-1842">Open ↗</button></td></tr><tr><td class="table-primary">DAG-1843</td><td><strong>Amin Bazar</strong></td><td>732</td><td>RS</td><td>8.00 decimal</td><td><span class="pill blue">Demo data</span></td><td><button class="table-actions" data-action="view-parcel" data-id="DAG-1843">Open ↗</button></td></tr><tr><td class="table-primary">DAG-0918</td><td><strong>Baipayl</strong></td><td>204</td><td>SA</td><td>5.25 decimal</td><td><span class="pill blue">Demo data</span></td><td><button class="table-actions" data-action="view-parcel" data-id="DAG-0918">Open ↗</button></td></tr>`,['Dag reference','Mouza','Khatian','Survey','Recorded area','Source status',''])}</div>
    </section>`;
  }

  function myLand(){
    return `${heading('PROPERTY WORKSPACE','My land & Land Passport','Organise linked parcels, record references, ownership history, due-diligence notes, and saved land watchlists.',`<button class="btn" data-action="share-land">↗ Share workspace</button><button class="btn primary" data-action="link-land">＋ Link a land record</button>`)}
    ${demoBanner()}
    <div class="stats-grid">
      ${stat('Linked parcels','03','⌂','Verified links|demo workspace')}
      ${stat('Land Passports','03','▤','Ready|for review')}
      ${stat('Watchlist alerts','02','♧','1|new update','warning')}
      ${stat('Shared workspaces','01','♧','Active|family workspace')}
    </div>
    <div class="feature-list">
      ${['Land Passport · EB-LP-001842','Land Passport · EB-LP-001843','Land Passport · EB-LP-000918'].map((n,i)=>`<article class="feature-card"><div class="feature-symbol">⌂</div><div style="flex:1"><h3>${n}</h3><p>${['Amin Bazar Mouza · Savar · Dhaka · 12.50 decimal','Amin Bazar Mouza · Savar · Dhaka · 8.00 decimal','Baipayl Mouza · Savar · Dhaka · 5.25 decimal'][i]}</p><div class="feature-meta"><span class="pill green">Linked to workspace</span><span class="pill blue">Demo data</span></div><div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn small" data-action="land-passport" data-id="${i}">Open passport</button><button class="btn small" data-action="watch-land" data-id="${i}">♡ Watch changes</button></div></div></article>`).join('')}
    </div>
    <div class="section-row"><div><h2>Ownership and record timeline</h2><p>Provenance-aware events; no legal conclusions are inferred.</p></div></div>
    <section class="panel">
      <div class="activity-list">${[{icon:'▤',title:'RS record reference linked',desc:'Khatian 731 · Dag 1842 · Amin Bazar Mouza',time:'Record snapshot · Demo'},{icon:'↔',title:'Historical record comparison available',desc:'Compare available record snapshots when authoritative data is provided.',time:'Data dependency'},{icon:'♧',title:'Change Watch enabled',desc:'This demo watchlist illustrates how record-change alerts may appear.',time:'Monitoring · Demo'}].map(a=>`<div class="activity-item"><div class="activity-icon">${a.icon}</div><div class="activity-copy"><b>${a.title}</b><p>${a.desc}</p></div><span class="activity-time">${a.time}</span></div>`).join('')}</div>
    </section>`;
  }

  function servicesPage(){
    return `${heading('SERVICE DIRECTORY','Land services','Browse service guidance, required information, estimated process steps, and application entry points.',`<button class="btn" data-action="service-compare">⇄ Compare services</button>`)}
    ${demoBanner()}
    <div class="toolbar">
      <label class="field-search"><span>⌕</span><input id="serviceFilter" placeholder="Search services, documents, or keywords…"/></label>
      <select class="select-field" id="serviceCategory"><option value="all">All categories</option>${[...new Set(services.map(s=>s.tag))].map(t=>`<option>${t}</option>`).join('')}</select>
    </div>
    <div class="service-grid" id="servicesGrid">${serviceCards(services)}</div>
    <div class="section-row"><div><h2>Service guidance</h2><p>Official eligibility, fees, and timelines must be confirmed against current government rules.</p></div></div>
    <section class="panel">
      <div class="feature-list">${[['Before you apply','Review the service checklist and required document categories.'],['Track every request','Use the reference ID to follow status and officer actions.'],['Keep evidence organised','Store receipts, submitted documents, and correction notices together.'],['Need help?','Submit a complaint or request guidance from the support workspace.']].map(([a,b])=>`<div class="feature-card"><div class="feature-symbol">✓</div><div><h3>${a}</h3><p>${b}</p></div></div>`).join('')}</div>
    </section>`;
  }

  function serviceCards(arr){
    return arr.map(s=>`<button class="service-card" data-action="service" data-service="${esc(s.title)}"><span class="service-icon">${s.icon}</span><b>${s.title}</b><small>${s.desc}</small><span class="pill gray" style="margin-top:11px">${s.tag}</span></button>`).join('')||'<div class="no-results">No services match your search.</div>';
  }

  function applicationsPage(){
    const filtered=state.applicationFilter==='all'?applications:applications.filter(a=>a.tone===state.applicationFilter);
    return `${heading('CASE TRACKER','My applications','Track each service request, review next actions, and retain an auditable history.',`<button class="btn primary" data-action="new-application">＋ New application</button>`)}
    ${demoBanner()}
    <div class="stats-grid">
      ${stat('Total applications',String(applications.length).padStart(2,'0'),'▣','Across|all service types')}
      ${stat('In review',String(applications.filter(a=>a.tone==='amber').length).padStart(2,'0'),'◷','Officer review|in progress','warning')}
      ${stat('Verified',String(applications.filter(a=>a.tone==='blue').length).padStart(2,'0'),'✓','Document|verification complete')}
      ${stat('Completed',String(applications.filter(a=>a.tone==='green').length).padStart(2,'0'),'✓','Latest|successful service')}
    </div>
    <section class="panel">${panelHead('Application register','Use the reference ID when contacting a service office.')}
      <div class="toolbar">
        <label class="field-search"><span>⌕</span><input id="applicationSearch" placeholder="Search by reference or service…"/></label>
        <select class="select-field" id="applicationStatus">
          <option value="all">All statuses</option>
          <option value="amber">In progress / action required</option>
          <option value="blue">Verification</option>
          <option value="green">Completed</option>
        </select>
      </div>
      <div id="applicationsTable">${table(appRows(filtered),['Reference ID','Service','Land reference','Submitted','Current status',''])}</div>
    </section>
    <div class="section-row"><div><h2>Typical application flow</h2><p>Service-specific steps may vary and require official validation.</p></div></div>
    <section class="panel">
      <div class="workflow">${[['1','Prepare','Checklist'],['2','Submit','Documents'],['3','Verify','Officer review'],['4','Decision','Approved / returned'],['5','Complete','Receipt / record']].map((x,i)=>`<div class="workflow-step ${i<2?'done':i===2?'current':''}"><div class="step-circle">${i<2?'✓':x[0]}</div><b>${x[1]}</b><small>${x[2]}</small></div>`).join('')}</div>
    </section>`;
  }

  function gisPage(){
    const currentParcel = parcels.find(p => p[1] === state.selectedParcel) || parcels[0];
    return `${heading('GEOSPATIAL WORKSPACE','GIS & cadastral map','Explore illustrative parcel boundaries, switch map layers, and inspect parcel references.',`<button class="btn" data-action="measure">⌁ Measure</button><button class="btn" data-action="export-map">↓ Export map</button>`)}
    ${demoBanner()}
    <div class="toolbar">
      <label class="field-search"><span>⌕</span><input id="mapSearch" placeholder="Search Dag (e.g. DAG-1842), Mouza…" value="${esc(state.selectedParcel)}"/></label>
      <select class="select-field"><option>Dhaka · Savar</option><option>Khulna · Narail</option></select>
      <button class="btn primary" data-action="locate-map">⌖ Locate</button>
    </div>
    <div class="map-layout">
      <div class="map-canvas ${!state.layerState.parcels?'hide-parcels ':''}${!state.layerState.roads?'hide-roads ':''}${!state.layerState.water?'hide-water ':''}${!state.layerState.labels?'hide-labels ':''}" id="mapCanvas">
        <div class="map-river"></div>
        <div class="map-road road-a"></div>
        <div class="map-road road-b"></div>
        ${parcels.map(p=>`<button class="parcel ${state.selectedParcel===p[1]?'selected':''} ${p[0]}" data-action="select-parcel" data-id="${p[1]}" title="Select ${p[1]}">${p[1]}</button>`).join('')}
        <div class="map-controls">
          <button data-action="zoom-in" aria-label="Zoom in">＋</button>
          <button data-action="zoom-out" aria-label="Zoom out">−</button>
          <button data-action="locate-map" aria-label="Locate">⌖</button>
        </div>
        <div class="map-legend">
          <span><i class="legend-dot"></i>Illustrative parcel</span>
          <span><i class="legend-dot road"></i>Road / path</span>
        </div>
      </div>
      <aside class="map-side">
        <section class="panel map-info">
          ${panelHead('Selected parcel','Click a parcel boundary to inspect it.')}
          <h3 id="selectedParcelTitle">${esc(currentParcel[1])}</h3>
          <div class="detail-row"><div><div class="detail-label">Mouza</div><div class="detail-value">Amin Bazar</div></div></div>
          <div class="detail-row"><div><div class="detail-label">Khatian</div><div class="detail-value">731 · RS</div></div><div><div class="detail-label">Area</div><div class="detail-value" id="selectedArea">${esc(currentParcel[2])}</div></div></div>
          <div class="detail-row"><div><div class="detail-label">Data source</div><div class="detail-value">Demo cadastral fixture</div></div></div>
          <button class="btn primary" style="width:100%;margin-top:14px" data-action="view-parcel" data-id="${esc(currentParcel[1])}">Open parcel details ↗</button>
        </section>
        <section class="panel map-info">
          <h3>Map layers</h3>
          <div class="layer-list">${[['parcels','Parcel boundaries'],['mouza','Mouza outlines'],['roads','Roads & paths'],['water','Water features'],['labels','Place labels']].map(([k,l])=>`<div class="layer-item"><span>${l}</span><button class="switch ${state.layerState[k]?'on':''}" data-action="layer-toggle" data-layer="${k}" aria-label="Toggle ${l}" aria-pressed="${state.layerState[k]}"></button></div>`).join('')}</div>
        </section>
        <section class="panel map-info">
          <h3>Map tools</h3>
          <div class="feature-meta">
            <button class="btn small" data-action="measure">⌁ Measure area</button>
            <button class="btn small" data-action="coordinates">⌖ Coordinates</button>
            <button class="btn small" data-action="print-map">▤ Print map</button>
            <button class="btn small" data-action="save-map">♡ Save view</button>
          </div>
        </section>
      </aside>
    </div>
    <p class="panel-subtitle" style="margin:12px 3px">GIS demo note: boundaries are schematic placeholders. Connect authoritative cadastral datasets and spatial services before operational use.</p>`;
  }

  function documentsPage(){
    return `${heading('SECURE DOCUMENTS','Documents vault','Organise uploaded evidence, service-generated files, receipts, and document verification status.',`<button class="btn" data-action="document-guidance">Document checklist</button><button class="btn primary" data-action="upload-document">↑ Upload document</button>`)}
    ${demoBanner()}
    <div class="stats-grid">
      ${stat('Stored documents',String(docs.length).padStart(2,'0'),'▧','Across|4 categories')}
      ${stat('Verified',String(docs.filter(d=>d[4]==='green').length).padStart(2,'0'),'✓','Verified|by platform')}
      ${stat('Needs review',String(docs.filter(d=>d[4]==='amber').length).padStart(2,'0'),'◷','Check|before submission','warning')}
      ${stat('Drafts',String(docs.filter(d=>d[4]==='gray').length).padStart(2,'0'),'♧','Checklist|ready')}
    </div>
    <section class="panel">${panelHead('All documents','Sample inventory. Files are kept in browser state in this frontend-only build.')}
      <div class="toolbar">
        <label class="field-search"><span>⌕</span><input id="documentSearch" placeholder="Search document name or reference…"/></label>
        <select class="select-field" id="documentCategory">
          <option value="all">All categories</option>
          <option>Land record</option>
          <option>Payment receipt</option>
          <option>Uploaded document</option>
          <option>Checklist</option>
        </select>
        <button class="btn" data-action="batch-verify">✓ Batch review</button>
      </div>
      <div id="documentsTable">${table(docRows(docs),['Reference','Document','Category','Status','Last updated',''])}</div>
    </section>
    <div class="section-row"><div><h2>Document integrity</h2><p>Production storage should enforce versioning, checksums, malware scanning, and access logging.</p></div></div>
    <div class="feature-list">${[['Version history','Retain prior versions and record who uploaded or changed each file.'],['Secure sharing','Use expiring, permission-bound links instead of public document URLs.'],['OCR & classification','Suggest document type and extract fields for human verification.'],['Tamper-evident records','Fingerprint files and log verification events; do not treat a hash as proof of legal validity.']].map(x=>`<article class="feature-card"><div class="feature-symbol">▧</div><div><h3>${x[0]}</h3><p>${x[1]}</p></div></article>`).join('')}</div>`;
  }

  function paymentsPage(){
    return `${heading('PAYMENT CENTRE','Payments & receipts','Review illustrative service charges, payment events, receipts, and transaction status.',`<button class="btn" data-action="download-receipts">↓ Export receipts</button>`)}
    ${demoBanner()}
    <div class="stats-grid">
      ${stat('Total demo payments','৳ 2,450','৳','3|sample transactions')}
      ${stat('Successful','02','✓','Settled|demo only')}
      ${stat('Pending','01','◷','Awaiting|sandbox callback','warning')}
      ${stat('Refund requests','00','↶','No open|demo request')}
    </div>
    <section class="panel">${panelHead('Transaction history','No real money is moved by this frontend demo.')}
      <div class="toolbar">
        <label class="field-search"><span>⌕</span><input id="paymentSearch" placeholder="Search transaction, service, amount…"/></label>
        <select class="select-field" id="paymentStatusFilter">
          <option value="all">All statuses</option>
          <option value="Successful">Successful</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
      <div id="paymentsTable">${table(paymentRows(payments),['Transaction ID','Service','Amount','Date','Status',''])}</div>
    </section>
    <div class="section-row"><div><h2>Payment safety</h2><p>Live payment gateway access, fee schedules, and refund rules require official approval and validation.</p></div></div>
    <section class="panel">
      <div class="warning-panel">Demo payment provider active. Before production, integrate an approved Bangladesh payment gateway, validate server-side callbacks, verify transaction signatures, and reconcile provider settlement reports. Never trust client-reported payment success.</div>
    </section>`;
  }

  function dueDiligence(){
    return `${heading('LAND RISK & REVIEW','Due diligence workspace','Organise evidence and screening signals before a land transaction. This tool is advisory, not a title guarantee.',`<button class="btn" data-action="export-checklist">↓ Export checklist</button><button class="btn primary" data-action="new-due-diligence">＋ New review</button>`)}
    ${demoBanner()}
    <div class="warning-panel" style="margin-bottom:18px"><b>Important:</b> Automated checks cannot establish legal ownership or replace a lawyer, competent land office, registration authority, or court. Resolve discrepancies through official channels.</div>
    <div class="content-grid">
      <section class="panel">${panelHead('Review checklist','Select checks completed for your own workflow.')}
        <div id="diligenceChecks">
          ${diligenceItems.map(x=>{
            const isChecked = Boolean(state.diligenceChecks[x[0]]);
            return `<label style="display:flex;align-items:center;gap:10px;padding:13px 0;border-bottom:1px solid #edf1ee;font-size:11px;color:#4d685b;cursor:pointer"><input type="checkbox" data-check="${x[0]}" ${isChecked?'checked':''} style="accent-color:#27694f;width:15px;height:15px"/><span>${x[1]}</span></label>`;
          }).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:17px">
          <span class="panel-subtitle" id="checkProgress">${Object.values(state.diligenceChecks).filter(Boolean).length} of ${diligenceItems.length} checks marked</span>
          <button class="btn primary" data-action="save-diligence">Save review progress</button>
        </div>
      </section>
      <section class="panel">${panelHead('Screening signals','Illustrative indicators only.')}
        <div class="activity-list">${[['Identity match','Not connected','amber'],['Record consistency','Needs human comparison','amber'],['Parcel overlap','No GIS dataset connected','gray'],['Litigation status','Official source required','gray'],['Double-sale signal','No transaction feed connected','gray']].map(x=>`<div class="activity-item"><div class="activity-icon">◈</div><div class="activity-copy"><b>${x[0]}</b><p>${x[1]}</p></div><span class="pill ${x[2]}">${x[2]==='amber'?'Review':'Unavailable'}</span></div>`).join('')}</div>
      </section>
    </div>`;
  }

  function aiAssistant(){
    return `${heading('ASSISTED GUIDANCE','AI land assistant','Ask for general service guidance, document explanations, or help preparing a checklist.',`<button class="btn" data-action="clear-chat">↺ New conversation</button>`)}
    ${demoBanner()}
    <div class="content-grid">
      <section class="panel chat-panel">${panelHead('Ask e-Bhumi','Demo assistant with predefined guidance; no live AI model is connected.')}
        <div class="chat-messages" id="chatMessages">
          ${state.chat.length?state.chat.map(m=>`<div class="chat-bubble ${m.role==='user'?'user':''}">${esc(m.text)}</div>`).join(''):`<div class="chat-bubble">Hello! I can help you understand e-Bhumi services, prepare a document checklist, or explain what a Khatian/Dag reference means. I cannot verify legal ownership or make official decisions.</div><div class="feature-meta">${['What is a Khatian?','Mutation checklist','Prepare for land purchase'].map(q=>`<button class="btn small" data-action="chat-suggestion" data-text="${q}">${q}</button>`).join('')}</div>`}
        </div>
        <form class="chat-input" id="chatForm"><input id="chatInput" placeholder="Ask about a land service…" autocomplete="off"/><button class="btn primary" type="submit">Send ↑</button></form>
      </section>
      <section class="panel">${panelHead('Responsible AI','Source-aware, human-verified assistance.')}
        <div class="activity-list">${[['Grounded answers','Show the official source and effective date when connected.'],['Human verification','Flag extracted fields for review before use.'],['Privacy first','Avoid uploading unnecessary personal or sensitive data.'],['No legal decisions','AI does not determine title, fraud guilt, or application outcomes.']].map(x=>`<div class="activity-item"><div class="activity-icon">✳</div><div class="activity-copy"><b>${x[0]}</b><p>${x[1]}</p></div></div>`).join('')}</div>
      </section>
    </div>`;
  }

  function casebook(){
    return `${heading('SUPPORT & DISPUTES','Cases & complaints','Create and track support requests, service complaints, evidence bundles, and escalation history.',`<button class="btn primary" data-action="new-complaint">＋ New complaint</button>`)}
    ${demoBanner()}
    <div class="stats-grid">
      ${stat('Open complaints','02','⚑','1|awaiting response','warning')}
      ${stat('Resolved','04','✓','This quarter|demo')}
      ${stat('Escalated','01','↗','Review|service timeline','warning')}
      ${stat('Average response','2.4 days','◷','Illustrative|metric')}
    </div>
    <section class="panel">${panelHead('Support case register','Case records shown here are illustrative.')}
      ${table(`<tr><td class="table-primary">CMP-DEMO-014</td><td><strong>Mutation status clarification</strong></td><td>MUT-2026-00481</td><td>14 Oct 2026</td><td><span class="pill amber">Awaiting response</span></td><td><button class="table-actions" data-action="case-detail" data-id="CMP-DEMO-014">Open ↗</button></td></tr><tr><td class="table-primary">CMP-DEMO-009</td><td><strong>Document upload assistance</strong></td><td>DOC-0072</td><td>05 Oct 2026</td><td><span class="pill blue">Under review</span></td><td><button class="table-actions" data-action="case-detail" data-id="CMP-DEMO-009">Open ↗</button></td></tr>`,['Case ID','Subject','Related reference','Created','Status',''])}
    </section>
    <div class="section-row"><div><h2>Case handling tools</h2><p>Escalation and legal workflows require appropriate authority and access controls.</p></div></div>
    <div class="service-grid">${[['Evidence bundle','Organise supporting documents and timeline.','▧'],['Escalation tracker','Track response dates and escalation path.','↗'],['Hearing / appointment','Manage an authorised visit or hearing slot.','◷'],['Complaint feedback','Rate a resolved support interaction.','☆']].map(x=>`<button class="service-card" data-action="case-tool" data-name="${x[0]}"><span class="service-icon">${x[2]}</span><b>${x[0]}</b><small>${x[1]}</small></button>`).join('')}</div>`;
  }

  function appointments(){
    return `${heading('VISIT PLANNER','Appointments & queue','Plan an office visit, review appointment details, or view a sample digital token.',`<button class="btn primary" data-action="book-appointment">＋ Book appointment</button>`)}
    ${demoBanner()}
    <div class="content-grid">
      <section class="panel">${panelHead('Upcoming appointment','Sample appointment; not connected to an actual office queue.')}
        <div style="display:flex;gap:15px;align-items:center;padding:12px 0 20px">
          <div style="border:1px solid #dce9df;border-radius:12px;overflow:hidden;text-align:center;min-width:66px">
            <div style="background:#eaf4ed;padding:7px;color:#4a7960;font-size:9px;font-weight:700">OCT</div>
            <strong style="display:block;font-size:24px;padding:8px;color:#285b45">22</strong>
          </div>
          <div>
            <h3 style="font-size:13px;margin:0 0 6px">Land record guidance desk</h3>
            <p class="panel-subtitle">Demo Service Centre · Savar, Dhaka</p>
            <p class="panel-subtitle">Thursday · 10:30 AM – 10:45 AM</p>
            <span class="pill blue">Token DEMO-018</span>
          </div>
        </div>
        <button class="btn" data-action="appointment-detail">View appointment details</button>
        <button class="btn" data-action="cancel-appointment">Cancel demo booking</button>
      </section>
      <section class="panel">${panelHead('Queue status','Illustrative queue only.')}
        <div class="split-metrics">
          <div class="mini-metric"><strong>07</strong><small>People ahead</small></div>
          <div class="mini-metric"><strong>~35m</strong><small>Estimated wait</small></div>
          <div class="mini-metric"><strong>Open</strong><small>Demo status</small></div>
        </div>
        <div class="form-note" style="margin-top:14px">Live office hours, appointment inventory, and queue updates require an official scheduling integration.</div>
      </section>
    </div>
    <section class="panel">${panelHead('Visit preparation','A short checklist to reduce repeat visits.')}
      <div class="feature-list">${[['Bring reference IDs','Keep application numbers and appointment token available.'],['Prepare documents','Use the service checklist to confirm required document categories.'],['Check official details','Verify office location, service hours, and current requirements before travel.'],['Accessibility needs','Provide a way to request accessible service or assistance.']].map(x=>`<div class="feature-card"><div class="feature-symbol">✓</div><div><h3>${x[0]}</h3><p>${x[1]}</p></div></div>`).join('')}</div>
    </section>`;
  }

  function notifications(){
    return `${heading('UPDATES','Notifications','Important application events, document reminders, payments, and service announcements.',`<button class="btn" data-action="mark-read">✓ Mark all read</button><button class="btn" data-action="notification-settings">⚙ Preferences</button>`)}
    <section class="panel">${panelHead('All notifications','Recent activity in this demo workspace.')}
      <div class="toolbar">
        <select class="select-field" id="noticeFilter">
          <option value="all">All notifications</option>
          <option>Applications</option>
          <option>Documents</option>
          <option>Payments</option>
          <option>Service updates</option>
        </select>
      </div>
      <div id="noticeList">${[['Applications','Mutation application moved to officer review','MUT-2026-00481 has been assigned for review.','10 min ago'],['Documents','Document verification complete','Your certified Porcha document check is complete.','Yesterday'],['Payments','Receipt available','A demo receipt is available for PAY-DEMO-0019.','12 Oct'],['Service updates','Service notice: demo environment','Official service fees and processing times require validation.','11 Oct'],['Documents','Document review requested','A sample deed scan is marked for human review.','08 Oct']].map((n,i)=>`<div class="notice-item" data-notice-category="${n[0]}"><div class="notice-bullet" style="${i>2?'background:#c4cec8':''}"></div><div style="flex:1"><b>${n[1]}</b><p>${n[2]}</p></div><span class="activity-time">${n[3]}</span></div>`).join('')}</div>
    </section>
    <div class="section-row"><div><h2>Notification channels</h2><p>Configure channels once identity/contact verification and delivery providers are connected.</p></div></div>
    <section class="panel">
      <div class="layer-list">${[['In-app notifications','Enabled'],['Email updates','Not connected'],['SMS alerts','Provider required'],['Important deadlines','Enabled · demo']].map(x=>`<div class="layer-item"><span>${x[0]}</span><span class="pill ${x[1]==='Enabled'?'green':'gray'}">${x[1]}</span></div>`).join('')}</div>
    </section>`;
  }

  function analytics(){
    return `${heading('SERVICE INTELLIGENCE','Analytics & reports','Explore illustrative operational metrics, application throughput, and service-quality indicators.',`<button class="btn" data-action="export-report">↓ Export report</button><button class="btn" data-action="report-schedule">◷ Schedule report</button>`)}
    ${demoBanner()}
    <div class="stats-grid">
      ${stat('Applications created','1,284','▣','+12.4%|vs previous period')}
      ${stat('On-time completion','78.6%','✓','+4.2%|vs previous period')}
      ${stat('Pending review','216','◷','-8.1%|vs previous period','positive')}
      ${stat('Citizen satisfaction','4.3 / 5','☆','+0.2|illustrative score')}
    </div>
    <div class="content-grid">
      <section class="panel">${panelHead('Monthly application volume','Illustrative counts; not government statistics.')}
        <div class="bar-chart">${[['May',50,'218'],['Jun',65,'286'],['Jul',58,'254'],['Aug',75,'331'],['Sep',68,'298'],['Oct',85,'372']].map(x=>`<div class="bar-col"><span>${x[2]}</span><div class="bar" style="height:${x[1]}%"></div><small>${x[0]}</small></div>`).join('')}</div>
      </section>
      <section class="panel">${panelHead('Service distribution','Share of illustrative requests.')}
        <div class="activity-list">${[['Mutation / Namjari','34%'],['Khatian / Porcha','26%'],['Land tax','18%'],['Record correction','12%'],['Other services','10%']].map((x,i)=>`<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;font-size:10px;color:#60776b;margin-bottom:7px"><span>${x[0]}</span><b>${x[1]}</b></div><div class="progress"><span style="width:${parseInt(x[1])}%;background:${['#2e7656','#70a988','#b7d3bf','#7c9ab5','#d8c69c'][i]}"></span></div></div>`).join('')}</div>
      </section>
    </div>
    <div class="section-row"><div><h2>Report library</h2><p>Public reports should be aggregated and privacy-reviewed; restricted reports require explicit permissions.</p></div></div>
    <div class="service-grid">${[['Application funnel','Created → submitted → reviewed → completed','▥'],['Geographic service trends','District/upazila trends where data is authorised','⌖'],['Payment reconciliation','Provider settlement and transaction matching','৳'],['Data quality dashboard','Missing fields, duplicate candidates, GIS mismatch','◈']].map(x=>`<button class="service-card" data-action="open-report" data-name="${x[0]}"><span class="service-icon">${x[2]}</span><b>${x[0]}</b><small>${x[1]}</small></button>`).join('')}</div>`;
  }

  let featureLimit = 20;

  function featureCatalog(){
    const fs = manifest.features || [];
    const modules = [...new Set(fs.map(f => f.module || 'Other'))].sort();
    const count = fs.length;
    return `${heading('SCOPE & TRACEABILITY','Feature catalogue','Browse every tracked feature in the Maximum Feature Edition and inspect its implementation mapping.',`<button class="btn" data-action="export-features">↓ Export manifest</button>`)}
    <div class="catalog-stats">
      <div class="catalog-stat"><strong>${count}</strong><small>Tracked features</small><div class="progress"><span style="width:100%"></span></div></div>
      <div class="catalog-stat"><strong>${fs.filter(f=>f.priority==='P0').length}</strong><small>Priority P0</small><div class="progress"><span style="width:${count?fs.filter(f=>f.priority==='P0').length/count*100:0}%"></span></div></div>
      <div class="catalog-stat"><strong>${new Set(fs.map(f=>f.module)).size}</strong><small>Feature modules</small><div class="progress"><span style="width:100%"></span></div></div>
    </div>
    <div class="catalog-grid">
      <section class="panel" style="min-width:0">
        ${panelHead('All tracked features','Coverage catalogue is generated from the supplied package manifest.')}
        <div class="toolbar">
          <label class="field-search"><span>⌕</span><input id="featureSearch" placeholder="Search name, ID, API, database, integration…" value="${esc(state.featureQuery)}"/></label>
          <select class="select-field" id="featureModule">
            <option value="all">All modules</option>
            ${modules.map(m=>`<option ${state.featureModule===m?'selected':''}>${esc(m)}</option>`).join('')}
          </select>
          <select class="select-field" id="featurePriority">
            <option value="all">All priorities</option>
            <option ${state.featurePriority==='P0'?'selected':''}>P0</option>
            <option ${state.featurePriority==='P1'?'selected':''}>P1</option>
            <option ${state.featurePriority==='P2'?'selected':''}>P2</option>
          </select>
        </div>
        <div id="featureResults">${featureCards(filterFeatures())}</div>
        <div class="toolbar" style="justify-content:space-between;margin-top:14px">
          <span class="panel-subtitle" id="featureCount">Showing ${Math.min(featureLimit,count)} of ${count} features</span>
          <button class="btn" id="loadMoreFeatures" data-action="load-more">Load more features ↓</button>
        </div>
      </section>
      <aside>
        <section class="panel">
          ${panelHead('Implementation coverage','Traceability dimensions')}
          <div class="activity-list">${[['Frontend','UI / interaction'],['Backend','Domain service'],['Database','Entity / persistence'],['API','Contract / endpoint'],['Integration','Provider / authority'],['Phase','Dependency sequence']].map(x=>`<div class="activity-item"><div class="activity-icon">✓</div><div class="activity-copy"><b>${x[0]}</b><p>${x[1]}</p></div></div>`).join('')}</div>
        </section>
        <section class="panel" style="margin-top:12px">
          ${panelHead('Important boundary')}
          <p class="panel-subtitle" style="line-height:1.7">A tracked feature is a requirement, not proof it is implemented. Government-only data and legally authoritative decisions remain gated until official validation and access are granted.</p>
        </section>
      </aside>
    </div>`;
  }

  function filterFeatures(){
    return (manifest.features||[]).filter(f =>
      (state.featureModule==='all'||f.module===state.featureModule) &&
      (state.featurePriority==='all'||f.priority===state.featurePriority) &&
      (`${f.id} ${f.name} ${f.module} ${f.frontend} ${f.backend} ${f.database} ${f.api} ${f.integration} ${f.notes}`).toLowerCase().includes(state.featureQuery.toLowerCase())
    );
  }

  function featureCards(fs){
    return fs.slice(0,featureLimit).map(f=>`<article class="feature-card" style="margin-bottom:9px">
      <div class="feature-symbol">${iconsForModule(f.module)}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start">
          <h3>${esc(f.name)}</h3>
          <span class="feature-id">${esc(f.id)}</span>
        </div>
        <p>${esc(f.module||'General')} · ${esc(f.frontend||'Frontend module')} · ${esc(f.notes||'Implementation details defined in the specification.')}</p>
        <div class="feature-meta">
          <span class="pill ${f.priority==='P0'?'green':f.priority==='P1'?'blue':'gray'}">${esc(f.priority||'Unranked')}</span>
          <span class="pill gray">${esc(f.featureClass||'FEATURE')}</span>
          <span class="pill gray">${esc(f.maxPhase||f.phase||'Phase TBD')}</span>
          <button class="inline-link" data-action="feature-detail" data-id="${esc(f.id)}">Traceability ↗</button>
        </div>
      </div>
    </article>`).join('')||'<div class="no-results">No features match the current filters.</div>';
  }

  function iconsForModule(m=''){
    m=m.toLowerCase();
    if(m.includes('gis')||m.includes('map')||m.includes('parcel')) return '⌖';
    if(m.includes('ai')||m.includes('ocr')) return '✳';
    if(m.includes('document')) return '▧';
    if(m.includes('payment')||m.includes('tax')) return '৳';
    if(m.includes('security')||m.includes('audit')) return '◈';
    if(m.includes('admin')||m.includes('analytics')) return '▥';
    if(m.includes('application')||m.includes('workflow')) return '▣';
    return '▤';
  }

  function admin(){
    return `${heading('CONTROL CENTRE','Administration','A role-aware operational shell for authorised service administrators and system operators.',`<button class="btn" data-action="audit-log">◈ View audit log</button><button class="btn primary" data-action="admin-create">＋ Create configuration</button>`)}
    ${demoBanner()}
    <div class="stats-grid">
      ${stat('Service queues','08','▣','2|need attention','warning')}
      ${stat('Officer assignments','124','♙','+6|this week')}
      ${stat('Integration health','3 / 7','⌁','4|sandbox / unavailable','warning')}
      ${stat('Security alerts','02','◈','Review|recommended','warning')}
    </div>
    <div class="content-grid">
      <section class="panel">${panelHead('Operational queues','Sample operations dashboard.')}
        <div class="activity-list">${[['Mutation review queue','42 cases pending','amber'],['Record correction','18 cases pending','blue'],['Document verification','27 files pending','amber'],['Citizen complaints','09 cases pending','blue'],['Payment reconciliation','03 exceptions','amber']].map(x=>`<div class="activity-item"><div class="activity-icon">▣</div><div class="activity-copy"><b>${x[0]}</b><p>${x[1]}</p></div><button class="btn small" data-action="admin-queue" data-name="${x[0]}">Open</button></div>`).join('')}</div>
      </section>
      <section class="panel">${panelHead('Integration status','No live government integration is configured.')}
        <div class="activity-list">${[['Identity / NID','Not configured'],['Government land records','Adapter only'],['Payment provider','Sandbox only'],['SMS / Email','Not configured'],['Authoritative GIS','Demo geometry']].map(x=>`<div class="activity-item"><div class="activity-icon">⌁</div><div class="activity-copy"><b>${x[0]}</b><p>${x[1]}</p></div><span class="pill gray">Offline</span></div>`).join('')}</div>
      </section>
    </div>
    <div class="section-row"><div><h2>Administration modules</h2><p>High-impact configuration changes must be permission-gated and audited.</p></div></div>
    <div class="service-grid">${[['User & role management','RBAC / ABAC and delegated access','♙'],['Workflow designer','Configure service states and transitions','↗'],['Service catalogue','Forms, checklists, SLA and eligibility','▤'],['Audit & security','Review security events and admin changes','◈'],['Feature flags','Enable modules by environment or authority','⚙'],['Data quality','Review duplicates and reconciliation queues','⌁'],['Notification templates','Manage approved content by channel','♧'],['Integration registry','Provider health and failure queue','⇄']].map(x=>`<button class="service-card" data-action="admin-module" data-name="${x[0]}"><span class="service-icon">${x[2]}</span><b>${x[0]}</b><small>${x[1]}</small></button>`).join('')}</div>`;
  }

  function pageContent(){
    switch(state.page){
      case'dashboard':return dashboard();
      case'land-search':return landSearch();
      case'my-land':return myLand();
      case'services':return servicesPage();
      case'applications':return applicationsPage();
      case'gis':return gisPage();
      case'documents':return documentsPage();
      case'payments':return paymentsPage();
      case'due-diligence':return dueDiligence();
      case'ai-assistant':return aiAssistant();
      case'casebook':return casebook();
      case'appointments':return appointments();
      case'notifications':return notifications();
      case'analytics':return analytics();
      case'feature-catalog':return featureCatalog();
      case'admin':return admin();
      default:return dashboard();
    }
  }

  function renderPage(){
    $('#pageContent').innerHTML = pageContent();
    bindPageInputs();
  }

  function bindPageInputs(){
    const featureSearch = $('#featureSearch');
    if(featureSearch) featureSearch.addEventListener('input', e => { state.featureQuery = e.target.value; featureLimit = 20; refreshFeatureResults(); });
    const fm = $('#featureModule');
    if(fm) fm.addEventListener('change', e => { state.featureModule = e.target.value; featureLimit = 20; refreshFeatureResults(); });
    const fp = $('#featurePriority');
    if(fp) fp.addEventListener('change', e => { state.featurePriority = e.target.value; featureLimit = 20; refreshFeatureResults(); });

    const sf = $('#serviceFilter');
    if(sf) sf.addEventListener('input', filterServiceGrid);
    const sc = $('#serviceCategory');
    if(sc) sc.addEventListener('change', filterServiceGrid);

    const lf = $('#landFilter');
    if(lf) lf.addEventListener('input', filterLandTable);
    const lsf = $('#recordSurveyFilter');
    if(lsf) lsf.addEventListener('change', filterLandTable);

    const af = $('#applicationSearch');
    if(af) af.addEventListener('input', filterApplications);
    const ast = $('#applicationStatus');
    if(ast) ast.addEventListener('change', filterApplications);

    const df = $('#documentSearch');
    if(df) df.addEventListener('input', filterDocuments);
    const dc = $('#documentCategory');
    if(dc) dc.addEventListener('change', filterDocuments);

    const ps = $('#paymentSearch');
    if(ps) ps.addEventListener('input', filterPayments);
    const pst = $('#paymentStatusFilter');
    if(pst) pst.addEventListener('change', filterPayments);

    const ms = $('#mapSearch');
    if(ms) ms.addEventListener('keydown', e => {
      if(e.key === 'Enter') {
        e.preventDefault();
        actionHandler('locate-map', ms);
      }
    });

    const nf = $('#noticeFilter');
    if(nf) nf.addEventListener('change', () => {
      $$('#noticeList .notice-item').forEach(el => {
        el.style.display = nf.value === 'all' || el.dataset.noticeCategory === nf.value ? 'flex' : 'none';
      });
    });

    const chat = $('#chatForm');
    if(chat) chat.addEventListener('submit', e => {
      e.preventDefault();
      const input = $('#chatInput');
      const q = input.value.trim();
      if(!q) return;
      state.chat.push({role:'user',text:q}, {role:'assistant',text:answerFor(q)});
      renderPage();
      const msgs = $('#chatMessages');
      if(msgs) msgs.scrollTop = msgs.scrollHeight;
    });

    $$('[data-check]').forEach(c => c.addEventListener('change', updateCheckProgress));
  }

  function refreshFeatureResults(){
    const list = filterFeatures();
    const holder = $('#featureResults');
    if(holder) holder.innerHTML = featureCards(list);
    const count = $('#featureCount');
    if(count) count.textContent = `Showing ${Math.min(featureLimit, list.length)} of ${list.length} matching features`;
  }

  function filterServiceGrid(){
    const q = ($('#serviceFilter')?.value || '').toLowerCase();
    const cat = $('#serviceCategory')?.value || 'all';
    const arr = services.filter(s => (cat === 'all' || s.tag === cat) && `${s.title} ${s.desc} ${s.tag}`.toLowerCase().includes(q));
    const grid = $('#servicesGrid');
    if(grid) grid.innerHTML = serviceCards(arr);
  }

  function filterLandTable(){
    const q = ($('#landFilter')?.value || '').toLowerCase();
    const sur = $('#recordSurveyFilter')?.value || 'all';
    state.landQuery = q;
    const rows = [
      ['DAG-1842','Amin Bazar','731','RS','12.50 decimal'],
      ['DAG-1843','Amin Bazar','732','RS','8.00 decimal'],
      ['DAG-0918','Baipayl','204','SA','5.25 decimal']
    ].filter(r => (sur === 'all' || r[3] === sur) && r.join(' ').toLowerCase().includes(q));
    const tbl = $('#landTable');
    if(tbl) {
      tbl.innerHTML = rows.length ? table(rows.map(r => `<tr><td class="table-primary">${r[0]}</td><td><strong>${r[1]}</strong></td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td><span class="pill blue">Demo data</span></td><td><button class="table-actions" data-action="view-parcel" data-id="${r[0]}">Open ↗</button></td></tr>`).join(''), ['Dag reference','Mouza','Khatian','Survey','Recorded area','Source status','']) : '<div class="no-results">No records match. Try a different reference or location.</div>';
    }
  }

  function filterApplications(){
    const q = ($('#applicationSearch')?.value || '').toLowerCase();
    const f = $('#applicationStatus')?.value || 'all';
    const arr = applications.filter(a => (f === 'all' || a.tone === f) && `${a.id} ${a.service} ${a.parcel} ${a.status}`.toLowerCase().includes(q));
    const tbl = $('#applicationsTable');
    if(tbl) {
      tbl.innerHTML = arr.length ? table(appRows(arr), ['Reference ID','Service','Land reference','Submitted','Current status','']) : '<div class="no-results">No applications match this filter.</div>';
    }
  }

  function filterDocuments(){
    const q = ($('#documentSearch')?.value || '').toLowerCase();
    const cat = $('#documentCategory')?.value || 'all';
    const filtered = docs.filter(d => (cat === 'all' || d[2] === cat) && d.join(' ').toLowerCase().includes(q));
    const tbl = $('#documentsTable');
    if(tbl) {
      tbl.innerHTML = filtered.length ? table(docRows(filtered), ['Reference','Document','Category','Status','Last updated','']) : '<div class="no-results">No documents match this search or category filter.</div>';
    }
  }

  function filterPayments(){
    const q = ($('#paymentSearch')?.value || '').toLowerCase();
    const st = $('#paymentStatusFilter')?.value || 'all';
    const filtered = payments.filter(p => (st === 'all' || p.status.toLowerCase().includes(st.toLowerCase())) && `${p.id} ${p.service} ${p.amount}`.toLowerCase().includes(q));
    const tbl = $('#paymentsTable');
    if(tbl) {
      tbl.innerHTML = filtered.length ? table(paymentRows(filtered), ['Transaction ID','Service','Amount','Date','Status','']) : '<div class="no-results">No payment records match this filter.</div>';
    }
  }

  function updateCheckProgress(){
    const all = $$('[data-check]');
    all.forEach(c => { state.diligenceChecks[c.dataset.check] = c.checked; });
    const checked = all.filter(c => c.checked).length;
    const out = $('#checkProgress');
    if(out) out.textContent = `${checked} of ${all.length} checks marked`;
  }

  function answerFor(q){
    const t = q.toLowerCase();
    if(t.includes('khatian') || t.includes('porcha')) {
      return 'A Khatian is a land record/record-of-rights reference, while Porcha commonly refers to a copy or extract of that record. The exact record type and legal effect depend on the applicable survey and official record. Confirm the source, survey, Mouza, Khatian and Dag references with the competent land office. This demo cannot verify ownership.';
    }
    if(t.includes('mutation') || t.includes('namjari')) {
      return 'A mutation (Namjari) service generally concerns updating land records following a qualifying change. Before applying, gather the relevant deed or transfer/inheritance evidence, current record references, applicant identification requirements, and any service-specific checklist. Exact required documents, fees and timelines require official validation. Follow the competent authority’s current instructions.';
    }
    if(t.includes('purchase') || t.includes('buy') || t.includes('seller')) {
      return 'Before a purchase, organise a due-diligence checklist: compare record references and survey history, inspect the deed chain, verify the seller’s authority and co-sharer context, check taxes and any encumbrance/litigation through authorised sources, and compare the parcel on an authoritative map. This is not a title opinion; obtain qualified legal and official verification.';
    }
    if(t.includes('tax') || t.includes('dakhila')) {
      return 'For land development tax, keep the holding or land reference, relevant ownership/record details and previous receipts available. Use the official government service for current dues and payment. Do not rely on amounts shown in this demo; the payment screen uses illustrative data only.';
    }
    return 'I can help with general service guidance and checklists. Please share the service name or document type (avoid unnecessary personal data). Any legal interpretation, ownership claim, official fee, deadline, or government record must be verified against an authoritative source. This frontend is a demo and has no live government data or AI backend connected.';
  }

  function openModal(titleText, body, eyebrow='QUICK ACTION'){
    $('#modalTitle').textContent = titleText;
    $('#modalEyebrow').textContent = eyebrow;
    $('#modalBody').innerHTML = body;
    $('#modalBackdrop').hidden = false;
    const focus = $('#modalBody input, #modalBody select, #modalBody textarea, #modalBody button');
    if(focus) focus.focus();
  }

  function closeModal(){
    $('#modalBackdrop').hidden = true;
  }

  function modalForm(fields, submitLabel='Save'){
    return `<form id="modalForm">
      <div class="form-grid">${fields.map(f=>`<div class="form-field ${f.full?'full':''}"><label>${f.label}</label>${f.type==='textarea'?`<textarea name="${f.name}" placeholder="${f.placeholder||''}" ${f.required?'required':''}></textarea>`:f.options?`<select name="${f.name}" ${f.required?'required':''}>${f.options.map(o=>`<option>${o}</option>`).join('')}</select>`:`<input name="${f.name}" type="${f.type||'text'}" placeholder="${f.placeholder||''}" ${f.required?'required':''}/>`}</div>`).join('')}</div>
      <div class="form-note" style="margin-top:15px">This demo stores no information on a government system. Do not enter sensitive personal information.</div>
      <div class="modal-actions"><button type="button" class="btn" data-action="close-modal">Cancel</button><button type="submit" class="btn primary">${submitLabel}</button></div>
    </form>`;
  }

  function actionHandler(action, el){
    const id = el.dataset.id;
    const name = el.dataset.name;
    const service = el.dataset.service;

    switch(action){
      case 'new-application':
        openModal('Start a land-service application', modalForm([
          {name:'service',label:'Service',options:services.map(s=>s.title),required:true},
          {name:'landReference',label:'Land reference (optional)',placeholder:'e.g. DAG-1842'},
          {name:'mouza',label:'Mouza / location',placeholder:'Mouza and Upazila'},
          {name:'notes',label:'Notes for your checklist',type:'textarea',full:true,placeholder:'Describe what you want to prepare'}
        ],'Create draft'),'APPLICATION WORKSPACE');
        break;

      case 'application-detail': {
        const app = applications.find(x => x.id === id) || {id: id||'APP-UNKNOWN', service:'Land Service Application', parcel:'Not linked', date:'Recent', status:'In review', tone:'amber', step:2};
        openModal(`Application · ${esc(app.id)}`, `
          <div class="detail-row"><div><div class="detail-label">Service</div><div class="detail-value"><strong>${esc(app.service)}</strong></div></div><span class="pill ${app.tone}">${esc(app.status)}</span></div>
          <div class="detail-row" style="margin-top:12px"><div><div class="detail-label">Land Reference</div><div class="detail-value">${esc(app.parcel)}</div></div><div><div class="detail-label">Submitted</div><div class="detail-value">${esc(app.date)}</div></div></div>
          <div style="margin-top:16px"><div class="detail-label" style="margin-bottom:8px">Workflow Stage (${app.step || 2} of 5)</div>
            <div class="workflow">${[['1','Prepare','Checklist'],['2','Submit','Documents'],['3','Verify','Officer review'],['4','Decision','Approved/returned'],['5','Complete','Receipt/record']].map((x,i)=>`<div class="workflow-step ${i<(app.step||2)?'done':i===(app.step||2)?'current':''}"><div class="step-circle">${i<(app.step||2)?'✓':x[0]}</div><b>${x[1]}</b><small>${x[2]}</small></div>`).join('')}</div>
          </div>
          <div class="warning-panel" style="margin-top:14px">Illustrative application tracking. Official status must be verified with the competent land office.</div>
          <div class="modal-actions"><button class="btn" data-action="close-modal">Close</button><button class="btn primary" data-action="view-parcel" data-id="${esc(app.parcel.includes('1842')?'DAG-1842':'DAG-1843')}">View parcel on map ↗</button></div>
        `, 'APPLICATION DETAILS');
        break;
      }

      case 'document-detail': {
        const doc = docs.find(x => x[0] === id) || [id, 'Document reference', 'Land record', 'Verified', 'green', 'Recent'];
        openModal(`Document · ${esc(doc[0])}`, `
          <div class="detail-row"><div><div class="detail-label">Document Title</div><div class="detail-value"><strong>${esc(doc[1])}</strong></div></div><span class="pill ${doc[4]}">${esc(doc[3])}</span></div>
          <div class="detail-row" style="margin-top:12px"><div><div class="detail-label">Category</div><div class="detail-value">${esc(doc[2])}</div></div><div><div class="detail-label">Last Updated</div><div class="detail-value">${esc(doc[5])}</div></div></div>
          <div class="detail-row" style="margin-top:12px"><div><div class="detail-label">Integrity Status</div><div class="detail-value" style="font-family:monospace;font-size:10px">SHA-256 verified · e-Sign pending</div></div></div>
          <div class="warning-panel" style="margin-top:14px">Stored in local demo sandbox. Before legal use, verify physical certified copy or authoritative digital Porcha.</div>
          <div class="modal-actions"><button class="btn" data-action="close-modal">Close</button><button class="btn primary" data-action="document-guidance">Verification checklist →</button></div>
        `, 'DOCUMENT VAULT');
        break;
      }

      case 'service':
        openModal(service, `<p class="panel-subtitle" style="line-height:1.8">${esc((services.find(s=>s.title===service)||{}).desc||'Service guidance and checklist.')}</p>
        <div class="workflow">${[['1','Check','Eligibility'],['2','Prepare','Documents'],['3','Submit','Application'],['4','Track','Review']].map(x=>`<div class="workflow-step"><div class="step-circle">${x[0]}</div><b>${x[1]}</b><small>${x[2]}</small></div>`).join('')}</div>
        <div class="form-note">Required documents, fees, service timelines, and eligibility must be confirmed from current official guidance. This demo does not submit to a government service.</div>
        <div class="modal-actions"><button class="btn" data-action="close-modal">Close</button><button class="btn primary" data-action="new-application">Prepare application →</button></div>`, 'SERVICE GUIDANCE');
        break;

      case 'land-passport':
        openModal('Land Passport · EB-LP-001842', `<div class="detail-row"><div><div class="detail-label">Mouza / Upazila</div><div class="detail-value">Amin Bazar · Savar</div></div><div><div class="detail-label">District</div><div class="detail-value">Dhaka</div></div></div>
        <div class="detail-row" style="margin-top:13px"><div><div class="detail-label">Khatian / Survey</div><div class="detail-value">731 · RS</div></div><div><div class="detail-label">Dag / Area</div><div class="detail-value">1842 · 12.50 decimal</div></div></div>
        <div class="warning-panel" style="margin-top:16px">Demo data — not an official land record. A Land Passport is a user-facing aggregation of references and evidence, not a legal title certificate.</div>
        <div class="modal-actions"><button class="btn" data-action="close-modal">Close</button><button class="btn primary" data-action="view-parcel" data-id="DAG-1842">Open map ↗</button></div>`, 'LAND PASSPORT');
        break;

      case 'link-land':
        openModal('Link a land record', modalForm([
          {name:'district',label:'District',options:['Dhaka','Narail','Gazipur','Manikganj'],required:true},
          {name:'upazila',label:'Upazila / Thana',placeholder:'e.g. Savar',required:true},
          {name:'mouza',label:'Mouza',placeholder:'Mouza name',required:true},
          {name:'khatian',label:'Khatian number',placeholder:'Record number',required:true},
          {name:'dag',label:'Dag number',placeholder:'Plot number',required:true}
        ],'Link demo record'), 'MY LAND');
        break;

      case 'share-land':
        openModal('Share land workspace', modalForm([
          {name:'email',label:'Recipient email',type:'email',placeholder:'name@example.com',required:true},
          {name:'access',label:'Access level',options:['View only','Can add notes','Professional representative']},
          {name:'expiry',label:'Access expiry',options:['24 hours','7 days','30 days']}
        ],'Create demo share link'), 'SHARED WORKSPACE');
        break;

      case 'watch-land':
        toast('Change Watch enabled', `Demo watchlist added for parcel ${Number(id)+1}.`);
        break;

      case 'view-parcel':
        closeModal();
        state.selectedParcel = id || 'DAG-1842';
        setPage('gis');
        toast('Parcel selected', `${state.selectedParcel} · demo geometry`);
        break;

      case 'select-parcel':
        state.selectedParcel = id;
        renderPage();
        toast('Parcel selected', `${id} is illustrative demo geometry.`);
        break;

      case 'layer-toggle':
        state.layerState[el.dataset.layer] = !state.layerState[el.dataset.layer];
        renderPage();
        toast('Map layer updated', `${el.dataset.layer} layer ${state.layerState[el.dataset.layer]?'enabled':'disabled'}.`);
        break;

      case 'zoom-in':
        state.zoom = Math.min(1.6, state.zoom + .1);
        $('#mapCanvas').style.backgroundSize = `${160*state.zoom}px ${120*state.zoom}px,${210*state.zoom}px ${160*state.zoom}px,100% ${44*state.zoom}px`;
        toast('Map zoom', `${Math.round(state.zoom*100)}% schematic view`);
        break;

      case 'zoom-out':
        state.zoom = Math.max(.7, state.zoom - .1);
        $('#mapCanvas').style.backgroundSize = `${160*state.zoom}px ${120*state.zoom}px,${210*state.zoom}px ${160*state.zoom}px,100% ${44*state.zoom}px`;
        toast('Map zoom', `${Math.round(state.zoom*100)}% schematic view`);
        break;

      case 'run-land-search': {
        const n = $('#recordNumber')?.value || '1842';
        const res = $('#landResults');
        if(res){
          res.innerHTML = landResults();
          toast('Search completed', `Illustrative matches for ${n}.`);
          setTimeout(() => $('#landResults')?.scrollIntoView({behavior:'smooth',block:'start'}), 50);
        }
        break;
      }

      case 'reset-land-search':
        ['division','district','upazila','mouza','surveyType','searchBy','recordNumber','ownerName'].forEach(id => {
          const e = $('#'+id);
          if(e) e.value = '';
        });
        toast('Search reset', 'Enter a location or record reference.');
        break;

      case 'save-search':
        state.savedSearches.push({ query: $('#recordNumber')?.value || state.landQuery || 'Land search', date: new Date().toLocaleDateString() });
        toast('Search saved', 'Available in your saved-search workspace for this session.');
        break;

      case 'upload-document':
        openModal('Upload a document', `
          <div class="form-field"><label>Select a file</label><input type="file" id="demoFile" accept=".pdf,.jpg,.jpeg,.png,.webp"/><small class="panel-subtitle">File selection is local to this browser demo; no file is uploaded to a server.</small></div>
          <div class="form-grid" style="margin-top:15px">
            <div class="form-field"><label>Document category</label><select id="docCatSelect"><option>Land record</option><option>Deed / transfer</option><option>Payment receipt</option><option>Identity supporting document</option><option>Other</option></select></div>
            <div class="form-field"><label>Related reference</label><input id="docRefInput" placeholder="Application or parcel ID"/></div>
          </div>
          <div class="modal-actions"><button class="btn" data-action="close-modal">Cancel</button><button class="btn primary" data-action="confirm-upload">Validate selection</button></div>
        `, 'DOCUMENT VAULT');
        break;

      case 'confirm-upload': {
        const f = $('#demoFile')?.files?.[0];
        if(!f) { toast('Choose a file first'); break; }
        if(f.size > 10*1024*1024) { toast('File too large', 'Demo limit is 10 MB.'); break; }
        const cat = $('#docCatSelect')?.value || 'Uploaded document';
        docs.unshift([`DOC-${String(docs.length+1).padStart(4,'0')}`, f.name, cat, 'Needs review', 'amber', 'Just now']);
        toast('Document added', `${f.name} · ${Math.round(f.size/1024)} KB added to demo vault.`);
        closeModal();
        if(state.page === 'documents') renderPage();
        break;
      }

      case 'new-complaint':
        openModal('Create a complaint', modalForm([
          {name:'subject',label:'Complaint subject',placeholder:'Briefly describe the issue',required:true},
          {name:'reference',label:'Related application / document',placeholder:'Reference ID (optional)'},
          {name:'category',label:'Category',options:['Application delay','Document issue','Payment issue','Service access','Other']},
          {name:'description',label:'Description',type:'textarea',full:true,placeholder:'Provide relevant facts; avoid sensitive information',required:true}
        ],'Save complaint draft'), 'SUPPORT');
        break;

      case 'book-appointment':
        openModal('Book an appointment', modalForm([
          {name:'office',label:'Office / service desk',options:['Demo Service Centre · Savar','Land record guidance desk','Digital support desk'],required:true},
          {name:'service',label:'Purpose',options:['Land record guidance','Application follow-up','Document assistance','Payment query']},
          {name:'date',label:'Preferred date',type:'date',required:true},
          {name:'time',label:'Preferred time',options:['09:30 AM','10:30 AM','11:30 AM','02:00 PM','03:00 PM']}
        ],'Create demo booking'), 'APPOINTMENT');
        break;

      case 'appointment-detail':
        openModal('Appointment details', `
          <div class="detail-row"><div><div class="detail-label">Appointment token</div><div class="detail-value">DEMO-018</div></div><div><div class="detail-label">Date</div><div class="detail-value">22 Oct 2026</div></div></div>
          <p class="panel-subtitle" style="line-height:1.8;margin-top:14px">Demo Service Centre · Savar, Dhaka<br/>Land record guidance desk · 10:30 AM</p>
          <div class="warning-panel">This is not a confirmed booking at a real government office.</div>
          <div class="modal-actions"><button class="btn" data-action="close-modal">Close</button></div>
        `, 'APPOINTMENT');
        break;

      case 'cancel-appointment':
        toast('Demo booking cancelled', 'No real appointment was affected.');
        break;

      case 'feature-detail': {
        const f = manifest.features.find(x => x.id === id);
        if(!f) break;
        openModal(`${f.id} · ${f.name}`, `
          <div class="feature-meta">
            <span class="pill ${f.priority==='P0'?'green':'blue'}">${esc(f.priority||'Unranked')}</span>
            <span class="pill gray">${esc(f.featureClass||'FEATURE')}</span>
            <span class="pill gray">${esc(f.maxPhase||f.phase||'Phase TBD')}</span>
          </div>
          <div style="margin-top:18px">
            ${[['Module',f.module],['Frontend',f.frontend],['Backend',f.backend],['Database',f.database],['API',f.api],['Integration',f.integration],['Notes',f.notes]].map(x=>`<div class="detail-row"><div><div class="detail-label">${x[0]}</div><div class="detail-value" style="font-weight:500;line-height:1.6">${esc(x[1]||'Not specified')}</div></div></div>`).join('')}
          </div>
          <div class="modal-actions"><button class="btn" data-action="close-modal">Close</button></div>
        `, 'FEATURE TRACEABILITY');
        break;
      }

      case 'load-more':
        featureLimit += 20;
        refreshFeatureResults();
        break;

      case 'export-features':
        downloadFile('e-bhumi-feature-manifest.json', JSON.stringify(manifest, null, 2), 'application/json');
        toast('Feature manifest exported', `${manifest.features.length} tracked features.`);
        break;

      case 'export-report':
      case 'download-summary':
      case 'download-receipts':
      case 'export-map':
      case 'print-map':
        toast('Export prepared', 'In this frontend-only demo, export is represented by a local sample action.');
        break;

      case 'measure':
      case 'coordinates':
        openModal(action==='measure'?'Map measurement tool':'Coordinate lookup', modalForm([
          {name:'coordinate',label:action==='measure'?'Start/end points':'Coordinate pair',placeholder:action==='measure'?'Select two points on a connected GIS map':'Latitude, longitude',required:true},
          {name:'unit',label:'Unit',options:action==='measure'?['Square metres','Decimal','Hectare','Kilometre']:['WGS84 decimal degrees','DMS','Local grid (requires definition)']}
        ],'Run demo tool'), 'GIS TOOLS');
        break;

      case 'locate-map': {
        const query = ($('#mapSearch')?.value || '').trim().toUpperCase();
        const match = parcels.find(p => p[1].toUpperCase() === query || p[1].toUpperCase().includes(query) || (query.length > 2 && p[1].includes(query)));
        if(match) {
          state.selectedParcel = match[1];
          renderPage();
          toast('Parcel located', `Centered on ${match[1]} (${match[2]}).`);
        } else {
          toast('Map location', 'Centered on the illustrative Amin Bazar area.');
        }
        break;
      }

      case 'save-map':
        toast('Map view saved', 'Saved to this session only.');
        break;

      case 'document-guidance':
        openModal('Document checklist', `<div class="activity-list">${['Confirm document category and legibility','Check that names and record references are consistent','Keep original files unchanged; upload a readable copy','Verify requirements against the official service checklist','Retain submission receipt and version history'].map(x=>`<div class="activity-item"><div class="activity-icon">✓</div><div class="activity-copy"><b>${x}</b></div></div>`).join('')}</div>`, 'DOCUMENT GUIDANCE');
        break;

      case 'batch-verify':
        toast('Batch review opened', 'Select each document and record the human verification outcome.');
        break;

      case 'receipt':
      case 'payment-detail': {
        const item = payments.find(p => p.id === id) || {id: id||'PAY-DEMO-0019', service:'Land Development Tax', amount:'৳ 1,500', date:'12 Oct 2026', status:'Successful · demo'};
        openModal(action==='receipt'?'Demo payment receipt':'Payment transaction details', `
          <div class="detail-row"><div><div class="detail-label">Transaction reference</div><div class="detail-value">${esc(item.id)}</div></div><span class="pill green">Demo record</span></div>
          <div class="detail-row" style="margin-top:12px"><div><div class="detail-label">Service</div><div class="detail-value">${esc(item.service)}</div></div><div><div class="detail-label">Amount</div><div class="detail-value">${esc(item.amount)}</div></div></div>
          <div class="detail-row" style="margin-top:12px"><div><div class="detail-label">Provider status</div><div class="detail-value">Sandbox settled · Ekpay/Sonali Gateway Demo</div></div><div><div class="detail-label">Date</div><div class="detail-value">${esc(item.date)}</div></div></div>
          <div class="warning-panel" style="margin-top:15px">Not an official government receipt. No real money moved.</div>
          <div class="modal-actions"><button class="btn" data-action="close-modal">Close</button><button class="btn primary" data-action="print-receipt">Print demo receipt</button></div>
        `, 'PAYMENT CENTRE');
        break;
      }

      case 'print-receipt':
        window.print();
        break;

      case 'clear-chat':
        state.chat = [];
        renderPage();
        break;

      case 'chat-suggestion':
        state.chat.push({role:'user',text:el.dataset.text}, {role:'assistant',text:answerFor(el.dataset.text)});
        renderPage();
        break;

      case 'notification-settings':
        openModal('Notification preferences', modalForm([
          {name:'channel',label:'Preferred channel',options:['In-app','Email (not connected)','SMS (provider required)']},
          {name:'frequency',label:'Non-urgent updates',options:['Immediately','Daily summary','Weekly summary']},
          {name:'urgent',label:'Important deadline alerts',options:['Enabled','Disabled']}
        ],'Save preferences'), 'PREFERENCES');
        break;

      case 'mark-read':
        toast('Notifications marked as read', 'Demo state updated for this session.');
        break;

      case 'profile':
        openModal('Citizen profile', `
          <div class="detail-row"><div><div class="detail-label">Name</div><div class="detail-value">Citizen Account</div></div><div><div class="detail-label">Account type</div><div class="detail-value">Citizen · Demo</div></div></div>
          <div class="detail-row" style="margin-top:12px"><div><div class="detail-label">NID Verification</div><div class="detail-value"><span class="pill green">Verified · 9585288633</span></div></div><div><div class="detail-label">Phone</div><div class="detail-value">+880 1700-000000</div></div></div>
          <p class="panel-subtitle" style="line-height:1.7;margin-top:15px">Identity verification, profile changes, and delegated access must be handled by the authenticated backend in a production implementation.</p>
          <div class="modal-actions"><button class="btn" data-action="close-modal">Close</button></div>
        `, 'ACCOUNT');
        break;

      case 'workspace-switch':
        openModal('Switch Workspace', `
          <p class="panel-subtitle">Select the operational role or perspective to explore in the demo platform:</p>
          <div class="service-grid" style="margin-top:14px">
            <button class="service-card" data-action="switch-role" data-name="Citizen Workspace"><span class="service-icon">⌂</span><b>Citizen Workspace</b><small>Search, apply, track land records</small></button>
            <button class="service-card" data-action="switch-role" data-name="Land Officer Workspace"><span class="service-icon">⚙</span><b>Land Officer Desk</b><small>Review, audit, mutation casework</small></button>
            <button class="service-card" data-action="switch-role" data-name="Surveyor Workspace"><span class="service-icon">⌖</span><b>Cadastral Surveyor</b><small>Mouza maps, parcel boundaries, GIS</small></button>
          </div>
          <div class="modal-actions"><button class="btn" data-action="close-modal">Close</button></div>
        `, 'WORKSPACE SELECTION');
        break;

      case 'switch-role':
        closeModal();
        toast('Workspace role selected', `${name || 'Workspace'} active for this session.`);
        if(name && name.includes('Officer')) setPage('admin');
        else if(name && name.includes('Surveyor')) setPage('gis');
        else setPage('dashboard');
        break;

      case 'notifications':
        setPage('notifications');
        break;

      case 'help':
        openModal('Help centre', `<div class="activity-list">${[['Service guide','Understand available land services and checklists.'],['Application tracking','Use the reference number to review the latest status.'],['Document help','Prepare clear files and retain submission receipts.'],['Contact support','Create a complaint if you need a service follow-up.']].map(x=>`<div class="activity-item"><div class="activity-icon">?</div><div class="activity-copy"><b>${x[0]}</b><p>${x[1]}</p></div></div>`).join('')}</div>`, 'HELP');
        break;

      case 'service-compare':
        openModal('Compare services', `<div class="table-wrap"><table class="data-table"><thead><tr><th>Service</th><th>Purpose</th><th>Next step</th></tr></thead><tbody>${services.slice(0,5).map(s=>`<tr><td><strong>${s.title}</strong></td><td>${s.desc}</td><td><button class="table-actions" data-action="service" data-service="${s.title}">Explore ↗</button></td></tr>`).join('')}</tbody></table></div>`, 'SERVICE COMPARISON');
        break;

      case 'export-checklist':
        downloadFile('e-bhumi-due-diligence-checklist.txt', $$('[data-check]').map(c=>`${c.checked?'[x]':'[ ]'} ${c.parentElement.textContent.trim()}`).join('\n'), 'text/plain');
        toast('Checklist exported');
        break;

      case 'save-diligence': {
        const checkedCount = Object.values(state.diligenceChecks).filter(Boolean).length;
        toast('Review progress saved', `${checkedCount} checks saved in memory for this session.`);
        break;
      }

      case 'new-due-diligence':
        setPage('due-diligence');
        toast('Due diligence workspace', 'Use the checklist to begin a review.');
        break;

      case 'admin-module':
      case 'admin-queue':
      case 'open-report':
      case 'case-tool':
      case 'report-schedule':
      case 'audit-log':
      case 'admin-create':
        toast(name || action, 'This module is represented in the frontend. Connect its protected backend API to activate it.');
        break;

      case 'case-detail':
        openModal('Complaint details', `
          <div class="detail-row"><div><div class="detail-label">Case reference</div><div class="detail-value">${esc(id)}</div></div><span class="pill amber">Demo · Under review</span></div>
          <p class="panel-subtitle" style="line-height:1.7;margin-top:12px">Review the related application and retain evidence. Escalation decisions require authorised service staff.</p>
          <div class="modal-actions"><button class="btn" data-action="close-modal">Close</button></div>
        `, 'SUPPORT CASE');
        break;

      case 'close-modal':
        closeModal();
        break;

      default:
        toast('Action available in demo', 'This interaction is illustrative and not connected to a government backend.');
    }
  }

  function downloadFile(name, content, type){
    const blob = new Blob([content], {type});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  document.addEventListener('click', e => {
    const p = e.target.closest('[data-page]');
    if(p) {
      e.preventDefault();
      setPage(p.dataset.page);
      return;
    }
    const a = e.target.closest('[data-action]');
    if(a) {
      e.preventDefault();
      actionHandler(a.dataset.action, a);
    }
  });

  $('#modalBackdrop').addEventListener('click', e => {
    if(e.target === $('#modalBackdrop')) closeModal();
  });

  $('#modalBody').addEventListener('submit', e => {
    if(e.target.id === 'modalForm') {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      const t = $('#modalTitle').textContent;
      closeModal();
      toast(`${t} · draft saved`, 'Demo state only. No government service was contacted.');
      if(t.toLowerCase().includes('application')) {
        applications.unshift({
          id: `EB-DEMO-${String(applications.length + 1).padStart(4, '0')}`,
          service: data.service || 'New service request',
          parcel: data.landReference || 'Not linked',
          date: '16 Oct 2026',
          status: 'Draft created',
          tone: 'blue',
          step: 1
        });
        if(state.page === 'applications' || state.page === 'dashboard') renderPage();
      }
    }
  });

  $('#globalSearch').addEventListener('keydown', e => {
    if(e.key === 'Enter') {
      const q = e.target.value.trim();
      if(!q) return;
      state.landQuery = q;
      setPage('feature-catalog');
      state.featureQuery = q;
      renderPage();
      toast('Workspace search', `Searching features and service capabilities for “${q}”.`);
    }
  });

  $('#languageToggle').addEventListener('click', () => {
    state.lang = state.lang === 'en' ? 'bn' : 'en';
    document.documentElement.lang = state.lang === 'bn' ? 'bn' : 'en';
    $('#languageToggle').innerHTML = state.lang === 'bn' ? 'English <span>⌄</span>' : 'বাংলা <span>⌄</span>';
    renderNav();
    renderPage();
    $('#crumbCurrent').textContent = title(state.page);
    toast(state.lang === 'bn' ? 'বাংলা ইন্টারফেস লেবেল সক্রিয়' : 'English interface labels active', 'Some detailed demo content remains in English.');
  });

  $('#mobileMenu').addEventListener('click', () => $('.sidebar').classList.toggle('open'));

  document.addEventListener('keydown', e => {
    if((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      $('#globalSearch').focus();
    }
    if(e.key === 'Escape') closeModal();
  });

  async function init(){
    try {
      const r = await fetch('data/features.json');
      if(r.ok) {
        manifest = await r.json();
      }
    } catch(err) {
      console.warn('Feature manifest fetch failed (likely file:// protocol); loading built-in manifest.', err);
    }

    if(!manifest.features || !manifest.features.length) {
      manifest = {
        features: [
          {id:'FEAT-001',name:'Citizen Land Record Discovery & Search',module:'Search & Discovery',priority:'P0',featureClass:'FEATURE',phase:'Phase 1',frontend:'Land search UI',backend:'Search domain adapter',database:'PostgreSQL/PostGIS',api:'/api/v1/records/search',integration:'Government Land Records',notes:'Search by Division, District, Upazila, Mouza, Khatian and Dag.'},
          {id:'FEAT-002',name:'Land Passport & Property Portfolio',module:'Property Management',priority:'P0',featureClass:'FEATURE',phase:'Phase 1',frontend:'My Land workspace',backend:'Portfolio service',database:'Land records store',api:'/api/v1/parcels/passport',integration:'Authoritative Registry',notes:'Centralized citizen property wallet.'},
          {id:'FEAT-003',name:'Cadastral GIS Map & Parcel Boundaries',module:'GIS & Mapping',priority:'P0',featureClass:'FEATURE',phase:'Phase 1',frontend:'Leaflet/SVG GIS map',backend:'Spatial GIS service',database:'PostGIS geometry',api:'/api/v1/gis/parcels',integration:'Survey of Bangladesh / DLRS',notes:'Interactive boundary visualization and layer control.'},
          {id:'FEAT-004',name:'Mutation / Namjari Service Intake & Tracking',module:'Applications',priority:'P0',featureClass:'FEATURE',phase:'Phase 1',frontend:'Application tracker & wizard',backend:'Workflow engine',database:'Case state store',api:'/api/v1/applications/mutation',integration:'AC Land / Mutation Registry',notes:'Full lifecycle management with status tracking.'},
          {id:'FEAT-005',name:'Secure Document Vault & Verification',module:'Documents',priority:'P0',featureClass:'FEATURE',phase:'Phase 1',frontend:'Document vault & uploader',backend:'Intake & hashing service',database:'Encrypted object metadata',api:'/api/v1/documents/verify',integration:'e-Sign / Verification service',notes:'Tamper-evident storage and provenance logs.'},
          {id:'FEAT-006',name:'Land Development Tax (LD Tax) Portal',module:'Finance & Tax',priority:'P0',featureClass:'FEATURE',phase:'Phase 1',frontend:'Payment center & receipt viewer',backend:'Tax computation service',database:'Payment ledger',api:'/api/v1/finance/tax-dues',integration:'Sonali / Ekpay payment gateway',notes:'Calculate dues, view receipts, and payment status.'},
          {id:'FEAT-007',name:'AI Land Assistant & Document Understanding',module:'AI & Intelligence',priority:'P1',featureClass:'FEATURE',phase:'Phase 2',frontend:'Conversational assistant chat',backend:'Bounded LLM / RAG service',database:'Vector embeddings',api:'/api/v1/ai/guidance',integration:'Gemini API / Sovereign Model',notes:'Rule-bounded citizen guidance and terminology explanation.'},
          {id:'FEAT-008',name:'Citizen Grievance & Dispute Casebook',module:'Support & Disputes',priority:'P1',featureClass:'FEATURE',phase:'Phase 2',frontend:'Casebook & complaint form',backend:'Grievance service',database:'Dispute tickets',api:'/api/v1/cases/complaints',integration:'Central Grievance Redress System',notes:'Complaint tracking with escalation timelines.'}
        ]
      };
    }

    renderNav();
    renderPage();
  }

  init();
})();
