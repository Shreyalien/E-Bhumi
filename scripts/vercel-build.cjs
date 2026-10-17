'use strict';
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
for(const file of fs.readdirSync(path.join(root,'ebhumi-platform')).filter(name=>name.endsWith('.js')))execFileSync(process.execPath,['--check',path.join(root,'ebhumi-platform',file)]);
for(const file of ['api/index.js','server.cjs','lib/hosted-state.cjs','ebhumi-platform/server-v4.cjs','ebhumi-platform/lib/platform.cjs','ebhumi-platform/lib/terrain-engine.cjs','ebhumi-platform/hill-terrain.js'])execFileSync(process.execPath,['--check',path.join(root,file)]);
for(const file of ['index.html','login.html','portal.html','i18n.js','interface.css','data/features.json','assets/leaflet.js','assets/leaflet.css','assets/favicon.svg','assets/gsap.min.js','lib/research-2026-10-18.json'])if(!fs.existsSync(path.join(root,'ebhumi-platform',file)))throw Error('Missing runtime file '+file);
fs.mkdirSync(path.join(root,'public'),{recursive:true});
console.log('Vercel runtime verified; private data is excluded from deployment.');
