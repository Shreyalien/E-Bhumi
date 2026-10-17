'use strict';
const {Writable,Readable}=require('node:stream');
const {createServer}=require('../e-Bhumi-Frontend/server-v4.cjs');

class BufferedResponse extends Writable{
 constructor(){super();this.statusCode=200;this.headers={};this.chunks=[];this.done=new Promise((resolve,reject)=>{this.once('finish',()=>resolve({status:this.statusCode,headers:this.headers,body:Buffer.concat(this.chunks)}));this.once('error',reject);});}
 setHeader(name,value){this.headers[name.toLowerCase()]=value;return this;}
 getHeader(name){return this.headers[name.toLowerCase()];}
 writeHead(status,headers={}){this.statusCode=status;for(const [k,v]of Object.entries(headers))this.setHeader(k,v);return this;}
 _write(chunk,encoding,callback){this.chunks.push(Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk,encoding));callback();}
}
function blobStore(){
 const {get,put,BlobPreconditionFailedError}=require('@vercel/blob');
 const environment=process.env.VERCEL_ENV==='production'?'production':'preview';
 const pathname='ebhumi/state-v1/'+environment+'.json';
 return {
  // Compression changes the download ETag to a weak validator, which cannot
  // be used for conditional writes. Read the identity representation instead.
  async read(){const result=await get(pathname,{access:'private',useCache:false,headers:{'Accept-Encoding':'identity'},abortSignal:AbortSignal.timeout(12000)});if(!result)return {state:null,etag:null};return {state:JSON.parse(await new Response(result.stream).text()),etag:result.blob.etag};},
  async write(state,etag){try{return await put(pathname,JSON.stringify(state),{access:'private',contentType:'application/json',addRandomSuffix:false,allowOverwrite:Boolean(etag),...(etag?{ifMatch:etag}:{}),cacheControlMaxAge:60,abortSignal:AbortSignal.timeout(12000)});}catch(e){if(e instanceof BlobPreconditionFailedError||/already exists/i.test(e.message))throw Object.assign(new Error('Shared state changed'),{conflict:true});throw e;}}
 };
}
async function readBody(req){const chunks=[];let size=0;for await(const chunk of req){const bytes=Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk);size+=bytes.length;if(size>3*1024*1024)throw Object.assign(new Error('Request too large'),{status:413});chunks.push(bytes);}return Buffer.concat(chunks);}
function createHostedHandler({store,seedDemo=true,maxRetries=8}={}){
 let publicApp;
 return async(req,res)=>{
  const rawPath=String(req.url||'/').split('?')[0];
  const protectedPage=rawPath==='/workspace.html'||rawPath==='/portal.html'||rawPath.startsWith('/portal/');
  const needsShared=protectedPage||(rawPath.startsWith('/api/')&&rawPath!=='/api/catalog');
  if(!needsShared){publicApp=publicApp||createServer({memoryOnly:true,seedDemo:false});publicApp.server.emit('request',req,res);return;}
  try{
   if(!store&&!process.env.BLOB_READ_WRITE_TOKEN)throw new Error('Private storage not configured');
   const shared=store||blobStore(),body=await readBody(req);
   for(let attempt=0;attempt<maxRetries;attempt++){
    const previous=await shared.read(),state=previous.state;
    const app=createServer({memoryOnly:true,seedDemo,initialState:state?.db,sessionState:state?.sessions,attemptState:state?.attempts});
    let reply,next;
    try{const replay=Readable.from(body.length?[body]:[]);Object.assign(replay,{method:req.method,url:req.url,headers:req.headers,socket:req.socket});const buffered=new BufferedResponse();app.server.emit('request',replay,buffered);reply=await buffered.done;next=app.platform.snapshot();}finally{app.platform.close();}
    // Do not release a success/cookie until the database and session commit together.
    if(JSON.stringify(state)!==JSON.stringify(next)){
     try{await shared.write(next,previous.etag);}catch(e){if(e.conflict)continue;throw e;}
    }
    res.writeHead(reply.status,reply.headers);res.end(reply.body);return;
   }
   res.writeHead(503,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Retry-After':'1'});res.end(JSON.stringify({error:'Shared storage is busy. Please retry.'}));
  }catch(e){console.error('Hosted state failure:',e.name);res.writeHead(e.status||503,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Retry-After':'1'});res.end(JSON.stringify({error:e.status?e.message:'Shared storage is unavailable. Please retry.'}));}
 };
}
module.exports={createHostedHandler,BufferedResponse};
