'use strict';
const {createServer}=require('./server-v4.cjs');
const {server}=createServer();
server.listen(Number(process.env.PORT)||8080,'127.0.0.1',()=>console.log('e-Bhumi: http://127.0.0.1:'+(process.env.PORT||8080)));
