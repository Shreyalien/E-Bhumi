'use strict';
// Optional browser check. Runtime application does not depend on Playwright.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {createServer}=require('../server-v4.cjs');const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
(async()=>{
 const dataRoot=process.env.EBHUMI_BROWSER_DATA||path.join(__dirname,'.browser-data');fs.mkdirSync(dataRoot,{recursive:true});const dataDir=fs.mkdtempSync(path.join(dataRoot,'run-'));const {server}=createServer({dataDir});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});const errors=[];
 const screenshots=path.resolve(__dirname,'../../docs/screenshots-v4');fs.mkdirSync(screenshots,{recursive:true});
 async function pageFor(){const ctx=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true});const page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
  // A request bridge uses the actual server/API when browser loopback is isolated.
  if(process.env.EBHUMI_BROWSER_BRIDGE==='1')await page.route(base+'/**',async route=>{try{const req=route.request(),headers=req.headers();delete headers['content-length'];const result=await fetch(req.url(),{method:req.method(),headers,redirect:'manual',...(req.postData()?{body:req.postData()}:{}),signal:AbortSignal.timeout(10000)});await route.fulfill({status:result.status,headers:Object.fromEntries(result.headers),body:Buffer.from(await result.arrayBuffer())});}catch(e){errors.push('Bridge: '+e.message);await route.abort();}});
  return page;
 }
 async function login(page,role){await page.goto(base+'/login.html');await page.locator('#demoRole').selectOption(role);await page.locator('#authSubmit').click();await page.waitForURL('**/portal/'+role+'#dashboard');await page.locator('#content h1').waitFor();}
 try{
  const citizen=await pageFor();await citizen.goto(base+'/login.html');await citizen.screenshot({path:screenshots+'/login.png'});await login(citizen,'citizen');await citizen.screenshot({path:screenshots+'/citizen.png'});
  await citizen.locator('a[href="#services"]').first().click();await citizen.locator('a[href="#service/mutation"]').click();await citizen.locator('[data-action="start"]').click();await citizen.locator('#wizardForm').waitFor();
  await citizen.locator('[name=d_eligibility]').check();await citizen.locator('button[value=next]').click();await citizen.locator('#d_applicant').fill('Browser Sample Applicant');await citizen.locator('#d_authority').selectOption('Self');await citizen.locator('button[value=next]').click();
  await citizen.locator('#d_division').selectOption('Dhaka');await citizen.locator('#d_district').selectOption('Dhaka');
  for(const [key,value]of Object.entries({upazila:'Savar',mouza:'Amin Bazar',khatian:'731',dag:'1842',area:'12.5',deed:'BROWSER-DEED-001',transferDate:'2026-01-01'}))await citizen.locator('#d_'+key).fill(value);await citizen.locator('#d_transferType').selectOption('Purchase');await citizen.locator('button[value=next]').click();
  await citizen.screenshot({path:screenshots+'/evidence-step.png'});
  for(let i=0;i<2;i++){await citizen.locator('[data-action="sample-evidence"]').nth(i).click();await citizen.locator('.evidence').nth(i).locator('text=✓').waitFor();}
  await citizen.locator('button[value=next]').click();await citizen.locator('button[value=submit]').click();await citizen.waitForURL(/#application\//);
  await citizen.locator('a[href="#applications"]').first().click();await citizen.locator('#applicationResults a').first().click();await citizen.locator('.badge').filter({hasText:'Submitted'}).first().waitFor();
  const caseHash=new URL(citizen.url()).hash;await citizen.screenshot({path:screenshots+'/submitted-case.png'});
  const officer=await pageFor();await login(officer,'officer');await officer.screenshot({path:screenshots+'/officer.png'});await officer.goto(base+'/portal/officer'+caseHash);await officer.locator('[data-action="transition"][data-transition=claim]').click();await officer.locator('[data-transition=approve]').click();await officer.locator('#reviewForm textarea').fill('Browser evidence reviewed; sandbox approval');await officer.locator('#reviewForm button').click();
  await citizen.reload();await citizen.locator('[data-action=checkout]').click();await citizen.locator('[data-action=pay][data-result=success]').click();await citizen.locator('.badge').filter({hasText:'ReadyForDelivery'}).first().waitFor();
  await officer.reload();await officer.locator('[data-transition=issue]').click();await officer.locator('#reviewForm textarea').fill('Browser test outcome issued; no legal effect');await officer.locator('#reviewForm button').click();await officer.locator('.outcome').waitFor();
  await citizen.reload();await citizen.locator('[data-action=outcome]').waitFor();const download=citizen.waitForEvent('download');await citizen.locator('[data-action=outcome]').click();const file=await download;assert(file.suggestedFilename().endsWith('-DEMO-outcome.html'));await citizen.screenshot({path:screenshots+'/completed-outcome.png'});
  for(const role of ['representative','records','surveyor','registrar','finance','support','admin','auditor']){const page=await pageFor();await login(page,role);await page.screenshot({path:screenshots+'/'+role+'.png'});if(role==='admin'){await page.locator('a[href="#users"]').first().click();await page.locator('#userForm').waitFor();await page.screenshot({path:screenshots+'/admin-access.png'});}if(role==='auditor'){await page.locator('a[href="#audit"]').first().click();await page.locator('text=Chain valid').waitFor();}}
  for(const view of ['documents','payments','land','gis','tools','support','features','knowledge','profile','notifications']){await citizen.goto(base+'/portal/citizen#'+view);await citizen.locator('#content h1').waitFor();assert(!await citizen.locator('#content h1').innerText().then(t=>t.includes('Unable')));}
  await citizen.goto(base+'/portal/citizen#services');await citizen.locator('#serviceGrid .card').first().waitFor();assert.equal(await citizen.locator('#serviceGrid .card').count(),33);await citizen.setViewportSize({width:390,height:844});await citizen.screenshot({path:screenshots+'/mobile-services.png'});assert.equal(await citizen.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.deepEqual(errors,[]);console.log('PASS: 10 role logins, complete browser mutation lifecycle, real evidence creation, outcome download, admin access view, audit chain, 33 service cards, mobile overflow and no page errors.');
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
