const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = 8080;
const HOST = '127.0.0.1';
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.cjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, `http://${HOST}:${PORT}`).pathname);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain' }).end('Bad Request');
    return;
  }

  if (pathname === '/' || pathname === '') pathname = '/index.html';
  const filePath = path.resolve(ROOT, '.' + pathname);

  if (!filePath.startsWith(ROOT + path.sep) && filePath !== ROOT) {
    res.writeHead(403, { 'Content-Type': 'text/plain' }).end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
      'Content-Length': stat.size
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`e-Bhumi Frontend running at http://${HOST}:${PORT}`);
  console.log(`  Landing Page: http://${HOST}:${PORT}/`);
  console.log(`  Workspace:    http://${HOST}:${PORT}/workspace.html#dashboard`);
});
