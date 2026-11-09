'use strict';

// ============================================================
//  serve.js  --  tiny static web server (Node.js, no packages)
//
//  Used by serve.bat when Python is not available.
//
//  Usage:  node serve.js "<site root>" [port]
// ============================================================

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(process.argv[2] || process.cwd());
const PORT = parseInt(process.argv[3] || '8000', 10);
const HOST = '127.0.0.1';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wasm': 'application/wasm',
};

function typeFor(file) {
  return TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Map a request URL to a file inside ROOT, or null if it escapes ROOT.
function resolveTarget(requestUrl) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(requestUrl, 'http://' + HOST).pathname);
  } catch (e) {
    return null;
  }
  const rel = pathname.replace(/^[/\\]+/, '');
  const full = path.resolve(ROOT, rel);
  if (full !== ROOT && !full.startsWith(ROOT + path.sep)) return null;
  return full;
}

function fail(res, status, message) {
  const body = '<!doctype html><meta charset="utf-8"><title>' + status + '</title>' +
    '<h1>' + status + '</h1><p>' + escapeHtml(message) + '</p>';
  res.writeHead(status, {
    'Content-Type': 'text/html; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function listing(dir, urlPath) {
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    return null;
  }
  entries = entries
    .filter((e) => !e.name.startsWith('.'))
    .sort((a, b) => (Number(b.isDirectory()) - Number(a.isDirectory())) || a.name.localeCompare(b.name, 'en'));

  const rows = entries.map((e) => {
    const isDir = e.isDirectory();
    const href = encodeURIComponent(e.name) + (isDir ? '/' : '');
    return '<li><a href="' + href + '">' + escapeHtml(e.name) + (isDir ? '/' : '') + '</a></li>';
  }).join('\n');

  const parent = urlPath === '/' ? '' :
    '<li><a href="../">../</a></li>\n';

  return '<!doctype html><meta charset="utf-8"><title>Index of ' + escapeHtml(urlPath) + '</title>' +
    '<style>body{font:14px/1.6 system-ui,sans-serif;padding:24px}' +
    'li{list-style:none}a{color:#1a4fa0;text-decoration:none}a:hover{text-decoration:underline}</style>' +
    '<h1>Index of ' + escapeHtml(urlPath) + '</h1><ul>' + parent + rows + '</ul>';
}

function serveFile(req, res, file) {
  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) return fail(res, 404, 'Not found');

    const headers = {
      'Content-Type': typeFor(file),
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-cache',
    };

    let start = 0;
    let end = stat.size - 1;
    let status = 200;

    const range = req.headers.range;
    if (range) {
      const m = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
      if (m && (m[1] || m[2])) {
        if (m[1]) {
          start = parseInt(m[1], 10);
          if (m[2]) end = Math.min(parseInt(m[2], 10), stat.size - 1);
        } else {
          start = Math.max(stat.size - parseInt(m[2], 10), 0);
        }
        if (start > end || start >= stat.size) {
          res.writeHead(416, { 'Content-Range': 'bytes */' + stat.size });
          return res.end();
        }
        status = 206;
        headers['Content-Range'] = 'bytes ' + start + '-' + end + '/' + stat.size;
      }
    }

    headers['Content-Length'] = end - start + 1;
    res.writeHead(status, headers);

    if (req.method === 'HEAD') return res.end();

    const stream = fs.createReadStream(file, { start, end });
    stream.on('error', () => res.destroy());
    stream.pipe(res);
  });
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    return res.end('Method Not Allowed');
  }

  const target = resolveTarget(req.url);
  if (!target) return fail(res, 400, 'Bad request');

  const urlPath = decodeURIComponent(new URL(req.url, 'http://' + HOST).pathname);

  fs.stat(target, (err, stat) => {
    if (err) {
      console.log('404 ' + req.method + ' ' + urlPath);
      return fail(res, 404, 'Not found: ' + urlPath);
    }

    if (stat.isDirectory()) {
      const index = path.join(target, 'index.html');
      if (fs.existsSync(index) && fs.statSync(index).isFile()) {
        console.log('200 ' + req.method + ' ' + urlPath + ' -> index.html');
        return serveFile(req, res, index);
      }
      const page = listing(target, urlPath);
      if (!page) return fail(res, 403, 'Cannot list this folder');
      console.log('200 ' + req.method + ' ' + urlPath + ' (listing)');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(page);
    }

    console.log('200 ' + req.method + ' ' + urlPath);
    serveFile(req, res, target);
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('');
    console.error('  Port ' + PORT + ' is already in use.');
    console.error('  Run stop-server.bat first, or close the other server window.');
    console.error('');
  } else {
    console.error('  Server error: ' + err.message);
  }
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log('');
  console.log('  Node.js static server');
  console.log('  Root : ' + ROOT);
  console.log('  URL  : http://' + HOST + ':' + PORT + '/index.html');
  console.log('');
});
