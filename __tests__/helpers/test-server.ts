import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

let server: any;
let app: any;

export async function startTestServer() {
  if (server) return server;

  app = next({ dev: false, dir: process.cwd() });
  const handle = app.getRequestHandler();

  await app.prepare();

  server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  await new Promise<void>((resolve) => {
    server.listen(0, () => resolve());
  });

  return server;
}

export function getTestServerUrl() {
  if (!server) throw new Error('Server not started');
  const address = server.address();
  return `http://localhost:${address.port}`;
}

export async function stopTestServer() {
  if (server) {
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
    server = null;
  }
  if (app) {
    await app.close();
    app = null;
  }
}
