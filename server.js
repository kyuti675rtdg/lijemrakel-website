const http = require('http');
const https = require('https');
const { parse } = require('url');
const next = require('next');

// Force 0.0.0.0 so Podman's container-ID HOSTNAME env var does not block 127.0.0.1 healthchecks
process.env.HOSTNAME = '0.0.0.0';
const dev = false;
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer(async (req, res) => {
    try {
      // Fast healthcheck response for cPanel / Podman probes
      if (req.url === '/api/health') {
        const body = JSON.stringify({
          ok: true,
          status: 'healthy',
          uptime: Math.round(process.uptime()),
        });
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store',
          'Content-Length': Buffer.byteLength(body),
        });
        res.end(req.method === 'HEAD' ? undefined : body);
        return;
      }

      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  });

  server.listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port} (PID ${process.pid})`);

    // Keep rootless Podman (pasta) loopback and LiteSpeed reverse proxy warm every 45s
    // so cPanel's 5-minute watchdog never marks the idle tunnel as wedged.
    const keepAlive = setInterval(() => {
      try {
        const localReq = http.request(
          {
            hostname: '127.0.0.1',
            port,
            path: '/api/health',
            method: 'GET',
            timeout: 4000,
          },
          (res) => res.resume()
        );
        localReq.on('error', () => {});
        localReq.on('timeout', () => localReq.destroy());
        localReq.end();
      } catch {}

      try {
        const directReq = https.request(
          {
            host: process.env.HOST_PUBLIC_IP || '37.26.105.28',
            port: 443,
            path: '/api/health',
            method: 'HEAD',
            servername: 'lijemrakel.com',
            rejectUnauthorized: false,
            timeout: 5000,
            headers: {
              Host: 'lijemrakel.com',
              'User-Agent': 'Lijemrakel-KeepAlive/1.0',
            },
          },
          (res) => res.resume()
        );
        directReq.on('error', () => {});
        directReq.on('timeout', () => directReq.destroy());
        directReq.end();
      } catch {}
    }, 45000);
    keepAlive.unref();
  });
});
