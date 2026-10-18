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
    diligenceChecks: {},
    leaseFilter: 'all',
    ctgCircle: 'ranga'
  };
  let manifest = { features: [] };

  const nav = [
    {id:'dashboard',label:'Overview',icon:'▦',group:'main'},
    {id:'land-search',label:'Land Search',icon:'⌕',group:'main'},
    {id:'my-land',label:'My Land & Passport',icon:'⌂',group:'main',count:'3'},
    {id:'services',label:'Land Services',icon:'▤',group:'main'},
    {id:'applications',label:'My Applications',icon:'▣',group:'main',count:'2'},
    {id:'land-lease',label:'Govt Land Lease',icon:'⌁',group:'main'},
    {id:'ctg-zone',label:'Hill Tracts Zone (CHT)',icon:'◭',group:'main'},
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
    {icon:'✳',title:'AI Document Guide',desc:'Understand document contents with source-aware guidance',tag:'AI'},
    {icon:'⌁',title:'Govt Lease / Bandobasto',desc:'Tea garden, khas land and industrial land lease services',tag:'Lease'},
    {icon:'◭',title:'CHT Land Procedure',desc:'Circle Chief and Mouza Headman approval process guidance',tag:'Special Zone'}
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
    ['DOC-0082','Mutation Porcha · demo','Land record','Verified','green','05 Jun 2025'],
    ['DOC-0072','Deed scan · sample','Uploaded document','Needs review','amber','08 Oct 2026'],
    ['DOC-0083','Historical deed · sample','Uploaded document','Needs review','amber','18 Mar 1985'],
    ['DOC-0079','Tax receipt · demo','Payment receipt','Verified','green','10 Oct 2026'],
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

  const leaseRecords = [
    {id:'LSE-SYL-0012',name:'Lackatura Tea Estate',type:'Tea garden lease',location:'Sylhet Sadar, Sylhet',area:'550 acres',term:'1998–2028',status:'Renewal in progress',tone:'amber'},
    {id:'LSE-SYL-0019',name:'Malnichhara Tea Estate',type:'Tea garden lease',location:'Sylhet Sadar, Sylhet',area:'420 acres',term:'2005–2035',status:'Active',tone:'green'},
    {id:'LSE-SYL-0027',name:'Chatak Valley Tea Estate',type:'Tea garden lease',location:'Chhatak, Sylhet',area:'780 acres',term:'1992–2022',status:'Expired · review required',tone:'amber'},
    {id:'LSE-MLV-0004',name:'Sreemangal Tea Estate',type:'Tea garden lease',location:'Sreemangal, Moulvibazar',area:'610 acres',term:'2008–2038',status:'Active',tone:'green'},
    {id:'LSE-KHS-0081',name:'Landless family khas allotment',type:'Khas land bandobasto',location:'Lohagara, Narail',area:'0.5 acre',term:'Perpetual · conditions apply',status:'Allotted',tone:'green'},
    {id:'LSE-KHS-0094',name:'Ashrayan Project allotment',type:'Khas land bandobasto',location:'Kalia, Narail',area:'2.0 acres',term:'Perpetual · conditions apply',status:'Verification in progress',tone:'amber'},
    {id:'LSE-IND-0033',name:'Private industrial park lease',type:'Industrial / commercial lease',location:'Savar, Dhaka',area:'40 acres',term:'2018–2048',status:'Active',tone:'green'}
  ];

  const chtCircles = [
    {id:'ranga',name:'Chakma Circle',district:'Rangamati Hill District',chief:'Circle Chief (Chakma Raja)',mouzas:'123 mouzas',desc:'The largest of the three CHT circles, administered under the 1900 CHT Regulation and the 1997 CHT Accord.'},
    {id:'bandar',name:'Bomang Circle',district:'Bandarban Hill District',chief:'Circle Chief (Bomang Raja)',mouzas:'99 mouzas',desc:'Covers most of Bandarban district, with its own Circle Chief and Mouza Headman structure.'},
    {id:'khagra',name:'Mong Circle',district:'Khagrachhari Hill District',chief:'Circle Chief (Mong Raja)',mouzas:'45 mouzas',desc:'Covers part of Khagrachhari district, with a parallel customary administration to the other two circles.'}
  ];

  const bn = {
    dashboard:'ওভারভিউ',
    'land-search':'জমি অনুসন্ধান',
    'my-land':'আমার জমি ও পাসপোর্ট',
    services:'ভূমি সেবা',
    applications:'আমার আবেদন',
    'land-lease':'সরকারি বন্দোবস্ত ও লিজ',
    'ctg-zone':'পার্বত্য চট্টগ্রাম জোন',
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
  function toast(message, detail=''){const el=document.createElement('div');el.className='toast';el.innerHTML=`${esc(message)}${detail?`<small>${esc(detail)}</small>`:''}`;$('#toastRegion').append(el);if(typeof gsap!=='undefined'&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){gsap.killTweensOf(el);gsap.fromTo(el,{y:14,opacity:0,scale:0.96},{y:0,opacity:1,scale:1,duration:0.25,ease:'power2.out',clearProps:'transform'});setTimeout(()=>{gsap.to(el,{y:-8,opacity:0,duration:0.2,ease:'power2.in',onComplete:()=>el.remove()});},3000);}else{setTimeout(()=>el.remove(),3500);}}
  function setPage(id){if(!nav.some(n=>n.id===id)) id='dashboard'; if(location.hash.slice(1)!==id) history.pushState(null,'','#'+id); state.page=id;renderNav();renderPage();$('#crumbCurrent').textContent=title(id);$('.sidebar').classList.remove('open');window.scrollTo({top:0,behavior:'smooth'});}

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
    return items.map(d=>`<tr><td class="table-primary">${esc(d[0])}</td><td><strong>${esc(d[1])}</strong></td><td>${esc(d[2])}</td><td><span class="pill ${d[4]}">${esc(d[3])}</span></td><td>${esc(d[5])}</td><td><button class="table-actions" data-action="document-detail" data-id="${esc(d[0])}">Open ↗</button><button class="table-actions" data-action="document-compare" data-id="${esc(d[0])}" style="margin-left:7px;color:#185343;font-weight:700" title="অন্য নথির সাথে তথ্য তুলনা করুন">⚖ Reconcile</button></td></tr>`).join('');
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
        <div class="form-field"><label>District</label><select id="district"><option value="">Select district</option><option>Dhaka</option><option>Narail</option><option>Gazipur</option><option>Manikganj</option><option>Sylhet</option><option>Moulvibazar</option><option>Chattogram</option><option>Rangamati</option><option>Bandarban</option><option>Khagrachhari</option></select></div>
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
    return `${heading('SERVICE DIRECTORY','Land services','Browse service guidance, required information, estimated process steps, and application entry points.',`<button class="btn primary" data-action="open-service-router">AI Service Router (#71)</button><button class="btn" data-action="service-compare">⇄ Compare services</button>`)}
    ${demoBanner()}
    <div class="service-router-banner">
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <span class="router-spark-icon" style="display:inline-flex;align-items:center;color:#1b5e48;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"></path></svg></span>
        <div style="flex:1">
          <strong style="color:#183d35;font-size:13px">কোন সরকারি সেবাটি আপনার প্রয়োজন নিশ্চিত নন? (AI Service Router #71)</strong>
          <p style="margin:2px 0 0;font-size:11.5px;color:#5a7368">আপনার জমি-সংক্রান্ত সমস্যা সহজ ভাষায় লিখুন। সিস্টেম যাচাইকৃত সরকারি সেবা ডিরেক্টরি অনুযায়ী সঠিক কর্তৃপক্ষ ও পোর্টালের দিকনির্দেশনা দেবে।</p>
        </div>
        <button class="btn small primary" data-action="open-service-router">AI Service Router ব্যবহার করুন →</button>
      </div>
    </div>
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

  let _leafletMapInstance = null, _leafletPolygons = {};
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
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors | e-Bhumi GIS'
      }).addTo(map);

      const parcelDefs = [
        { id: 'DAG-1842', coords: [[23.7850, 90.3330], [23.7855, 90.3345], [23.7848, 90.3350], [23.7842, 90.3335]], color: '#2d6a4f', name: 'DAG-1842', area: '12.50 decimal' },
        { id: 'DAG-1843', coords: [[23.7855, 90.3345], [23.7860, 90.3360], [23.7852, 90.3365], [23.7848, 90.3350]], color: '#1d4ed8', name: 'DAG-1843', area: '8.00 decimal' },
        { id: 'DAG-1844', coords: [[23.7842, 90.3335], [23.7848, 90.3350], [23.7840, 90.3355], [23.7835, 90.3338]], color: '#b45309', name: 'DAG-1844', area: '10.25 decimal' },
        { id: 'DAG-1845', coords: [[23.7848, 90.3350], [23.7852, 90.3365], [23.7845, 90.3370], [23.7840, 90.3355]], color: '#047857', name: 'DAG-1845', area: '6.75 decimal' }
      ];

      _leafletPolygons = {};
      parcelDefs.forEach(p => {
        const isSel = p.id === state.selectedParcel;
        const poly = L.polygon(p.coords, {
          color: p.color,
          fillColor: p.color,
          fillOpacity: isSel ? 0.65 : 0.28,
          weight: isSel ? 3 : 1.5
        }).addTo(map);

        poly.bindPopup(`
          <div style="font-family:'Hind Siliguri','Plus Jakarta Sans',sans-serif;font-size:13px;line-height:1.5;">
            <b style="font-size:14px;color:#173e33">${p.name}</b><br>
            <span>মৌজা: আমিন বাজার (Savar)</span><br>
            <span>পরিমাপ: <b>${p.area}</b></span><br>
            <div style="margin-top:6px;"><button class="btn small primary" data-action="select-parcel" data-id="${p.id}">সিলেক্ট করুন ↗</button></div>
          </div>
        `);

        poly.on('click', () => {
          state.selectedParcel = p.id;
          renderPage();
          toast('Parcel selected', `${p.id} is illustrative demo geometry.`);
        });

        _leafletPolygons[p.id] = poly;
      });

      setTimeout(() => map.invalidateSize(), 150);
    } catch (err) {
      console.warn('Leaflet initialization notice:', err);
    }
  }

  function gisPage(){
    const currentParcel = parcels.find(p => p[1] === state.selectedParcel) || parcels[0];
    return `${heading('GEOSPATIAL WORKSPACE','GIS & cadastral map','Explore illustrative parcel boundaries, switch map layers, and inspect parcel references.',`<button class="btn" data-action="measure">⌁ Measure</button><button class="btn primary" data-action="hill-terrain">⛰️ Hill 3D Area</button><button class="btn" data-action="export-map">↓ Export map</button>`)}
    ${demoBanner()}
    <div class="toolbar">
      <label class="field-search"><span>⌕</span><input id="mapSearch" placeholder="Search Dag (e.g. DAG-1842), Mouza…" value="${esc(state.selectedParcel)}"/></label>
      <select class="select-field"><option>Dhaka · Savar</option><option>Khulna · Narail</option></select>
      <button class="btn primary" data-action="locate-map">⌖ Locate</button>
    </div>
    <div class="map-layout">
      <div id="leafletMap" style="height:480px; width:100%; border-radius:12px; margin-bottom:14px; border:1px solid var(--line); z-index:1; overflow:hidden;"></div>
      <div class="map-canvas ${!state.layerState.parcels?'hide-parcels ':''}${!state.layerState.roads?'hide-roads ':''}${!state.layerState.water?'hide-water ':''}${!state.layerState.labels?'hide-labels ':''}" id="mapCanvas" style="display:none">
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
            <button class="btn small primary" data-action="hill-terrain">Hill 3D Topographic Area</button>
            <button class="btn small" data-action="print-map">▤ Print map</button>
            <button class="btn small" data-action="save-map">Save bookmark</button>
          </div>
        </section>
      </aside>
    </div>
    <p class="panel-subtitle" style="margin:12px 3px">GIS demo note: boundaries are schematic placeholders. Connect authoritative cadastral datasets and spatial services before operational use.</p>`;
  }

  function documentsPage(){
    return `${heading('SECURE DOCUMENTS','Documents vault','Organise uploaded evidence, service-generated files, receipts, and document verification status.',`<button class="btn" data-action="start-reconciliation">⚖ নথিপত্র তুলনা (Reconcile #55)</button><button class="btn" data-action="document-guidance">Document checklist</button><button class="btn primary" data-action="upload-document">↑ Upload document</button>`)}
    ${demoBanner()}
    <div class="reconcile-promo">
      <div class="reconcile-promo-icon">⚖</div>
      <div class="reconcile-promo-text">
        <span class="eyebrow" style="color:#2a6552;margin-bottom:3px">R&amp;D FEATURE #55 · DETERMINISTIC RECONCILIATION</span>
        <h3 style="margin:0 0 4px;font-size:15px;color:#173d35">Record Reconciliation Engine (দলিল ও খতিয়ান গরমিল নিরূপণ)</h3>
        <p style="margin:0;font-size:12px;color:#5a7368;line-height:1.5">যেকোনো দুটি দলিল বা খতিয়ানের তথ্য (মালিকের নাম, দাগ, খতিয়ান, মৌজা, জমির পরিমাণ ও একক) পাশাপাশি রেখে অমিল ও অসঙ্গতি নিরূপণ করুন। ফলাফল সরাসরি Land Case ফাইলে সংরক্ষণ করতে পারবেন।</p>
      </div>
      <button class="btn primary" data-action="start-reconciliation" style="white-space:nowrap">⚖ নথিপত্র তুলনা শুরু করুন →</button>
    </div>
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

  /* ==========================================================================
     R&D Feature #2: AI Land Case Builder
     Lightweight deterministic classification, clarifying questions, property
     linking, document checklists, and local persistence.
     ========================================================================== */

  const LAND_CASE_CATEGORIES = {
    mismatch: {
      key: 'mismatch',
      title: 'দলিল ও খতিয়ানের গরমিল',
      titleEn: 'Document & Record Mismatch',
      icon: '▤',
      desc: 'নামের বানান, দাগ নম্বর, খতিয়ান বা জমির পরিমাণে ভুল বা অসঙ্গতি',
      keywords: ['গরমিল', 'অমিল', 'ভুল', 'বানান', 'নামের ভুল', 'দাগের ভুল', 'খতিয়ানের ভুল', 'রেকর্ড ভুল', 'mismatch', 'spelling', 'error', 'discrepancy', 'অসঙ্গতি'],
      clarifyingQuestion: {
        question: 'কোথায় গরমিল বা অসঙ্গতিটি মূলত দেখা গেছে?',
        options: [
          'মালিকের নাম বা পিতার নামের বানানে ভুল',
          'দাগ নম্বর বা খতিয়ান নম্বরে অমিল',
          'জমির পরিমাপে কম-বেশি (ক্ষেত্রফল গরমিল)',
          'অন্যান্য অসঙ্গতি / নিশ্চিত নই'
        ]
      },
      documents: [
        { id: 'doc_1', name: 'মূল সাব-কবলা বা দান দলিল', desc: 'মালিকানা প্রাপ্তির মূল দলিল অথবা সার্টিফাইড নকল', defaultStatus: 'available' },
        { id: 'doc_2', name: 'সংশ্লিষ্ট পরচা / খতিয়ান কপি', desc: 'সিএস, এসএ, আরএস অথবা হাল বিএস পরচা', defaultStatus: 'verify' },
        { id: 'doc_3', name: 'জাতীয় পরিচয়পত্র (NID)', desc: 'আবেদনকারীর বর্তমান এনআইডি কার্ডের কপি', defaultStatus: 'available' },
        { id: 'doc_4', name: 'হাল সনের ভূমি উন্নয়ন কর দাখিলা', desc: 'ইউনিয়ন ভূমি অফিস কর্তৃক প্রদত্ত খাজনা পরিশোধের রসিদ', defaultStatus: 'missing' },
        { id: 'doc_5', name: 'ওয়ারিশান সনদ বা প্রত্যয়নপত্র', desc: 'প্রযোজ্য ক্ষেত্রে ইউনিয়ন পরিষদ/পৌরসভা থেকে প্রাপ্ত সনদ', defaultStatus: 'verify' }
      ],
      nextSteps: [
        'সহকারী কমিশনার (ভূমি) কার্যালয়ে রেকর্ড সংশোধনের মিসকেস (Miss Case) আবেদন প্রস্তুত করুন।',
        'সংশ্লিষ্ট উপজেলা সাব-রেজিস্ট্রি অফিস থেকে মূল দলিলের সার্টিফাইড নকল তুলে প্রস্তুত রাখুন।',
        'অনুপস্থিত দাখিলা রসিদ হালনাগাদ করার জন্য স্থানীয় ইউনিয়ন ভূমি অফিসে যোগাযোগ করুন।'
      ]
    },
    mutation: {
      key: 'mutation',
      title: 'নামজারি ও জমাভাগ',
      titleEn: 'Mutation / Namjari',
      icon: '⇄',
      desc: 'ক্রয়, হেবা বা উত্তরাধিকারসূত্রে জমি নিজের নামে রেকর্ডভুক্তকরণ',
      keywords: ['নামজারি', 'খারিজ', 'নামপত্তন', 'জমাভাগ', 'জোত', 'রেকর্ড পরিবর্তন', 'mutation', 'namjari', 'kharij', 'পত্তন'],
      clarifyingQuestion: {
        question: 'আপনার নামজারি বা খারিজ প্রক্রিয়ার বর্তমান অবস্থা কী?',
        options: [
          'এখনও কোনো আবেদন দাখিল করা হয়নি (নতুন আবেদন প্রস্তুত করতে চাই)',
          'অনলাইনে আবেদন দাখিল করা হয়েছে, শুনানি বা প্রতিবেদনের অপেক্ষায়',
          'আবেদন নামঞ্জুর বা বাতিল হয়েছে (আপিল বা পুনঃআবেদন করতে চাই)',
          'অন্যান্য / নির্দিষ্ট নয়'
        ]
      },
      documents: [
        { id: 'doc_1', name: 'রেজিস্ট্রিকৃত মূল দলিল বা সার্টিফাইড কপি', desc: 'ক্রয়কৃত সাব-কবলা, হেবা বা বণ্টননামা দলিল', defaultStatus: 'available' },
        { id: 'doc_2', name: 'পিঠ দলিল / বায়া দলিলের ধারাবাহিক কপি', desc: 'বিক্রেতার পূর্ববর্তী মালিকানার ধারাবাহিক দলিল', defaultStatus: 'verify' },
        { id: 'doc_3', name: 'হাল সনের ভূমি উন্নয়ন কর পরিশোধ দাখিলা', desc: 'সর্বশেষ অর্থবছর পর্যন্ত খাজনা পরিশোধের প্রমাণক', defaultStatus: 'available' },
        { id: 'doc_4', name: 'প্রস্তাবিত খতিয়ান ও আরএস/বিএস পরচা', desc: 'জমির সর্বশেষ জরিপের রেকর্ডীয় খতিয়ান কপি', defaultStatus: 'verify' },
        { id: 'doc_5', name: 'আবেদনকারীর পাসপোর্ট ছবি ও এনআইডি', desc: 'জাতীয় পরিচয়পত্র ও আবেদনকারীর সাম্প্রতিক ছবি', defaultStatus: 'available' }
      ],
      nextSteps: [
        'ভূমি মন্ত্রণালয়ের ই-নামজারি পোর্টালে (mutation.land.gov.bd) অনলাইনে আবেদন সম্পন্ন করুন।',
        'যেসব বায়া দলিল অনুপস্থিত, তা সাব-রেজিস্ট্রি অফিস থেকে তল্লাশি দিয়ে সংগ্রহ করুন।',
        'ইউনিয়ন ভূমি সহকারী কর্মকর্তা সরেজমিন তদন্তে আসলে জমি ও দখল প্রদর্শন করুন।'
      ]
    },
    verification: {
      key: 'verification',
      title: 'জমি ক্রয়ের পূর্ব যাচাই',
      titleEn: 'Pre-Purchase Verification',
      icon: '◈',
      desc: 'বায়না বা কেনার পূর্বে বিক্রেতার সঠিক মালিকানা ও নির্ভেজালতা পরীক্ষা',
      keywords: ['ক্রয়', 'কেনা', 'কিনতে', 'বায়না', 'যাচাই', 'বিক্রেতা', 'মালিকানা যাচাই', 'জাল দলিল', 'purchase', 'buy', 'verify', 'ownership check', 'কিনবো'],
      clarifyingQuestion: {
        question: 'বিক্রেতা জমিটির মালিকানা কীভাবে অর্জন করেছেন?',
        options: [
          'ক্রয়সূত্রে মালিক (সাব-কবলা দলিল দ্বারা অর্জিত)',
          'উত্তরাধিকার সূত্রে মালিক (পৈতৃক বা মাতার সম্পত্তি)',
          'দান, হেবা বা অন্যান্য উপায়ে অর্জিত',
          'নিশ্চিত নই / কাগজপত্র এখনও বিস্তারিত দেখা হয়নি'
        ]
      },
      documents: [
        { id: 'doc_1', name: 'বিক্রেতার নামের সর্বশেষ খতিয়ান ও পরচা', desc: 'বিক্রেতার নামে পৃথক নামজারি খতিয়ান হয়েছে কিনা যাচাই', defaultStatus: 'verify' },
        { id: 'doc_2', name: 'বিগত ২৫ বছরের বায়া দলিলের ধারাবাহিকতা', desc: 'মালিকানা হস্তান্তরের নিখুঁত ধারাবাহিক প্রমাণপত্র', defaultStatus: 'verify' },
        { id: 'doc_3', name: 'হাল সনের দাখিলা রসিদ', desc: 'সর্বশেষ খাজনা পরিশোধের রসিদ ও হোল্ডিং তথ্য', defaultStatus: 'available' },
        { id: 'doc_4', name: 'সরেজমিন দখল ও সীমানা প্রতিবেদন', desc: 'জমিতে বিক্রেতার প্রত্যক্ষ দখল ও সঠিক সীমানা অবস্থান', defaultStatus: 'missing' },
        { id: 'doc_5', name: 'সাব-রেজিস্ট্রি অফিস তল্লাশি রেকর্ড', desc: 'জমিটি কোনো ব্যাংক বা ব্যক্তির কাছে দায়বদ্ধ (Encumbrance) নয় মর্মে তল্লাশি', defaultStatus: 'missing' }
      ],
      nextSteps: [
        'উপজেলা সাব-রেজিস্ট্রি অফিসে বিগত ১২-২৫ বছরের দলিলের নির্ভেজালতা তল্লাশি (Search) দিন।',
        'স্থানীয় ইউনিয়ন ভূমি অফিসে গিয়ে বিক্রেতার নামে নামজারি ও জমাভাগ সঠিক আছে কিনা যাচাই করুন।',
        'সরকারি অনুমোদিত সার্ভেয়ার (আমিন) দ্বারা মৌজা ম্যাপের সাথে বাস্তব সীমানা মেপে নিশ্চিত হোন।'
      ]
    },
    inheritance: {
      key: 'inheritance',
      title: 'উত্তরাধিকার ও সম্পত্তি বণ্টন',
      titleEn: 'Inheritance & Distribution',
      icon: '⌁',
      desc: 'পৈতৃক সম্পত্তি ফারায়েজ অনুযায়ী বণ্টন ও ওয়ারিশান নামজারি',
      keywords: ['উত্তরাধিকার', 'ওয়ারিশ', 'ওয়ারিশ', 'ওয়ারিশান', 'ফারায়েজ', 'বণ্টন', 'বন্টন', 'পিতা মারা', 'মৃত', 'inheritance', 'heir', 'succession', 'faraiz', 'পৈতৃক'],
      clarifyingQuestion: {
        question: 'ওয়ারিশদের বর্তমান সম্মতি ও নথিপত্রের অবস্থা কী?',
        options: [
          'সকল ওয়ারিশের সম্মতি আছে, কিন্তু বণ্টননামা দলিল হয়নি',
          'রেজিস্ট্রিকৃত আপস বণ্টননামা সম্পন্ন হয়েছে',
          'ওয়ারিশদের মধ্যে অংশ বা সীমানা নিয়ে মতবিরোধ রয়েছে',
          'এখনও কোনো ওয়ারিশান সনদ বা কাগজ তৈরি করা হয়নি'
        ]
      },
      documents: [
        { id: 'doc_1', name: 'ইউপি/পৌরসভা থেকে ওয়ারিশান সনদ', desc: 'সংশ্লিষ্ট স্থানীয় সরকার কর্তৃপক্ষ প্রদত্ত বৈধ সনদপত্র', defaultStatus: 'available' },
        { id: 'doc_2', name: 'মূল মালিকের মৃত্যু সনদপত্র', desc: 'রেজিস্ট্রার কর্তৃক প্রদত্ত অফিসিয়াল ডেথ সার্টিফিকেট', defaultStatus: 'available' },
        { id: 'doc_3', name: 'মৃত ব্যক্তির নামের দলিল ও খতিয়ান', desc: 'পৈতৃক সম্পত্তির মূল রেকর্ড ও পরচা কপি', defaultStatus: 'verify' },
        { id: 'doc_4', name: 'পারিবারিক আপস বণ্টননামা দলিল', desc: 'রেজিস্ট্রিকৃত বণ্টন দলিল বা সালিশি রোয়েদাদ', defaultStatus: 'missing' },
        { id: 'doc_5', name: 'সকল জীবিত ওয়ারিশের এনআইডি কপি', desc: 'ফারায়েজ তালিকা ও উত্তরাধিকারীদের পরিচয় প্রমাণ', defaultStatus: 'verify' }
      ],
      nextSteps: [
        'ইসলামিক ফারায়েজ বা প্রযোজ্য পারিবারিক আইন অনুযায়ী অংশ বণ্টন তালিকা প্রস্তুত করুন।',
        'সকল ওয়ারিশ মিলে সাব-রেজিস্ট্রি অফিসে একটি রেজিস্ট্রিকৃত আপস বণ্টননামা সম্পাদন করুন।',
        'বণ্টননামার পর নিজ নিজ অংশের জন্য আলাদা ই-নামজারি আবেদন দাখিল করুন।'
      ]
    },
    lease: {
      key: 'lease',
      title: 'সরকারি লিজ ও বন্দোবস্ত',
      titleEn: 'Govt Lease & Settlement',
      icon: '⌁',
      desc: 'কৃষি খাস জমি বন্দোবস্ত, চা বাগান বা বাণিজ্যিক লিজ প্রক্রিয়া',
      keywords: ['লিজ', 'বন্দোবস্ত', 'খাস জমি', 'অর্পিত', 'পরিত্যক্ত', 'চা বাগান', 'lease', 'settlement', 'khas', 'bandobasto', 'সরকার জমি'],
      clarifyingQuestion: {
        question: 'এটি কী ধরনের সরকারি জমি বা লিজ আবেদন?',
        options: [
          'কৃষি খাস জমি বন্দোবস্ত (ভূমিহীন পরিবারের জন্য)',
          'বাণিজ্যিক, শিল্প বা প্রাতিষ্ঠানিক লিজ',
          'পূর্বে প্রাপ্ত লিজের মেয়াদ বৃদ্ধি বা নবায়ন',
          'অন্যান্য বা নিশ্চিত নই'
        ]
      },
      documents: [
        { id: 'doc_1', name: 'ভূমিহীন / যোগ্যতার প্রত্যয়নপত্র', desc: 'ইউপি চেয়ারম্যান বা স্থানীয় প্রশাসন কর্তৃক প্রদত্ত সনদপত্র', defaultStatus: 'verify' },
        { id: 'doc_2', name: 'জাতীয় পরিচয়পত্র ও নাগরিকত্ব সনদ', desc: 'পরিবারের প্রধান ও সদস্যদের পরিচয় নিশ্চিতকরণ', defaultStatus: 'available' },
        { id: 'doc_3', name: 'প্রস্তাবিত খাস জমির মৌজা ও দাগ বিবরণ', desc: 'নির্দিষ্ট দাগের অবস্থান ও পার্শ্ববর্তী সীমানা তথ্য', defaultStatus: 'verify' },
        { id: 'doc_4', name: 'স্থানীয় ভূমি সহকারী কর্মকর্তার সুপারিশ', desc: 'তহশিল অফিস কর্তৃক জমিটির খাস স্ট্যাটাস যাচাই', defaultStatus: 'missing' },
        { id: 'doc_5', name: 'পূর্ববর্তী লিজ চুক্তিপত্র (যদি নবায়ন হয়)', desc: 'পূর্বে সম্পাদিত লিজের কপি ও রসিদ', defaultStatus: 'missing' }
      ],
      nextSteps: [
        'উপজেলা নির্বাহী কর্মকর্তা (ইউএনও) বা এসি ল্যান্ড কার্যালয়ে নির্ধারিত ফরমে আবেদন জমা দিন।',
        'উপজেলা কৃষি খাস জমি বন্দোবস্ত কমিটির সভায় অনুমোদনের জন্য অপেক্ষা করুন।',
        'অনুমোদন পাওয়া গেলে সরকারি সালামি জমা দিয়ে বন্দোবস্ত কবুলিয়ত রেজিস্ট্রি করুন।'
      ]
    },
    tax: {
      key: 'tax',
      title: 'ভূমি উন্নয়ন কর ও দাখিলা',
      titleEn: 'Land Development Tax',
      icon: '৳',
      desc: 'অনলাইন খাজনা পরিশোধ, বকেয়া কর নির্ধারণ ও দাখিলা সংগ্রহ',
      keywords: ['কর', 'খাজনা', 'দাখিলা', 'বকেয়া', 'বকেয়া', 'এলডি ট্যাক্স', 'tax', 'khajna', 'dakhila', 'holding', 'ট্যাক্স'],
      clarifyingQuestion: {
        question: 'সর্বশেষ কোন অর্থবছর পর্যন্ত কর বা খাজনা পরিশোধ করা হয়েছে?',
        options: [
          'বিগত ২-৩ বছরের মধ্যে পরিশোধ করা হয়েছে',
          'দীর্ঘদিন (৫+ বছর) ধরে খাজনা দেওয়া হয়নি / বকেয়া জমেছে',
          'অনলাইনে হোল্ডিং এন্ট্রি এখনও করা হয়নি',
          'হালনাগাদ তথ্য জানা নেই'
        ]
      },
      documents: [
        { id: 'doc_1', name: 'সর্বশেষ পরিশোধিত খাজনার দাখিলা রসিদ', desc: 'পূর্ববর্তী ম্যানুয়াল বা ডিজিটাল রসিদের কপি', defaultStatus: 'available' },
        { id: 'doc_2', name: 'হাল খতিয়ান / নামজারি পর্চা', desc: 'বর্তমান মালিকানার রেকর্ডভুক্ত পরচা', defaultStatus: 'available' },
        { id: 'doc_3', name: 'অনলাইন হোল্ডিং নম্বর ট্র্যাকিং স্লিপ', desc: 'এলডি ট্যাক্স পোর্টাল থেকে প্রাপ্ত রেফারেন্স', defaultStatus: 'verify' },
        { id: 'doc_4', name: 'মালিকের এনআইডি ও সক্রিয় মোবাইল নম্বর', desc: 'ডিজিটাল পোর্টালে নিবন্ধিত তথ্য', defaultStatus: 'available' }
      ],
      nextSteps: [
        'ldtax.gov.bd পোর্টালে নাগরিক নিবন্ধন সম্পন্ন করে হোল্ডিং স্ট্যাটাস যাচাই করুন।',
        'বকেয়া করের পরিমাণ নির্ভুল করার জন্য সংশ্লিষ্ট ইউনিয়ন ভূমি অফিসের সহায়তা নিন।',
        'অনলাইনে মোবাইল ব্যাংকিং বা কার্ডের মাধ্যমে কর পরিশোধ করে কিউআর-কোডযুক্ত দাখিলা ডাউনলোড করুন।'
      ]
    },
    boundary: {
      key: 'boundary',
      title: 'সীমানা ও দখল বিরোধ',
      titleEn: 'Boundary & Possession Dispute',
      icon: '⌖',
      desc: 'জমির সীমানা নির্ধারণ, জবরদখল প্রতিরোধ ও সরকারি আমিন দ্বারা পরিমাপ',
      keywords: ['সীমানা', 'দখল', 'জবরদখল', 'বেদখল', 'পজেশন', 'মাপ', 'আমিন', 'আইল', 'ঘেরা', 'boundary', 'possession', 'dispute', 'encroachment', 'বেড়া'],
      clarifyingQuestion: {
        question: 'জমিটির বর্তমান দখল ও সীমানার অবস্থা কী?',
        options: [
          'জমি আমার পূর্ণ দখলে রয়েছে, কিন্তু সীমানা নিয়ে প্রতিবেশী আপত্তি তুলছে',
          'অন্য কেউ জোরপূর্বক বা আংশিক দখল করে রেখেছে',
          'সরকারি রাস্তা বা খালের কারণে সীমানা পরিবর্তন হয়েছে',
          'জমি পরিমাপ করা হয়নি, সীমানা অস্পষ্ট'
        ]
      },
      documents: [
        { id: 'doc_1', name: 'সিএস / আরএস / বিএস মৌজা নকশা (ম্যাপ)', desc: 'সরকারি জরিপ ম্যাপের সার্টিফাইড শিট', defaultStatus: 'verify' },
        { id: 'doc_2', name: 'মালিকানার মূল দলিল ও হাল খতিয়ান', desc: 'জমির সঠিক অবস্থান ও পরিমাপ প্রমাণের কাগজ', defaultStatus: 'available' },
        { id: 'doc_3', name: 'অনুমোদিত সার্ভেয়ার (আমিন) দ্বারা পরিমাপ স্কেচ', desc: 'চারদিকের পরিমাপ ও আইল চিহ্নিতকরণ নকশা', defaultStatus: 'missing' },
        { id: 'doc_4', name: 'দখল প্রমাণের সহায়ক দলিলপত্র', desc: 'বিদ্যুৎ বিল, গ্যাস সংযোগ বা স্থাপনার প্রমাণ', defaultStatus: 'verify' },
        { id: 'doc_5', name: 'স্থানীয় সালিশ বা চেয়ারম্যানের প্রত্যয়ন', desc: 'সীমানা বিরোধ নিষ্পত্তিতে স্থানীয় উদ্যোগের বিবরণ', defaultStatus: 'missing' }
      ],
      nextSteps: [
        'উপজেলা সেটেলমেন্ট অফিস বা জেলা রেকর্ডরুম থেকে মৌজা ম্যাপের ফটোকপি সংগ্রহ করুন।',
        'দুই পক্ষের উপস্থিতিতে সরকারি সনদপ্রাপ্ত অভিজ্ঞ আমিন দ্বারা সীমানা পরিমাপ করান।',
        'বিরোধ জটিল হলে ইউনিয়ন পরিষদ বা সহকারী কমিশনার (ভূমি) কার্যালয়ে লিখিত সীমানা নির্ধারণের আবেদন করুন।'
      ]
    },
    other: {
      key: 'other',
      title: 'অন্যান্য সমস্যা ও সাধারণ জিজ্ঞাসা',
      titleEn: 'Other Issue / General Guidance',
      icon: '✳',
      desc: 'উপরে উল্লেখিত বিষয়ের বাইরে যেকোনো সাধারণ ভূমি বিষয়ক সহায়তা',
      keywords: ['অন্যান্য', 'সাহায্য', 'পরামর্শ', 'help', 'general', 'other'],
      clarifyingQuestion: {
        question: 'আপনার সমস্যাটি মূলত কোন সরকারি কার্যালয়ের সাথে সংশ্লিষ্ট?',
        options: [
          'উপজেলা সহকারী কমিশনার (ভূমি) বা তহশিল অফিস',
          'সাব-রেজিস্ট্রি কার্যালয় (দলিল রেজিস্ট্রি সংক্রান্ত)',
          'জরিপ বা সেটেলমেন্ট অফিস (নকশা ও রেকর্ড সংক্রান্ত)',
          'অন্যান্য বা নিশ্চিত নই'
        ]
      },
      documents: [
        { id: 'doc_1', name: 'জমির সর্বশেষ দলিল বা পরচা', desc: 'মালিকানা বা সমস্যার সাথে সংশ্লিষ্ট নথি', defaultStatus: 'available' },
        { id: 'doc_2', name: 'আবেদনকারীর জাতীয় পরিচয়পত্র', desc: 'এনআইডি কার্ডের কপি', defaultStatus: 'available' },
        { id: 'doc_3', name: 'হাল সনের ভূমি উন্নয়ন কর দাখিলা', desc: 'সর্বশেষ খাজনা রসিদ', defaultStatus: 'verify' },
        { id: 'doc_4', name: 'পূর্ববর্তী কোনো আবেদন থাকলে তার কপি', desc: 'দাপ্তরিক ট্র্যাকিং নম্বর বা রসিদ', defaultStatus: 'missing' }
      ],
      nextSteps: [
        'কাগজপত্র গুছিয়ে উপজেলা ভূমি অফিসের হেল্পডেস্ক বা এসি ল্যান্ডের সাথে কথা বলুন।',
        'ভূমি মন্ত্রণালয়ের সেবা হটলাইন ১৬১২২-এ কল করে বিস্তারিত পরামর্শ নিতে পারেন।'
      ]
    }
  };

  /**
   * Deterministic local classifier for citizen land problems.
   * Pure function: decoupled from UI rendering.
   * Evaluates input keywords and calculates confidence.
   */
  function classifyLandIssue(rawText = ''){
    const text = normalize(rawText);
    if (!text || text.length < 12) {
      return {
        categoryKey: 'other',
        category: LAND_CASE_CATEGORIES.other.title,
        confidence: 'low',
        isVague: true,
        reason: 'ইনপুট অত্যন্ত সংক্ষিপ্ত'
      };
    }

    // Check specifically for generic phrases like "আমার জমি নিয়ে সমস্যা হচ্ছে"
    const genericPhrases = ['জমি নিয়ে সমস্যা', 'জমি নিয়ে সমস্যা', 'জমি সংক্রান্ত সমস্যা', 'আমার জমি', 'সাহায্য চাই', 'ভূমি সমস্যা', 'land problem', 'land issue', 'need help with land', 'problem with land'];
    const isGenericOnly = genericPhrases.some(p => text.includes(normalize(p))) && text.length < 35;

    const scores = {};
    const matchedCategories = [];

    for (const [key, cat] of Object.entries(LAND_CASE_CATEGORIES)) {
      if (key === 'other') continue;
      let score = 0;
      for (const kw of cat.keywords) {
        const normKw = normalize(kw);
        if (text.includes(normKw)) {
          score += 1;
        }
      }
      if (score > 0) {
        scores[key] = score;
        matchedCategories.push({ key, cat, score });
      }
    }

    matchedCategories.sort((a, b) => b.score - a.score);

    // If completely generic or no keywords matched
    if (isGenericOnly || matchedCategories.length === 0) {
      return {
        categoryKey: 'other',
        category: LAND_CASE_CATEGORIES.other.title,
        confidence: 'low',
        isVague: true,
        reason: 'সুনির্দিষ্ট কি-ওয়ার্ড পাওয়া যায়নি'
      };
    }

    // Check for ambiguous match: top 2 categories have equal scores
    if (matchedCategories.length > 1 && matchedCategories[0].score === matchedCategories[1].score) {
      return {
        categoryKey: matchedCategories[0].key,
        category: matchedCategories[0].cat.title,
        confidence: 'low',
        isVague: false,
        ambiguousMatches: matchedCategories.slice(0, 3).map(m => m.key),
        reason: 'একাধিক ক্যাটাগরির সমসংখ্যক ম্যাচ পাওয়া গেছে'
      };
    }

    const top = matchedCategories[0];
    const confidence = top.score >= 2 ? 'high' : 'medium';

    return {
      categoryKey: top.key,
      category: top.cat.title,
      confidence,
      isVague: false,
      reason: `ক্যাটাগরি ম্যাচ স্কোর: ${top.score}`
    };
  }

  function getSuggestedChecklist(categoryKey){
    const cat = LAND_CASE_CATEGORIES[categoryKey] || LAND_CASE_CATEGORIES.other;
    return cat.documents.map(d => ({
      id: d.id,
      name: d.name,
      desc: d.desc,
      status: d.defaultStatus || 'verify'
    }));
  }

  function getClarifyingQuestion(categoryKey){
    const cat = LAND_CASE_CATEGORIES[categoryKey] || LAND_CASE_CATEGORIES.other;
    return cat.clarifyingQuestion;
  }

  function getSuggestedNextSteps(categoryKey, checklist = []){
    const cat = LAND_CASE_CATEGORIES[categoryKey] || LAND_CASE_CATEGORIES.other;
    const baseSteps = [...cat.nextSteps];
    const missingDocs = checklist.filter(c => c.status === 'missing');
    if (missingDocs.length > 0) {
      baseSteps.unshift(`অনুপস্থিত নথি (${missingDocs.map(d => d.name).slice(0, 2).join(', ')}) সংগ্রহের জন্য দ্রুত সংশ্লিষ্ট দপ্তর বা নথিপত্রে তল্লাশি দিন।`);
    }
    return baseSteps;
  }

  /* Wizard state for AI Land Case Builder */
  let caseWizardState = {
    step: 1,
    description: '',
    categoryKey: 'other',
    category: '',
    confidence: 'low',
    isVague: false,
    ambiguousMatches: [],
    showCategoryGrid: false,
    clarificationAnswer: '',
    linkedParcel: '',
    checklist: [],
    notes: '',
    savedCaseId: null
  };

  const WIZARD_PRESETS = [
    { title: 'দলিল ও খতিয়ানের গরমিল', text: 'খতিয়ানের নামের বানানের সাথে আমার জাতীয় পরিচয়পত্রের নামের বানানে গরমিল আছে।' },
    { title: 'নামজারি ও জমাভাগ', text: 'নতুন জমি কিনেছি, নিজের নামে নামজারি ও জমাভাগ আবেদন প্রস্তুত করতে চাই।' },
    { title: 'জমি ক্রয়ের পূর্ব যাচাই', text: 'জমি কেনার পূর্বে বিক্রেতার সঠিক মালিকানা ও বিগত ২৫ বছরের বায়া দলিল যাচাই করতে চাই।' },
    { title: 'উত্তরাধিকার ও সম্পত্তি বণ্টন', text: 'পিতার মৃত্যুর পর ওয়ারিশদের মধ্যে পৈতৃক সম্পত্তি বণ্টন ও পৃথক নামজারি করতে চাই।' },
    { title: 'সরকারি লিজ ও বন্দোবস্ত', text: 'কৃষি খাস জমি বন্দোবস্ত পাওয়ার নিয়মাবলী ও প্রয়োজনীয় কাগজপত্র জানতে চাই।' },
    { title: 'ভূমি উন্নয়ন কর ও দাখিলা', text: 'কয়েক বছর ধরে জমির ভূমি উন্নয়ন কর (খাজনা) দেওয়া হয়নি, বকেয়া পরিশোধ করতে চাই।' },
    { title: 'সীমানা ও দখল বিরোধ', text: 'প্রতিবেশী সীমানা অতিক্রম করে জমি দখলের চেষ্টা করছে, সরকারি আমিন দিয়ে মাপতে চাই।' },
    { title: 'অস্পষ্ট ইনপুট (Clarification Test)', text: 'আমার জমি নিয়ে সমস্যা হচ্ছে।' }
  ];

  function startLandCaseBuilder(initialText = '', options = {}){
    const catKey = options.categoryKey || (initialText ? classifyLandIssue(initialText).categoryKey : 'other');
    const cat = LAND_CASE_CATEGORIES[catKey] || LAND_CASE_CATEGORIES.other;
    caseWizardState = {
      step: options.step || 1,
      description: initialText || '',
      categoryKey: catKey,
      category: options.category || cat.title,
      confidence: options.confidence || (catKey !== 'other' ? 'high' : 'low'),
      isVague: false,
      ambiguousMatches: [],
      showCategoryGrid: false,
      clarificationAnswer: options.clarificationAnswer || '',
      linkedParcel: options.linkedParcel || '',
      checklist: options.checklist || getSuggestedChecklist(catKey),
      notes: options.notes || '',
      reconciliation: options.reconciliation || null,
      savedCaseId: null
    };

    openModal('AI Land Case Builder', renderCaseBuilderWizard(), 'R&D FEATURE #2 · BANGLA-FIRST CASE BUILDER');
    $('.modal')?.classList.add('case-builder-modal');
  }

  function renderWizardStepper(currentStep){
    const steps = [
      { num: 1, label: 'সমস্যা বর্ণনা' },
      { num: 2, label: 'শনাক্তকরণ ও স্পষ্টীকরণ' },
      { num: 3, label: 'জমি নির্বাচন' },
      { num: 4, label: 'চেকলিস্ট' },
      { num: 5, label: 'পর্যালোচনা' }
    ];

    const progressPercent = Math.min(100, Math.max(0, (currentStep - 1) / 4 * 100));

    return `<div class="wizard-stepper">
      <div class="wizard-stepper-line"></div>
      <div class="wizard-stepper-progress" style="width: calc(${progressPercent}% * 0.85)"></div>
      ${steps.map(s => {
        const isCompleted = s.num < currentStep;
        const isActive = s.num === currentStep;
        return `<div class="wizard-step-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}">
          <div class="wizard-step-circle">${isCompleted ? '✓' : s.num}</div>
          <span class="wizard-step-label">${s.label}</span>
        </div>`;
      }).join('')}
    </div>`;
  }

  function renderCaseBuilderWizard(){
    const step = caseWizardState.step;

    if (step === 1) {
      return `${renderWizardStepper(1)}
        <div style="margin-bottom:14px">
          <h3 style="font-size:14px;color:#183d35;margin:0 0 6px">আপনার জমি সংক্রান্ত সমস্যাটি সহজ ভাষায় বর্ণনা করুন</h3>
          <p style="font-size:11px;color:#788f83;line-height:1.5;margin:0">বাংলা বা ইংরেজিতে আপনার সমস্যাটি লিখুন। নিচে দেওয়া বহুল প্রচলিত উদাহরণগুলোতে ক্লিক করেও শুরু করতে পারেন।</p>
        </div>
        <div class="preset-list">
          ${WIZARD_PRESETS.map(p => `<button type="button" class="preset-chip" data-action="wizard-preset" data-text="${esc(p.text)}">${esc(p.title)} ↗</button>`).join('')}
        </div>
        <div class="form-field full" style="margin-top:6px">
          <label for="wizardProblemText">সমস্যার বিস্তারিত বিবরণ <span style="color:var(--red)">*</span></label>
          <textarea id="wizardProblemText" style="min-height:110px" placeholder="উদাহরণ: খতিয়ানের নামের সাথে আমার জাতীয় পরিচয়পত্রের নামের বানান মিলছে না, কীভাবে সংশোধন করব?">${esc(caseWizardState.description)}</textarea>
        </div>
        <div class="form-note" style="margin-top:14px">
          🔒 আপনার তথ্য ব্রাউজারের স্থানীয় মেমরিতে নিরাপদ থাকে। কোনো সরকারি বা তৃতীয় পক্ষের সার্ভারে আপলোড করা হয় না।
        </div>
        <div class="modal-actions">
          <button type="button" class="btn" data-action="close-modal">বাতিল করুন</button>
          <button type="button" class="btn primary" data-action="wizard-next">পরবর্তী ধাপ (শনাক্তকরণ) →</button>
        </div>`;
    }

    if (step === 2) {
      const isLowConfidence = caseWizardState.confidence === 'low' || caseWizardState.isVague || caseWizardState.ambiguousMatches?.length > 1;
      const q = getClarifyingQuestion(caseWizardState.categoryKey);

      return `${renderWizardStepper(2)}
        <div style="margin-bottom:14px">
          <h3 style="font-size:14px;color:#183d35;margin:0 0 6px">সমস্যার ধরন শনাক্তকরণ ও প্রয়োজনীয় স্পষ্টীকরণ</h3>
          <p style="font-size:11px;color:#788f83;line-height:1.5;margin:0">সিস্টেমের স্বয়ংক্রিয় স্থানীয় নিয়মের সাহায্যে সম্ভাব্য ক্যাটাগরি বিশ্লেষণ করা হয়েছে।</p>
        </div>

        ${isLowConfidence ? `
          <div class="alert-box warning">
            <div style="font-size:20px;line-height:1">⚠️</div>
            <div style="flex:1">
              <strong style="display:block;font-size:12px;margin-bottom:3px">সমস্যার সুনির্দিষ্ট ধরনটি নিশ্চিত হওয়া যায়নি (Low-Confidence Heuristic)</strong>
              <span>আপনার দেওয়া বিবরণ থেকে সমস্যাটি এককভাবে চিহ্নিত করা যায়নি। অনুগ্রহ করে নিচে থেকে সঠিক বিষয়টি বেছে নিন:</span>
            </div>
          </div>
          <div class="category-select-grid">
            ${Object.values(LAND_CASE_CATEGORIES).map(c => `
              <div class="category-option-card ${caseWizardState.categoryKey === c.key ? 'selected' : ''}" data-action="wizard-select-category" data-key="${c.key}">
                <div class="category-card-icon">${c.icon}</div>
                <div class="category-card-info">
                  <b>${esc(c.title)}</b>
                  <small>${esc(c.desc)}</small>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="alert-box success">
            <div style="font-size:20px;line-height:1">✓</div>
            <div style="flex:1">
              <strong style="display:block;font-size:12px;margin-bottom:3px">শনাক্তকৃত সম্ভাব্য ধরন: ${esc(caseWizardState.category)}</strong>
              <small style="color:#2a6552">স্থানীয় হেউরিস্টিক নিয়মের সাহায্যে প্রস্তাবিত (ডেমো অ্যালগরিদম — যাচাইকৃত নয়)।</small>
            </div>
            <button type="button" class="btn small" data-action="wizard-toggle-categories" style="white-space:nowrap">${caseWizardState.showCategoryGrid ? 'তালিকা লুকান' : 'ধরন পরিবর্তন করুন ✎'}</button>
          </div>
          ${caseWizardState.showCategoryGrid ? `
            <div class="category-select-grid">
              ${Object.values(LAND_CASE_CATEGORIES).map(c => `
                <div class="category-option-card ${caseWizardState.categoryKey === c.key ? 'selected' : ''}" data-action="wizard-select-category" data-key="${c.key}">
                  <div class="category-card-icon">${c.icon}</div>
                  <div class="category-card-info">
                    <b>${esc(c.title)}</b>
                    <small>${esc(c.desc)}</small>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        `}

        <div style="margin-top:16px;border-top:1px solid #e5ece8;padding-top:14px">
          <label style="font-size:12px;font-weight:700;color:#1d4235;display:block;margin-bottom:6px">
            প্রয়োজনীয় স্পষ্টীকরণ প্রশ্ন: ${esc(q.question)}
          </label>
          <p style="font-size:11px;color:#6d8479;margin:0 0 10px">সঠিক চেকলিস্ট দেওয়ার জন্য একটি উপযুক্ত বিকল্প নির্বাচন করুন (না জানলে এড়িয়ে যেতে পারেন):</p>
          <div class="clarify-option-group">
            ${q.options.map(opt => `
              <button type="button" class="clarify-option-btn ${caseWizardState.clarificationAnswer === opt ? 'selected' : ''}" data-action="wizard-select-clarify" data-val="${esc(opt)}">
                <span class="clarify-radio-circle"></span>
                <span>${esc(opt)}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn" data-action="wizard-prev">← পূর্ববর্তী</button>
          <button type="button" class="btn primary" data-action="wizard-next">পরবর্তী ধাপ (জমি নির্বাচন) →</button>
        </div>`;
    }

    if (step === 3) {
      return `${renderWizardStepper(3)}
        <div style="margin-bottom:14px">
          <h3 style="font-size:14px;color:#183d35;margin:0 0 6px">জমি নির্বাচন (ঐচ্ছিক)</h3>
          <p style="font-size:11px;color:#788f83;line-height:1.5;margin:0">আপনার সমস্যাটি কি ডেমো সিস্টেমে থাকা কোনো নির্দিষ্ট পার্সেল বা খতিয়ানের সাথে সম্পর্কিত? চাইলে একটি জমি যুক্ত করতে পারেন, অথবা জমি লিঙ্ক না করেই চালিয়ে যান।</p>
        </div>

        <div class="parcel-link-grid">
          <div class="parcel-option-card ${caseWizardState.linkedParcel === '' ? 'selected' : ''}" data-action="wizard-select-parcel" data-parcel="">
            <b>✓ নির্দিষ্ট জমি লিঙ্ক না করেই এগিয়ে যান</b>
            <small>সাধারণ পরামর্শ বা সামগ্রিক কেস ফাইলের জন্য উপযুক্ত</small>
          </div>
          ${parcels.map(p => `
            <div class="parcel-option-card ${caseWizardState.linkedParcel === p[1] ? 'selected' : ''}" data-action="wizard-select-parcel" data-parcel="${p[1]}">
              <b>${p[1]} · ${p[2]}</b>
              <small>আমিন বাজার, সাভার · খতিয়ান ৭৩১</small>
            </div>
          `).join('')}
        </div>

        <div class="form-note" style="margin-top:14px">
          নোট: জমি লিঙ্ক করা সম্পূর্ণ ঐচ্ছিক। জমি সিলেক্ট করলে আপনার কেসবুকে জমির রেফারেন্স যুক্ত থাকবে।
        </div>

        <div class="modal-actions">
          <button type="button" class="btn" data-action="wizard-prev">← পূর্ববর্তী</button>
          <button type="button" class="btn primary" data-action="wizard-next">পরবর্তী ধাপ (চেকলিস্ট) →</button>
        </div>`;
    }

    if (step === 4) {
      const avail = caseWizardState.checklist.filter(c => c.status === 'available').length;
      const missing = caseWizardState.checklist.filter(c => c.status === 'missing').length;
      const verify = caseWizardState.checklist.filter(c => c.status === 'verify').length;

      return `${renderWizardStepper(4)}
        <div style="margin-bottom:14px">
          <h3 style="font-size:14px;color:#183d35;margin:0 0 6px">প্রয়োজনীয় কাগজপত্র ও অনুপস্থিত তথ্যের চেকলিস্ট</h3>
          <p style="font-size:11px;color:#788f83;line-height:1.5;margin:0">আপনার সমস্যার ধরন অনুযায়ী প্রাথমিক প্রয়োজনীয় কাগজপত্রের তালিকা প্রস্তুত করা হয়েছে। আপনার কাছে থাকা কাগজপত্র চিহ্নিত করুন।</p>
        </div>

        <div style="display:flex;gap:8px;align-items:center;margin-bottom:12px;font-size:11px;font-weight:700">
          <span class="pill green">${avail} সংগৃহীত</span>
          <span class="pill amber">${missing} অনুপস্থিত</span>
          <span class="pill blue">${verify} যাচাই প্রয়োজন</span>
        </div>

        <div class="checklist-card-list">
          ${caseWizardState.checklist.map(item => `
            <div class="checklist-card-item">
              <div class="checklist-card-title">
                <b>${esc(item.name)}</b>
                <small>${esc(item.desc)}</small>
              </div>
              <div class="checklist-btn-group">
                <button type="button" class="check-toggle-btn ${item.status === 'available' ? 'active-available' : ''}" data-action="wizard-toggle-doc" data-id="${item.id}" data-status="available">✓ সংগৃহীত</button>
                <button type="button" class="check-toggle-btn ${item.status === 'missing' ? 'active-missing' : ''}" data-action="wizard-toggle-doc" data-id="${item.id}" data-status="missing">✗ অনুপস্থিত</button>
                <button type="button" class="check-toggle-btn ${item.status === 'verify' ? 'active-verify' : ''}" data-action="wizard-toggle-doc" data-id="${item.id}" data-status="verify">? যাচাই প্রয়োজন</button>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="form-field full" style="margin-top:14px">
          <label for="wizardCaseNotes">অনুপস্থিত তথ্য বা অতিরিক্ত নোট (ঐচ্ছিক)</label>
          <textarea id="wizardCaseNotes" placeholder="যেমন: বায়া দলিলের কপি তল্লাশি চলছে, বা খতিয়ানের মূল নকল সংগ্রহ করতে হবে...">${esc(caseWizardState.notes)}</textarea>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn" data-action="wizard-prev">← পূর্ববর্তী</button>
          <button type="button" class="btn primary" data-action="wizard-next">পরবর্তী ধাপ (পর্যালোচনা) →</button>
        </div>`;
    }

    if (step === 5) {
      const avail = caseWizardState.checklist.filter(c => c.status === 'available').length;
      const missing = caseWizardState.checklist.filter(c => c.status === 'missing').length;
      const verify = caseWizardState.checklist.filter(c => c.status === 'verify').length;
      const nextSteps = getSuggestedNextSteps(caseWizardState.categoryKey, caseWizardState.checklist);

      return `${renderWizardStepper(5)}
        <div style="margin-bottom:14px">
          <h3 style="font-size:14px;color:#183d35;margin:0 0 6px">কেস ড্রাফট পর্যালোচনা ও সংরক্ষণ</h3>
          <p style="font-size:11px;color:#788f83;line-height:1.5;margin:0">সংরক্ষণ করার পূর্বে আপনার তৈরি করা কেস ফাইলের সকল তথ্য এক নজরে দেখে নিন। যেকোনো সময় সম্পাদনা করতে পারবেন।</p>
        </div>

        <div class="review-section">
          <div class="review-section-head">
            <b>১. সমস্যার মূল বিবরণ</b>
            <button type="button" class="inline-link" data-action="wizard-jump" data-step="1">সম্পাদনা ✎</button>
          </div>
          <p>${esc(caseWizardState.description)}</p>
        </div>

        <div class="review-section">
          <div class="review-section-head">
            <b>২. শনাক্তকৃত শ্রেণি ও স্পষ্টীকরণ</b>
            <button type="button" class="inline-link" data-action="wizard-jump" data-step="2">সম্পাদনা ✎</button>
          </div>
          <p>
            <strong>ক্যাটাগরি:</strong> ${esc(caseWizardState.category)} <span class="pill gray" style="font-size:8px">লোকাল ডেমো হেউরিস্টিক</span><br/>
            <strong>স্পষ্টীকরণ উত্তর:</strong> ${esc(caseWizardState.clarificationAnswer || 'নির্বাচন করা হয়নি (এড়িয়ে যাওয়া হয়েছে)')}
          </p>
        </div>

        <div class="review-section">
          <div class="review-section-head">
            <b>৩. সম্পর্কিত জমি</b>
            <button type="button" class="inline-link" data-action="wizard-jump" data-step="3">সম্পাদনা ✎</button>
          </div>
          <p>${caseWizardState.linkedParcel ? `<strong>${esc(caseWizardState.linkedParcel)}</strong> · আমিন বাজার, সাভার (খতিয়ান ৭৩১)` : 'কোনো নির্দিষ্ট জমি লিঙ্ক করা নেই'}</p>
        </div>

        <div class="review-section">
          <div class="review-section-head">
            <b>৪. নথিপত্র চেকলিস্ট (${avail} সংগৃহীত, ${missing} অনুপস্থিত, ${verify} যাচাই বাকি)</b>
            <button type="button" class="inline-link" data-action="wizard-jump" data-step="4">সম্পাদনা ✎</button>
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;margin-top:6px">
            ${caseWizardState.checklist.map(i => `
              <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px">
                <span>${esc(i.name)}</span>
                <span class="pill ${i.status === 'available' ? 'green' : i.status === 'missing' ? 'amber' : 'blue'}">
                  ${i.status === 'available' ? 'সংগৃহীত' : i.status === 'missing' ? 'অনুপস্থিত' : 'যাচাই প্রয়োজন'}
                </span>
              </div>
            `).join('')}
          </div>
          ${caseWizardState.notes ? `<div style="margin-top:10px;padding-top:8px;border-top:1px dashed #dce7e1;font-size:11px;color:#456657"><strong>নোট:</strong> ${esc(caseWizardState.notes)}</div>` : ''}
        </div>

        <div class="review-section">
          <div class="review-section-head">
            <b>৫. পরবর্তী করণীয় ও প্রাথমিক সুপারিশ</b>
          </div>
          <ul class="steps-checklist">
            ${nextSteps.map(s => `<li>${esc(s)}</li>`).join('')}
          </ul>
        </div>

        <div class="alert-box warning">
          <div style="font-size:20px;line-height:1">⚠️</div>
          <div>
            <strong>আইনি অস্বীকৃতি ও ডেমো নোটিশ:</strong> এটি একটি ব্রাউজার-ভিত্তিক প্রস্তুতিমূলক কেস ফাইল। এটি কোনো সরকারি সংস্থার গৃহীত অফিসিয়াল আবেদন বা আদালতের মামলা নয়। কোনো আইনি পদক্ষেপ গ্রহণের পূর্বে স্থানীয় সহকারী কমিশনার (ভূমি) বা উপযুক্ত আইনজ্ঞের পরামর্শ নিন।
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn" data-action="wizard-prev">← সম্পাদনা করুন</button>
          <button type="button" class="btn" data-action="close-modal">বাতিল করুন</button>
          <button type="button" class="btn primary" data-action="wizard-confirm-save">✓ নিশ্চিত করুন ও কেস সংরক্ষণ করুন</button>
        </div>`;
    }

    if (step === 6) {
      return `<div class="confirmation-box">
        <div class="confirmation-icon">✓</div>
        <h2 style="font-size:20px;color:#183d35;margin:0 0 6px">আপনার Land Case ফাইলটি সংরক্ষিত হয়েছে!</h2>
        <p style="font-size:12px;color:#6b8276;max-width:440px;margin:0 auto 12px">কেসটি আপনার ব্রাউজার মেমোরিতে নিরাপদে সংরক্ষিত রয়েছে। কেসবুক থেকে যেকোনো সময় এই কেসটি খুলতে পারবেন এবং কাগজপত্রের অবস্থা আপডেট করতে পারবেন।</p>
        <div class="case-ref-badge">${esc(caseWizardState.savedCaseId || 'LCASE-2026-DEMO')}</div>
        <div style="background:#f4f8f5;border:1px solid #dce8df;border-radius:12px;padding:12px;max-width:460px;margin:0 auto 18px;text-align:left;font-size:11.5px">
          <div><strong>শ্রেণি:</strong> ${esc(caseWizardState.category)}</div>
          <div style="margin-top:4px"><strong>সম্পর্কিত জমি:</strong> ${esc(caseWizardState.linkedParcel || 'নির্দিষ্ট জমি নেই')}</div>
          <div style="margin-top:4px"><strong>চেকলিস্ট:</strong> ${caseWizardState.checklist.filter(c => c.status === 'available').length}টি সংগৃহীত, ${caseWizardState.checklist.filter(c => c.status === 'missing').length}টি অনুপস্থিত</div>
        </div>
        <div class="modal-actions" style="justify-content:center">
          <button type="button" class="btn primary" data-action="wizard-goto-casebook">কেসবুকে সংরক্ষিত কেস দেখুন →</button>
          <button type="button" class="btn" data-action="wizard-new-case">নতুন আরেকটি কেস তৈরি করুন</button>
          <button type="button" class="btn" data-action="close-modal">বন্ধ করুন</button>
        </div>
      </div>`;
    }

    return '';
  }

  /* Wizard action dispatcher */
  function handleCaseWizardAction(action, el){
    switch(action){
      case 'wizard-preset': {
        const text = el.dataset.text || '';
        const textarea = $('#wizardProblemText');
        if (textarea) textarea.value = text;
        caseWizardState.description = text;
        break;
      }

      case 'wizard-next': {
        if (caseWizardState.step === 1) {
          const text = $('#wizardProblemText')?.value?.trim() || '';
          if (!text) {
            toast('বিবরণ আবশ্যক', 'অনুগ্রহ করে আপনার সমস্যাটি লিখুন বা উপরের উদাহরণ থেকে বেছে নিন।');
            $('#wizardProblemText')?.focus();
            return;
          }
          caseWizardState.description = text;
          const cls = classifyLandIssue(text);
          caseWizardState.categoryKey = cls.categoryKey;
          caseWizardState.category = cls.category;
          caseWizardState.confidence = cls.confidence;
          caseWizardState.isVague = cls.isVague;
          caseWizardState.ambiguousMatches = cls.ambiguousMatches || [];
          caseWizardState.showCategoryGrid = (cls.confidence === 'low' || cls.isVague || (cls.ambiguousMatches && cls.ambiguousMatches.length > 0));
          caseWizardState.checklist = getSuggestedChecklist(cls.categoryKey);
          caseWizardState.clarificationAnswer = '';
          caseWizardState.step = 2;
          $('#modalBody').innerHTML = renderCaseBuilderWizard();
          return;
        }

        if (caseWizardState.step === 2) {
          caseWizardState.step = 3;
          $('#modalBody').innerHTML = renderCaseBuilderWizard();
          return;
        }

        if (caseWizardState.step === 3) {
          caseWizardState.step = 4;
          $('#modalBody').innerHTML = renderCaseBuilderWizard();
          return;
        }

        if (caseWizardState.step === 4) {
          caseWizardState.notes = $('#wizardCaseNotes')?.value?.trim() || '';
          caseWizardState.step = 5;
          $('#modalBody').innerHTML = renderCaseBuilderWizard();
          return;
        }
        break;
      }

      case 'wizard-prev': {
        if (caseWizardState.step > 1) {
          if (caseWizardState.step === 4) {
            caseWizardState.notes = $('#wizardCaseNotes')?.value?.trim() || '';
          }
          caseWizardState.step -= 1;
          $('#modalBody').innerHTML = renderCaseBuilderWizard();
        }
        break;
      }

      case 'wizard-jump': {
        const targetStep = Number(el.dataset.step);
        if (targetStep >= 1 && targetStep <= 5) {
          caseWizardState.step = targetStep;
          $('#modalBody').innerHTML = renderCaseBuilderWizard();
        }
        break;
      }

      case 'wizard-toggle-categories': {
        caseWizardState.showCategoryGrid = !caseWizardState.showCategoryGrid;
        $('#modalBody').innerHTML = renderCaseBuilderWizard();
        break;
      }

      case 'wizard-select-category': {
        const key = el.dataset.key;
        if (LAND_CASE_CATEGORIES[key]) {
          caseWizardState.categoryKey = key;
          caseWizardState.category = LAND_CASE_CATEGORIES[key].title;
          caseWizardState.confidence = 'medium';
          caseWizardState.isVague = false;
          caseWizardState.checklist = getSuggestedChecklist(key);
          caseWizardState.clarificationAnswer = '';
          $('#modalBody').innerHTML = renderCaseBuilderWizard();
        }
        break;
      }

      case 'wizard-select-clarify': {
        caseWizardState.clarificationAnswer = el.dataset.val || '';
        $('#modalBody').innerHTML = renderCaseBuilderWizard();
        break;
      }

      case 'wizard-select-parcel': {
        caseWizardState.linkedParcel = el.dataset.parcel || '';
        $('#modalBody').innerHTML = renderCaseBuilderWizard();
        break;
      }

      case 'wizard-toggle-doc': {
        const docId = el.dataset.id;
        const status = el.dataset.status;
        const item = caseWizardState.checklist.find(c => c.id === docId);
        if (item) {
          item.status = status;
          $('#modalBody').innerHTML = renderCaseBuilderWizard();
        }
        break;
      }

      case 'wizard-confirm-save': {
        // Generate unique reference
        let uniqueId = '';
        let tries = 0;
        do {
          uniqueId = 'LCASE-2026-' + String(Math.floor(1000 + Math.random() * 9000));
          tries++;
        } while (local.landCases.some(c => c.id === uniqueId) && tries < 50);

        const newCase = {
          id: uniqueId,
          created: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          timestamp: Date.now(),
          description: caseWizardState.description,
          category: caseWizardState.category,
          categoryKey: caseWizardState.categoryKey,
          confidence: caseWizardState.confidence,
          clarificationAnswer: caseWizardState.clarificationAnswer,
          linkedParcel: caseWizardState.linkedParcel,
          checklist: JSON.parse(JSON.stringify(caseWizardState.checklist)),
          notes: caseWizardState.notes || '',
          nextSteps: getSuggestedNextSteps(caseWizardState.categoryKey, caseWizardState.checklist),
          reconciliation: caseWizardState.reconciliation || null,
          isDemo: true
        };

        local.landCases.unshift(newCase);
        const success = persist();

        if (!success) {
          local.landCases.shift();
          toast('কেস সংরক্ষণ ব্যর্থ হয়েছে', 'ব্রাউজার লোকাল স্টোরেজ অনুপলব্ধ বা পূর্ণ হয়ে গেছে। স্টোরেজ পারমিশন পরীক্ষা করুন।');
          return;
        }

        caseWizardState.savedCaseId = uniqueId;
        caseWizardState.step = 6;
        $('#modalBody').innerHTML = renderCaseBuilderWizard();
        toast('Land Case সংরক্ষিত হয়েছে', `${uniqueId} রেফারেন্সে সংরক্ষিত হয়েছে।`);
        if (state.page === 'casebook') renderPage();
        break;
      }

      case 'wizard-goto-casebook': {
        closeModal();
        setPage('casebook');
        break;
      }

      case 'wizard-new-case': {
        startLandCaseBuilder();
        break;
      }
    }
  }

  /* Saved Land Cases UI in Casebook */
  function renderSavedLandCasesSection(){
    const cases = local.landCases || [];
    return `<section class="panel" style="margin-top:22px" id="savedLandCasesPanel">
      <div class="panel-head">
        <div>
          <span class="eyebrow" style="color:var(--green)">R&amp;D FEATURE #2 · CITIZEN CASE FILES</span>
          <h2 class="panel-title">সংরক্ষিত Land Case সমূহ (Saved Land Cases)</h2>
          <p class="panel-subtitle">AI Land Case Builder দ্বারা প্রস্তুতকৃত আপনার ব্যক্তিগত প্রস্তুতিমূলক ফাইল। এটি সাধারণ অভিযোগ থেকে সম্পূর্ণ পৃথক।</p>
        </div>
        <button class="btn primary small" data-action="start-land-case-builder">＋ নতুন Land Case তৈরি করুন</button>
      </div>
      ${cases.length ? `
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>কেস রেফারেন্স</th>
                <th>সমস্যার ধরন</th>
                <th>সম্পর্কিত জমি</th>
                <th>তৈরির তারিখ</th>
                <th>চেকলিস্ট অগ্রগতি</th>
                <th>অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              ${cases.map(c => {
                const avail = (c.checklist || []).filter(i => i.status === 'available').length;
                const missing = (c.checklist || []).filter(i => i.status === 'missing').length;
                const verify = (c.checklist || []).filter(i => i.status === 'verify').length;
                return `<tr>
                  <td class="table-primary"><strong>${esc(c.id)}</strong></td>
                  <td>
                    <strong>${esc(c.category)}</strong>
                    ${c.reconciliation ? `<br/><span class="reconcile-case-badge ${c.reconciliation.overallStatus === 'POTENTIAL_MISMATCH' ? 'warning' : c.reconciliation.overallStatus === 'NO_MISMATCH_OBSERVED' ? 'success' : 'info'}">⚖ ${c.reconciliation.overallStatus === 'POTENTIAL_MISMATCH' ? 'গরমিল চিহ্নিত' : c.reconciliation.overallStatus === 'NO_MISMATCH_OBSERVED' ? 'মিল রয়েছে' : 'যাচাই প্রয়োজন'}</span>` : ''}
                  </td>
                  <td>${esc(c.linkedParcel || 'নির্দিষ্ট জমি নেই')}</td>
                  <td>${esc(c.created)}</td>
                  <td>
                    <span class="pill green">${avail} সংগৃহীত</span>
                    ${missing ? `<span class="pill amber">${missing} অনুপস্থিত</span>` : ''}
                    ${verify ? `<span class="pill blue">${verify} যাচাই</span>` : ''}
                  </td>
                  <td>
                    <button class="table-actions" data-action="open-land-case" data-id="${esc(c.id)}">বিস্তারিত ও আপডেট ↗</button>
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-icon">📁</div>
          <b>কোনো সংরক্ষিত Land Case নেই</b>
          <p>আপনার জমি সংক্রান্ত সমস্যা চিহ্নিত করতে ও প্রয়োজনীয় নথিপত্রের চেকলিস্ট তৈরি করতে AI Land Case Builder ব্যবহার করুন।</p>
          <button class="btn primary" data-action="start-land-case-builder">＋ নতুন Land Case তৈরি করুন</button>
        </div>
      `}
    </section>`;
  }

  /* Open and edit saved Land Case detail */
  function openLandCaseDetail(id){
    const c = (local.landCases || []).find(x => x.id === id);
    if (!c) {
      toast('কেস পাওয়া যায়নি', 'তালিকা রিফ্রেশ করুন।');
      return;
    }

    const avail = (c.checklist || []).filter(i => i.status === 'available').length;
    const missing = (c.checklist || []).filter(i => i.status === 'missing').length;
    const verify = (c.checklist || []).filter(i => i.status === 'verify').length;

    openModal(`Land Case · ${esc(c.id)}`, `
      <div class="detail-row">
        <div>
          <div class="detail-label">সমস্যার শ্রেণি</div>
          <div class="detail-value"><strong>${esc(c.category)}</strong></div>
        </div>
        <span class="pill green">${avail} সংগৃহীত · ${missing} অনুপস্থিত</span>
      </div>

      <div class="detail-row" style="margin-top:12px">
        <div>
          <div class="detail-label">সম্পর্কিত জমি</div>
          <div class="detail-value">${esc(c.linkedParcel || 'নির্দিষ্ট জমি লিঙ্ক করা নেই')}</div>
        </div>
        <div>
          <div class="detail-label">কেস তৈরির তারিখ</div>
          <div class="detail-value">${esc(c.created)}</div>
        </div>
      </div>

      <div style="margin-top:14px">
        <div class="detail-label">সমস্যার বিবরণ</div>
        <p style="font-size:12px;color:#2f4e41;line-height:1.6;margin:4px 0 0;background:#f8faf8;padding:10px 12px;border-radius:9px;border:1px solid #e7efe9">${esc(c.description)}</p>
      </div>

      ${c.clarificationAnswer ? `
        <div style="margin-top:10px">
          <div class="detail-label">স্পষ্টীকরণ উত্তর</div>
          <p style="font-size:11.5px;color:#456657;margin:2px 0 0">${esc(c.clarificationAnswer)}</p>
        </div>
      ` : ''}

      ${c.reconciliation ? `
        <div style="margin-top:16px;background:#f6faf8;border:1.5px solid #c2e2d2;border-radius:12px;padding:14px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <strong style="font-size:11.5px;color:#184236">⚖ R&amp;D Feature #55 · সংযুক্ত গরমিল রিপোর্ট</strong>
            <span class="pill ${c.reconciliation.overallStatus === 'POTENTIAL_MISMATCH' ? 'amber' : c.reconciliation.overallStatus === 'NO_MISMATCH_OBSERVED' ? 'green' : 'blue'}">
              ${c.reconciliation.overallStatus === 'POTENTIAL_MISMATCH' ? '⚠️ গরমিল চিহ্নিত' : c.reconciliation.overallStatus === 'NO_MISMATCH_OBSERVED' ? '✓ মিল রয়েছে' : 'ℹ অপর্যাপ্ত তথ্য'}
            </span>
          </div>
          <p style="font-size:11px;color:#355a49;margin:0 0 8px;line-height:1.5">${esc(c.reconciliation.explanation)}</p>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <button type="button" class="btn small" data-action="reconcile-view-attached" data-case-id="${esc(c.id)}">সম্পূর্ণ বিশ্লেষণ রিপোর্ট দেখুন ↗</button>
            <small style="color:#779183;font-size:9.5px">নথি: ${esc(c.reconciliation.docA?.id || 'Doc A')} বনাম ${esc(c.reconciliation.docB?.id || 'Doc B')}</small>
          </div>
        </div>
      ` : `
        <div style="margin-top:14px;border:1px dashed #dce7df;border-radius:10px;padding:10px 12px;display:flex;justify-content:space-between;align-items:center">
          <small style="color:#638072;font-size:10.5px">এই কেসে নথিপত্রের গরমিল পরীক্ষা করতে চান?</small>
          <button type="button" class="btn small" data-action="start-reconciliation" data-case-id="${esc(c.id)}">⚖ নথিপত্র গরমিল পরীক্ষা করুন</button>
        </div>
      `}

      <div style="margin-top:18px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <strong style="font-size:12px;color:#183d35">নথিপত্র চেকলিস্ট আপডেট করুন</strong>
          <span style="font-size:10px;color:#788f83">ক্লিক করে স্ট্যাটাস পরিবর্তন করুন</span>
        </div>
        <div class="checklist-card-list">
          ${(c.checklist || []).map(item => `
            <div class="checklist-card-item">
              <div class="checklist-card-title">
                <b>${esc(item.name)}</b>
                <small>${esc(item.desc)}</small>
              </div>
              <div class="checklist-btn-group">
                <button type="button" class="check-toggle-btn ${item.status === 'available' ? 'active-available' : ''}" data-action="update-case-check-status" data-case-id="${esc(c.id)}" data-check-id="${item.id}" data-status="available">✓ সংগৃহীত</button>
                <button type="button" class="check-toggle-btn ${item.status === 'missing' ? 'active-missing' : ''}" data-action="update-case-check-status" data-case-id="${esc(c.id)}" data-check-id="${item.id}" data-status="missing">✗ অনুপস্থিত</button>
                <button type="button" class="check-toggle-btn ${item.status === 'verify' ? 'active-verify' : ''}" data-action="update-case-check-status" data-case-id="${esc(c.id)}" data-check-id="${item.id}" data-status="verify">? যাচাই প্রয়োজন</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="form-field full" style="margin-top:14px">
        <label for="caseDetailNotes">ব্যক্তিগত নোট ও অগ্রগতি</label>
        <textarea id="caseDetailNotes" placeholder="আপনার প্রয়োজনীয় তথ্যের আপডেট লিখুন...">${esc(c.notes || '')}</textarea>
        <button type="button" class="btn small primary" style="align-self:flex-start;margin-top:8px" data-action="save-case-notes" data-id="${esc(c.id)}">নোট সংরক্ষণ করুন</button>
      </div>

      <div class="warning-panel" style="margin-top:14px">
        নাগরিক ডেমো কেস সামারি। এটি কোনো সরকারি সংস্থার গৃহীত অভিযোগ বা আদালতের মামলা নয়।
      </div>

      <div class="modal-actions" style="margin-top:18px">
        <button type="button" class="btn ghost" style="color:var(--red);margin-right:auto" data-action="delete-land-case" data-id="${esc(c.id)}">🗑 কেস মুছে ফেলুন</button>
        <button type="button" class="btn" data-action="close-modal">বন্ধ করুন</button>
      </div>
    `, 'SAVED LAND CASE');
    $('.modal')?.classList.add('case-builder-modal');
  }

  function updateSavedCaseCheckStatus(caseId, checkId, newStatus){
    const c = (local.landCases || []).find(x => x.id === caseId);
    if (!c) return;
    const item = (c.checklist || []).find(i => i.id === checkId);
    if (item) {
      item.status = newStatus;
      c.nextSteps = getSuggestedNextSteps(c.categoryKey, c.checklist);
      persist();
      openLandCaseDetail(caseId);
      if (state.page === 'casebook') renderPage();
      toast('চেকলিস্ট আপডেট হয়েছে', `${item.name}: ${newStatus === 'available' ? 'সংগৃহীত' : newStatus === 'missing' ? 'অনুপস্থিত' : 'যাচাই প্রয়োজন'}`);
    }
  }

  function saveSavedCaseNotes(caseId){
    const c = (local.landCases || []).find(x => x.id === caseId);
    if (!c) return;
    const notesText = $('#caseDetailNotes')?.value || '';
    c.notes = notesText;
    persist();
    if (state.page === 'casebook') renderPage();
    toast('নোট সংরক্ষিত হয়েছে', 'কেস ফাইলে আপনার নোট আপডেট করা হয়েছে।');
  }

  function deleteLandCase(caseId){
    if (!confirm('আপনি কি নিশ্চিত যে এই Land Case ফাইলটি মুছে ফেলতে চান?')) return;
    local.landCases = (local.landCases || []).filter(x => x.id !== caseId);
    persist();
    closeModal();
    if (state.page === 'casebook') renderPage();
    toast('Land Case মুছে ফেলা হয়েছে', 'কেস ফাইলটি অপসারিত হয়েছে।');
  }

  /* ==========================================================================
     R&D Feature #55: Record Reconciliation Engine
     Deterministic document & record comparison engine.
     Normalizes formatting, Bangla/English numerals, and whitespace.
     Unit-aware area comparison with conversion caution.
     Missing fields tolerance (does not treat missing as mismatch).
     Citizen-friendly Bangla explanations & next steps.
     ========================================================================== */

  const DEMO_DOCUMENT_RECORDS = {
    'DOC-0081': {
      id: 'DOC-0081',
      title: 'RS Khatian reference (আরএস খতিয়ান নং ৭৩১)',
      docType: 'খতিয়ান / পর্চা (Khatian Record)',
      provenance: 'verified-source',
      provenanceLabel: 'সরকারি রেকর্ডরুম সার্টিফাইড নকল',
      sourceRef: 'সাভার উপজেলা ভূমি রেকর্ডরুম · বালাম ৪২, পৃষ্ঠা ১৫',
      date: '12 Oct 2026',
      fields: {
        party: 'আব্দুল করিম',
        mouza: 'আমিন বাজার',
        dag: '1842',
        khatian: '731',
        surveyType: 'RS',
        area: '12.50 decimal',
        date: '12 Oct 2026'
      }
    },
    'DOC-0072': {
      id: 'DOC-0072',
      title: 'Deed scan · sample (সাব-কবলা দলিল নং ৫৪২১/২০২৪)',
      docType: 'সাব-কবলা দলিল (Sub-Kabala Deed)',
      provenance: 'AI-extracted-unverified',
      provenanceLabel: 'নমুনা স্ক্যান থেকে এক্সট্র্যাক্টকৃত (যাচাইহীন)',
      sourceRef: 'সাভার সাব-রেজিস্ট্রি অফিস · দলিল নং ৫৪২১',
      date: '14 Feb 2024',
      fields: {
        party: 'আব্দুল করিম',
        mouza: 'আমিন বাজার',
        dag: '1842',
        khatian: '731',
        surveyType: 'RS',
        area: '10.00 decimal', // Area mismatch with DOC-0081 (12.50 vs 10.00)
        date: '14 Feb 2024'
      }
    },
    'DOC-0082': {
      id: 'DOC-0082',
      title: 'Mutation Porcha · demo (নামজারি পর্চা নং ৯২০/১)',
      docType: 'নামজারি খতিয়ান (Mutation Khatian)',
      provenance: 'verified-source',
      provenanceLabel: 'ই-নামজারি ডিজিটাল রেকর্ড',
      sourceRef: 'ই-নামজারি সিস্টেম · জোত নং ৯২০/১',
      date: '05 Jun 2025',
      fields: {
        party: 'আব্দুল করিম',
        mouza: 'আমিন বাজার',
        dag: '1842',
        khatian: '731',
        surveyType: 'RS',
        area: '12.50 decimal', // Exact match with DOC-0081
        date: '05 Jun 2025'
      }
    },
    'DOC-0083': {
      id: 'DOC-0083',
      title: 'Historical deed · sample (১৯৮৫ সালের বায়া দলিল)',
      docType: 'বায়া দলিল (Historical Deed)',
      provenance: 'sample/demo',
      provenanceLabel: 'ঐতিহাসিক দলিল নমুনা (ডেমো)',
      sourceRef: 'পারিবারিক বায়া দলিল রেকর্ড',
      date: '18 Mar 1985',
      fields: {
        party: 'মরহুম রমিজ উদ্দিন',
        mouza: 'আমিন বাজার',
        dag: '1842',
        khatian: '731',
        surveyType: 'SA',
        area: '২ কাঠা ৪ ছটাক', // Incompatible regional units
        date: '18 Mar 1985'
      }
    },
    'DOC-0079': {
      id: 'DOC-0079',
      title: 'Tax receipt · demo (ভূমি উন্নয়ন কর দাখিলা)',
      docType: 'কর দাখিলা (Tax Receipt)',
      provenance: 'sample/demo',
      provenanceLabel: 'ভূমি কর পোর্টাল ডেমো দাখিলা',
      sourceRef: 'ইউনিয়ন ভূমি অফিস · দাখিলা রসিদ নং ৯৮৩',
      date: '10 Oct 2026',
      fields: {
        party: 'আব্দুল করিম',
        mouza: 'আমিন বাজার',
        dag: '1842',
        khatian: '731',
        surveyType: '', // Missing survey type
        area: '12.50 decimal',
        date: '10 Oct 2026'
      }
    },
    'DOC-0065': {
      id: 'DOC-0065',
      title: 'Applicant identity checklist (পরিচয় ও এনআইডি)',
      docType: 'নাগরিক চেকলিস্ট (Citizen Identity Checklist)',
      provenance: 'user-provided',
      provenanceLabel: 'নাগরিকের প্রদত্ত তথ্য',
      sourceRef: 'নাগরিকের নিজ ঘোষণাপত্র ও এনআইডি কপি',
      date: '04 Oct 2026',
      fields: {
        party: 'আব্দুল করিম শেখ', // Spelling variation
        mouza: '',
        dag: '',
        khatian: '',
        surveyType: '',
        area: '',
        date: '04 Oct 2026'
      }
    }
  };

  const RECONCILIATION_PRESETS = [
    {
      key: 'area-mismatch',
      title: '⚠️ কেস ১: জমির পরিমাপে গরমিল (Area Discrepancy)',
      desc: 'আরএস খতিয়ান (১২.৫০ শতক) বনাম সাব-কবলা দলিল (১০.০০ শতক) — ২.৫০ শতকের অমিল',
      docA: 'DOC-0081',
      docB: 'DOC-0072'
    },
    {
      key: 'exact-match',
      title: '✓ কেস ২: অবিকল মিল (Exact Match)',
      desc: 'আরএস খতিয়ান (৭৩১) বনাম ই-নামজারি পর্চা (৯২০/১) — সকল ফিল্ড সঙ্গতিপূর্ণ',
      docA: 'DOC-0081',
      docB: 'DOC-0082'
    },
    {
      key: 'incompatible-units',
      title: '❓ কেস ৩: পরিমাপের অসম একক (Incompatible Units)',
      desc: 'আরএস খতিয়ান (১২.৫০ শতক) বনাম প্রাচীন দলিল (২ কাঠা ৪ ছটাক) — একক রূপান্তর যাচাই প্রয়োজন',
      docA: 'DOC-0081',
      docB: 'DOC-0083'
    },
    {
      key: 'missing-fields',
      title: '✎ কেস ৪: অনুপস্থিত তথ্য ও নামের বানান তফাত (Missing Fields & Spelling)',
      desc: 'আরএস খতিয়ান (সম্পূর্ণ) বনাম নাগরিক পরিচয়পত্র (অনুপস্থিত দাগ/খতিয়ান এবং নামের পদবি পার্থক্য)',
      docA: 'DOC-0081',
      docB: 'DOC-0065'
    }
  ];

  function normalizeDigits(str) {
    if (str == null) return '';
    return String(str).replace(/[০-৯]/g, d => '০১২৩৪৫৬৭৮৯'.indexOf(d));
  }

  function normalizeRecordText(str) {
    if (str == null) return '';
    return normalizeDigits(String(str))
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase();
  }

  function parseAreaField(raw) {
    if (!raw || !String(raw).trim()) return { raw: '', num: null, unit: '', reliable: false, empty: true };
    const text = normalizeRecordText(raw);
    const numMatch = text.match(/[-+]?[0-9]*\.?[0-9]+/);
    if (!numMatch) {
      return { raw, num: null, unit: 'unknown', reliable: false, empty: false, reason: 'কোনো বৈধ সংখ্যাসূচক মান পাওয়া যায়নি' };
    }
    const num = parseFloat(numMatch[0]);

    // Check for regional or unstandardized local units
    if (/কাঠা|katha|বিঘা|bigha|ছটাক|chatak|কানি|kani|গণ্ডা|gonda|পাখি|pakhi/.test(text)) {
      return {
        raw,
        num,
        unit: 'regional',
        reliable: false,
        empty: false,
        reason: 'আঞ্চলিক পরিমাপের একক (কাঠা/ছটাক/কানি) — স্থানীয় মৌজার সরকারি রূপান্তর অনুপাত ব্যতীত সরাসরি মেলানো ঝুঁকিপূর্ণ'
      };
    }

    // Standard decimal / শতাংশ / শতক
    if (/decimal|শতাংশ|শতক|ডিসিমেল|শতকরা/.test(text) || (!/acre|একর|sqft|বর্গফুট/.test(text) && numMatch)) {
      return { raw, num: num, unit: 'decimal', reliable: true, empty: false };
    }

    // Acre / একর (1 acre = 100 decimal)
    if (/acre|একর/.test(text)) {
      return { raw, num: num * 100, unit: 'decimal', reliable: true, empty: false, convertedFrom: 'acre' };
    }

    // Sq ft / বর্গফুট (1 decimal = 435.6 sq ft)
    if (/sqft|sq\s*ft|square\s*feet|বর্গফুট|বর্গ\s*ফুট/.test(text)) {
      return { raw, num: Number((num / 435.6).toFixed(2)), unit: 'decimal', reliable: true, empty: false, convertedFrom: 'sqft' };
    }

    return { raw, num: num, unit: 'unknown', reliable: false, empty: false, reason: 'অনির্ধারিত একক' };
  }

  function getDocumentRecord(id) {
    if (DEMO_DOCUMENT_RECORDS[id]) {
      return JSON.parse(JSON.stringify(DEMO_DOCUMENT_RECORDS[id]));
    }
    const d = docs.find(x => x[0] === id);
    if (d) {
      return {
        id: d[0],
        title: `${d[1]} (${d[0]})`,
        docType: d[2] || 'নথি (Document)',
        provenance: d[4] === 'green' ? 'verified-source' : 'sample/demo',
        provenanceLabel: d[4] === 'green' ? 'যাচাইকৃত নথি' : 'নমুনা নথি (ডেমো)',
        sourceRef: 'ডেমো ভল্ট নথি',
        date: d[5] || 'Recent',
        fields: {
          party: 'আব্দুল করিম',
          mouza: 'আমিন বাজার',
          dag: '1842',
          khatian: '731',
          surveyType: 'RS',
          area: '12.50 decimal',
          date: d[5] || '12 Oct 2026'
        }
      };
    }
    return JSON.parse(JSON.stringify(DEMO_DOCUMENT_RECORDS['DOC-0081']));
  }

  function renderProvenanceBadge(prov) {
    switch(prov) {
      case 'verified-source':
        return '<span class="prov-badge verified-source">✓ সরকারি রেকর্ডরুম (Verified)</span>';
      case 'AI-extracted-unverified':
        return '<span class="prov-badge ai-extracted">✳ এআই এক্সট্র্যাক্টকৃত (যাচাইহীন)</span>';
      case 'sample/demo':
        return '<span class="prov-badge sample-demo">◈ ডেমো নমুনা (Sample)</span>';
      case 'user-provided':
        return '<span class="prov-badge user-provided">✎ নাগরিকের প্রদত্ত তথ্য</span>';
      default:
        return '<span class="prov-badge sample-demo">◈ ডেমো ডাটা</span>';
    }
  }

  function compareRecords(docA, docB) {
    const fA = docA.fields || {};
    const fB = docB.fields || {};
    const findings = [];

    const areNamesEquivalent = (a, b) => {
      const na = normalizeRecordText(a);
      const nb = normalizeRecordText(b);
      if (na === nb) return true;
      const pairs = [
        ['abdul karim', 'আব্দুল করিম'],
        ['karim', 'করিম'],
        ['mohammad', 'মোহাম্মদ'],
        ['md', 'মো:'],
        ['md', 'মোঃ']
      ];
      for (const [p1, p2] of pairs) {
        if ((na.includes(p1) && nb.includes(p2)) || (na.includes(p2) && nb.includes(p1))) return true;
      }
      return false;
    };

    const areMouzasEquivalent = (a, b) => {
      const na = normalizeRecordText(a);
      const nb = normalizeRecordText(b);
      if (na === nb) return true;
      const mouzaPairs = [
        ['amin bazar', 'আমিন বাজার'],
        ['baipayl', 'বাইপাইল'],
        ['savar', 'সাভার'],
        ['kalighat', 'কালীঘাট'],
        ['lohagara', 'লোহাগড়া']
      ];
      for (const [p1, p2] of mouzaPairs) {
        if ((na === p1 && nb === p2) || (na === p2 && nb === p1)) return true;
      }
      return false;
    };

    // 1. Party / Name
    const rawPartyA = (fA.party || '').trim();
    const rawPartyB = (fB.party || '').trim();
    if (!rawPartyA || !rawPartyB) {
      findings.push({
        id: 'party',
        label: 'মালিক / পক্ষের নাম (Party / Owner)',
        valA: rawPartyA || '(অনুপস্থিত)',
        valB: rawPartyB || '(অনুপস্থিত)',
        status: 'SKIPPED_MISSING',
        statusLabel: 'তথ্য অনুপস্থিত (উপেক্ষিত)',
        statusTone: 'gray',
        reason: 'একটি নথিতে নাম অনুপস্থিত থাকায় অমিল হিসেবে গণ্য করা হয়নি।',
        nextStep: 'প্রয়োজনে জাতীয় পরিচয়পত্র (NID) বা ওয়ারিশান সনদ থেকে নাম সংযোজন করুন।'
      });
    } else if (areNamesEquivalent(rawPartyA, rawPartyB)) {
      findings.push({
        id: 'party',
        label: 'মালিক / পক্ষের নাম (Party / Owner)',
        valA: rawPartyA,
        valB: rawPartyB,
        status: 'MATCH',
        statusLabel: 'হুবহু মিল',
        statusTone: 'green',
        reason: 'উভয় নথিতে মালিক/পক্ষের নাম সঙ্গতিপূর্ণ ও অভিন্ন রয়েছে।',
        nextStep: 'মালিকানা অপরিবর্তিত থাকলে অতিরিক্ত পদক্ষেপের প্রয়োজন নেই।'
      });
    } else {
      findings.push({
        id: 'party',
        label: 'মালিক / পক্ষের নাম (Party / Owner)',
        valA: rawPartyA,
        valB: rawPartyB,
        status: 'MISMATCH',
        statusLabel: 'সম্ভাব্য অমিল',
        statusTone: 'amber',
        reason: `নামের বানান বা পদবিতে অমিল পাওয়া গেছে ("${rawPartyA}" বনাম "${rawPartyB}")।`,
        nextStep: 'উপজেলা সাব-রেজিস্ট্রি অফিসে মূল বায়া দলিল তল্লাশি দিয়ে এবং এনআইডি কার্ডের সাথে মিলিয়ে সঠিক নাম নিশ্চিত করুন।'
      });
    }

    // 2. Mouza
    const rawMouzaA = (fA.mouza || '').trim();
    const rawMouzaB = (fB.mouza || '').trim();
    if (!rawMouzaA || !rawMouzaB) {
      findings.push({
        id: 'mouza',
        label: 'মৌজা (Mouza)',
        valA: rawMouzaA || '(অনুপস্থিত)',
        valB: rawMouzaB || '(অনুপস্থিত)',
        status: 'SKIPPED_MISSING',
        statusLabel: 'তথ্য অনুপস্থিত (উপেক্ষিত)',
        statusTone: 'gray',
        reason: 'একটি নথিতে মৌজার তথ্য অনুপস্থিত থাকায় অমিল গণ্য করা হয়নি।',
        nextStep: 'খতিয়ান বা খাজনা দাখিলা থেকে সঠিক মৌজা জেএল নম্বর সংগ্রহ করুন।'
      });
    } else if (areMouzasEquivalent(rawMouzaA, rawMouzaB)) {
      findings.push({
        id: 'mouza',
        label: 'মৌজা (Mouza)',
        valA: rawMouzaA,
        valB: rawMouzaB,
        status: 'MATCH',
        statusLabel: 'হুবহু মিল',
        statusTone: 'green',
        reason: 'উভয় নথিতে মৌজা অভিন্ন ("আমিন বাজার")।',
        nextStep: 'মৌজা এলাকা নিশ্চিত রয়েছে।'
      });
    } else {
      findings.push({
        id: 'mouza',
        label: 'মৌজা (Mouza)',
        valA: rawMouzaA,
        valB: rawMouzaB,
        status: 'MISMATCH',
        statusLabel: 'ভিন্ন মৌজা',
        statusTone: 'amber',
        reason: `ভিন্ন মৌজার নাম পাওয়া গেছে ("${rawMouzaA}" বনাম "${rawMouzaB}")। এটি সম্পূর্ণ ভিন্ন স্থানের সম্পত্তি হতে পারে।`,
        nextStep: 'সংশ্লিষ্ট উপজেলা ভূমি অফিস ও সাব-রেজিস্ট্রি থেকে মৌজা ও জেএল নম্বর পুনঃযাচাই করুন।'
      });
    }

    // 3. Dag Number
    const rawDagA = (fA.dag || '').trim();
    const rawDagB = (fB.dag || '').trim();
    if (!rawDagA || !rawDagB) {
      findings.push({
        id: 'dag',
        label: 'দাগ নম্বর (Dag Number)',
        valA: rawDagA || '(অনুপস্থিত)',
        valB: rawDagB || '(অনুপস্থিত)',
        status: 'SKIPPED_MISSING',
        statusLabel: 'তথ্য অনুপস্থিত (উপেক্ষিত)',
        statusTone: 'gray',
        reason: 'একটি নথিতে দাগ নম্বর উল্লেখ নেই (যেমন সাধারণ দাখিলা বা পরিচয়পত্রে এটি থাকে না)।',
        nextStep: 'মৌজা নকশা (ম্যাপ) ও মূল খতিয়ান থেকে দাগ নম্বর সংগ্রহ করুন।'
      });
    } else if (normalizeDigits(rawDagA) === normalizeDigits(rawDagB)) {
      findings.push({
        id: 'dag',
        label: 'দাগ নম্বর (Dag Number)',
        valA: rawDagA,
        valB: rawDagB,
        status: 'MATCH',
        statusLabel: 'হুবহু মিল',
        statusTone: 'green',
        reason: `দাগ নম্বর নির্ভুলভাবে মিলেছে (${normalizeDigits(rawDagA)})।`,
        nextStep: 'দাগ নম্বর সঠিক রয়েছে।'
      });
    } else {
      findings.push({
        id: 'dag',
        label: 'দাগ নম্বর (Dag Number)',
        valA: rawDagA,
        valB: rawDagB,
        status: 'MISMATCH',
        statusLabel: 'দাগ অমিল',
        statusTone: 'amber',
        reason: `দাগ নম্বরে অমিল পাওয়া গেছে (${rawDagA} বনাম ${rawDagB})। সাবেক ও হাল দাগের রূপান্তর ঘটেছে কিনা পরীক্ষা প্রয়োজন।`,
        nextStep: 'উপজেলা সেটেলমেন্ট বা তহশিল অফিস থেকে সাবেক-হাল দাগের মিলপর্চা বা দাগসূচি (Chitta) সংগ্রহ করুন।'
      });
    }

    // 4. Khatian Number
    const rawKhatA = (fA.khatian || '').trim();
    const rawKhatB = (fB.khatian || '').trim();
    if (!rawKhatA || !rawKhatB) {
      findings.push({
        id: 'khatian',
        label: 'খতিয়ান নম্বর (Khatian Number)',
        valA: rawKhatA || '(অনুপস্থিত)',
        valB: rawKhatB || '(অনুপস্থিত)',
        status: 'SKIPPED_MISSING',
        statusLabel: 'তথ্য অনুপস্থিত (উপেক্ষিত)',
        statusTone: 'gray',
        reason: 'একটি নথিতে খতিয়ান নম্বর উল্লেখ নেই।',
        nextStep: 'সর্বশেষ নামজারি বা পর্চা কপি থেকে খতিয়ান নম্বর দেখে নিন।'
      });
    } else if (normalizeDigits(rawKhatA) === normalizeDigits(rawKhatB)) {
      findings.push({
        id: 'khatian',
        label: 'খতিয়ান নম্বর (Khatian Number)',
        valA: rawKhatA,
        valB: rawKhatB,
        status: 'MATCH',
        statusLabel: 'হুবহু মিল',
        statusTone: 'green',
        reason: `খতিয়ান নম্বর হুবহু মিলেছে (${normalizeDigits(rawKhatA)})।`,
        nextStep: 'খতিয়ান রেফারেন্স সঠিক আছে।'
      });
    } else {
      findings.push({
        id: 'khatian',
        label: 'খতিয়ান নম্বর (Khatian Number)',
        valA: rawKhatA,
        valB: rawKhatB,
        status: 'MISMATCH',
        statusLabel: 'খতিয়ান অমিল',
        statusTone: 'amber',
        reason: `খতিয়ান নম্বর ভিন্ন (${rawKhatA} বনাম ${rawKhatB})। নামজারির কারণে পৃথক জোত খতিয়ান সৃষ্টি হয়ে থাকতে পারে।`,
        nextStep: 'সহকারী কমিশনার (ভূমি) কার্যালয়ের রেজিস্টার থেকে খতিয়ানের ধারাবাহিক খারিজ রেকর্ড যাচাই করুন।'
      });
    }

    // 5. Survey Type
    const rawSurA = (fA.surveyType || '').trim();
    const rawSurB = (fB.surveyType || '').trim();
    if (!rawSurA || !rawSurB) {
      findings.push({
        id: 'surveyType',
        label: 'জরিপের ধরন (Survey Type)',
        valA: rawSurA || '(অনুপস্থিত)',
        valB: rawSurB || '(অনুপস্থিত)',
        status: 'SKIPPED_MISSING',
        statusLabel: 'তথ্য অনুপস্থিত (উপেক্ষিত)',
        statusTone: 'gray',
        reason: 'একটি নথিতে জরিপের ধরন উল্লেখ নেই।',
        nextStep: 'পরচা কপির শীর্ষভাগ থেকে জরিপের ধরন (CS/SA/RS/BS) নিশ্চিত করুন।'
      });
    } else if (normalizeRecordText(rawSurA) === normalizeRecordText(rawSurB)) {
      findings.push({
        id: 'surveyType',
        label: 'জরিপের ধরন (Survey Type)',
        valA: rawSurA,
        valB: rawSurB,
        status: 'MATCH',
        statusLabel: 'হুবহু মিল',
        statusTone: 'green',
        reason: `উভয় নথি একই জরিপ পর্যায়ের (${rawSurA})।`,
        nextStep: 'জরিপের ধরন সঙ্গতিপূর্ণ।'
      });
    } else {
      findings.push({
        id: 'surveyType',
        label: 'জরিপের ধরন (Survey Type)',
        valA: rawSurA,
        valB: rawSurB,
        status: 'INFO_SURVEY',
        statusLabel: 'জরিপের স্তর ভিন্ন (তথ্যমূলক)',
        statusTone: 'blue',
        reason: `নথি দুটিতে জরিপের স্তর আলাদা (${rawSurA} বনাম ${rawSurB}) — এটি বাংলাদেশ ভূমি জরিপের স্বাভাবিক বিবর্তনের অংশ, বিরোধ নয়।`,
        nextStep: 'সিএস থেকে বর্তমান বিএস পর্যন্ত মালিকানার ধারাবাহিক রেকর্ড সংরক্ষিত আছে কিনা পর্যালোচনা করুন।'
      });
    }

    // 6. Land Area
    const rawAreaA = (fA.area || '').trim();
    const rawAreaB = (fB.area || '').trim();
    const areaA = parseAreaField(rawAreaA);
    const areaB = parseAreaField(rawAreaB);

    if (areaA.empty || areaB.empty) {
      findings.push({
        id: 'area',
        label: 'জমির পরিমাণ ও একক (Land Area)',
        valA: rawAreaA || '(অনুপস্থিত)',
        valB: rawAreaB || '(অনুপস্থিত)',
        status: 'SKIPPED_MISSING',
        statusLabel: 'তথ্য অনুপস্থিত (উপেক্ষিত)',
        statusTone: 'gray',
        reason: 'একটি নথিতে জমির পরিমাণ উল্লেখ নেই।',
        nextStep: 'মূল দলিল বা পরচা থেকে অনুমোদিত জমির অংশ ও ক্ষেত্রফল সংগ্রহ করুন।'
      });
    } else if (!areaA.reliable || !areaB.reliable) {
      findings.push({
        id: 'area',
        label: 'জমির পরিমাণ ও একক (Land Area)',
        valA: rawAreaA,
        valB: rawAreaB,
        status: 'INCOMPATIBLE_UNIT',
        statusLabel: 'একক যাচাই প্রয়োজন',
        statusTone: 'blue',
        reason: `পরিমাপের একক ভিন্ন বা স্থানীয় রূপান্তর অনুপাত অনির্ধারিত (${rawAreaA} বনাম ${rawAreaB})। কাঠা/ছটাক/কানির সরকারি রূপান্তর অনুপাত মৌজাভেদে যাচাই সাপেক্ষ।`,
        nextStep: 'স্থানীয় ভূমি সহকারী কর্মকর্তা (তহশিলদার) বা অনুমোদিত সার্ভেয়ার দ্বারা মৌজার নির্দিষ্ট এককে রূপান্তর নিশ্চিত করুন।'
      });
    } else {
      const diff = Math.abs(areaA.num - areaB.num);
      if (diff < 0.01) {
        findings.push({
          id: 'area',
          label: 'জমির পরিমাণ ও একক (Land Area)',
          valA: rawAreaA,
          valB: rawAreaB,
          status: 'MATCH',
          statusLabel: 'হুবহু মিল',
          statusTone: 'green',
          reason: `উভয় নথিতে জমির পরিমাণ নির্ভুলভাবে মিলেছে (${areaA.num.toFixed(2)} শতক/decimal)।`,
          nextStep: 'জমির পরিমাণ সঙ্গতিপূর্ণ রয়েছে।'
        });
      } else {
        findings.push({
          id: 'area',
          label: 'জমির পরিমাণ ও একক (Land Area)',
          valA: rawAreaA,
          valB: rawAreaB,
          status: 'MISMATCH',
          statusLabel: 'পরিমাণে গরমিল',
          statusTone: 'amber',
          diffAmount: `${diff.toFixed(2)} শতক (decimal)`,
          reason: `জমির পরিমাপে গরমিল পাওয়া গেছে (${rawAreaA} বনাম ${rawAreaB})। পার্থক্যের পরিমাণ প্রায় ${diff.toFixed(2)} শতক।`,
          nextStep: 'সহকারী কমিশনার (ভূমি) কার্যালয়ে মিসকেস বা রেকর্ড সংশোধনের জন্য বায়া দলিলের হস্তান্তরিত অংশ ও পরচা মিলিয়ে দেখুন।'
        });
      }
    }

    // 7. Dates (Informational timeline check)
    const rawDateA = (fA.date || '').trim();
    const rawDateB = (fB.date || '').trim();
    if (rawDateA && rawDateB) {
      findings.push({
        id: 'date',
        label: 'নথির সংশ্লিষ্ট তারিখ (Timeline / Date)',
        valA: rawDateA,
        valB: rawDateB,
        status: 'INFO_DATE',
        statusLabel: 'তারিখ প্রদর্শন (তথ্যমূলক)',
        statusTone: 'gray',
        reason: `নথিদ্বয়ের প্রস্তুত বা রেজিস্ট্রেশনের তারিখ প্রদর্শিত (${rawDateA} বনাম ${rawDateB})। নথির ধরন আলাদা হওয়ায় তারিখ ভিন্ন হওয়া স্বাভাবিক।`,
        nextStep: 'দলিলের সম্পাদিত তারিখ এবং খতিয়ান প্রস্তুতের তারিখের ধারাবাহিকতা পরীক্ষা করুন।'
      });
    }

    // Calculate overall status
    const mismatches = findings.filter(f => f.status === 'MISMATCH');
    const matches = findings.filter(f => f.status === 'MATCH');
    const unitIncompatibles = findings.filter(f => f.status === 'INCOMPATIBLE_UNIT');
    const skipped = findings.filter(f => f.status === 'SKIPPED_MISSING');
    const comparableCount = mismatches.length + matches.length + unitIncompatibles.length;

    let overallStatus = 'NO_MISMATCH_OBSERVED';
    let statusTitle = 'কোনো গরমিল পরিলক্ষিত হয়নি (No Mismatch Observed)';
    let statusTone = 'match';
    let explanation = `যাচাইকৃত ${matches.length}টি তুলনীয় ফিল্ডে কোনো গরমিল বা অসঙ্গতি পাওয়া যায়নি।`;

    if (mismatches.length > 0) {
      overallStatus = 'POTENTIAL_MISMATCH';
      statusTitle = 'সম্ভাব্য গরমিল পরিলক্ষিত (Potential Mismatch Detected)';
      statusTone = 'mismatch';
      explanation = `তুলনাযোগ্য ফিল্ডগুলোর মধ্যে ${mismatches.map(m => m.label.split(' ')[0]).join(', ')} ক্ষেত্রে অমিল পাওয়া গেছে। বিস্তারিত পর্যালোচনা করা বাঞ্ছনীয়।`;
    } else if (unitIncompatibles.length > 0 || comparableCount === 0) {
      overallStatus = 'INSUFFICIENT_DATA';
      statusTitle = 'অপর্যাপ্ত বা অসামঞ্জস্যপূর্ণ তথ্য (Insufficient Data)';
      statusTone = 'insufficient';
      explanation = unitIncompatibles.length > 0
        ? 'পরিমাপের একক অসম বা স্থানীয় রূপান্তর অনুপাত অনিশ্চিত হওয়ায় চূড়ান্ত তুলনা সম্ভব হয়নি। অধিকতর যাচাই প্রয়োজন।'
        : 'নথি দুটিতে পর্যাপ্ত তুলনীয় সাধারণ ফিল্ড পাওয়া যায়নি।';
    }

    return {
      docA,
      docB,
      overallStatus,
      statusTitle,
      statusTone,
      explanation,
      comparableCount,
      findings,
      mismatches,
      matches,
      unitIncompatibles,
      skipped,
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };
  }

  let reconciliationState = {
    step: 1, // 1: Select docs, 2: Review candidate values, 3: Findings
    docAId: 'DOC-0081',
    docBId: 'DOC-0072',
    docAData: null,
    docBData: null,
    result: null,
    presetKey: 'area-mismatch',
    targetCaseId: null
  };

  function startReconciliation(initialDocA = 'DOC-0081', initialDocB = 'DOC-0072', options = {}) {
    reconciliationState = {
      step: options.step || 1,
      docAId: initialDocA || 'DOC-0081',
      docBId: initialDocB || 'DOC-0072',
      docAData: getDocumentRecord(initialDocA || 'DOC-0081'),
      docBData: getDocumentRecord(initialDocB || 'DOC-0072'),
      result: options.result || null,
      presetKey: options.presetKey || null,
      targetCaseId: options.caseId || null
    };

    if (options.step === 3 && options.result) {
      reconciliationState.result = options.result;
    }

    openModal('Record Reconciliation Engine', renderReconciliationModal(), 'R&D FEATURE #55 · DETERMINISTIC RECONCILIATION');
    $('.modal')?.classList.add('reconciliation-modal');
  }

  function renderReconcileStepper(currentStep) {
    const steps = [
      { num: 1, label: 'নথি নির্বাচন' },
      { num: 2, label: 'ফিল্ড পর্যালোচনা ও সংশোধন' },
      { num: 3, label: 'গরমিল বিশ্লেষণ ও করণীয়' }
    ];
    const progressPercent = Math.min(100, Math.max(0, (currentStep - 1) / 2 * 100));

    return `<div class="wizard-stepper">
      <div class="wizard-stepper-line"></div>
      <div class="wizard-stepper-progress" style="width: calc(${progressPercent}% * 0.85)"></div>
      ${steps.map(s => {
        const isCompleted = s.num < currentStep;
        const isActive = s.num === currentStep;
        return `<div class="wizard-step-node ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}">
          <div class="wizard-step-circle">${isCompleted ? '✓' : s.num}</div>
          <span class="wizard-step-label">${s.label}</span>
        </div>`;
      }).join('')}
    </div>`;
  }

  function renderReconciliationModal() {
    const step = reconciliationState.step;

    if (step === 1) {
      const docA = reconciliationState.docAData || getDocumentRecord(reconciliationState.docAId);
      const docB = reconciliationState.docBData || getDocumentRecord(reconciliationState.docBId);

      return `${renderReconcileStepper(1)}
        <div style="margin-bottom:14px">
          <h3 style="font-size:14px;color:#183d35;margin:0 0 4px">তুলনার জন্য দুটি নথি নির্বাচন করুন</h3>
          <p style="font-size:11px;color:#788f83;line-height:1.5;margin:0">যেকোনো দুটি দলিল, খতিয়ান, পরচা বা দাখিলার তথ্য পাশাপাশি মিলিয়ে দেখার জন্য নিচের বহুল প্রচলিত টেস্ট কেসগুলো থেকে বেছে নিন অথবা ম্যানুয়ালি নথি সিলেক্ট করুন।</p>
        </div>

        <div style="font-size:11px;font-weight:700;color:#284a3d;margin-bottom:6px">দ্রুত টেস্ট কেস (1-Click Verification Presets):</div>
        <div class="reconcile-preset-grid">
          ${RECONCILIATION_PRESETS.map(p => `
            <div class="reconcile-preset-card ${reconciliationState.presetKey === p.key ? 'selected' : ''}" data-action="reconcile-preset" data-key="${p.key}">
              <b>${esc(p.title)}</b>
              <small>${esc(p.desc)}</small>
            </div>
          `).join('')}
        </div>

        <div class="reconcile-compare-grid" style="margin-top:16px">
          <div class="reconcile-doc-card doc-a">
            <div class="reconcile-doc-head">
              <div>
                <strong>প্রথম নথি (Document A)</strong>
                <small>মূল রেফারেন্স বা খতিয়ান নথি</small>
              </div>
              ${renderProvenanceBadge(docA.provenance)}
            </div>
            <div class="form-field">
              <label for="selectDocA">নথি নির্বাচন করুন:</label>
              <select id="selectDocA" data-action="reconcile-select-doc-a">
                ${docs.map(d => `<option value="${d[0]}" ${d[0] === reconciliationState.docAId ? 'selected' : ''}>${d[0]} · ${d[1]} (${d[2]})</option>`).join('')}
              </select>
            </div>
            <div style="background:#f8faf8;border-radius:9px;padding:10px 12px;font-size:11px;line-height:1.6">
              <div><strong>নথি:</strong> ${esc(docA.title)}</div>
              <div><strong>ধরন:</strong> ${esc(docA.docType)}</div>
              <div><strong>উৎস:</strong> ${esc(docA.sourceRef)}</div>
            </div>
          </div>

          <div class="reconcile-doc-card doc-b">
            <div class="reconcile-doc-head">
              <div>
                <strong>দ্বিতীয় নথি (Document B)</strong>
                <small>তুলনার জন্য সংরক্ষিত বা স্ক্যানকৃত নথি</small>
              </div>
              ${renderProvenanceBadge(docB.provenance)}
            </div>
            <div class="form-field">
              <label for="selectDocB">নথি নির্বাচন করুন:</label>
              <select id="selectDocB" data-action="reconcile-select-doc-b">
                ${docs.map(d => `<option value="${d[0]}" ${d[0] === reconciliationState.docBId ? 'selected' : ''}>${d[0]} · ${d[1]} (${d[2]})</option>`).join('')}
              </select>
            </div>
            <div style="background:#f8faf8;border-radius:9px;padding:10px 12px;font-size:11px;line-height:1.6">
              <div><strong>নথি:</strong> ${esc(docB.title)}</div>
              <div><strong>ধরন:</strong> ${esc(docB.docType)}</div>
              <div><strong>উৎস:</strong> ${esc(docB.sourceRef)}</div>
            </div>
          </div>
        </div>

        <div class="form-note" style="margin-top:14px">
          💡 পরবর্তী ধাপে আপনি নথির প্রতিটি ফিল্ডের মান পরীক্ষা করতে পারবেন এবং প্রয়োজনে সংশোধিত মান টাইপ করে গরমিল বিশ্লেষণ চালাতে পারবেন।
        </div>

        <div class="modal-actions">
          <button type="button" class="btn" data-action="close-modal">বাতিল করুন</button>
          <button type="button" class="btn primary" data-action="reconcile-next">পরবর্তী ধাপ (ফিল্ড পর্যালোচনা) →</button>
        </div>`;
    }

    if (step === 2) {
      const docA = reconciliationState.docAData;
      const docB = reconciliationState.docBData;
      const fA = docA.fields || {};
      const fB = docB.fields || {};

      return `${renderReconcileStepper(2)}
        <div style="margin-bottom:14px">
          <h3 style="font-size:14px;color:#183d35;margin:0 0 4px">ফিল্ড পর্যালোচনা ও প্রার্থীর মান সংশোধন (Candidate Values Review)</h3>
          <p style="font-size:11px;color:#788f83;line-height:1.5;margin:0">নথি দুটির পাওয়া ফিল্ডগুলো নিচে দেখানো হলো। কোনো তথ্যে টাইপো থাকলে বা আপনি কোনো নির্দিষ্ট মান দিয়ে টেস্ট করতে চাইলে ইনপুট বক্স থেকে সংশোধন করতে পারেন।</p>
        </div>

        <div class="reconcile-compare-grid">
          <div class="reconcile-doc-card doc-a">
            <div class="reconcile-doc-head">
              <div>
                <strong>${esc(docA.id)}</strong>
                <small>${esc(docA.title)}</small>
              </div>
              ${renderProvenanceBadge(docA.provenance)}
            </div>

            <div class="reconcile-field-group">
              <div class="reconcile-field">
                <label for="f_a_party">মালিক / পক্ষের নাম</label>
                <input id="f_a_party" value="${esc(fA.party || '')}" placeholder="নাম নেই"/>
              </div>
              <div class="reconcile-field">
                <label for="f_a_mouza">মৌজা</label>
                <input id="f_a_mouza" value="${esc(fA.mouza || '')}" placeholder="মৌজা নেই"/>
              </div>
              <div class="reconcile-field">
                <label for="f_a_dag">দাগ নম্বর</label>
                <input id="f_a_dag" value="${esc(fA.dag || '')}" placeholder="দাগ নেই"/>
              </div>
              <div class="reconcile-field">
                <label for="f_a_khatian">খতিয়ান নম্বর</label>
                <input id="f_a_khatian" value="${esc(fA.khatian || '')}" placeholder="খতিয়ান নেই"/>
              </div>
              <div class="reconcile-field">
                <label for="f_a_survey">জরিপের ধরন</label>
                <input id="f_a_survey" value="${esc(fA.surveyType || '')}" placeholder="জরিপ উল্লেখ নেই"/>
              </div>
              <div class="reconcile-field">
                <label for="f_a_area">জমির পরিমাণ ও একক</label>
                <input id="f_a_area" value="${esc(fA.area || '')}" placeholder="পরিমাণ নেই"/>
              </div>
              <div class="reconcile-field">
                <label for="f_a_date">নথির তারিখ</label>
                <input id="f_a_date" value="${esc(fA.date || '')}" placeholder="তারিখ নেই"/>
              </div>
            </div>
          </div>

          <div class="reconcile-doc-card doc-b">
            <div class="reconcile-doc-head">
              <div>
                <strong>${esc(docB.id)}</strong>
                <small>${esc(docB.title)}</small>
              </div>
              ${renderProvenanceBadge(docB.provenance)}
            </div>

            <div class="reconcile-field-group">
              <div class="reconcile-field">
                <label for="f_b_party">মালিক / পক্ষের নাম</label>
                <input id="f_b_party" value="${esc(fB.party || '')}" placeholder="নাম নেই"/>
              </div>
              <div class="reconcile-field">
                <label for="f_b_mouza">মৌজা</label>
                <input id="f_b_mouza" value="${esc(fB.mouza || '')}" placeholder="মৌজা নেই"/>
              </div>
              <div class="reconcile-field">
                <label for="f_b_dag">দাগ নম্বর</label>
                <input id="f_b_dag" value="${esc(fB.dag || '')}" placeholder="দাগ নেই"/>
              </div>
              <div class="reconcile-field">
                <label for="f_b_khatian">খতিয়ান নম্বর</label>
                <input id="f_b_khatian" value="${esc(fB.khatian || '')}" placeholder="খতিয়ান নেই"/>
              </div>
              <div class="reconcile-field">
                <label for="f_b_survey">জরিপের ধরন</label>
                <input id="f_b_survey" value="${esc(fB.surveyType || '')}" placeholder="জরিপ উল্লেখ নেই"/>
              </div>
              <div class="reconcile-field">
                <label for="f_b_area">জমির পরিমাণ ও একক</label>
                <input id="f_b_area" value="${esc(fB.area || '')}" placeholder="পরিমাণ নেই"/>
              </div>
              <div class="reconcile-field">
                <label for="f_b_date">নথির তারিখ</label>
                <input id="f_b_date" value="${esc(fB.date || '')}" placeholder="তারিখ নেই"/>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn" data-action="reconcile-prev">← পূর্ববর্তী (নথি নির্বাচন)</button>
          <button type="button" class="btn primary" data-action="reconcile-next">গরমিল বিশ্লেষণ চালান (Run Comparison) →</button>
        </div>`;
    }

    if (step === 3) {
      const res = reconciliationState.result;
      if (!res) return '<div class="no-results">কোনো ফলাফল পাওয়া যায়নি।</div>';

      const cases = local.landCases || [];

      return `${renderReconcileStepper(3)}
        <div class="reconcile-status-banner ${res.statusTone}">
          <div class="reconcile-status-icon">${res.statusTone === 'mismatch' ? '⚠️' : res.statusTone === 'match' ? '✓' : 'ℹ'}</div>
          <div style="flex:1">
            <strong style="font-size:14px;display:block;margin-bottom:3px">${esc(res.statusTitle)}</strong>
            <p style="margin:0;font-size:11.5px;line-height:1.5">${esc(res.explanation)}</p>
          </div>
          <div style="text-align:right">
            <span class="pill ${res.statusTone === 'mismatch' ? 'amber' : res.statusTone === 'match' ? 'green' : 'blue'}" style="font-size:10px">${res.overallStatus}</span>
          </div>
        </div>

        <div style="display:flex;gap:8px;align-items:center;margin-bottom:14px;font-size:11px;font-weight:700;flex-wrap:wrap">
          <span class="pill green">${res.matches.length}টি ফিল্ডে মিল</span>
          ${res.mismatches.length ? `<span class="pill amber">${res.mismatches.length}টি গরমিল</span>` : ''}
          ${res.unitIncompatibles.length ? `<span class="pill blue">${res.unitIncompatibles.length}টি একক যাচাই</span>` : ''}
          <span class="pill gray">${res.skipped.length}টি অনুপস্থিত (উপেক্ষিত)</span>
        </div>

        <div class="reconcile-findings-list">
          ${res.findings.map(f => {
            const isMismatch = f.status === 'MISMATCH';
            const isMatch = f.status === 'MATCH';
            const isUnit = f.status === 'INCOMPATIBLE_UNIT';
            const rowClass = isMismatch ? 'has-mismatch' : isMatch ? 'is-match' : isUnit ? 'is-unit-incompatible' : '';

            return `<div class="reconcile-finding-row ${rowClass}">
              <div class="reconcile-finding-field">
                <b>${esc(f.label.split(' ')[0])}</b>
                <small>${esc(f.label.split('(')[1]?.replace(')', '') || '')}</small>
              </div>

              <div class="reconcile-val-box">
                <small style="color:#778f83">${esc(res.docA.id)} (${res.docA.docType})</small>
                <strong>${esc(f.valA)}</strong>
                ${renderProvenanceBadge(res.docA.provenance)}
              </div>

              <div class="reconcile-val-box">
                <small style="color:#778f83">${esc(res.docB.id)} (${res.docB.docType})</small>
                <strong>${esc(f.valB)}</strong>
                ${renderProvenanceBadge(res.docB.provenance)}
                ${f.diffAmount ? `<div class="reconcile-diff-tag red">তফাত: ${esc(f.diffAmount)}</div>` : ''}
              </div>

              <div>
                <span class="pill ${f.statusTone}" style="margin-bottom:4px;display:inline-block">${esc(f.statusLabel)}</span>
                <p style="font-size:10px;color:#496b5b;margin:3px 0 0;line-height:1.4">${esc(f.reason)}</p>
                <div style="font-size:9.5px;color:#6d887a;margin-top:4px"><strong>পরামর্শ:</strong> ${esc(f.nextStep)}</div>
              </div>
            </div>`;
          }).join('')}
        </div>

        <div class="warning-panel" style="margin-top:16px">
          ⚠️ <strong>আইনি অস্বীকৃতি ও দায়িত্বসীমা:</strong> এই তুলনামূলক ফলাফলটি একটি স্থানীয় ব্রাউজার অ্যালগরিদমের সহায়তায় তৈরি করা হয়েছে। এটি কোনো আদালত, সহকারী কমিশনার (ভূমি) বা সাব-রেজিস্ট্রারের অফিসিয়াল রেকর্ড প্রত্যয়ন নয়। এটি জমির বৈধ মালিকানা বা জালিয়াতি নির্ধারণ করে না এবং কোনো আইনি অধিকার সৃষ্টি করে না। যেকোনো বিরোধ নিষ্পত্তির জন্য সংশ্লিষ্ট ভূমি অফিসের শরণাপন্ন হোন।
        </div>

        <div class="reconcile-case-link-box">
          <div class="reconcile-case-link-head">
            <div style="font-size:24px;line-height:1">📁</div>
            <div style="flex:1">
              <strong>Land Case-এর সাথে যুক্ত করুন (Associate with Land Case)</strong>
              <p>আপনার এই গরমিল বিশ্লেষণ রিপোর্টটি কেসবুকের Land Case ফাইলে সংরক্ষণ করে রাখুন। পরবর্তী শুনানি বা আবেদনের প্রস্তুতিতে কাজে লাগবে।</p>
              ${cases.length ? `
                <div style="display:flex;gap:9px;margin-top:10px;align-items:center;flex-wrap:wrap">
                  <select id="reconcileCaseSelect" style="padding:7px 10px;border-radius:8px;border:1px solid #c9decb;font-size:11px;background:#fff">
                    ${cases.map(c => `<option value="${esc(c.id)}">${esc(c.id)} · ${esc(c.category)} (${esc(c.created)})</option>`).join('')}
                  </select>
                  <button type="button" class="btn primary small" data-action="reconcile-link-case">✓ এই কেসে যুক্ত করুন</button>
                  <span style="font-size:11px;color:#6b887b">অথবা</span>
                  <button type="button" class="btn small" data-action="reconcile-create-case">＋ নতুন Land Case তৈরি করুন</button>
                </div>
              ` : `
                <div style="margin-top:10px">
                  <button type="button" class="btn primary small" data-action="reconcile-create-case">＋ নতুন Land Case ফাইলে এই গরমিল সংরক্ষণ করুন</button>
                </div>
              `}
            </div>
          </div>
        </div>

        <div class="modal-actions" style="margin-top:20px">
          <button type="button" class="btn" data-action="reconcile-prev">← মান সম্পাদনা করুন</button>
          <button type="button" class="btn" data-action="start-reconciliation">নতুন তুলনা</button>
          <button type="button" class="btn primary" data-action="close-modal">সম্পন্ন</button>
        </div>`;
    }

    return '';
  }

  function handleReconciliationAction(action, el) {
    switch(action) {
      case 'start-reconciliation': {
        const caseId = el?.dataset?.caseId || null;
        startReconciliation('DOC-0081', 'DOC-0072', { caseId });
        break;
      }

      case 'document-compare': {
        const docId = el?.dataset?.id || 'DOC-0081';
        const otherDoc = docId === 'DOC-0081' ? 'DOC-0072' : 'DOC-0081';
        startReconciliation(docId, otherDoc);
        break;
      }

      case 'reconcile-preset': {
        const key = el.dataset.key;
        const preset = RECONCILIATION_PRESETS.find(p => p.key === key);
        if (preset) {
          reconciliationState.presetKey = key;
          reconciliationState.docAId = preset.docA;
          reconciliationState.docBId = preset.docB;
          reconciliationState.docAData = getDocumentRecord(preset.docA);
          reconciliationState.docBData = getDocumentRecord(preset.docB);
          $('#modalBody').innerHTML = renderReconciliationModal();
        }
        break;
      }

      case 'reconcile-select-doc-a': {
        const val = $('#selectDocA')?.value;
        if (val) {
          reconciliationState.docAId = val;
          reconciliationState.docAData = getDocumentRecord(val);
          reconciliationState.presetKey = null;
          $('#modalBody').innerHTML = renderReconciliationModal();
        }
        break;
      }

      case 'reconcile-select-doc-b': {
        const val = $('#selectDocB')?.value;
        if (val) {
          reconciliationState.docBId = val;
          reconciliationState.docBData = getDocumentRecord(val);
          reconciliationState.presetKey = null;
          $('#modalBody').innerHTML = renderReconciliationModal();
        }
        break;
      }

      case 'reconcile-next': {
        if (reconciliationState.step === 1) {
          reconciliationState.docAData = getDocumentRecord(reconciliationState.docAId);
          reconciliationState.docBData = getDocumentRecord(reconciliationState.docBId);
          reconciliationState.step = 2;
          $('#modalBody').innerHTML = renderReconciliationModal();
          return;
        }

        if (reconciliationState.step === 2) {
          if (reconciliationState.docAData) {
            reconciliationState.docAData.fields = {
              party: $('#f_a_party')?.value?.trim() || '',
              mouza: $('#f_a_mouza')?.value?.trim() || '',
              dag: $('#f_a_dag')?.value?.trim() || '',
              khatian: $('#f_a_khatian')?.value?.trim() || '',
              surveyType: $('#f_a_survey')?.value?.trim() || '',
              area: $('#f_a_area')?.value?.trim() || '',
              date: $('#f_a_date')?.value?.trim() || ''
            };
          }
          if (reconciliationState.docBData) {
            reconciliationState.docBData.fields = {
              party: $('#f_b_party')?.value?.trim() || '',
              mouza: $('#f_b_mouza')?.value?.trim() || '',
              dag: $('#f_b_dag')?.value?.trim() || '',
              khatian: $('#f_b_khatian')?.value?.trim() || '',
              surveyType: $('#f_b_survey')?.value?.trim() || '',
              area: $('#f_b_area')?.value?.trim() || '',
              date: $('#f_b_date')?.value?.trim() || ''
            };
          }

          reconciliationState.result = compareRecords(reconciliationState.docAData, reconciliationState.docBData);
          reconciliationState.step = 3;
          $('#modalBody').innerHTML = renderReconciliationModal();
          return;
        }
        break;
      }

      case 'reconcile-prev': {
        if (reconciliationState.step > 1) {
          reconciliationState.step -= 1;
          $('#modalBody').innerHTML = renderReconciliationModal();
        }
        break;
      }

      case 'reconcile-link-case': {
        const caseId = $('#reconcileCaseSelect')?.value;
        const c = (local.landCases || []).find(x => x.id === caseId);
        if (!c || !reconciliationState.result) {
          toast('কেস নির্বাচন করুন', 'সঠিক কেস সিলেক্ট করুন।');
          return;
        }

        const res = reconciliationState.result;
        c.reconciliation = res;
        const noteSummary = `[নথিপত্র গরমিল নিরূপণ #55 - ${res.dateStr}]: ${res.docA.id} বনাম ${res.docB.id} | স্থিতি: ${res.overallStatus} (${res.mismatches.length}টি গরমিল, ${res.matches.length}টি মিল)।`;
        c.notes = c.notes ? `${c.notes}\n\n${noteSummary}` : noteSummary;

        persist();
        toast('Land Case-এ গরমিল রিপোর্ট সংরক্ষিত হয়েছে', `${c.id} কেসে সফলভাবে সংযুক্ত করা হয়েছে।`);
        if (state.page === 'casebook') renderPage();
        closeModal();
        break;
      }

      case 'reconcile-create-case': {
        const res = reconciliationState.result;
        closeModal();

        const mismatchText = res && res.mismatches.length
          ? res.mismatches.map(m => `${m.label.split(' ')[0]}: ${m.valA} বনাম ${m.valB}`).join('; ')
          : 'নথিপত্র তথ্যে অমিল';

        const prefillText = res
          ? `${res.docA.title} এবং ${res.docB.title}-এর মধ্যে গরমিল চিহ্নিত হয়েছে (${mismatchText})। সহকারী কমিশনার (ভূমি) কার্যালয়ে রেকর্ড সংশোধনের জন্য প্রস্তুতি নিতে চাই।`
          : 'দলিল ও খতিয়ানের নামের বানান ও জমির পরিমাপে গরমিল আছে।';

        startLandCaseBuilder(prefillText, {
          categoryKey: 'mismatch',
          category: LAND_CASE_CATEGORIES.mismatch.title,
          linkedParcel: 'DAG-1842',
          reconciliation: res,
          notes: res ? `R&D Feature #55 Record Reconciliation Engine দ্বারা স্বয়ংক্রিয়ভাবে গরমিল রিপোর্ট যুক্ত করা হয়েছে (${res.overallStatus})।` : ''
        });
        break;
      }

      case 'reconcile-view-attached': {
        const caseId = el.dataset.caseId;
        const c = (local.landCases || []).find(x => x.id === caseId);
        if (c && c.reconciliation) {
          startReconciliation(c.reconciliation.docA?.id || 'DOC-0081', c.reconciliation.docB?.id || 'DOC-0072', {
            step: 3,
            result: c.reconciliation
          });
        }
        break;
      }
    }
  }

  /* ==========================================================================
     R&D Feature #71: AI Service Router
     Suggests an official service/authority based on the stated problem and
     the verified service directory.
     Source basis: docs/RND_REFERENCE_v1.4.md (§6.12, §7.4 #71, §20.1–20.4)
     ========================================================================== */

  const VERIFIED_SERVICE_DIRECTORY = [
    {
      id: 'mutation',
      name: 'ই-নামজারি ও জমাভাগ (e-Mutation)',
      nameEn: 'Online Land Mutation & Partition',
      authority: 'সহকারী কমিশনার (ভূমি) / উপজেলা ভূমি অফিস (AC Land Office)',
      authorityEn: 'Assistant Commissioner (Land) / Upazila Land Office',
      ministry: 'ভূমি মন্ত্রণালয় (Ministry of Land)',
      categoryKey: 'mutation',
      icon: '⇄',
      officialPortalUrl: 'https://mutation.land.gov.bd/',
      portalLabel: 'mutation.land.gov.bd',
      urlVerified: true,
      isOnlineSubmission: true,
      sourceCitation: 'R&D Reference v1.4 §20.2 #6 (e-Mutation / e-Namjari Portal)',
      description: 'জমি ক্রয়, হেবা, দান বা হস্তান্তরের পর সরকারি রেকর্ডে নিজের নাম অন্তর্ভুক্তিকরণ ও পৃথক খতিয়ান তৈরি।',
      keywords: ['নামজারি', 'খারিজ', 'নামপত্তন', 'জমাভাগ', 'খারিজের আবেদন', 'মিউটেশন', 'mutation', 'namjari', 'kharij', 'হস্তান্তর', 'জমি কিনেছি', 'দলিল রেজিস্ট্রি হয়েছে', 'রেকর্ড পরিবর্তন', 'নাম পরিবর্তন'],
      requiredDocuments: [
        'মূল দলিলের সার্টিফাইড কপি বা স্ক্যান',
        'পিঠ দলিল / বায়া দলিলের ধারাবাহিক কপি',
        'হাল সনের ভূমি উন্নয়ন কর পরিশোধ দাখিলা',
        'সর্বশেষ জরিপের খতিয়ান / পরচা কপি',
        'আবেদনকারীর এনআইডি ও ছবি'
      ],
      citizenNextSteps: [
        'ই-নামজারি পোর্টালে (mutation.land.gov.bd) অনলাইনে আবেদন ফরম পূরণ করুন।',
        'প্রয়োজনীয় কোর্ট ফি ও নোটিশ জারি ফি অনলাইনে পরিশোধ করুন।',
        'ইউনিয়ন ভূমি সহকারী কর্মকর্তার সরেজমিন তদন্ত ও এসি ল্যান্ডের শুনানিতে মূল কাগজপত্র প্রদর্শন করুন।'
      ],
      caution: 'নামজারির আবেদন কেবল অনুমোদিত সরকারি পোর্টালেই করতে হবে। কোনো মধ্যস্বত্বভোগী বা দালালের সহায়তা নেওয়া দণ্ডনীয়।'
    },
    {
      id: 'tax',
      name: 'ভূমি উন্নয়ন কর ও অনলাইন দাখিলা (Land Development Tax)',
      nameEn: 'Land Development Tax & Digital Dakhila',
      authority: 'ইউনিয়ন ভূমি সহকারী কর্মকর্তা (তহশিলদার) / ইউনিয়ন ভূমি অফিস',
      authorityEn: 'Union Land Assistant Officer / Union Land Office',
      ministry: 'ভূমি মন্ত্রণালয় (Ministry of Land)',
      categoryKey: 'tax',
      icon: '৳',
      officialPortalUrl: 'https://ldtax.gov.bd/',
      portalLabel: 'ldtax.gov.bd',
      urlVerified: true,
      isOnlineSubmission: true,
      sourceCitation: 'R&D Reference v1.4 §20.2 #7, #8 (Land Development Tax Portal & Manuals)',
      description: 'বার্ষিক জমির খাজনা বা ভূমি উন্নয়ন কর পরিশোধ, বকেয়া কর যাচাই এবং কিউআর-কোডযুক্ত ডিজিটাল দাখিলা সংগ্রহ।',
      keywords: ['খাজনা', 'ভূমি উন্নয়ন কর', 'ভূমি কর', 'কর পরিশোধ', 'বকেয়া কর', 'দাখিলা', 'বকেয়া খাজনা', 'এলডি ট্যাক্স', 'হোল্ডিং ট্যাক্স', 'ট্যাক্স', 'tax', 'khajna', 'dakhila', 'ldtax', 'holding tax', 'খাজনা বাকি', 'দাখিলা রসিদ', 'খাজনা দেব'],
      requiredDocuments: [
        'হাল খতিয়ান বা নামজারি পর্চার কপি',
        'পূর্ববর্তী পরিশোধিত দাখিলা রসিদ',
        'মালিকের জাতীয় পরিচয়পত্র ও সক্রিয় মোবাইল নম্বর',
        'অনলাইন হোল্ডিং নম্বর (যদি পূর্বে নিবন্ধন করা থাকে)'
      ],
      citizenNextSteps: [
        'ldtax.gov.bd পোর্টালে নাগরিক নিবন্ধন করে মোবাইল নম্বর ও এনআইডি দিয়ে লগইন করুন।',
        'হোল্ডিং এন্ট্রি বা হালনাগাদ করে বর্তমান বকেয়া ও দাবির পরিমাণ যাচাই করুন।',
        'অনলাইনে মোবাইল ফাইন্যান্সিয়াল সার্ভিস (বিকাশ, নগদ, রকেট) বা কার্ডের মাধ্যমে কর পরিশোধ করে কিউআর দাখিলা প্রিন্ট করুন।'
      ],
      caution: 'দাখিলার জন্য কোনো অতিরিক্ত নগদ অর্থ প্রদান করবেন না। ডিজিটাল কিউআর-কোডযুক্ত দাখিলাই একমাত্র আইনি রসিদ।'
    },
    {
      id: 'khatian',
      name: 'খতিয়ান / পর্চার সার্টিফাইড কপি ও তল্লাশ (e-Porcha)',
      nameEn: 'Certified Khatian / Porcha Record Copy',
      authority: 'জেলা প্রশাসকের কার্যালয়ের রেকর্ডরুম / উপজেলা ভূমি অফিস (DC Record Room / DLRS)',
      authorityEn: 'Deputy Commissioner Record Room / Directorate of Land Records & Surveys',
      ministry: 'ভূমি রেকর্ড ও জরিপ অধিদপ্তর (DLRS) ও ভূমি মন্ত্রণালয়',
      categoryKey: 'records',
      icon: '⌂',
      officialPortalUrl: 'https://land.gov.bd/',
      portalLabel: 'land.gov.bd (DLRS e-Porcha)',
      urlVerified: true,
      isOnlineSubmission: true,
      sourceCitation: 'R&D Reference v1.4 §20.1 #3, §20.2 #9 (DLRS / National Land Portal)',
      description: 'সিএস, এসএ, আরএস, দিয়ারা ও হাল বিএস/বিআরএস জরিপের খতিয়ান অনুসন্ধান, অনলাইন যাচাই ও সার্টিফাইড কপির আবেদন।',
      keywords: ['খতিয়ান', 'পর্চা', 'পরচা', 'সিএস', 'এসএ', 'আরএস', 'বিএস', 'বিআরএস', 'khatian', 'porcha', 'eporcha', 'সার্টিফাইড কপি', 'রেকর্ড কপি', 'খতিয়ান তল্লাশ', 'রেকর্ড অফ রাইটস', 'ror', 'পর্চা তুলতে'],
      requiredDocuments: [
        'মৌজার নাম ও জেএল নম্বর',
        'খতিয়ান নম্বর বা দাগ নম্বর',
        'জরিপের ধরন (CS / SA / RS / BS)',
        'আবেদনকারীর এনআইডি ও ডাকযোগে ডেলিভারি ঠিকানা'
      ],
      citizenNextSteps: [
        'land.gov.bd বা eporcha সেবায় গিয়ে বিভাগ, জেলা, উপজেলা ও মৌজা নির্বাচন করুন।',
        'খতিয়ান নম্বর বা দাগ নম্বর দিয়ে রেকর্ড অনুসন্ধান করুন।',
        'সার্টিফাইড কপির জন্য কোর্ট ফি প্রদান করে ডাকযোগে বা ডিসি অফিস রেকর্ডরুম থেকে সরাসরি কপি সংগ্রহের আবেদন করুন।'
      ],
      caution: 'অনলাইন ভিউ কেবল তথ্যগত পর্যালোচনার জন্য; আদালতে প্রমাণের জন্য রেকর্ডরুমের মোহরাঙ্কিত সার্টিফাইড কপি আবশ্যক।'
    },
    {
      id: 'mouza-map',
      name: 'মৌজা নকশা ও দাগভিত্তিক ম্যাপ (Digital Mouza Map)',
      nameEn: 'Digital Mouza Map & Plot Sheet',
      authority: 'ভূমি রেকর্ড ও জরিপ অধিদপ্তর (DLRS) / জেলা রেকর্ডরুম',
      authorityEn: 'Directorate of Land Records & Surveys (DLRS)',
      ministry: 'ভূমি মন্ত্রণালয় (Ministry of Land)',
      categoryKey: 'gis',
      icon: '⌖',
      officialPortalUrl: 'https://map.land.gov.bd/',
      portalLabel: 'map.land.gov.bd',
      urlVerified: true,
      isOnlineSubmission: true,
      sourceCitation: 'R&D Reference v1.4 §20.1 #5 (National Digital Land Zoning & Map Portal)',
      description: 'মৌজা নকশা বা শিট ম্যাপ দর্শন, নির্দিষ্ট দাগের অবস্থান পরিমাপ এবং মুদ্রিত শিটের জন্য সার্টিফাইড আবেদন।',
      keywords: ['ম্যাপ', 'নকশা', 'মৌজা ম্যাপ', 'দাগ ম্যাপ', 'শিট', 'মৌজা নকশা', 'map', 'mouza map', 'cadastral', 'plot map', 'নকসা', 'sheet', 'নকশা দেখতে'],
      requiredDocuments: [
        'মৌজা ও জেএল নম্বর',
        'শিট নম্বর (একাধিক শিটভুক্ত মৌজার ক্ষেত্রে)',
        'দাগ নম্বর'
      ],
      citizenNextSteps: [
        'map.land.gov.bd পোর্টালে মৌজা ও শিট নির্বাচন করে ডিজিটাল দাগ ম্যাপ পর্যালোচনা করুন।',
        'সার্টিফাইড প্রিন্টেড ম্যাপের জন্য জেলা রেকর্ডরুম বা ডাকযোগে ডেলিভারির আবেদন করুন।'
      ],
      caution: 'স্ক্রিনের ডিজিটাল ভিউ পরিমাপের জন্য সহায়ক হলেও আইনি সীমানা নির্ধারণে সরকারি সার্টিফাইড শিট প্রযোজ্য।'
    },
    {
      id: 'dispute-correction',
      name: 'রেকর্ড সংশোধন ও ভূমি রাজস্ব মামলা (Miss Case / Correction)',
      nameEn: 'Record Correction & Revenue Court Case',
      authority: 'সহকারী কমিশনার (ভূমি) আদালত / অতিরিক্ত জেলা প্রশাসক (রাজস্ব)',
      authorityEn: 'Assistant Commissioner (Land) Revenue Court / ADC (Revenue)',
      ministry: 'ভূমি মন্ত্রণালয় (Ministry of Land)',
      categoryKey: 'dispute',
      icon: '▤',
      officialPortalUrl: 'https://case.gov.bd/',
      portalLabel: 'case.gov.bd',
      urlVerified: true,
      isOnlineSubmission: true,
      sourceCitation: 'R&D Reference v1.4 §20.2 #10 (Land Revenue Case Management System)',
      description: 'খতিয়ানে নামের বানান বা দাগের ক্লারিক্যাল ভুল সংশোধন, নামজারি আদেশের বিরুদ্ধে মিসকেস ও রাজস্ব বিরোধের আইনি প্রতিকার।',
      keywords: ['রেকর্ড সংশোধন', 'মিসকেস', 'ভুল সংশোধন', 'বানান ভুল', 'দাগ ভুল', 'খতিয়ান ভুল', 'মিস কেস', 'মামলা', 'আপিল', 'রাজস্ব মামলা', 'case', 'miss case', 'correction', 'revenue case', 'বিরোধ', 'গরমিল সংশোধন', 'নামের বানান ভুল'],
      requiredDocuments: [
        'যেই খতিয়ানে ভুল হয়েছে তার সার্টিফাইড কপি',
        'ভুল প্রমাণের সপক্ষে মূল বায়া দলিল ও পূর্ববর্তী শুদ্ধ খতিয়ান',
        'আবেদনকারীর এনআইডি ও সংশোধন প্রার্থনার সুনির্দিষ্ট বিবরণ',
        'নামজারি আদেশের বিরুদ্ধে হলে আদেশের সত্যায়িত নকল'
      ],
      citizenNextSteps: [
        'case.gov.bd পোর্টালে মামলার ধরন নির্বাচন করে মিসকেস বা আপিল পিটিশন দাখিলের প্রস্তুতি নিন।',
        'উপজেলা সহকারী কমিশনার (ভূমি) কার্যালয়ে প্রয়োজনীয় কোর্ট ফিসহ আবেদনপত্র জমা দিন।',
        'বিজ্ঞ আদালতের নোটিশ জারির পর নির্ধারিত তারিখে মূল নথিপত্রসহ শুনানিতে অংশ নিন।'
      ],
      caution: 'স্বত্ব ও মালিকানা সংক্রান্ত জটিল দেওয়ানি বিরোধ নিষ্পত্তির এখতিয়ার কেবল দেওয়ানি আদালতের (Civil Court); রাজস্ব আদালত কেবল রেকর্ডের ভুল ও নামজারি বিরোধ দেখে।'
    },
    {
      id: 'inheritance',
      name: 'উত্তরাধিকার ও পারিবারিক সম্পত্তি বণ্টন (Inheritance & Faraiz)',
      nameEn: 'Inheritance Property Distribution & Succession Mutation',
      authority: 'সহকারী কমিশনার (ভূমি) কার্যালয় (নামজারির জন্য) ও সাব-রেজিস্ট্রি অফিস (বণ্টন দলিলের জন্য)',
      authorityEn: 'AC Land Office (Mutation) & Sub-Registry Office (Partition Deed)',
      ministry: 'ভূমি মন্ত্রণালয় ও আইন মন্ত্রণালয় (নিবন্ধন অধিদপ্তর)',
      categoryKey: 'inheritance',
      icon: '⌁',
      officialPortalUrl: 'https://mutation.land.gov.bd/',
      portalLabel: 'mutation.land.gov.bd (ওয়ারিশান নামজারি)',
      urlVerified: true,
      isOnlineSubmission: true,
      sourceCitation: 'R&D Reference v1.4 §20.2 #6, §19.3',
      description: 'পৈতৃক সম্পত্তির ফারায়েজ অনুযায়ী অংশ নির্ধারণ, ওয়ারিশান নামজারি এবং রেজিস্ট্রিকৃত আপস বণ্টননামার মাধ্যমে পৃথক খতিয়ান তৈরি।',
      keywords: ['উত্তরাধিকার', 'ওয়ারিশ', 'ওয়ারিশ', 'ওয়ারিশান', 'ফারায়েজ', 'বণ্টন', 'বন্টন', 'পিতা মারা', 'মৃত', 'পৈতৃক', 'inheritance', 'heir', 'succession', 'faraiz', 'পারিবারিক জমি', 'বণ্টননামা', 'বাবার মৃত্যুর পর'],
      requiredDocuments: [
        'স্থানীয় ইউনিয়ন পরিষদ বা পৌরসভা কর্তৃক প্রদত্ত ওয়ারিশান সনদপত্র',
        'মৃত ব্যক্তির অফিসিয়াল মৃত্যু সনদপত্র (Death Certificate)',
        'মৃত ব্যক্তির নামের রেকর্ডীয় খতিয়ান ও মালিকানার মূল দলিল',
        'পারিবারিক রেজিস্ট্রিকৃত আপস বণ্টননামা দলিল (যদি সম্পাদিত হয়ে থাকে)',
        'সকল জীবিত ওয়ারিশের জাতীয় পরিচয়পত্র'
      ],
      citizenNextSteps: [
        'ফারায়েজ অনুযায়ী প্রত্যেক ওয়ারিশের প্রাপ্য অংশ হিসাব করুন।',
        'ওয়ারিশদের সমঝোতার ভিত্তিতে উপজেলা সাব-রেজিস্ট্রি অফিসে একটি রেজিস্ট্রিকৃত বণ্টননামা দলিল সম্পাদন করুন।',
        'বণ্টননামার দলিলের কপি সংযুক্ত করে mutation.land.gov.bd-তে ওয়ারিশান নামজারির আবেদন দাখিল করুন।'
      ],
      caution: 'ওয়ারিশদের মধ্যে অংশ বা দখল নিয়ে ফৌজদারি বিরোধ থাকলে স্থানীয় সালিশ বা দেওয়ানি আদালতের শরণাপন্ন হোন।'
    },
    {
      id: 'khas-settlement',
      name: 'সরকারি খাস জমি বন্দোবস্ত ও লিজ (Khas Land Settlement)',
      nameEn: 'Government Khas Land Allotment & Lease',
      authority: 'উপজেলা কৃষি খাস জমি বন্দোবস্ত কমিটি / সহকারী কমিশনার (ভূমি) ও উপজেলা নির্বাহী কর্মকর্তা (UNO)',
      authorityEn: 'Upazila Khas Land Settlement Committee / AC Land & UNO',
      ministry: 'ভূমি মন্ত্রণালয় (Ministry of Land)',
      categoryKey: 'lease',
      icon: '⌁',
      officialPortalUrl: 'https://land.gov.bd/',
      portalLabel: 'land.gov.bd / স্থানীয় উপজেলা কার্যালয়',
      urlVerified: true,
      isOnlineSubmission: false,
      sourceCitation: 'R&D Reference v1.4 §20.3 #18, #19 (Agricultural & Non-agricultural Khas Policies)',
      description: 'ভূমিহীন পরিবারের জন্য কৃষি খাস জমি বন্দোবস্ত, আশ্রয়ণ প্রকল্প অথবা সরকারি নীতিমালা অনুযায়ী বিশেষ ইজারা ও বন্দোবস্ত।',
      keywords: ['খাস জমি', 'বন্দোবস্ত', 'লিজ', 'ভূমিহীন', 'চা বাগান লিজ', 'জলমহাল', 'সরকারি জমি', 'khas', 'settlement', 'bandobasto', 'lease', 'allotment', 'ashrayan'],
      requiredDocuments: [
        'ইউপি চেয়ারম্যান কর্তৃক প্রদত্ত প্রকৃত ভূমিহীন পরিবারের সনদপত্র',
        'পরিবারের সকল সদস্যের জাতীয় পরিচয়পত্র ও ছবি',
        'প্রস্তাবিত খাস জমির মৌজা ও দাগ সংক্রান্ত তথ্য',
        'স্থানীয় ইউনিয়ন ভূমি কর্মকর্তার খাস জমি যাচাই প্রতিবেদন'
      ],
      citizenNextSteps: [
        'উপজেলা নির্বাহী কর্মকর্তা (ইউএনও) বা এসি ল্যান্ডের কার্যালয়ে নির্ধারিত ফরমে সরাসরি আবেদন জমা দিন।',
        'উপজেলা কৃষি খাস জমি বন্দোবস্ত কমিটির যাচাই ও অনুমোদনের জন্য অপেক্ষা করুন।',
        'অনুমোদন পাওয়া গেলে প্রতীকী সালামি জমা দিয়ে সরকারি কবুলিয়ত দলিল সম্পাদন করুন।'
      ],
      caution: 'খাস জমি কোনো ব্যক্তি বা দালালের মাধ্যমে ক্রয়-বিক্রয় করা সম্পূর্ণ অবৈধ। এটি কেবল সরকারি কমিটির মাধ্যমেই বন্দোবস্তযোগ্য।'
    },
    {
      id: 'deed-registration',
      name: 'দলিল নিবন্ধন, বালাম তল্লাশ ও সার্টিফাইড নকল (Sub-Registry)',
      nameEn: 'Deed Registration, Search & Certified Copy',
      authority: 'উপজেলা সাব-রেজিস্ট্রি কার্যালয় (Sub-Registry Office)',
      authorityEn: 'Sub-Registry Office, Directorate of Registration',
      ministry: 'আইন, বিচার ও সংসদ বিষয়ক মন্ত্রণালয় (নিবন্ধন অধিদপ্তর)',
      categoryKey: 'deeds',
      icon: '▣',
      officialPortalUrl: 'https://registration.gov.bd/',
      portalLabel: 'registration.gov.bd',
      urlVerified: true,
      isOnlineSubmission: false,
      sourceCitation: 'R&D Reference v1.4 §20.3 (Registration Directorate & Laws)',
      description: 'সাব-কবলা, হেবা, দান বা বণ্টননামা দলিল রেজিস্ট্রি, পুরাতন দলিলের বালাম তল্লাশ এবং সার্টিফাইড নকল (নকলনবিস কপি) উত্তোলন।',
      keywords: ['দলিল', 'রেজিস্ট্রি', 'সাব রেজিস্ট্রি', 'দলিল তল্লাশ', 'বায়া দলিল', 'সাব কবলা', 'হেবা', 'নকল', 'deed', 'registration', 'sub registry', 'deed copy', 'দলিলের নকল', 'দলিল রেজিস্ট্রি', 'দলিল তল্লাশ ও নকল'],
      requiredDocuments: [
        'হস্তান্তরকারী ও গ্রহীতার এনআইডি, ছবি ও টিআইএন (প্রযোজ্য ক্ষেত্রে)',
        'হাল সনের দাখিলা ও বিক্রেতার নামে নামজারি খতিয়ান',
        'পুরাতন দলিলের বালাম তল্লাশের ক্ষেত্রে দলিল নম্বর, সাল ও পক্ষগণের নাম',
        'সরকার নির্ধারিত স্ট্যাম্প ডিউটি ও রেজিস্ট্রি ফি পরিশোধের চালান'
      ],
      citizenNextSteps: [
        'নিবন্ধন অধিদপ্তরের পোর্টালে (registration.gov.bd) ফি ও নিয়মাবলী পর্যালোচনা করুন।',
        'সংশ্লিষ্ট উপজেলা সাব-রেজিস্ট্রি কার্যালয়ে গিয়ে নির্ধারিত তল্লাশ ফি জমা দিয়ে বালাম ও ইনডেক্স তল্লাশ দিন।',
        'তল্লাশ শেষে মহাফেজখানা/রেকর্ড শাখা থেকে দলিলের সার্টিফাইড নকলের জন্য আবেদন করুন।'
      ],
      caution: 'সাব-রেজিস্ট্রি অফিস আইন মন্ত্রণালয়ের অধীন; ভূমি মন্ত্রণালয়ের নামজারি বা খাজনার সাথে এর এখতিয়ার আলাদা।'
    },
    {
      id: 'cht-special',
      name: 'পার্বত্য চট্টগ্রাম বিশেষ ভূমি ব্যবস্থাপনা (CHT Customary Land Governance)',
      nameEn: 'Chittagong Hill Tracts Special Land Administration',
      authority: 'সার্কেল চিফ (রাজা), সংশ্লিষ্ট মৌজা হেডম্যান ও জেলা প্রশাসন (DC Office)',
      authorityEn: 'Circle Chief (Raja), Mouza Headman & Hill District Administration',
      ministry: 'পার্বত্য চট্টগ্রাম বিষয়ক মন্ত্রণালয় (MoCHTA)',
      categoryKey: 'cht',
      icon: '◭',
      officialPortalUrl: 'https://mochta.gov.bd/',
      portalLabel: 'mochta.gov.bd',
      urlVerified: true,
      isOnlineSubmission: false,
      sourceCitation: 'R&D Reference v1.4 §20.3 #13, #14, #15, #16 (MoCHTA Laws & 1900 CHT Regulation)',
      description: 'রাঙামাটি, খাগড়াছড়ি ও বান্দরবান পার্বত্য জেলার জন্য প্রযোজ্য বিশেষ ভূমি ব্যবস্থাপনা, মৌজা হেডম্যানের সুপারিশ ও সার্কেল চিফের অনাপত্তি।',
      keywords: ['পার্বত্য চট্টগ্রাম', 'হেডম্যান', 'সার্কেল চিফ', 'চাকমা রাজা', 'বোমাং', 'মং', 'রাঙামাটি', 'খাগড়াছড়ি', 'বান্দরবান', 'cht', 'hill tracts', 'headman', 'circle chief', 'পার্বত্য জেলা', 'প্রথাগত ভূমি'],
      requiredDocuments: [
        'স্থায়ী বাসিন্দার প্রত্যয়নপত্র (সার্কেল চিফ বা হেডম্যান কর্তৃক প্রদত্ত)',
        'মৌজা হেডম্যানের সীমানা ও মালিকানা তদন্ত প্রতিবেদন',
        'জাতীয় পরিচয়পত্র ও আবেদনকারীর বংশপরম্পরা বিবরণী',
        'পার্বত্য জেলা পরিষদের অনাপত্তিপত্র (প্রযোজ্য ক্ষেত্রে)'
      ],
      citizenNextSteps: [
        'প্রথমে আপনার সংশ্লিষ্ট মৌজার হেডম্যানের সাথে সাক্ষাৎ করে ভূমির বিবরণ দিন ও তদন্ত প্রতিবেদন সংগ্রহ করুন।',
        'সংশ্লিষ্ট সার্কেল চিফ (চাকমা, বোমাং বা মং সার্কেল) কার্যালয়ে অনাপত্তিপত্র বা সনদের জন্য আবেদন করুন।',
        'পরবর্তীতে জেলা প্রশাসকের কার্যালয়ের রাজস্ব শাখায় চূড়ান্ত অনুমোদনের প্রক্রিয়া সম্পন্ন করুন।'
      ],
      caution: 'পার্বত্য চট্টগ্রামের ভূমি ব্যবস্থাপনা সমতল এলাকার চেয়ে সম্পূর্ণ ভিন্ন এবং ১৯০০ সালের পার্বত্য চট্টগ্রাম রেগুলেশন ও শান্তি চুক্তি আইন দ্বারা নিয়ন্ত্রিত। সাধারণ নামজারি নিয়ম সরাসরি প্রযোজ্য নয়।'
    },
    {
      id: 'acquisition',
      name: 'ভূমি অধিগ্রহণ ক্ষতিপূরণ দাবি ও আপত্তি (Land Acquisition - LA Case)',
      nameEn: 'Land Acquisition Compensation Claim & Objection',
      authority: 'জেলা প্রশাসকের কার্যালয়ের ভূমি অধিগ্রহণ (LA) শাখা (DC Office LA Section)',
      authorityEn: 'Land Acquisition Section, Deputy Commissioner Office',
      ministry: 'ভূমি মন্ত্রণালয় (Ministry of Land)',
      categoryKey: 'acquisition',
      icon: '⚑',
      officialPortalUrl: 'https://land.gov.bd/',
      portalLabel: 'land.gov.bd / জেলা প্রশাসকের এলএ শাখা',
      urlVerified: true,
      isOnlineSubmission: false,
      sourceCitation: 'R&D Reference v1.4 §20.3 #21 (Acquisition & Requisition of Immovable Property Act, 2017)',
      description: 'সরকারি উন্নয়ন প্রকল্পের জন্য জমি অধিগ্রহণে ৪ ধারা, ৭ ধারা বা ৮ ধারা নোটিশের প্রেক্ষিতে ক্ষতিপূরণ দাবি দাখিল বা আপত্তি উত্থাপন।',
      keywords: ['অধিগ্রহণ', 'ক্ষতিপূরণ', 'এলএ কেস', 'হুকুমদখল', '৭ ধারা', '৮ ধারা', '৪ ধারা', 'acquisition', 'la case', 'compensation', 'requisition', 'জমি নিয়েছে', 'রাস্তার জন্য জমি'],
      requiredDocuments: [
        'ডিসি অফিস কর্তৃক জারিকৃত অধিগ্রহণের মূল নোটিশ কপি (৪/৭/৮ ধারা)',
        'অধিগ্রহণকৃত জমির মালিকানার মূল বায়া দলিল ও আরএস/বিএস খতিয়ান',
        'হাল সনের ভূমি উন্নয়ন কর দাখিলা রসিদ',
        'জমিতে বিদ্যমান ঘরবাড়ি, গাছপালা বা স্থাপনার বিবরণ ও মালিকের এনআইডি'
      ],
      citizenNextSteps: [
        'নোটিশে উল্লেখিত সময়সীমার মধ্যে জেলা প্রশাসকের এলএ শাখায় ক্ষতিপূরণ দাবি ফরম দাখিল করুন।',
        'যৌথ তদন্ত (Joint Verification) কমিটির সাথে জমিতে উপস্থিত থেকে সম্পদ প্রদর্শন করুন।',
        'স্বত্ব প্রমাণের শুনানি শেষে ডিসি অফিসের হিসাব শাখা থেকে ক্ষতিপূরণের চেক গ্রহণ করুন।'
      ],
      caution: 'স্থাবর সম্পত্তি অধিগ্রহণ ও হুকুমদখল আইন ২০১৭ অনুসারে নির্ধারিত সময়ের মধ্যে দাবি বা আপত্তি না জানালে ক্ষতিপূরণ প্রাপ্তিতে জটিলতা সৃষ্টি হতে পারে।'
    },
    {
      id: 'boundary-survey',
      name: 'সীমানা নির্ধারণ ও সরকারি আমিন দ্বারা পরিমাপ (Boundary Demarcation)',
      nameEn: 'Boundary Demarcation & Government Survey',
      authority: 'উপজেলা সহকারী কমিশনার (ভূমি) কার্যালয় / উপজেলা সেটেলমেন্ট অফিস',
      authorityEn: 'AC Land Office / Upazila Settlement Office',
      ministry: 'ভূমি মন্ত্রণালয় ও DLRS',
      categoryKey: 'boundary',
      icon: '⌖',
      officialPortalUrl: 'https://land.gov.bd/',
      portalLabel: 'land.gov.bd / সহকারী কমিশনার (ভূমি) কার্যালয়',
      urlVerified: true,
      isOnlineSubmission: false,
      sourceCitation: 'R&D Reference v1.4 §7.2 #30, §19.3',
      description: 'জমির আইল বা সীমানা নিয়ে বিরোধের ক্ষেত্রে সরকারি সনদপ্রাপ্ত আমিন/সার্ভেয়ার দ্বারা সরকারি জরিপ ম্যাপের ভিত্তিতে সরেজমিন পরিমাপ।',
      keywords: ['সীমানা', 'মাপ', 'পরিমাপ', 'আমিন', 'সার্ভেয়ার', 'আইল', 'দখল', 'জবরদখল', 'বেদখল', 'ঘেরা', 'boundary', 'survey', 'measurement', 'demarcation', 'encroachment', 'আইল ঠেলা', 'জমি মাপতে'],
      requiredDocuments: [
        'জমির মূল দলিল ও হাল নামজারি পরচা',
        'সংশ্লিষ্ট মৌজার সার্টিফাইড জরিপ ম্যাপের শিট',
        'চৌহদ্দীর পার্শ্ববর্তী মালিকগণের তালিকা ও আবেদনকারীর এনআইডি'
      ],
      citizenNextSteps: [
        'সহকারী কমিশনার (ভূমি) বরাবর নির্ধারিত সরকারি ফি দিয়ে সীমানা পরিমাপের আবেদন দাখিল করুন।',
        'পক্ষগণকে নোটিশ জারির পর নির্ধারিত তারিখে সরকারি আমিনের উপস্থিতিতে সরেজমিন পরিমাপ নিশ্চিত করুন।',
        'আমিন কর্তৃক প্রস্তুতকৃত পরিমাপ স্কেচ ও প্রতিবেদন এসি ল্যান্ড কার্যালয় থেকে গ্রহণ করুন।'
      ],
      caution: 'সরকারি আমিন কেবল নকশা অনুযায়ী সীমানা চিহ্নিত করে প্রতিবেদন দেন। জোরপূর্বক দখল উচ্ছেদের জন্য দেওয়ানি আদালতের ডিক্রি বা নির্বাহী ম্যাজিস্ট্রেটের সহায়তা প্রয়োজন।'
    },
    {
      id: 'helpline',
      name: 'জাতীয় ভূমি সেবা কল সেন্টার ও হেল্পডেস্ক (Land Service 16122)',
      nameEn: 'National Land Helpline 16122 & Citizen Grievance',
      authority: 'ভূমি মন্ত্রণালয় নাগরিক সেবা কেন্দ্র (Citizen Service Center)',
      authorityEn: 'Citizen Service Center, Ministry of Land',
      ministry: 'ভূমি মন্ত্রণালয় (Ministry of Land)',
      categoryKey: 'support',
      icon: '♧',
      officialPortalUrl: 'https://land.gov.bd/',
      portalLabel: 'land.gov.bd (হটলাইন: ১৬১২২)',
      urlVerified: true,
      isOnlineSubmission: true,
      sourceCitation: 'R&D Reference v1.4 §20.1 #3, §7.4 #76 (Citizen Support Escalation)',
      description: 'যেকোনো ভূমি সেবা সংক্রান্ত সার্বিক তথ্য, পরামর্শ, সিস্টেমের কারিগরি সহায়তা বা অনিয়মের অভিযোগ দাখিলের জাতীয় হেল্পলাইন।',
      keywords: ['হেল্পলাইন', 'অভিযোগ', 'সাহায্য', 'পরামর্শ', 'কল সেন্টার', 'ফোন নম্বর', 'হটলাইন', '১৬১২২', '16122', 'help', 'support', 'complaint', 'grievance', 'সহায়তা চাই'],
      requiredDocuments: [
        'আবেদনকারী নাগরিকের জাতীয় পরিচয়পত্র ও মোবাইল নম্বর',
        'পূর্ববর্তী কোনো আবেদন থাকলে তার ট্র্যাকিং নম্বর (যেমন: নামজারি কেস আইডি বা দাখিলা নম্বর)'
      ],
      citizenNextSteps: [
        'সরাসরি ১৬১২২ (টোল-ফ্রি নয়) নম্বরে কল করে ভূমি কর্মকর্তার সাথে পরামর্শ করুন।',
        'অনলাইনে land.gov.bd পোর্টালে ‘অভিযোগ’ ট্যাবে গিয়ে লিখিত অভিযোগ বা পরামর্শ নিবন্ধন করুন।'
      ],
      caution: 'হেল্পলাইন কর্মকর্তারা প্রক্রিয়াগত পরামর্শ প্রদান করেন; কোনো সরাসরি অফিসিয়াল আদেশ বা স্বত্ব নির্ধারণ করতে পারেন না।'
    }
  ];

  function routeCitizenProblem(rawText = '', options = {}) {
    const raw = String(rawText || '').trim();
    if (!raw || raw.length < 3) {
      return {
        query: raw,
        categoryKey: 'none',
        status: 'EMPTY_INPUT',
        confidence: 'none',
        service: null,
        rationale: 'অনুগ্রহ করে আপনার জমি সংক্রান্ত সমস্যাটি বিস্তারিত লিখুন (যেমন: জমি কিনেছি নামজারি কীভাবে করব, খতিয়ানে নামের ভুল, খাজনা বকেয়া, ইত্যাদি)।',
        nextSteps: [
          'আপনার সমস্যার বিষয় বা কী সেবা প্রয়োজন তা সংক্ষেপে লিখুন।',
          'অথবা নিচে দেওয়া বহুল প্রচলিত উদাহরণগুলোতে ক্লিক করে দেখুন।'
        ],
        clarification: null,
        guardrail: 'সতর্কতা: এটি একটি তথ্যভিত্তিক সরকারি সেবা রাউটার। কোনো আইনি স্বত্ব বা মালিকানা ঘোষণার সুযোগ এতে নেই।'
      };
    }

    const norm = normalize(raw).toLowerCase();

    // If an explicit category is requested (e.g. from a clarification selection)
    if (options.selectedCategory) {
      const explicitService = VERIFIED_SERVICE_DIRECTORY.find(s => s.id === options.selectedCategory || s.categoryKey === options.selectedCategory);
      if (explicitService) {
        return {
          query: raw,
          categoryKey: explicitService.categoryKey,
          status: 'RECOMMENDED',
          confidence: 'high',
          service: explicitService,
          rationale: `নাগরিকের নির্বাচিত স্পষ্টীকরণ ('${explicitService.name}') অনুযায়ী দায়িত্বপ্রাপ্ত সরকারি কর্তৃপক্ষ হলো ${explicitService.authority}।`,
          nextSteps: explicitService.citizenNextSteps,
          clarification: null,
          guardrail: 'সতর্কতা: এটি একটি তথ্যভিত্তিক সেবা নির্দেশিকা। কোনো স্বত্ব, মালিকানা বা আইনি রায় ঘোষণার সুযোগ এতে নেই; প্রযোজ্য আনুষ্ঠানিক প্রক্রিয়া সংশ্লিষ্ট সরকারি দপ্তর কর্তৃক নির্ধারিত।'
        };
      }
    }

    // Check for broad / generic problem statement
    const broadPhrases = [
      'জমি নিয়ে সমস্যা', 'জমি নিয়ে সমস্যা', 'জমি সংক্রান্ত সমস্যা', 'আমার জমি',
      'সাহায্য চাই', 'ভূমি সমস্যা', 'land problem', 'land issue', 'need help with land',
      'problem with land', 'জমি ঝামেলা', 'সহায়তা প্রয়োজন', 'কি করব বুঝতে পারছি না'
    ];
    const isBroadGeneric = broadPhrases.some(p => norm.includes(normalize(p))) && norm.length < 35;

    if (isBroadGeneric) {
      return {
        query: raw,
        categoryKey: 'ambiguous',
        status: 'AMBIGUOUS',
        confidence: 'low',
        service: null,
        rationale: 'আপনার প্রদত্ত বিবরণটি অত্যন্ত সাধারণ ("জমি নিয়ে সমস্যা")। ভূমি মন্ত্রণালয়ে একাধিক ভিন্ন ভিন্ন সেবা ও দপ্তর রয়েছে। সুনির্দিষ্ট সেবা নির্ধারণের জন্য স্পষ্টীকরণ প্রয়োজন।',
        nextSteps: [
          'নিচে দেওয়া ক্যাটাগরিগুলো থেকে আপনার নির্দিষ্ট সমস্যাটি নির্বাচন করুন।',
          'অথবা আপনার সমস্যার বিবরণটিতে আরও সুনির্দিষ্ট তথ্য (যেমন: নামজারি, খাজনা, খতিয়ান, সীমানা ইত্যাদি) যোগ করুন।'
        ],
        clarification: {
          question: 'আপনার সমস্যাটি মূলত কোন বিষয়ের সাথে সম্পর্কিত?',
          options: [
            { text: 'নামজারি / খারিজ (ক্রয় বা হস্তান্তরের পর রেকর্ড হালনাগাদ)', categoryKey: 'mutation' },
            { text: 'ভূমি উন্নয়ন কর / খাজনা ও বকেয়া পরিশোধ', categoryKey: 'tax' },
            { text: 'খতিয়ান বা পর্চা অনুসন্ধান ও সার্টিফাইড নকল', categoryKey: 'khatian' },
            { text: 'খতিয়ানের ভুল সংশোধন / মিসকেস পিটিশন', categoryKey: 'dispute-correction' },
            { text: 'পৈতৃক সম্পত্তি বণ্টন ও উত্তরাধিকার (ফারায়েজ)', categoryKey: 'inheritance' },
            { text: 'জমির সীমানা নিয়ে বিরোধ ও আমিন দ্বারা পরিমাপ', categoryKey: 'boundary-survey' },
            { text: 'অন্যান্য পরামর্শ বা সরাসরি হেল্পলাইন (১৬১২২)', categoryKey: 'helpline' }
          ]
        },
        guardrail: 'সতর্কতা: অনুমাননির্ভর ভুল সেবা নির্বাচন এড়াতে সুনির্দিষ্ট তথ্য দিয়ে স্পষ্টীকরণ করুন। এটি কোনো আইনি সিদ্ধান্ত বা স্বত্ব/মালিকানা নির্ধারণ নয়।'
      };
    }

    // Score all services in VERIFIED_SERVICE_DIRECTORY
    const scores = [];

    for (const s of VERIFIED_SERVICE_DIRECTORY) {
      let score = 0;
      const matched = [];

      for (const kw of s.keywords) {
        const normKw = normalize(kw).toLowerCase();
        if (norm.includes(normKw)) {
          const weight = normKw.includes(' ') ? 3 : 1.5;
          score += weight;
          matched.push(kw);
        }
      }

      if (score > 0) {
        scores.push({
          service: s,
          score,
          matched
        });
      }
    }

    scores.sort((a, b) => b.score - a.score);

    // No keywords matched -> Out of scope / No match
    if (scores.length === 0) {
      return {
        query: raw,
        categoryKey: 'none',
        status: 'NO_MATCH',
        confidence: 'none',
        service: null,
        rationale: 'প্রদত্ত বিবরণের সাথে ভূমি প্রশাসনের কোনো অনুমোদিত সরকারি সেবা নিশ্চিতভাবে মেলেনি। অনুসন্ধানটি জমি-সংক্রান্ত না হতে পারে অথবা ভিন্ন শব্দভাণ্ডার ব্যবহৃত হয়েছে।',
        nextSteps: [
          'ভূমি মন্ত্রণালয়ের সার্বক্ষণিক নাগরিক সেবা হেল্পলাইন ১৬১২২ (16122)-এ কল করে সরাসরি পরামর্শ নিতে পারেন।',
          'আপনার অনুসন্ধানে সুনির্দিষ্ট ভূমি সম্পর্কিত শব্দ ব্যবহার করুন (যেমন: নামজারি, খতিয়ান, পর্চা, খাজনা, সীমানা, অধিগ্রহণ)।',
          'অথবা e-Bhumi "AI Land Case Builder (#2)" ব্যবহার করে নতুন একটি কেস ফাইল প্রস্তুত করুন।'
        ],
        clarification: null,
        guardrail: 'সতর্কতা: eBhumi কোনো কাল্পনিক সেবা বা অননুমোদিত পোর্টাল লিঙ্ক প্রদর্শন করে না। এটি কোনো আইনি পরামর্শ বা মালিকানা সনদ নয়; সরকারি সেবার সত্যতা যাচাই সাপেক্ষ।'
      };
    }

    // Ambiguity check: multiple top services have close scores OR query expresses multiple conjunctive intents
    const hasConjunction = /(?:\s+(?:ও|এবং|বা|অথবা)\s+|দুটিই|উভয়|উভয়)/i.test(norm);
    if (scores.length > 1) {
      const topDiff = Math.abs(scores[0].score - scores[1].score);
      const isCloseScore = topDiff < 0.5 && scores[0].score <= 3.0;
      const isConjunctiveAmbiguity = hasConjunction && scores[0].score >= 1.5 && scores[1].score >= 1.5;
      if (isCloseScore || isConjunctiveAmbiguity) {
        const topCandidates = scores.slice(0, 3);
        return {
          query: raw,
          categoryKey: 'ambiguous',
          status: 'AMBIGUOUS',
          confidence: 'medium',
          service: null,
          rationale: `আপনার সমস্যায় একাধিক সরকারি সেবার প্রাসঙ্গিকতা পাওয়া গেছে (${topCandidates.map(c => `'${c.service.name}'`).join(' বনাম ')}। সঠিক সেবা সুপারিশের জন্য একটি বিষয় বেছে নিন।`,
          nextSteps: [
            'নিচে উল্লেখিত বিকল্পগুলোর মধ্যে কোনটি আপনার প্রধান প্রয়োজন তা নির্বাচন করুন।'
          ],
          clarification: {
            question: 'আপনার মূল অগ্রাধিকার কোনটি?',
            options: topCandidates.map(c => ({
              text: `${c.service.name} (${c.service.authority.split('/')[0].trim()})`,
              categoryKey: c.service.id
            }))
          },
          guardrail: 'সতর্কতা: একাধিক সেবা সংশ্লিষ্ট থাকলে নির্দিষ্ট বিষয়ের ভিত্তিতে আলাদা সরকারি প্রক্রিয়া অনুসরণ করতে হয়। এটি কোনো আদালতের আইনি রায় বা দলিলের মালিকানা সংক্রান্ত সিদ্ধান্ত নয়।'
        };
      }
    }

    const top = scores[0];
    const service = top.service;
    const confidence = top.score >= 3.0 ? 'high' : 'medium';
    const uniqueMatches = [...new Set(top.matched)].slice(0, 4);

    return {
      query: raw,
      categoryKey: service.categoryKey,
      status: 'RECOMMENDED',
      confidence,
      service,
      rationale: `আপনার বিবরণে '${uniqueMatches.join(', ')}' বিষয়ের উল্লেখ রয়েছে। সরকারি কার্যপ্রণালী অনুযায়ী এর দায়িত্বপ্রাপ্ত কর্তৃপক্ষ হলো ${service.authority} এবং প্রযোজ্য সেবা হলো '${service.name}'।`,
      nextSteps: service.citizenNextSteps,
      clarification: null,
      guardrail: 'সতর্কতা: এটি একটি তথ্যভিত্তিক সরকারি সেবা রাউটার। এটি কোনো দেওয়ানি বা রাজস্ব আদালতের আইনি সিদ্ধান্ত, স্বত্ব/মালিকানা ঘোষণা বা চূড়ান্ত আদেশের বিকল্প নয়। যেকোনো পদক্ষেপ গ্রহণের পূর্বে দায়িত্বপ্রাপ্ত সরকারি কার্যালয়ে বর্তমান নির্দেশনা যাচাই করুন।'
    };
  }

  let routerModalState = {
    query: '',
    result: null,
    selectedCategory: null
  };

  function renderServiceRouterPromo(){
    return `<div class="service-router-promo">
      <div class="service-router-promo-icon">⚡</div>
      <div class="service-router-promo-body">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px">
          <div>
            <span class="eyebrow" style="color:#2a6552;margin-bottom:3px">R&amp;D FEATURE #71 · AI SERVICE ROUTER</span>
            <h3 style="margin:0 0 4px;font-size:15px;color:#173d35">AI Service Router (সরকারি সেবা ও কর্তৃপক্ষ নির্দেশক)</h3>
          </div>
          <button class="btn primary small" data-action="open-service-router">সম্পূর্ণ রাউটার ড্যাশবোর্ড খুলুন ↗</button>
        </div>
        <p style="margin:0 0 10px;font-size:12px;color:#5a7368;line-height:1.5">আপনার সমস্যা অনুযায়ী কোন সরকারি দপ্তর ও পোর্টাল দায়িত্বপ্রাপ্ত তা জানতে নিচের ঘরে লিখুন অথবা জনপ্রিয় উদাহরণ নির্বাচন করুন:</p>
        <div class="service-router-quick-bar">
          <input id="serviceRouterQuickInput" type="text" placeholder="যেমন: জমি কিনেছি নামজারি কীভাবে করব, খতিয়ানে নামের ভুল সংশোধন, খাজনা পরিশোধ..." autocomplete="off"/>
          <button class="btn primary" data-action="router-quick-search">সেবা খুঁজুন ↗</button>
        </div>
        <div class="preset-list" style="margin-top:8px">
          <button class="preset-chip" data-action="router-preset" data-text="আমি জমি কিনেছি, এখন খারিজ করতে চাই">নামজারি / খারিজ (Mutation) ↗</button>
          <button class="preset-chip" data-action="router-preset" data-text="জমির খাজনা দিতে চাই, বকেয়া কর কীভাবে পরিশোধ করব?">খাজনা ও দাখিলা (Land Tax) ↗</button>
          <button class="preset-chip" data-action="router-preset" data-text="খতিয়ানের পর্চা তুলতে চাই, সার্টিফাইড কপি দরকার">পর্চা ও খতিয়ান (e-Porcha) ↗</button>
          <button class="preset-chip" data-action="router-preset" data-text="খতিয়ানে নামের বানান ভুল এসেছে, রেকর্ড সংশোধন করতে মিসকেস করতে হবে">রেকর্ড সংশোধন মিসকেস ↗</button>
          <button class="preset-chip" data-action="router-preset" data-text="বাবার মৃত্যুর পর পৈতৃক সম্পত্তি ওয়ারিশদের মধ্যে বণ্টন করতে চাই">উত্তরাধিকার ও ফারায়েজ ↗</button>
          <button class="preset-chip" data-action="router-preset" data-text="প্রতিবেশী সীমানা দখল করছে, সরকারি আমিন দিয়ে জমি মাপতে চাই">সীমানা বিরোধ ও পরিমাপ ↗</button>
          <button class="preset-chip" data-action="router-preset" data-text="আমার জমি নিয়ে সমস্যা হচ্ছে">অস্পষ্ট প্রশ্ন (Ambiguous) ↗</button>
          <button class="preset-chip" data-action="router-preset" data-text="পাসপোর্ট রিনিউ করার নিয়ম কী?">বহির্ভূত প্রশ্ন (Out of Scope) ↗</button>
        </div>
      </div>
    </div>`;
  }

  function renderServiceRouterModal(){
    const res = routerModalState.result;
    const q = routerModalState.query || '';

    let resultHtml = '';

    if (!res) {
      resultHtml = `
        <div style="text-align:center;padding:24px 16px;background:#f8faf9;border-radius:12px;border:1px dashed #d5e4db;margin-top:14px">
          <span style="font-size:32px;display:block;margin-bottom:8px">🔍</span>
          <strong style="color:#1d4336;font-size:13px;display:block">আপনার জমি সংক্রান্ত সমস্যাটি লিখুন</strong>
          <p style="color:#60796e;font-size:11.5px;margin:4px auto 0;max-width:380px">উপরে সমস্যা লিখুন বা নিচের কোনো একটি উদাহরণে ক্লিক করুন। রাউটার স্বয়ংক্রিয়ভাবে দায়িত্বপ্রাপ্ত সরকারি কর্তৃপক্ষ ও করণীয় দেখাবে।</p>
        </div>`;
    } else if (res.status === 'RECOMMENDED') {
      const s = res.service;
      const portalBox = s.isOnlineSubmission
        ? `<div class="service-router-official-box">
             <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
               <div>
                 <span style="font-size:10px;font-weight:700;color:#285b45;text-transform:uppercase;letter-spacing:.5px">অনুমোদিত ডিজিটাল সেবা পোর্টাল</span>
                 <strong style="display:block;font-size:13px;color:#154133">${esc(s.portalLabel)}</strong>
               </div>
               <a href="${s.officialPortalUrl}" target="_blank" rel="noopener noreferrer" class="btn primary small" style="display:inline-flex;align-items:center;gap:6px">🔗 অফিসিয়াল পোর্টাল খুলুন ↗</a>
             </div>
             <div style="font-size:10px;color:#617c70;margin-top:8px;display:flex;align-items:center;gap:6px">
               <span class="pill green" style="font-size:9px;padding:2px 6px">✓ যাচাইকৃত সরকারি উৎস</span>
               <span>ভিত্তি: ${esc(s.sourceCitation)}</span>
             </div>
           </div>`
        : `<div class="service-router-official-box warning">
             <div style="display:flex;align-items:center;gap:10px">
               <span style="font-size:20px">🏛️</span>
               <div style="flex:1">
                 <strong style="display:block;font-size:12.5px;color:#855519">সরাসরি সংশ্লিষ্ট দপ্তরে আবেদন প্রযোজ্য</strong>
                 <p style="font-size:11px;color:#8c6229;margin:2px 0 0;line-height:1.4">এই সেবার জন্য কোনো একক ডিজিটাল পোর্টাল নেই। দায়িত্বপ্রাপ্ত সরকারি কার্যালয়ে সশরীরে উপস্থিত হয়ে নির্ধারিত ফরমে আবেদন করতে হয়।</p>
               </div>
             </div>
             <div style="font-size:10px;color:#87673b;margin-top:8px">
               ভিত্তি: ${esc(s.sourceCitation)}
             </div>
           </div>`;

      resultHtml = `
        <div class="service-router-result-card" style="margin-top:14px">
          <div class="service-router-result-header">
            <div style="display:flex;align-items:center;gap:8px">
              <span class="pill green" style="font-size:10.5px">✓ সুপারিশকৃত সরকারি সেবা</span>
              <span class="pill gray" style="font-size:9.5px">${esc(s.categoryKey.toUpperCase())}</span>
            </div>
            <span style="font-size:11px;color:#617e71;font-weight:600">ম্যাচ আস্থা: <b style="color:#1d5c44">${res.confidence === 'high' ? 'উচ্চ (High)' : 'পরিমিত (Medium)'}</b></span>
          </div>

          <div style="padding:16px 18px">
            <h3 style="margin:0 0 4px;font-size:16px;color:#143e34">${esc(s.name)}</h3>
            <p style="margin:0 0 12px;font-size:11.5px;color:#5a7368">${esc(s.description)}</p>

            <div class="service-router-authority-box">
              <div class="authority-icon">🏛️</div>
              <div style="flex:1">
                <span class="authority-label">দায়িত্বপ্রাপ্ত সরকারি কর্তৃপক্ষ ও দপ্তর</span>
                <strong class="authority-name">${esc(s.authority)}</strong>
                <small class="authority-sub">${esc(s.ministry)}</small>
              </div>
            </div>

            ${portalBox}

            <div class="service-router-rationale-box">
              <strong>💡 কেন এই সেবাটি সুপারিশ করা হয়েছে:</strong>
              <p>${esc(res.rationale)}</p>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:14px 0">
              <div class="router-doc-box">
                <strong style="display:block;font-size:11.5px;color:#184236;margin-bottom:6px">📋 প্রয়োজনীয় নথিপত্র:</strong>
                <ul style="margin:0;padding-left:16px;font-size:11px;color:#355347;line-height:1.5">
                  ${s.requiredDocuments.map(d => `<li>${esc(d)}</li>`).join('')}
                </ul>
              </div>
              <div class="router-doc-box">
                <strong style="display:block;font-size:11.5px;color:#184236;margin-bottom:6px">🚶 নাগরিকের পরবর্তী করণীয় ধাপ:</strong>
                <ol style="margin:0;padding-left:16px;font-size:11px;color:#355347;line-height:1.5">
                  ${res.nextSteps.map(st => `<li>${esc(st)}</li>`).join('')}
                </ol>
              </div>
            </div>

            <div class="router-caution-box">
              <strong>⚠️ বিশেষ সতর্কতা:</strong> ${esc(s.caution)}
            </div>

            <div class="router-guardrail-banner">
              🔒 ${esc(res.guardrail)}
            </div>

            <div class="modal-actions" style="margin-top:16px">
              <button type="button" class="btn primary" data-action="router-open-case" data-category="${esc(s.categoryKey)}" data-problem="${esc(q)}">📁 এই সমস্যার Land Case ফাইল তৈরি করুন →</button>
              <button type="button" class="btn" data-action="router-reset">নতুন অনুসন্ধান ↺</button>
              <button type="button" class="btn" data-action="close-modal">সম্পন্ন</button>
            </div>
          </div>
        </div>`;
    } else if (res.status === 'AMBIGUOUS') {
      resultHtml = `
        <div class="service-router-result-card ambiguous" style="margin-top:14px">
          <div class="service-router-result-header" style="background:#fff8ee;border-color:#f1d7b1">
            <span class="pill amber" style="font-size:10.5px">⚠️ স্পষ্টীকরণ প্রয়োজন (Ambiguous Query)</span>
            <span style="font-size:11px;color:#855519;font-weight:600">অনুমানহীন রাউটিং</span>
          </div>
          <div style="padding:16px 18px">
            <p style="margin:0 0 10px;font-size:12px;color:#78541c;line-height:1.5">${esc(res.rationale)}</p>
            <div style="background:#fff;border:1px solid #ebd3ad;border-radius:10px;padding:12px;margin:12px 0">
              <strong style="display:block;font-size:12.5px;color:#183d35;margin-bottom:8px">❓ ${esc(res.clarification.question)}</strong>
              <div style="display:flex;flex-direction:column;gap:6px">
                ${res.clarification.options.map(opt => `
                  <button type="button" class="btn small" data-action="router-clarify" data-cat="${esc(opt.categoryKey)}" data-problem="${esc(q)}" style="text-align:left;justify-content:flex-start;padding:8px 12px;color:#194437;background:#fbfdfc;border:1px solid #dbe7df">
                    <span style="font-weight:700">👉 ${esc(opt.text)}</span>
                  </button>
                `).join('')}
              </div>
            </div>
            <div class="router-guardrail-banner">
              🔒 ${esc(res.guardrail)}
            </div>
            <div class="modal-actions" style="margin-top:14px">
              <button type="button" class="btn" data-action="router-reset">নতুন সমস্যা লিখুন ↺</button>
              <button type="button" class="btn" data-action="close-modal">বাতিল</button>
            </div>
          </div>
        </div>`;
    } else if (res.status === 'NO_MATCH') {
      resultHtml = `
        <div class="service-router-result-card no-match" style="margin-top:14px">
          <div class="service-router-result-header" style="background:#fafbfb;border-color:#e2e8e4">
            <span class="pill gray" style="font-size:10.5px">ℹ️ কোনো নির্ভরযোগ্য সেবা মেলেনি (No Official Match)</span>
          </div>
          <div style="padding:16px 18px">
            <p style="margin:0 0 12px;font-size:12px;color:#456356;line-height:1.5">${esc(res.rationale)}</p>
            <div style="background:#fff;border:1px solid #d8e5dd;border-radius:10px;padding:12px;margin:12px 0">
              <strong style="display:block;font-size:12px;color:#183d35;margin-bottom:6px">💡 পরবর্তী করণীয় পরামর্শ:</strong>
              <ul style="margin:0;padding-left:18px;font-size:11.5px;color:#355347;line-height:1.5">
                ${res.nextSteps.map(st => `<li>${esc(st)}</li>`).join('')}
              </ul>
            </div>
            <div class="router-guardrail-banner">
              🔒 ${esc(res.guardrail)}
            </div>
            <div class="modal-actions" style="margin-top:14px">
              <button type="button" class="btn primary small" data-action="router-open-case" data-category="other" data-problem="${esc(q)}">📁 সাধারণ Land Case প্রস্তুত করুন</button>
              <button type="button" class="btn" data-action="router-reset">নতুন অনুসন্ধান ↺</button>
              <button type="button" class="btn" data-action="close-modal">বন্ধ করুন</button>
            </div>
          </div>
        </div>`;
    }

    return `
      <div>
        <p style="font-size:11.5px;color:#60796e;margin:0 0 10px;line-height:1.5">
          আপনার সমস্যা বর্ণনা করুন। সিস্টেম যাচাইকৃত সরকারি সেবা ডিরেক্টরি অনুযায়ী সঠিক কর্তৃপক্ষ ও অফিসিয়াল পোর্টালের দিকনির্দেশনা দেবে।
        </p>

        <form id="serviceRouterModalForm" onsubmit="return false;">
          <div class="form-field full" style="margin-bottom:8px">
            <label for="serviceRouterModalInput">ভূমি সমস্যা বা প্রয়োজনীয় সেবার বিবরণ <span style="color:var(--red)">*</span></label>
            <div style="display:flex;gap:8px">
              <input id="serviceRouterModalInput" type="text" value="${esc(q)}" placeholder="যেমন: জমি কিনেছি নামজারি কীভাবে করব, খতিয়ানে নামের ভুল সংশোধন..." style="flex:1" autocomplete="off"/>
              <button type="button" class="btn primary" data-action="router-search">খুঁজুন ↗</button>
            </div>
          </div>
        </form>

        <div style="margin:10px 0 6px">
          <span style="font-size:10.5px;color:#6b8678;font-weight:600;display:block;margin-bottom:5px">জনপ্রিয় উদাহরণসমূহ দিয়ে পরীক্ষা করুন:</span>
          <div class="preset-list">
            <button type="button" class="preset-chip" data-action="router-preset" data-text="আমি জমি কিনেছি, এখন খারিজ করতে চাই">নামজারি / খারিজ (Mutation) ↗</button>
            <button type="button" class="preset-chip" data-action="router-preset" data-text="জমির খাজনা দিতে চাই, বকেয়া কর কীভাবে পরিশোধ করব?">খাজনা ও দাখিলা (Land Tax) ↗</button>
            <button type="button" class="preset-chip" data-action="router-preset" data-text="খতিয়ানের পর্চা তুলতে চাই, সার্টিফাইড কপি দরকার">পর্চা ও খতিয়ান (e-Porcha) ↗</button>
            <button type="button" class="preset-chip" data-action="router-preset" data-text="খতিয়ানে নামের বানান ভুল এসেছে, রেকর্ড সংশোধন করতে মিসকেস করতে হবে">রেকর্ড সংশোধন মিসকেস ↗</button>
            <button type="button" class="preset-chip" data-action="router-preset" data-text="বাবার মৃত্যুর পর পৈতৃক সম্পত্তি ওয়ারিশদের মধ্যে বণ্টন করতে চাই">উত্তরাধিকার ও ফারায়েজ ↗</button>
            <button type="button" class="preset-chip" data-action="router-preset" data-text="প্রতিবেশী সীমানা দখল করছে, সরকারি আমিন দিয়ে জমি মাপতে চাই">সীমানা বিরোধ ও পরিমাপ ↗</button>
            <button type="button" class="preset-chip" data-action="router-preset" data-text="আমার জমি নিয়ে সমস্যা হচ্ছে">অস্পষ্ট প্রশ্ন (Ambiguous) ↗</button>
            <button type="button" class="preset-chip" data-action="router-preset" data-text="পাসপোর্ট রিনিউ করার নিয়ম কী?">বহির্ভূত প্রশ্ন (Out of Scope) ↗</button>
          </div>
        </div>

        <div id="serviceRouterResultContainer">
          ${resultHtml}
        </div>
      </div>`;
  }

  function openServiceRouterModal(initialText = '', options = {}){
    routerModalState.query = initialText || '';
    routerModalState.selectedCategory = options.selectedCategory || null;
    routerModalState.result = initialText ? routeCitizenProblem(initialText, options) : null;

    openModal('AI Service Router', renderServiceRouterModal(), 'R&D FEATURE #71 · VERIFIED GOVERNMENT SERVICE ROUTER');
    $('.modal')?.classList.add('case-builder-modal');
  }

  function handleServiceRouterAction(action, el){
    switch(action){
      case 'open-service-router': {
        const problem = el?.dataset?.problem || '';
        openServiceRouterModal(problem);
        break;
      }

      case 'router-quick-search': {
        const input = $('#serviceRouterQuickInput');
        const q = input ? input.value.trim() : '';
        openServiceRouterModal(q);
        break;
      }

      case 'router-preset': {
        const text = el.dataset.text || '';
        openServiceRouterModal(text);
        break;
      }

      case 'router-search': {
        const input = $('#serviceRouterModalInput');
        const q = input ? input.value.trim() : '';
        routerModalState.query = q;
        routerModalState.selectedCategory = null;
        routerModalState.result = routeCitizenProblem(q);
        $('#modalBody').innerHTML = renderServiceRouterModal();
        break;
      }

      case 'router-clarify': {
        const catKey = el.dataset.cat;
        const problem = el.dataset.problem || routerModalState.query || '';
        routerModalState.query = problem;
        routerModalState.selectedCategory = catKey;
        routerModalState.result = routeCitizenProblem(problem, { selectedCategory: catKey });
        $('#modalBody').innerHTML = renderServiceRouterModal();
        break;
      }

      case 'router-reset': {
        routerModalState.query = '';
        routerModalState.selectedCategory = null;
        routerModalState.result = null;
        $('#modalBody').innerHTML = renderServiceRouterModal();
        break;
      }

      case 'router-open-case': {
        closeModal();
        const catKey = el.dataset.category || 'other';
        const problem = el.dataset.problem || routerModalState.query || '';
        startLandCaseBuilder(problem, { categoryKey: catKey });
        break;
      }
    }
  }

  function aiAssistant(){
    return `${heading('ASSISTED GUIDANCE','AI land assistant','Ask for general service guidance, document explanations, or help preparing a checklist.',`<button class="btn primary" data-action="open-service-router">⚡ AI Service Router (#71)</button><button class="btn" data-action="start-land-case-builder">＋ নতুন Land Case</button><button class="btn" data-action="clear-chat">↺ New conversation</button>`)}
    ${demoBanner()}
    ${renderServiceRouterPromo()}
    <div class="case-builder-promo">
      <div class="case-builder-promo-icon">✳</div>
      <div class="case-builder-promo-text">
        <span class="eyebrow" style="color:#2a6552;margin-bottom:3px">R&amp;D FEATURE #2</span>
        <h3 style="margin:0 0 4px;font-size:15px;color:#173d35">AI Land Case Builder (ভূমি কেস ফাইল প্রস্তুতকারক)</h3>
        <p style="margin:0;font-size:12px;color:#5a7368;line-height:1.5">আপনার জমি সংক্রান্ত সমস্যা বাংলায় বা ইংরেজিতে লিখুন। সিস্টেম স্বয়ংক্রিয়ভাবে সমস্যার ধরন শনাক্ত করবে এবং প্রয়োজনীয় দলিলের চেকলিস্ট তৈরি করে প্রস্তুতিমূলক কেস ফাইল সাজিয়ে দেবে।</p>
      </div>
      <button class="btn primary" data-action="start-land-case-builder" style="white-space:nowrap">নতুন Land Case তৈরি করুন →</button>
    </div>
    <div class="content-grid">
      <section class="panel chat-panel">${panelHead('Ask e-Bhumi','Demo assistant with predefined guidance; no live AI model is connected.')}
        <div class="chat-messages" id="chatMessages">
          ${state.chat.length?state.chat.map(m=>`<div class="chat-bubble ${m.role==='user'?'user':''}">${m.html?m.html:esc(m.text)}</div>`).join(''):`<div class="chat-bubble">Hello! I can help you understand e-Bhumi services, find the responsible authority via AI Service Router (#71), prepare a document checklist, or explain what a Khatian/Dag reference means. I cannot verify legal ownership or make official decisions.</div><div class="feature-meta">${['জমি কিনেছি নামজারি কীভাবে করব? (Router #71)','দলিল ও খতিয়ানের গরমিল কীভাবে মেলাব? (Reconcile #55)','খাজনা ও দাখিলা কীভাবে দেব?','What is a Khatian?','আমার জমি নিয়ে সমস্যা হচ্ছে (Case Builder)'].map(q=>`<button class="btn small" data-action="chat-suggestion" data-text="${q}">${q}</button>`).join('')}</div>`}
        </div>
        <form class="chat-input" id="chatForm"><input id="chatInput" placeholder="Ask about a land service…" autocomplete="off"/><button class="btn primary" type="submit">Send ↑</button></form>
      </section>
      <section class="panel">${panelHead('Responsible AI','Source-aware, human-verified assistance.')}
        <div class="activity-list">${[['Grounded answers','Show the official source and effective date when connected.'],['Human verification','Flag extracted fields for review before use.'],['Privacy first','Avoid uploading unnecessary personal or sensitive data.'],['No legal decisions','AI does not determine title, fraud guilt, or application outcomes.']].map(x=>`<div class="activity-item"><div class="activity-icon">✳</div><div class="activity-copy"><b>${x[0]}</b><p>${x[1]}</p></div></div>`).join('')}</div>
      </section>
    </div>`;
  }

  function casebook(){
    return `${heading('SUPPORT & DISPUTES','Cases & complaints','Create and track support requests, service complaints, evidence bundles, and escalation history.',`<button class="btn primary" data-action="start-land-case-builder">＋ নতুন Land Case তৈরি করুন</button><button class="btn" data-action="start-reconciliation">⚖ নথিপত্র তুলনা (Reconcile #55)</button><button class="btn" data-action="new-complaint">＋ New complaint</button>`)}
    ${demoBanner()}
    <div class="stats-grid">
      ${stat('Open complaints','02','⚑','1|awaiting response','warning')}
      ${stat('Resolved','04','✓','This quarter|demo')}
      ${stat('Escalated','01','↗','Review|service timeline','warning')}
      ${stat('Saved Land Cases', String((local.landCases||[]).length).padStart(2,'0'),'▤','Preparation|case files','positive')}
    </div>
    ${renderSavedLandCasesSection()}
    <section class="panel">${panelHead('Support case register','Case records shown here are illustrative complaints and grievances.')}
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
    ${demoBanner()}
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
      (featureIndex.get(f.id) || normalize(Object.values(f).join(' '))).includes(normalize(state.featureQuery))
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

  function leasePage(){
    const filtered = state.leaseFilter && state.leaseFilter!=='all' ? leaseRecords.filter(l=>l.type===state.leaseFilter) : leaseRecords;
    return `${heading('GOVERNMENT LEASE & SETTLEMENT','Government land lease & bandobasto','Track long-term government land lease and settlement records: tea-garden leases, khas land bandobasto to eligible citizens, and industrial/commercial leases.',`<button class="btn" data-action="lease-guide">ⓘ Lease guidance</button><button class="btn primary" data-action="lease-renewal">＋ Start renewal / new request</button>`)}
    ${demoBanner()}
    <div class="stats-grid">
      ${stat('Tracked lease & settlement records',String(leaseRecords.length).padStart(2,'0'),'⌁','Across|3 lease categories')}
      ${stat('Active',String(leaseRecords.filter(l=>l.tone==='green').length).padStart(2,'0'),'✓','Currently|in force')}
      ${stat('Renewal / review needed',String(leaseRecords.filter(l=>l.tone!=='green').length).padStart(2,'0'),'◷','Action|required','warning')}
      ${stat('Tea estates (Sylhet division)',String(leaseRecords.filter(l=>l.type==='Tea garden lease').length).padStart(2,'0'),'⌁','Sylhet · Moulvibazar|demo sample')}
    </div>
    <section class="panel">${panelHead('Lease & settlement register','Illustrative records. Official lease deeds, revenue-share terms and renewal rules must be confirmed with the Deputy Commissioner (Lease) and Ministry of Land.')}
      <div class="toolbar">
        <select class="select-field" id="leaseTypeFilter">
          <option value="all">All categories</option>
          <option ${state.leaseFilter==='Tea garden lease'?'selected':''}>Tea garden lease</option>
          <option ${state.leaseFilter==='Khas land bandobasto'?'selected':''}>Khas land bandobasto</option>
          <option ${state.leaseFilter==='Industrial / commercial lease'?'selected':''}>Industrial / commercial lease</option>
        </select>
      </div>
      <div id="leaseTable">${table(filtered.map(l=>`<tr><td class="table-primary">${esc(l.id)}</td><td><strong>${esc(l.name)}</strong></td><td>${esc(l.type)}</td><td>${esc(l.location)}</td><td>${esc(l.area)}</td><td>${esc(l.term)}</td><td><span class="pill ${l.tone}">${esc(l.status)}</span></td><td><button class="table-actions" data-action="lease-detail" data-id="${esc(l.id)}">Open ↗</button></td></tr>`).join(''),['Lease ID','Name','Category','Location','Area','Term','Status',''])}</div>
    </section>
    <div class="section-row"><div><h2>How government land lease works</h2><p>General structure only; eligibility, fees and terms vary by category and require official confirmation.</p></div></div>
    <div class="feature-list">
      <article class="feature-card"><div class="feature-symbol">⌁</div><div><h3>Tea garden lease (e.g. Sylhet division)</h3><p>Long-term government leases, commonly for 30+ years, with annual lease rent and periodic renewal review by the Deputy Commissioner (Lease) office. Sylhet and Moulvibazar hold most of Bangladesh's tea-garden leaseholds.</p></div></article>
      <article class="feature-card"><div class="feature-symbol">⌂</div><div><h3>Khas land bandobasto</h3><p>Allotment of government khas (vacant) agricultural or homestead land to landless and eligible families, subject to upazila/district land office verification and conditions against transfer.</p></div></article>
      <article class="feature-card"><div class="feature-symbol"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 20h20"></path><path d="M6 20V8l4 4V8l4 4V4h6v16"></path></svg></div><div><h3>Industrial / commercial lease</h3><p>Government land leased to private or public entities for industrial, commercial, or institutional use, under fixed-term agreements with defined rent and renewal conditions.</p></div></article>
    </div>
    <section class="panel"><div class="warning-panel">This workspace organises lease and settlement information only. It does not grant, renew, or cancel an actual government lease. Confirm current rules, rent schedules, and application forms with the Deputy Commissioner (Lease), Ministry of Land, and the relevant Hill/Tea District administration.</div></section>`;
  }

  function ctgZonePage(){
    const active = chtCircles.find(c=>c.id===(state.ctgCircle||'ranga')) || chtCircles[0];
    return `${heading('SPECIAL ADMINISTRATIVE ZONE','Chattogram Hill Tracts (CHT) land zone','Rangamati, Bandarban and Khagrachhari follow a separate customary land-governance structure under the CHT Regulation 1900 and the 1997 CHT Accord, distinct from the plains RS/BS Khatian system used elsewhere in this platform.',`<button class="btn" data-action="ctg-guide">ⓘ CHT land guidance</button><button class="btn" data-action="hill-terrain">⛰️ Hill 3D Area & Slope</button><button class="btn primary" data-action="ctg-certificate">＋ Request customary land certificate</button>`)}
    ${demoBanner()}
    <div class="warning-panel" style="margin-bottom:18px"><b>Important:</b> In the CHT, land transactions generally require endorsement by the Mouza Headman, approval by the Circle Chief, and are subject to Hill District Council authority — outside the national Khatian/RS record system used in the plains. This workspace is informational only.</div>
    <div class="toolbar">${chtCircles.map(c=>`<button class="btn ${active.id===c.id?'primary':''}" data-action="ctg-select-circle" data-id="${c.id}">${esc(c.name)}</button>`).join('')}</div>
    <div class="content-grid" style="margin-top:14px">
      <section class="panel">${panelHead(active.name,`${active.district} · ${active.mouzas}`)}
        <p class="panel-subtitle" style="line-height:1.8">${esc(active.desc)}</p>
        <div class="detail-row" style="margin-top:12px"><div><div class="detail-label">Customary authority</div><div class="detail-value">${esc(active.chief)}</div></div><div><div class="detail-label">Local record keeper</div><div class="detail-value">Mouza Headman</div></div></div>
        <div class="detail-row" style="margin-top:12px"><div><div class="detail-label">Village-level authority</div><div class="detail-value">Karbari (para/village headman)</div></div><div><div class="detail-label">Regional authority</div><div class="detail-value">Hill District Council</div></div></div>
        <button class="btn primary" style="width:100%;margin-top:14px" data-action="ctg-certificate" data-id="${active.id}">Request customary land certificate</button>
      </section>
      <section class="panel">${panelHead('Approval workflow','Customary land matters generally follow this sequence.')}
        <div class="workflow">${[['1','Karbari','Village-level note'],['2','Headman','Mouza record check'],['3','Circle','Chief endorsement'],['4','Council','Hill District Council']].map(x=>`<div class="workflow-step"><div class="step-circle">${x[0]}</div><b>${x[1]}</b><small>${x[2]}</small></div>`).join('')}</div>
        <p class="panel-subtitle" style="margin-top:12px;line-height:1.7">Jum (shifting) cultivation land, common/community land, and individually held plots can follow different customary rules. Always confirm the applicable process with the Circle and Hill District Council offices.</p>
      </section>
    </div>
    <div class="section-row"><div><h2>Why this zone is kept separate</h2><p>The CHT land-governance model differs structurally from the rest of the platform.</p></div></div>
    <div class="feature-list">
      <article class="feature-card"><div class="feature-symbol">◭</div><div><h3>No RS/BS Khatian by default</h3><p>Much of CHT land is managed through customary mouza records rather than the national RS/BS khatian survey system used in the plains districts.</p></div></article>
      <article class="feature-card"><div class="feature-symbol">⚖</div><div><h3>Accord-based governance</h3><p>The 1997 CHT Accord and CHT Regulation 1900 establish the Circle Chief, Headman and Karbari roles alongside the three Hill District Councils.</p></div></article>
      <article class="feature-card"><div class="feature-symbol">⚑</div><div><h3>Khas land sensitivity</h3><p>Khas and community land disputes in CHT require particular care; this platform routes such cases through the Casebook rather than a general khas allotment form.</p></div></article>
    </div>`;
  }

  function pageContent(){
    switch(state.page){
      case'dashboard':return dashboard();
      case'land-search':return landSearch();
      case'my-land':return myLand();
      case'services':return servicesPage();
      case'applications':return applicationsPage();
      case'land-lease':return leasePage();
      case'ctg-zone':return ctgZonePage();
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
    $('#pageContent').innerHTML = pageContent() + workspaceTools();
    $('#pageContent').setAttribute('tabindex','-1');
    document.title = title(state.page) + ' | e-Bhumi';
    bindPageInputs();
    if(local.read) $$('.notice-bullet').forEach(n=>n.style.background='#c4cec8');
    if(state.page === 'gis') setTimeout(() => initLeafletMap('leafletMap'), 50);
    animateWorkspaceContent();
  }

  function animateWorkspaceContent(){
    if(typeof gsap==='undefined'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const items = $$('#pageContent .panel, #pageContent .card, #pageContent .stat-card, #pageContent .data-table');
    if(items.length){
      gsap.fromTo(items,{opacity:0.35,y:8},{opacity:1,y:0,duration:0.25,stagger:0.03,ease:'power1.out',clearProps:'transform,opacity'});
    }
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

    const ltf = $('#leaseTypeFilter');
    if(ltf) ltf.addEventListener('change', e => { state.leaseFilter = e.target.value; renderPage(); });

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
      const ans = answerFor(q);
      const assistantMsg = typeof ans === 'object' && ans.html
        ? { role: 'assistant', text: ans.text, html: ans.html }
        : { role: 'assistant', text: String(ans) };
      state.chat.push({ role: 'user', text: q }, assistantMsg);
      persist();
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
    const q = normalize($('#landFilter')?.value || '');
    const sur = $('#recordSurveyFilter')?.value || 'all';
    state.landQuery = q;
    const rows = [
      ['DAG-1842','Amin Bazar','731','RS','12.50 decimal'],
      ['DAG-1843','Amin Bazar','732','RS','8.00 decimal'],
      ['DAG-0918','Baipayl','204','SA','5.25 decimal']
    ].filter(r => (sur === 'all' || r[3] === sur) && normalize(r.join(' ')).includes(q));
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
    persist();
    const checked = all.filter(c => c.checked).length;
    const out = $('#checkProgress');
    if(out) out.textContent = `${checked} of ${all.length} checks marked`;
  }

  function answerFor(q){
    const t = q.toLowerCase();

    // Check specific direct intents first
    if(t.includes('reconciliation') || t.includes('গরমিল') || t.includes('তুলনা') || t.includes('reconcile')) {
      return 'নথিপত্রের তথ্য তুলনা ও গরমিল শনাক্তকরণের জন্য "Record Reconciliation Engine (#55)" ব্যবহার করুন। Documents অথবা Casebook পেজে গিয়ে "⚖ নথিপত্র তুলনা (Reconcile #55)" বাটনে ক্লিক করুন। এটি দুটি দলিলের মালিকের নাম, দাগ, খতিয়ান, মৌজা এবং জমির পরিমাণ যাচাই করে নাগরিক-বান্ধব বিশ্লেষণ প্রদান করে।';
    }

    // Run deterministic AI Service Router (#71)
    const routed = routeCitizenProblem(q);
    if (routed.status === 'RECOMMENDED') {
      const s = routed.service;
      const portalHtml = s.isOnlineSubmission
        ? `<div style="margin:8px 0"><a href="${s.officialPortalUrl}" target="_blank" rel="noopener noreferrer" style="color:#185343;font-weight:700;text-decoration:underline">🔗 সরকারি পোর্টাল: ${esc(s.portalLabel)} ↗</a> <span class="pill green" style="font-size:9.5px">যাচাইকৃত সরকারি উৎস</span></div>`
        : `<div style="margin:8px 0"><span class="pill amber" style="font-size:9.5px">সরাসরি দপ্তরে আবেদন প্রযোজ্য</span> <small style="color:#5f796c">(কোনো একক অনলাইন পোর্টাল নেই)</small></div>`;

      return {
        text: `সুপারিশকৃত সরকারি সেবা: ${s.name} (${s.authority})\n\nকেন এই সেবা: ${routed.rationale}\n\nঅফিসিয়াল পোর্টাল: ${s.officialPortalUrl || 'সংশ্লিষ্ট কার্যালয়'}\n\nকরণীয়:\n${routed.nextSteps.map((st, i) => `${i+1}. ${st}`).join('\n')}\n\n${routed.guardrail}`,
        html: `<div class="chat-router-card">
          <div class="chat-router-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:middle;margin-right:3px"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg> R&amp;D Feature #71: AI Service Router</div>
          <h4 style="margin:4px 0 2px;font-size:13.5px;color:#184236">${esc(s.name)}</h4>
          <div style="font-size:11.5px;color:#3d6555;margin-bottom:6px"><strong>দায়িত্বপ্রাপ্ত কর্তৃপক্ষ:</strong> ${esc(s.authority)}</div>
          ${portalHtml}
          <div style="font-size:11.5px;color:#284a3d;line-height:1.5;margin:8px 0;background:#f5faf7;padding:8px 10px;border-radius:8px">
            <strong>কেন এই সেবা:</strong> ${esc(routed.rationale)}
          </div>
          <div style="font-size:11.5px;color:#284a3d;margin-top:6px">
            <strong>পরবর্তী করণীয় ধাপ:</strong>
            <ol style="margin:4px 0 0;padding-left:18px;line-height:1.5">
              ${routed.nextSteps.map(st => `<li>${esc(st)}</li>`).join('')}
            </ol>
          </div>
          <div style="font-size:10px;color:#7e958a;margin-top:8px;border-top:1px dashed #d5e4db;padding-top:6px">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:middle;margin-right:2px"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> ${esc(routed.guardrail)}
          </div>
          <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn small primary" data-action="router-open-case" data-category="${esc(s.categoryKey)}" data-problem="${esc(q)}">এই সমস্যার Land Case তৈরি করুন</button>
            <button class="btn small" data-action="open-service-router" data-problem="${esc(q)}">বিস্তারিত রাউটার খুলুন ↗</button>
          </div>
        </div>`
      };
    } else if (routed.status === 'AMBIGUOUS') {
      return {
        text: `স্পষ্টীকরণ প্রয়োজন: ${routed.rationale}\n\n${routed.clarification.question}\n${routed.clarification.options.map((o, i) => `${i+1}. ${o.text}`).join('\n')}`,
        html: `<div class="chat-router-card" style="border-color:#f1cfa0;background:#fffdfa">
          <div class="chat-router-badge" style="background:#fff1dc;color:#875416"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:middle;margin-right:3px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> R&amp;D Feature #71: স্পষ্টীকরণ প্রয়োজন</div>
          <p style="margin:6px 0;font-size:12px;color:#704e1b">${esc(routed.rationale)}</p>
          <strong style="display:block;font-size:12px;color:#184236;margin-top:6px">${esc(routed.clarification.question)}</strong>
          <div style="margin-top:8px;display:flex;flex-direction:column;gap:5px">
            ${routed.clarification.options.map(opt => `<button class="btn small" data-action="router-clarify" data-cat="${esc(opt.categoryKey)}" data-problem="${esc(q)}" style="text-align:left">${esc(opt.text)} →</button>`).join('')}
          </div>
        </div>`
      };
    } else if (routed.status === 'NO_MATCH' && (q.length > 15 || t.includes('help') || t.includes('সেবা'))) {
      return {
        text: `${routed.rationale}\n\nপরামর্শ:\n${routed.nextSteps.map((st, i) => `${i+1}. ${st}`).join('\n')}\n\n${routed.guardrail}`,
        html: `<div class="chat-router-card" style="border-color:#d7e2dc;background:#fafbfb">
          <div class="chat-router-badge" style="background:#edf2ef;color:#4c675b"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:middle;margin-right:3px"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> R&amp;D Feature #71: সেবা মেলেনি</div>
          <p style="margin:6px 0;font-size:12px;color:#456356">${esc(routed.rationale)}</p>
          <div style="font-size:11.5px;color:#284a3d;margin-top:6px">
            <strong>পরামর্শ:</strong>
            <ul style="margin:4px 0 0;padding-left:18px;line-height:1.5">
              ${routed.nextSteps.map(st => `<li>${esc(st)}</li>`).join('')}
            </ul>
          </div>
          <div style="font-size:10px;color:#7e958a;margin-top:8px;border-top:1px dashed #d5e4db;padding-top:6px">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:middle;margin-right:2px"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> ${esc(routed.guardrail)}
          </div>
        </div>`
      };
    }

    if(t.includes('purchase') || t.includes('buy') || t.includes('seller')) {
      return 'Before a purchase, organise a due-diligence checklist: compare record references and survey history, inspect the deed chain, verify the seller’s authority and co-sharer context, check taxes and any encumbrance/litigation through authorised sources, and compare the parcel on an authoritative map. This is not a title opinion; obtain qualified legal and official verification.';
    }
    if(t.includes('সমস্যা') || t.includes('case builder') || t.includes('case') || t.includes('problem')) {
      return 'আপনার জমি সংক্রান্ত সমস্যা গুছিয়ে নিতে এবং নথিপত্রের চেকলিস্ট তৈরি করতে আমাদের "AI Land Case Builder" ব্যবহার করুন। পেজের উপরের "নতুন Land Case তৈরি করুন" বাটনে ক্লিক করে ধাপে ধাপে আপনার সমস্যাটি নথিভুক্ত করতে পারেন।';
    }
    return 'I can help with general service guidance and checklists. Please share the service name or document type (avoid unnecessary personal data). Any legal interpretation, ownership claim, official fee, deadline, or government record must be verified against an authoritative source. This frontend is a demo and has no live government data or AI backend connected.';
  }

  function openModal(titleText, body, eyebrow='QUICK ACTION'){
    if($('#modalBackdrop').hidden) modalReturnFocus = document.activeElement;
    $('#modalTitle').textContent = titleText;
    $('#modalEyebrow').textContent = eyebrow;
    $('#modalBody').innerHTML = body;
    $('#modalBackdrop').hidden = false;
    const focus = $('#modalBody input, #modalBody select, #modalBody textarea, #modalBody button');
    if(focus) focus.focus();
    if(typeof gsap!=='undefined'&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      const m=$('.modal');
      if(m)gsap.fromTo(m,{opacity:0,scale:0.96,y:10},{opacity:1,scale:1,y:0,duration:0.24,ease:'power2.out',clearProps:'transform'});
    }
  }

  let modalReturnFocus;
  function closeModal(){
    const bd=$('#modalBackdrop');
    if(!bd||bd.hidden)return;
    const m=$('.modal');
    if(typeof gsap!=='undefined'&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&m){
      gsap.to(m,{opacity:0,scale:0.97,y:6,duration:0.16,ease:'power2.in',onComplete:()=>{
        bd.hidden=true;
        m.classList.remove('case-builder-modal');
        gsap.set(m,{clearProps:'all'});
        modalReturnFocus?.focus();
      }});
    }else{
      bd.hidden=true;
      m?.classList.remove('case-builder-modal');
      modalReturnFocus?.focus();
    }
  }

  function modalForm(fields, submitLabel='Save'){
    return `<form id="modalForm">
      <div class="form-grid">${fields.map(f=>`<div class="form-field ${f.full?'full':''}"><label>${f.label}</label>${f.type==='textarea'?`<textarea name="${f.name}" placeholder="${f.placeholder||''}" ${f.required?'required':''}></textarea>`:f.options?`<select name="${f.name}" ${f.required?'required':''}>${f.options.map(o=>`<option>${o}</option>`).join('')}</select>`:`<input name="${f.name}" type="${f.type||'text'}" placeholder="${f.placeholder||''}" ${f.required?'required':''}/>`}</div>`).join('')}</div>
      <div class="form-note" style="margin-top:15px">This demo stores no information on a government system. Do not enter sensitive personal information.</div>
      <div class="modal-actions"><button type="button" class="btn" data-action="close-modal">Cancel</button><button type="submit" class="btn primary">${submitLabel}</button></div>
    </form>`;
  }

  function actionHandler(action, el){
    if(enhancedAction(action, el)) return;
    const id = el.dataset.id;
    const name = el.dataset.name;
    const service = el.dataset.service;

    switch(action){
      case 'open-service-router':
      case 'router-quick-search':
      case 'router-preset':
      case 'router-search':
      case 'router-clarify':
      case 'router-reset':
      case 'router-open-case':
        handleServiceRouterAction(action, el);
        break;

      case 'start-land-case-builder':
        startLandCaseBuilder(el.dataset.text || '');
        break;

      case 'open-land-case':
        openLandCaseDetail(id);
        break;

      case 'start-reconciliation':
      case 'document-compare':
      case 'reconcile-preset':
      case 'reconcile-select-doc-a':
      case 'reconcile-select-doc-b':
      case 'reconcile-next':
      case 'reconcile-prev':
      case 'reconcile-link-case':
      case 'reconcile-create-case':
      case 'reconcile-view-attached':
        handleReconciliationAction(action, el);
        break;

      case 'wizard-preset':
      case 'wizard-next':
      case 'wizard-prev':
      case 'wizard-jump':
      case 'wizard-toggle-categories':
      case 'wizard-select-category':
      case 'wizard-select-clarify':
      case 'wizard-select-parcel':
      case 'wizard-toggle-doc':
      case 'wizard-confirm-save':
      case 'wizard-goto-casebook':
      case 'wizard-new-case':
        handleCaseWizardAction(action, el);
        break;

      case 'update-case-check-status':
        updateSavedCaseCheckStatus(el.dataset.caseId, el.dataset.checkId, el.dataset.status);
        break;

      case 'save-case-notes':
        saveSavedCaseNotes(id);
        break;

      case 'delete-land-case':
        deleteLandCase(id);
        break;

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
          <div class="modal-actions">
            <button class="btn" data-action="close-modal">Close</button>
            <button class="btn" data-action="document-compare" data-id="${esc(doc[0])}">⚖ অন্য দলিলের সাথে তুলনা করুন</button>
            <button class="btn primary" data-action="document-guidance">Verification checklist →</button>
          </div>
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
          state.landQuery = normalize($('#recordNumber')?.value || '');
          res.innerHTML = landResults();
          $('#landFilter').addEventListener('input', filterLandTable);
          $('#recordSurveyFilter').addEventListener('change', filterLandTable);
          filterLandTable();
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
        if(!/\.(pdf|jpe?g|png|webp)$/i.test(f.name)){ toast('Unsupported file type', 'Allowed formats: PDF, JPG, PNG, WEBP.'); break; }
        if(f.size > 10*1024*1024) { toast('File too large', 'Demo limit is 10 MB.'); break; }
        const cat = $('#docCatSelect')?.value || 'Uploaded document';
        docs.unshift([`DOC-${String(docs.length+1).padStart(4,'0')}`, f.name, cat, 'Needs review', 'amber', 'Just now']);
        persist(); toast('Document added', `${f.name} · ${Math.round(f.size/1024)} KB added to demo vault.`);
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

      case 'lease-detail': {
        const l = leaseRecords.find(x => x.id === id) || leaseRecords[0];
        openModal(`${esc(l.id)} · ${esc(l.name)}`, `
          <div class="detail-row"><div><div class="detail-label">Category</div><div class="detail-value"><strong>${esc(l.type)}</strong></div></div><span class="pill ${l.tone}">${esc(l.status)}</span></div>
          <div class="detail-row" style="margin-top:12px"><div><div class="detail-label">Location</div><div class="detail-value">${esc(l.location)}</div></div><div><div class="detail-label">Area</div><div class="detail-value">${esc(l.area)}</div></div></div>
          <div class="detail-row" style="margin-top:12px"><div><div class="detail-label">Lease term</div><div class="detail-value">${esc(l.term)}</div></div></div>
          <div class="warning-panel" style="margin-top:15px">Demo lease record — not an official government lease deed. Confirm current terms, rent, and renewal status with the Deputy Commissioner (Lease) / Ministry of Land.</div>
          <div class="modal-actions"><button class="btn" data-action="close-modal">Close</button><button class="btn primary" data-action="lease-renewal" data-id="${esc(l.id)}">Start renewal request →</button></div>
        `, 'GOVERNMENT LEASE');
        break;
      }

      case 'lease-renewal':
        openModal('Lease / settlement renewal request', modalForm([
          {name:'leaseId',label:'Existing lease / settlement ID (if any)',placeholder:'e.g. LSE-SYL-0012'},
          {name:'category',label:'Category',options:['Tea garden lease','Khas land bandobasto','Industrial / commercial lease'],required:true},
          {name:'location',label:'District / Upazila',placeholder:'e.g. Sylhet Sadar, Sylhet',required:true},
          {name:'notes',label:'Notes for the reviewing office',type:'textarea',full:true,placeholder:'Describe the renewal or new request'}
        ],'Create draft request'), 'GOVERNMENT LEASE');
        break;

      case 'lease-guide':
        openModal('Lease & bandobasto guidance', `<div class="activity-list">${[['Tea garden leases','Generally long-term (30+ years) with annual lease rent and a formal renewal review before expiry.'],['Khas land bandobasto','Allotment to eligible landless/homestead-need families, verified by the upazila/district land office.'],['Industrial & commercial leases','Fixed-term agreements for private or institutional use, with defined rent and renewal conditions.'],['Always confirm officially','Eligibility, rent schedules and required documents must be confirmed with the Deputy Commissioner (Lease) and Ministry of Land.']].map(x=>`<div class="activity-item"><div class="activity-icon">⌁</div><div class="activity-copy"><b>${x[0]}</b><p>${x[1]}</p></div></div>`).join('')}</div>`, 'LEASE GUIDANCE');
        break;

      case 'ctg-select-circle':
        state.ctgCircle = id;
        renderPage();
        break;

      case 'ctg-certificate':
        openModal('Request a customary land certificate', modalForm([
          {name:'circle',label:'Circle',options:chtCircles.map(c=>c.name),required:true},
          {name:'mouza',label:'Mouza',placeholder:'Mouza name',required:true},
          {name:'applicant',label:'Applicant name',placeholder:'As recorded with the Headman',required:true},
          {name:'purpose',label:'Purpose',options:['Homestead','Jum cultivation','Transfer endorsement','Other']},
          {name:'notes',label:'Notes for the Headman / Circle office',type:'textarea',full:true}
        ],'Create draft request'), 'HILL TRACTS ZONE');
        break;

      case 'ctg-guide':
        openModal('CHT land guidance', `<div class="activity-list">${[['Separate system','CHT land is largely governed by the CHT Regulation 1900 and the 1997 CHT Accord, not the plains RS/BS Khatian system.'],['Mouza Headman','First point of contact for local land record and customary endorsement.'],['Circle Chief','Endorses matters within Chakma, Bomang or Mong Circle jurisdiction.'],['Hill District Council','Regional authority for Rangamati, Bandarban or Khagrachhari.'],['Always confirm officially','This workspace is informational; it does not replace the Headman, Circle or Council process.']].map(x=>`<div class="activity-item"><div class="activity-icon">◭</div><div class="activity-copy"><b>${x[0]}</b><p>${x[1]}</p></div></div>`).join('')}</div>`, 'CHT GUIDANCE');
        break;

      case 'hill-terrain':
        openModal('পাহাড় ও ভূমির ৩ডি পৃষ্ঠতল ক্ষেত্রফল ও ঢাল বিশ্লেষক', typeof renderHillTerrainHTML === 'function' ? renderHillTerrainHTML() : '<p>Loading engine...</p>', 'TOPOGRAPHIC TERRAIN ENGINE');
        if (typeof attachHillTerrainListeners === 'function') attachHillTerrainListeners();
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
      saveWorkflow(t, data);
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
        persist(); if(state.page === 'applications' || state.page === 'dashboard') renderPage();
      }
    }
  });

  $('#globalSearch').addEventListener('keydown', e => {
    if(e.key === 'Enter') {
      const q = e.target.value.trim();
      if(!q) return;
      showSearch(q);
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
    restore();
    document.documentElement.lang = state.lang;
    const hashPage = (typeof location !== 'undefined' && location.hash) ? location.hash.slice(1) : '';
    state.page = nav.some(n => n.id === hashPage) ? hashPage : 'dashboard';
    try {
      const r = await fetch('data/features.json');
      if(r.ok) {
        manifest = await r.json();
        featureIndex = new Map(manifest.features.map(f => [f.id, normalize(Object.values(f).join(' '))]));
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
    initAiFloatingChatbot();
  }

  function initAiFloatingChatbot(){
    const container = document.getElementById('aiFloatingContainer');
    const btn = document.getElementById('aiFloatingBtn');
    const card = document.getElementById('aiFloatingCard');
    const close = document.getElementById('aiCardClose');
    const form = document.getElementById('aiFloatingForm');
    const input = document.getElementById('aiFloatingInput');
    const messages = document.getElementById('aiFloatingMessages');
    if (!container || !btn || !card || !form || !input || !messages) return;

    function toggleCard(open){
      const isCurrentlyHidden = card.hidden || card.classList.contains('hidden') || card.style.display === 'none';
      const shouldOpen = open !== undefined ? open : isCurrentlyHidden;
      card.hidden = !shouldOpen;
      card.classList.toggle('hidden', !shouldOpen);
      card.style.display = shouldOpen ? 'flex' : 'none';
      if (shouldOpen){
        setTimeout(() => input.focus(), 50);
        messages.scrollTop = messages.scrollHeight;
      }
    }

    btn.onclick = e => { e.stopPropagation(); toggleCard(); };
    if (close) close.onclick = e => { e.preventDefault(); e.stopPropagation(); toggleCard(false); };

    document.addEventListener('click', e => {
      const isCurrentlyHidden = card.hidden || card.classList.contains('hidden') || card.style.display === 'none';
      if (!isCurrentlyHidden && !container.contains(e.target)){
        toggleCard(false);
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape'){
        const isCurrentlyHidden = card.hidden || card.classList.contains('hidden') || card.style.display === 'none';
        if (!isCurrentlyHidden) toggleCard(false);
      }
    });

    container.addEventListener('click', e => {
      const chip = e.target.closest('.ai-chip');
      if (chip && chip.dataset.ask){
        e.preventDefault();
        handleUserQuery(chip.dataset.ask);
      }
      const closeAi = e.target.closest('[data-close-ai]');
      if (closeAi) toggleCard(false);
      const hillBtn = e.target.closest('[data-open-hill]');
      if (hillBtn){
        toggleCard(false);
        openModal('পাহাড় ও ভূমির ৩ডি পৃষ্ঠতল ক্ষেত্রফল ও ঢাল বিশ্লেষক', typeof renderHillTerrainHTML === 'function' ? renderHillTerrainHTML() : '<p>Loading engine...</p>', 'TOPOGRAPHIC TERRAIN ENGINE');
        if (typeof attachHillTerrainListeners === 'function') attachHillTerrainListeners();
      }
    });

    function getAssistantResponse(query){
      const q = normalize(query);
      if (/পাহাড়|hill|terrain|ঢাল/.test(q)){
        return { text: 'পাহাড় ও ভূমির ৩ডি পৃষ্ঠতল ক্ষেত্রফল ও ঢাল বিশ্লেষণে বাস্তব জমি মানচিত্রের চেয়ে বেশি থাকে। GIS ম্যাপে স্যাটেলাইট ভিউ ও "Hill 3D Topographic Area" ব্যবহার করে বাস্তব পৃষ্ঠতল পরিমাপ করুন।', serviceId: 'gis' };
      }
      if (/নামজারি|namjari|mutation/.test(q)){
        return { text: 'ই-নামজারি (Mutation) আবেদনের জন্য মালিকানা দলিল, খতিয়ান, ওয়ারিশ সনদ ও ভূমি কর দাখিলা প্রয়োজন। আবেদন প্রস্তুত করতে সরাসরি নামজারি সেবায় যান।', serviceId: 'services' };
      }
      if (/পর্চা|porcha|khatian|খতিয়ান/.test(q)){
        return { text: 'ই-পর্চা বা সার্টিফাইড খতিয়ান কপির জন্য আপনার মৌজা, খতিয়ান নম্বর ও দাগ নম্বর দিয়ে অনলাইন রেকর্ড অনুসন্ধান করুন।', serviceId: 'services' };
      }
      if (/tax|খাজনা|কর|dakhila/.test(q)){
        return { text: 'ভূমি উন্নয়ন কর (LD Tax) প্রদানের জন্য হোল্ডিং নম্বর ও কর পরিশোধের বছর নির্বাচন করুন। পেমেন্ট সম্পন্ন হলে ডিজিটাল দাখিলা পাওয়া যাবে।', serviceId: 'payments' };
      }
      return { text: 'আপনার প্রশ্নের জন্য সংশ্লিষ্ট সেবায় আবেদন করতে পারেন। e-Bhumi প্ল্যাটফর্মে নামজারি, পর্চা, খাজনা ও পাহাড়ি জমির ৩ডি পরিমাপ উপলব্ধ রয়েছে।', serviceId: null };
    }

    function handleUserQuery(query){
      if (!query || !query.trim()) return;
      const cleanQuery = query.trim();
      const userBubble = document.createElement('div');
      userBubble.className = 'ai-bubble ai-bubble-user';
      userBubble.textContent = cleanQuery;
      messages.appendChild(userBubble);
      messages.scrollTop = messages.scrollHeight;

      setTimeout(() => {
        const resp = getAssistantResponse(cleanQuery);
        const assistantBubble = document.createElement('div');
        assistantBubble.className = 'ai-bubble ai-bubble-assistant';
        assistantBubble.innerHTML = `<div>${esc(resp.text)}</div>` +
          (resp.serviceId ? `<div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
            <a class="btn small primary" href="#${esc(resp.serviceId)}" data-close-ai="true">সেবায় সরাসরি যান ↗</a>
            ${resp.serviceId === 'gis' ? '<button type="button" class="btn small" data-open-hill="true">পাহাড় ৩ডি বিশ্লেষক ↗</button>' : ''}
          </div>` : '');
        messages.appendChild(assistantBubble);
        messages.scrollTop = messages.scrollHeight;
      }, 120);
    }

    form.onsubmit = e => {
      e.preventDefault();
      const val = input.value;
      input.value = '';
      handleUserQuery(val);
    };
  }

  const storageKey = 'ebhumi.workspace.v3';
  let featureIndex = new Map();
  let local = { notes: {}, favorites: [], workflows: [], events: [], read: false, landCases: [] };
  const normalize = v => String(v).replace(/[০-৯]/g, c => '০১২৩৪৫৬৭৮৯'.indexOf(c)).toLowerCase().trim();

  function persist(){
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        version: 3,
        local,
        applications,
        docs,
        state: {
          lang: state.lang,
          savedSearches: state.savedSearches,
          diligenceChecks: state.diligenceChecks,
          chat: state.chat.slice(-40),
          layerState: state.layerState
        }
      }));
      return true;
    } catch {
      toast('Browser storage unavailable', 'Export your workspace to keep a local backup.');
      return false;
    }
  }

  function restore(){
    try {
      const s = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (s?.version === 3) {
        local = { ...local, ...s.local };
        if (!Array.isArray(local.landCases)) local.landCases = [];
        if (Array.isArray(s.applications)) applications.splice(0, applications.length, ...s.applications);
        if (Array.isArray(s.docs)) docs.splice(0, docs.length, ...s.docs);
        if (!docs.some(d => d[0] === 'DOC-0082')) {
          docs.splice(1, 0, ['DOC-0082','Mutation Porcha · demo','Land record','Verified','green','05 Jun 2025']);
        }
        if (!docs.some(d => d[0] === 'DOC-0083')) {
          docs.splice(3, 0, ['DOC-0083','Historical deed · sample','Uploaded document','Needs review','amber','18 Mar 1985']);
        }
        Object.assign(state, s.state || {});
      }
    } catch {
      console.warn('Saved workspace could not be restored.');
    }
  }

  function workspaceTools(){
    const rows = local.workflows.filter(w => w.page === state.page);
    return `<section class="panel workspace-tools">
      <div class="panel-head">
        <div>
          <span class="eyebrow">YOUR LOCAL WORKSPACE</span>
          <h2 class="panel-title">Keep your next step close</h2>
          <p class="panel-subtitle">Saved on this browser. Use sample information only.</p>
        </div>
        <button class="btn" data-action="favorite-page">${local.favorites.includes(state.page) ? '★ Saved page' : '☆ Save page'}</button>
      </div>
      <div class="form-field">
        <label for="pageNote">Notes for ${esc(title(state.page))}</label>
        <textarea id="pageNote" maxlength="4000" placeholder="References to compare, questions to ask, or your next step…">${esc(local.notes[state.page] || '')}</textarea>
        <small id="noteStatus" role="status">Autosaves as you type</small>
      </div>
      <div class="toolbar" style="margin-top:14px">
        <button class="btn" data-action="export-page">Export page data</button>
        <button class="btn" data-action="backup-workspace">Back up workspace</button>
        <button class="btn" data-action="unit-converter">Area converter</button>
        <button class="btn primary" data-action="hill-terrain">⛰️ Hill 3D Area & Slope</button>
        <a class="btn" href="index.html">Visit landing page ↗</a>
      </div>
      ${rows.length ? `<h3>Saved local drafts</h3>${rows.map(w => `<article class="local-draft"><strong>${esc(w.id)} · ${esc(w.title)}</strong><p>${esc(Object.entries(w.data).map(([k,v]) => k + ': ' + v).join(' · '))}</p><button class="btn small" data-action="delete-workflow" data-id="${esc(w.id)}">Delete draft</button></article>`).join('')}` : ''}
      ${state.page === 'land-search' ? `<h3>Saved searches</h3>${state.savedSearches.map(s => `<p>${esc(s.query)} · ${esc(s.date)}</p>`).join('') || '<p>No saved searches yet.</p>'}` : ''}
      ${state.page === 'dashboard' ? `<h3>Saved pages</h3>${local.favorites.map(p => `<button class="btn" data-page="${esc(p)}">${esc(title(p))}</button>`).join('') || '<p>Save a page to add a shortcut here.</p>'}` : ''}
    </section>`;
  }

  function saveWorkflow(t, data){
    if (t.toLowerCase().includes('application')) return;
    const page = t.includes('complaint') ? 'casebook' : t.includes('appointment') ? 'appointments' : state.page;
    local.workflows.unshift({
      id: 'LOCAL-' + Date.now().toString(36).toUpperCase(),
      page,
      title: t,
      data,
      created: new Date().toISOString()
    });
    persist();
    setTimeout(renderPage, 0);
  }

  function showSearch(q){
    const query = normalize(q);
    const hits = [
      ...nav.filter(n => normalize(n.label).includes(query)).map(n => ({ label: n.label, page: n.id })),
      ...services.filter(s => normalize(s.title + ' ' + s.desc).includes(query)).map(s => ({ label: s.title, page: 'services' })),
      ...applications.filter(a => normalize(Object.values(a).join(' ')).includes(query)).map(a => ({ label: a.id + ' · ' + a.service, page: 'applications' })),
      ...docs.filter(d => normalize(d.join(' ')).includes(query)).map(d => ({ label: d[1], page: 'documents' })),
      ...leaseRecords.filter(l => normalize(l.id + ' ' + l.title + ' ' + l.location).includes(query)).map(l => ({ label: l.id + ' · ' + l.title, page: 'land-lease' })),
      ...chtCircles.filter(c => normalize(c.name + ' ' + c.district).includes(query)).map(c => ({ label: c.name, page: 'ctg-zone' }))
    ];
    openModal('Search results', `<p>Results for “${esc(q)}”</p>
      ${hits.map(h => `<p><button class="btn" data-action="search-result" data-id="${h.page}">${esc(h.label)} ↗</button></p>`).join('') || '<p>No workspace results found. Try a service, document, or application reference.</p>'}
      <button class="btn" data-action="search-features" data-name="${esc(q)}">Search feature catalogue</button>
    `);
  }

  function enhancedAction(action, el){
    switch(action){
      case 'download-summary':
      case 'export-report':
        downloadFile('ebhumi-report.json', JSON.stringify({
          source: 'DEMO',
          generated: new Date().toISOString(),
          applications,
          documents: docs,
          payments,
          leases: leaseRecords,
          localDrafts: local.workflows,
          landCases: local.landCases,
          review: state.diligenceChecks
        }, null, 2), 'application/json');
        return true;

      case 'download-receipts':
        downloadFile('demo-receipts.csv', 'Transaction,Service,Amount,Date,Status\n' + payments.map(p => [p.id, p.service, p.amount, p.date, p.status].map(v => '"' + String(v).replaceAll('"', '""') + '"').join(',')).join('\n'), 'text/csv;charset=utf-8');
        return true;

      case 'print-map':
        window.print();
        return true;

      case 'export-map':
        downloadFile('demo-parcel-map.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420"><rect width="600" height="420" fill="#edf3e7"/><text x="20" y="25">DEMO schematic — not a survey or geographic dataset</text>' + parcels.map((p, i) => '<rect x="' + (25 + (i % 4) * 140) + '" y="' + (65 + Math.floor(i / 4) * 150) + '" width="125" height="110" fill="#bfd4ad" stroke="#52744a"/><text x="' + (32 + (i % 4) * 140) + '" y="' + (120 + Math.floor(i / 4) * 150) + '">' + p[1] + '</text>').join('') + '</svg>', 'image/svg+xml');
        return true;

      case 'watch-land':
        local.watches = local.watches || [];
        if (!local.watches.includes(el.dataset.id)) local.watches.push(el.dataset.id);
        persist();
        toast('Parcel saved to local watchlist', 'Live change monitoring is not connected.');
        return true;

      case 'service-compare':
        openModal('Compare service preparation', table(services.map(s => '<tr><td><strong>' + esc(s.title) + '</strong></td><td>' + esc(s.tag) + '</td><td>' + esc(s.desc) + '</td></tr>').join(''), ['Service', 'Category', 'Purpose']) + '<p style="margin-top:14px;font-size:11px;color:#6b7c72">Current official fees, eligibility and required documents need competent land office confirmation.</p>');
        return true;

      case 'cancel-appointment':
        local.workflows = local.workflows.filter(w => w.page !== 'appointments');
        persist();
        renderPage();
        toast('Local appointment drafts removed', 'Sample office appointment cards remain illustrative.');
        return true;

      case 'search-result':
        closeModal();
        setPage(el.dataset.id);
        return true;

      case 'search-features':
        state.featureQuery = el.dataset.name;
        closeModal();
        setPage('feature-catalog');
        return true;

      case 'favorite-page':
        local.favorites = local.favorites.includes(state.page) ? local.favorites.filter(p => p !== state.page) : [...local.favorites, state.page];
        persist();
        renderPage();
        return true;

      case 'delete-workflow':
        local.workflows = local.workflows.filter(w => w.id !== el.dataset.id);
        persist();
        renderPage();
        return true;

      case 'export-page':
        downloadFile('ebhumi-' + state.page + '.json', JSON.stringify({
          page: state.page,
          note: local.notes[state.page] || '',
          drafts: local.workflows.filter(w => w.page === state.page),
          landCases: (state.page === 'casebook' || state.page === 'ai-assistant') ? local.landCases : undefined,
          applications: state.page === 'applications' ? applications : undefined,
          documents: state.page === 'documents' ? docs : undefined,
          checks: state.page === 'due-diligence' ? state.diligenceChecks : undefined,
          payments: state.page === 'payments' ? payments : undefined,
          leases: state.page === 'land-lease' ? leaseRecords : undefined,
          chtCircles: state.page === 'ctg-zone' ? chtCircles : undefined,
          features: state.page === 'feature-catalog' ? filterFeatures() : undefined,
          source: 'DEMO'
        }, null, 2), 'application/json');
        return true;

      case 'backup-workspace':
        persist();
        downloadFile('ebhumi-workspace-backup.json', localStorage.getItem(storageKey) || '{}', 'application/json');
        return true;

      case 'hill-terrain':
        openModal('পাহাড় ও ভূমির ৩ডি পৃষ্ঠতল ক্ষেত্রফল ও ঢাল বিশ্লেষক', typeof renderHillTerrainHTML === 'function' ? renderHillTerrainHTML() : '<p>Loading engine...</p>', 'TOPOGRAPHIC TERRAIN ENGINE');
        if (typeof attachHillTerrainListeners === 'function') attachHillTerrainListeners();
        return true;

      case 'unit-converter':
        openModal('Land area converter', `<div class="form-grid">
          <div class="form-field"><label for="areaValue">Area (nonnegative)</label><input id="areaValue" type="number" min="0" step="any" value="1"></div>
          <div class="form-field"><label for="areaUnit">From</label><select id="areaUnit"><option value="1">Decimal</option><option value="100">Acre</option><option value="247.105381">Hectare</option><option value="0.0022956841">Square foot</option></select></div>
        </div>
        <p id="areaResult" role="status" style="font-size:13px;font-weight:700;color:#245842;margin:16px 0 8px"></p>
        <p class="panel-subtitle">1 acre = 100 decimal = 43,560 square feet. Local katha/bigha conventions vary by district and are excluded.</p>`);
        updateArea();
        return true;

      case 'mark-read':
        local.read = true;
        persist();
        $$('.notice-bullet').forEach(n => n.style.background = '#c4cec8');
        toast('All notifications marked read');
        return true;
    }
    return false;
  }

  function updateArea(){
    const value = Number($('#areaValue')?.value);
    const unit = Number($('#areaUnit')?.value);
    const decimal = value * unit;
    const res = $('#areaResult');
    if (res) {
      res.textContent = Number.isFinite(value) && value >= 0
        ? `${decimal.toFixed(4)} decimal · ${(decimal/100).toFixed(6)} acres · ${(decimal*435.6).toFixed(2)} sq ft`
        : 'Enter a valid nonnegative area.';
    }
  }

  document.addEventListener('input', e => {
    if (e.target.id === 'pageNote') {
      local.notes[state.page] = e.target.value;
      persist();
      const status = $('#noteStatus');
      if (status) status.textContent = 'Saved locally';
    }
    if (e.target.id === 'areaValue') updateArea();
  });

  document.addEventListener('change', e => {
    if (e.target.id === 'areaUnit') updateArea();
    if (e.target.id === 'colorVariantSelect') {
      const v = e.target.value;
      localStorage.setItem('ebhumi_color_variant', v);
      document.documentElement.setAttribute('data-color-variant', v);
      if (typeof toast === 'function') toast(v === 'padma' ? 'পদ্মা সবুজ থিম' : v === 'meghna' ? 'মেঘনা নীল থিম' : v === 'sundarban' ? 'সুন্দরবন মৃত্তিকা থিম' : 'সুরমা স্লেট থিম', 'Color variant active');
    }
  });

  const THEME_SUN_SVG = '<svg class="theme-icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
  const THEME_MOON_SVG = '<svg class="theme-icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';

  document.addEventListener('click', e => {
    if (e.target.closest('#themeToggle')) {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      if (next === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
      else document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('ebhumi_theme', next);
      const b = $('#themeToggle');
      if (b) b.innerHTML = next === 'dark' ? THEME_SUN_SVG : THEME_MOON_SVG;
      if (typeof toast === 'function') toast(next === 'dark' ? 'Dark mode enabled' : 'Light mode enabled');
    }
    if (e.target.closest('[data-action],#languageToggle')) setTimeout(persist, 0);
  });

  try {
    const savedTheme = localStorage.getItem('ebhumi_theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      const b = $('#themeToggle');
      if (b) b.innerHTML = THEME_SUN_SVG;
    }
    const savedVariant = localStorage.getItem('ebhumi_color_variant') || 'padma';
    document.documentElement.setAttribute('data-color-variant', savedVariant);
    const vSel = $('#colorVariantSelect');
    if (vSel) vSel.value = savedVariant;
  } catch {}

  window.addEventListener('popstate', () => {
    state.page = nav.some(n => n.id === location.hash.slice(1)) ? location.hash.slice(1) : 'dashboard';
    renderNav();
    renderPage();
    $('#crumbCurrent').textContent = title(state.page);
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Tab' || $('#modalBackdrop').hidden) return;
    const items = $$('button,input,select,textarea,a[href]', $('.modal')).filter(n => !n.disabled && n.getClientRects().length);
    if (!items.length) return;
    const first = items[0], last = items.at(-1);
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  if (typeof globalThis !== 'undefined') {
    globalThis.routeCitizenProblem = routeCitizenProblem;
    globalThis.VERIFIED_SERVICE_DIRECTORY = VERIFIED_SERVICE_DIRECTORY;
  }
  if (typeof window !== 'undefined' && typeof document !== 'undefined' && document.body) {
    init();
  }
})();
