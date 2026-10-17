'use strict';
const path = require('node:path');
const serverMod = require('./e-Bhumi-Frontend/server-v4.cjs');
const createServer = serverMod.createServer || serverMod?.default?.createServer || (typeof serverMod === 'function' ? serverMod : null);

let appInstance = null;
function getApp() {
  if (!appInstance) {
    appInstance = createServer({
      dataDir: process.env.VERCEL ? path.join('/tmp', '.data') : undefined
    });
  }
  return appInstance;
}

if (require.main === module) {
  const { server } = getApp();
  const PORT = Number(process.env.PORT) || 8080;
  server.listen(PORT, '127.0.0.1', () => {
    console.log('e-Bhumi running at http://127.0.0.1:' + PORT);
    console.log('  Landing Page:      http://127.0.0.1:' + PORT + '/');
    console.log('  Citizen Workspace: http://127.0.0.1:' + PORT + '/workspace.html#dashboard');
    console.log('  Role Portals:      http://127.0.0.1:' + PORT + '/login.html');
  });
}

module.exports = (req, res) => {
  const { server } = getApp();
  server.emit('request', req, res);
};
