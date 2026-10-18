'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {createPlatform}=require('./lib/platform.cjs');
const {allowedHost:hostAllowed}=require('./lib/request-security.cjs');
function createServer(options={}){
 const root=__dirname,platform=createPlatform({dataDir:options.dataDir||(process.env.VERCEL?path.join('/tmp','.data'):path.join(root,'.data')),seedDemo:options.seedDemo!==false,newWorkflowVersion:options.newWorkflowVersion,deskRouting:options.deskRouting,memoryOnly:options.memoryOnly,initialState:options.initialState,sessionState:options.sessionState,attemptState:options.attemptState});
 const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'};
 const server=http.createServer((req,res)=>{
  const host=req.headers.host||'';const allowedHost=hostAllowed(host);if(!allowedHost){res.writeHead(403).end('Local host required');return;}
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');res.setHeader('X-Frame-Options','DENY');res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: https://*.tile.openstreetmap.org https://tile.openstreetmap.org https://*.basemaps.cartocdn.com https://server.arcgisonline.com https://*.arcgisonline.com https://*.tile.opentopomap.org; connect-src 'self' https://*.tile.openstreetmap.org https://tile.openstreetmap.org https://*.basemaps.cartocdn.com https://server.arcgisonline.com https://*.arcgisonline.com https://*.tile.opentopomap.org; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'");
  let url;try{url=new URL(req.url,'http://'+req.headers.host);}catch{res.writeHead(400).end();return;}
  if(url.pathname.startsWith('/api/')){platform.api(req,res,url);return;}
  if(req.method!=='GET'){res.writeHead(405).end();return;}
  let name;try{name=decodeURIComponent(url.pathname);}catch{res.writeHead(400).end();return;}
  if(name==='/workspace.html'||name.startsWith('/portal/')){const auth=platform.authenticate(req);if(!auth){res.writeHead(302,{Location:'/login.html'}).end();return;}if(name.startsWith('/portal/')&&name.split('/')[2]!==auth.user.role){res.writeHead(302,{Location:'/portal/'+auth.user.role}).end();return;}name='/portal.html';}
  if(name==='/')name='/index.html';
  const allowed=['/index.html','/landing.js','/login.html','/portal.js','/workflows.js','/land-intelligence.js','/procedures-ui.js','/i18n.js','/desk-ui.js','/lawbook.js','/hill-terrain.js','/terrain-engine.js','/demo-flows.js','/themes.css','/appearance.js','/land-intelligence.css','/auth.js','/portal.css','/interface.css','/citizen.js','/preserved.css','/data/features.json'];
  const custom404='<!doctype html><html lang="bn"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>404 — পৃষ্ঠা খুঁজে পাওয়া যায়নি | e-Bhumi</title><link rel="icon" type="image/svg+xml" href="/assets/favicon.svg"><style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#f8faf9;font-family:sans-serif;color:#183228;padding:20px;box-sizing:border-box}.card{max-width:440px;background:#fff;border:1px solid #d4e2db;border-radius:12px;padding:32px;text-align:center;box-shadow:0 10px 25px rgba(0,0,0,0.05)}h1{font-size:24px;margin:12px 0 6px;color:#173e33}p{color:#527367;line-height:1.6;margin:0 0 20px;font-size:14px}.btn{display:inline-block;background:#1b4d3e;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-weight:600;font-size:13px}</style></head><body><div class="card"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2a6f58" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg><h1>পৃষ্ঠাটি খুঁজে পাওয়া যায়নি</h1><p>অনুরোধকৃত রিসোর্সটি পাওয়া যায়নি।</p><a href="/" class="btn">মূল পাতায় ফিরে যান →</a></div></body></html>';
  if(name==='/portal.html'){if(!platform.authenticate(req)){res.writeHead(302,{Location:'/login.html'}).end();return;}}
  else if(!allowed.includes(name)&&!/^\/assets\/[a-zA-Z0-9._-]+$/.test(name)){
    if(req.headers.accept?.includes('text/html')&&!name.includes('.')){res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'}).end(custom404);return;}
    res.writeHead(404).end('Not found');return;
  }
  const file=path.resolve(root,name==='/terrain-engine.js'?'lib/terrain-engine.cjs':'.'+name);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.stat(file,(err,stat)=>{if(err||!stat.isFile()){res.writeHead(404).end('Not found');return;}res.writeHead(200,{'Content-Type':types[path.extname(name)]||'application/octet-stream','Cache-Control':'no-store','Content-Length':stat.size});fs.createReadStream(file).pipe(res);});
 });server.on('close',()=>platform.close());return {server,platform};
}
if(require.main===module){const {server}=createServer();server.listen(Number(process.env.PORT)||8080,'127.0.0.1',()=>console.log('e-Bhumi role platform: http://127.0.0.1:'+(process.env.PORT||8080)));}
module.exports={createServer,default:{createServer}};
