'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {analyzeTerrain,PRESETS}=require('../ebhumi-platform/lib/terrain-engine.cjs');
const {createServer}=require('../ebhumi-platform/server-v4.cjs');
test('terrain uses one browser/server engine and labels generated observations honestly',()=>{
 const context={};vm.createContext(context);vm.runInContext(fs.readFileSync(require.resolve('../ebhumi-platform/lib/terrain-engine.cjs'),'utf8'),context);
 for(const presetId of Object.keys(PRESETS)){const a=analyzeTerrain({presetId}),b=context.BhumiTerrain.analyzeTerrain({presetId});assert.equal(a.surface_area_m2,b.surface_area_m2);assert(a.surface_area_m2>=a.projected_area_m2);assert.equal(a.mode,'synthetic-demonstration');assert(/no measured DEM/.test(a.elevation_source));assert(Number.isFinite(a.elevation.min_m));}
 const flat=analyzeTerrain({presetId:'benchmark-flat-100m'});assert.equal(flat.ratio,1);assert.equal(flat.projected_area_m2,10000);
 const raised=analyzeTerrain({presetId:'benchmark-flat-100m',targetElevation:30});assert.equal(raised.earthwork.target_elevation_m,30);assert.equal(raised.earthwork.fill_volume_m3,100000);
 const custom=analyzeTerrain({presetId:'benchmark-flat-100m',polygon:[[23.8,90.4],[23.802,90.4],[23.802,90.402],[23.8,90.402]]});assert(custom.projected_area_m2>40000,'Custom polygons must not return the canned benchmark area');
});
test('terrain rejects invalid, unsafe and expensive inputs before calculation',()=>{
 for(const input of [{presetId:'toString'},{demResolution:Infinity},{demResolution:-1},{targetElevation:'12'},{targetElevation:NaN},{polygon:[[NaN,90],[23,90],[23,91]]},{polygon:[[23,90],[24,91],[23,91],[24,90]]},{polygon:Array.from({length:101},()=>[23,90])},{polygon:[[20,88],[27,88],[27,93],[20,93]]},{polygon:[[23,90],[23.04,90],[23.04,90.04],[23,90.04]],demResolution:5}])assert.throws(()=>analyzeTerrain(input));
});
test('terrain API requires login and CSRF, browser assets work with restrictive CSP, postal quotes include delivery',async t=>{
 let app=createServer({memoryOnly:true,seedDemo:false});const state=app.platform.snapshot().db,owner=state.users.find(u=>u.role==='citizen');app.platform.close();
 state.applications=['eporcha','mouza-map','instant-copy'].map(serviceId=>({id:'APP-'+serviceId,serviceId,ownerId:owner.id,workflowVersion:2,status:'AwaitingApplicationPayment',revision:1,details:{delivery:'Postal demo'},procedureData:{reviewTasks:{},messages:[]},history:[],documentIds:[]}));
 app=createServer({memoryOnly:true,seedDemo:false,initialState:state});await new Promise(r=>app.server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>app.server.close(r)));const base='http://127.0.0.1:'+app.server.address().port;
 async function call(path,method='GET',body,who,status=200){const r=await fetch(base+path,{method,headers:{Origin:base,'Content-Type':'application/json',...(who?{Cookie:who.cookie,'X-CSRF-Token':who.csrf}:{})},...(body?{body:JSON.stringify(body)}:{})});assert.equal(r.status,status,path);return {r,data:r.headers.get('content-type')?.includes('application/json')?await r.json():await r.text()};}
 await call('/api/terrain/presets','GET',null,null,401);const login=await call('/api/login','POST',{email:'citizen@demo.ebhumi.local',password:'BhumiDemo!2026'});const who={cookie:login.r.headers.get('set-cookie').split(';')[0],csrf:login.data.csrf};
 await call('/api/terrain/analyze','POST',{presetId:'batali-hill'},{...who,csrf:'wrong'},403);assert.equal((await call('/api/terrain/analyze','POST',{presetId:'batali-hill'},who)).data.terrain.mode,'synthetic-demonstration');await call('/api/terrain/analyze','POST',{demResolution:-1},who,400);
 for(const [id,amount,postal]of [['eporcha',140,40],['mouza-map',630,110],['instant-copy',100,0]]){const q=(await call('/api/applications/APP-'+id+'/payment-quote','GET',null,who)).data.quote;assert.equal(q.amount,amount);assert.equal(q.postalCharge,postal);}
 const asset=await call('/terrain-engine.js');assert.match(asset.r.headers.get('content-type'),/javascript/);const policy=asset.r.headers.get('content-security-policy');assert(policy.includes("script-src 'self';"));assert(!policy.includes('unpkg.com'));
 for(const p of ['/assets/leaflet.js','/assets/leaflet.css','/assets/favicon.svg','/hill-terrain.js'])await call(p);
});
