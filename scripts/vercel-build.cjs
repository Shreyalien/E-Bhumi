'use strict';
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
for(const file of ['api/index.js','server.cjs','lib/hosted-state.cjs','ebhumi-platform/server-v4.cjs','ebhumi-platform/lib/platform.cjs'])execFileSync(process.execPath,['--check',path.join(root,file)]);
for(const file of ['index.html','login.html','portal.html','i18n.js','interface.css','data/features.json'])if(!fs.existsSync(path.join(root,'ebhumi-platform',file)))throw Error('Missing runtime file '+file);
fs.mkdirSync(path.join(root,'public'),{recursive:true});
console.log('Vercel runtime verified; private data is excluded from deployment.');
