'use strict';
const path = require('node:path');
const { createServer } = require('../e-Bhumi-Frontend/server-v4.cjs');

let appInstance = null;
function getApp() {
  if (!appInstance) {
    appInstance = createServer({
      dataDir: process.env.VERCEL ? path.join('/tmp', '.data') : undefined
    });
  }
  return appInstance;
}

module.exports = (req, res) => {
  const { server } = getApp();
  server.emit('request', req, res);
};
