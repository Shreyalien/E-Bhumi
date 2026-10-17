'use strict';
function validHost(value){return typeof value==='string'&&/^(?:localhost|127\.0\.0\.1|[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?)(?::\d{1,5})?$/i.test(value);}
function allowedHost(host,hosted=Boolean(process.env.VERCEL)){return validHost(host)&&(hosted||/^(127\.0\.0\.1|localhost)(:\d+)?$/i.test(host));}
function requestOrigin(req,hosted=Boolean(process.env.VERCEL)){const host=req.headers.host;if(!allowedHost(host,hosted))return null;return (hosted?'https':'http')+'://'+host;}
module.exports={allowedHost,requestOrigin};
