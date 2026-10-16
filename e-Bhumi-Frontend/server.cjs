'use strict';
const {createServer}=require('./server-v4.cjs');
const {server}=createServer();
const PORT = Number(process.env.PORT)||8080;
server.listen(PORT,'127.0.0.1',()=>{
  console.log('e-Bhumi running at http://127.0.0.1:' + PORT);
  console.log('  Landing Page:      http://127.0.0.1:' + PORT + '/');
  console.log('  Citizen Workspace: http://127.0.0.1:' + PORT + '/workspace.html#dashboard');
  console.log('  Role Portals:      http://127.0.0.1:' + PORT + '/login.html');
});
