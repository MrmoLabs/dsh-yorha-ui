import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const files = new Map([
  ['/docs/motion-preview.html', { path: join(root, 'docs', 'motion-preview.html'), type: 'text/html; charset=utf-8' }],
  ['/dist/client.js', { path: join(root, 'dist', 'client.js'), type: 'text/javascript; charset=utf-8' }],
]);

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://127.0.0.1').pathname;
  const file = files.get(pathname === '/' ? '/docs/motion-preview.html' : pathname);
  if (!file || request.method !== 'GET') {
    response.writeHead(404).end();
    return;
  }

  try {
    const content = await readFile(file.path);
    response.writeHead(200, { 'Content-Type': file.type, 'Cache-Control': 'no-store' }).end(content);
  } catch {
    response.writeHead(500).end('Preview file unavailable. Run node scripts/build.mjs first.');
  }
});

server.listen(4173, '127.0.0.1', () => {
  console.log('Motion preview: http://127.0.0.1:4173/');
});
