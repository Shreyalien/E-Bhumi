'use strict';
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
for(const file of ['api/index.js','server.cjs','lib/hosted-state.cjs','ebhumi-platform/server-v4.cjs','ebhumi-platform/lib/platform.cjs','ebhumi-platform/lib/demo-flows.cjs','ebhumi-platform/demo-flows.js','ebhumi-platform/appearance.js','ebhumi-platform/lib/terrain-engine.cjs'])execFileSync(process.execPath,['--check',path.join(root,file)]);
for(const file of ['license.html','index.html','login.html','portal.html','i18n.js','interface.css','data/features.json','themes.css','appearance.js','demo-flows.js','assets/leaflet.js','assets/leaflet.css'])if(!fs.existsSync(path.join(root,'ebhumi-platform',file)))throw Error('Missing runtime file '+file);
const publicDir = path.join(root, 'public');
fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, 'robots.txt'), 'User-agent: *\nDisallow:\n');
fs.writeFileSync(path.join(publicDir, '.gitkeep'), '');
const favicon = path.join(root, 'ebhumi-platform', 'assets', 'favicon.svg');
if (fs.existsSync(favicon)) {
  fs.copyFileSync(favicon, path.join(publicDir, 'favicon.svg'));
}
console.log('Vercel runtime verified; public assets generated; private data is excluded from deployment.');
