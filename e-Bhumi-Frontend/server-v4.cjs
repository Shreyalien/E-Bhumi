'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {createPlatform}=require('./lib/platform.cjs');
const {allowedHost:hostAllowed}=require('./lib/request-security.cjs');
function createServer(options={}){
 const root=__dirname,platform=createPlatform({dataDir:options.dataDir||(process.env.VERCEL?path.join('/tmp','.data'):path.join(root,'.data')),seedDemo:options.seedDemo!==false,newWorkflowVersion:options.newWorkflowVersion,deskRouting:options.deskRouting});
 const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'};
 const server=http.createServer((req,res)=>{
  const host=req.headers.host||'';const allowedHost=hostAllowed(host);if(!allowedHost){res.writeHead(403).end('Local host required');return;}
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');res.setHeader('X-Frame-Options','DENY');res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'");
  let url;try{url=new URL(req.url,'http://'+req.headers.host);}catch{res.writeHead(400).end();return;}
  if(url.pathname.startsWith('/api/')){platform.api(req,res,url);return;}
  if(req.method!=='GET'){res.writeHead(405).end();return;}
  let name;try{name=decodeURIComponent(url.pathname);}catch{res.writeHead(400).end();return;}
  if(name==='/workspace.html'||name.startsWith('/portal/')){const auth=platform.authenticate(req);if(!auth){res.writeHead(302,{Location:'/login.html'}).end();return;}if(name.startsWith('/portal/')&&name.split('/')[2]!==auth.user.role){res.writeHead(302,{Location:'/portal/'+auth.user.role}).end();return;}name='/portal.html';}
  if(name==='/')name='/index.html';
  const allowed=['/index.html','/landing.js','/login.html','/portal.js','/workflows.js','/land-intelligence.js','/procedures-ui.js','/i18n.js','/desk-ui.js','/lawbook.js','/land-intelligence.css','/auth.js','/portal.css','/interface.css','/citizen.js','/preserved.css','/data/features.json'];
  if(name==='/portal.html'){if(!platform.authenticate(req)){res.writeHead(302,{Location:'/login.html'}).end();return;}}
  else if(!allowed.includes(name)&&!/^\/assets\/[a-zA-Z0-9._-]+$/.test(name)){res.writeHead(404).end('Not found');return;}
  const file=path.resolve(root,'.'+name);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.stat(file,(err,stat)=>{if(err||!stat.isFile()){res.writeHead(404).end('Not found');return;}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','Content-Length':stat.size});fs.createReadStream(file).pipe(res);});
 });server.on('close',()=>platform.close());return {server,platform};
}
if(require.main===module){const {server}=createServer();server.listen(Number(process.env.PORT)||8080,'127.0.0.1',()=>console.log('e-Bhumi role platform: http://127.0.0.1:'+(process.env.PORT||8080)));}
module.exports={createServer,default:{createServer}};
