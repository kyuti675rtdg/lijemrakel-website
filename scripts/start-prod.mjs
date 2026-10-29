import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const rootDir = process.cwd();
const dataDir = path.join(rootDir, 'data');
const uploadsDir = path.join(rootDir, 'public', 'uploads');
const dbFile = path.join(dataDir, 'production-db.json');
const logFile = path.join(dataDir, 'supervisor.log');

function ensureDir(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch {
    // ignore
  }
}

ensureDir(dataDir);
ensureDir(uploadsDir);

const restoreDbFile = path.join(dataDir, 'production-db.restore.json');
const bakDbFile = path.join(dataDir, 'production-db.json.bak');

function logEvent(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  process.stdout.write(line);
  try {
    fs.appendFileSync(logFile, line, 'utf8');
  } catch {
    // ignore
  }
}

// Restore production database snapshot if queued before startup
if (fs.existsSync(restoreDbFile)) {
  try {
    const stat = fs.statSync(restoreDbFile);
    if (stat.size > 64) {
      fs.copyFileSync(restoreDbFile, dbFile);
      fs.copyFileSync(restoreDbFile, bakDbFile);
      fs.unlinkSync(restoreDbFile);
      logEvent(`Restored production database (${stat.size} bytes) from production-db.restore.json`);
    }
  } catch (err) {
    logEvent(`Warning restoring production DB: ${err?.message || err}`);
  }
}

/**
 * Safely unlinks a symlink without touching its target directory.
 */
function unlinkIfSymlink(targetPath) {
  try {
    const stat = fs.lstatSync(targetPath);
    if (stat.isSymbolicLink()) {
      fs.unlinkSync(targetPath);
      logEvent(`Removed legacy symlink ${targetPath}`);
    }
  } catch {
    // targetPath does not exist
  }
}

/**
 * Copies static assets into .next/standalone without creating symlinks.
 * Avoids symlinks inside .next/ so `next build` cleanup never traverses into /app/data or /app/public.
 */
function syncStandaloneDir(sourcePath, targetPath) {
  try {
    if (!fs.existsSync(sourcePath)) return;
    unlinkIfSymlink(targetPath);
    ensureDir(path.dirname(targetPath));
    fs.cpSync(sourcePath, targetPath, { recursive: true, force: true });
    logEvent(`Synced ${sourcePath} -> ${targetPath}`);
  } catch (err) {
    logEvent(`Warning syncing ${sourcePath}: ${err?.message || err}`);
  }
}

const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
};

function getDbMtimeMs() {
  try {
    return fs.statSync(dbFile).mtimeMs;
  } catch {
    return 0;
  }
}

let homePageCache = null;
let homeCacheRefreshing = false;
let activePort = parseInt(process.env.PORT || '3000', 10) || 3000;

function refreshHomePageCache(port) {
  if (homeCacheRefreshing) return;
  homeCacheRefreshing = true;
  const targetMtime = getDbMtimeMs();

  const req = http.request(
    {
      hostname: '127.0.0.1',
      port,
      path: '/',
      method: 'GET',
      timeout: 8000,
      headers: {
        'Accept': 'text/html',
        'Accept-Encoding': 'identity',
        'x-internal-cache-fill': '1',
      },
    },
    (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        homeCacheRefreshing = false;
        if (res.statusCode === 200 && chunks.length > 0) {
          const body = Buffer.concat(chunks);
          if (body.length > 512) {
            homePageCache = {
              mtimeMs: getDbMtimeMs() || targetMtime,
              body,
            };
          }
        }
      });
    }
  );

  req.on('error', () => {
    homeCacheRefreshing = false;
  });
  req.on('timeout', () => {
    req.destroy();
    homeCacheRefreshing = false;
  });
  req.end();
}

// Lock persistent paths in environment before Next.js standalone changes cwd
process.env.NODE_ENV = 'production';
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.APP_ROOT_DIR = rootDir;
process.env.DATA_DIR = dataDir;
process.env.UPLOADS_DIR = uploadsDir;
// Force 0.0.0.0 (Podman pre-populates HOSTNAME with container ID, which binds only one IP)
process.env.HOSTNAME = '0.0.0.0';
process.env.PORT = process.env.PORT || '3000';

const standaloneDir = path.join(rootDir, '.next', 'standalone');
const standaloneServer = path.join(standaloneDir, 'server.js');

if (fs.existsSync(standaloneServer)) {
  unlinkIfSymlink(path.join(standaloneDir, 'data'));
  syncStandaloneDir(path.join(rootDir, 'public'), path.join(standaloneDir, 'public'));
  syncStandaloneDir(
    path.join(rootDir, '.next', 'static'),
    path.join(standaloneDir, '.next', 'static')
  );
}

// Intercept http.createServer in-process so we run a single Node process
// with <1ms healthcheck responses, direct /uploads/* streaming, and dual-stack binding.
const cjsHttp = require('http');
const originalCreateServer = cjsHttp.createServer.bind(cjsHttp);
let activeHttpServer = null;

const patchedCreateServer = function patchedCreateServer(optionsOrListener, maybeListener) {
  const hasOptions = typeof optionsOrListener === 'object' && optionsOrListener !== null;
  const originalListener = hasOptions ? maybeListener : optionsOrListener;

  const wrappedListener = (req, res) => {
    try {
      const rawUrl = req.url || '/';
      const qIndex = rawUrl.indexOf('?');
      const urlPath = qIndex >= 0 ? rawUrl.slice(0, qIndex) : rawUrl;
      const method = req.method || 'GET';

      // 1. Dedicated fast healthcheck endpoint
      if (urlPath === '/api/health') {
        const payload = JSON.stringify({
          ok: true,
          status: 'healthy',
          uptime: Math.round(process.uptime()),
        });
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store',
          'Content-Length': Buffer.byteLength(payload),
        });
        res.end(method === 'HEAD' ? undefined : payload);
        return;
      }

      // 2. Direct persistent /uploads/* serving (prevents standalone 404s on new uploads)
      if ((method === 'GET' || method === 'HEAD') && urlPath.startsWith('/uploads/')) {
        const relPath = decodeURIComponent(urlPath.slice('/uploads/'.length));
        const resolvedFile = path.resolve(uploadsDir, relPath);
        if (
          resolvedFile.startsWith(uploadsDir + path.sep) &&
          fs.existsSync(resolvedFile)
        ) {
          const stat = fs.statSync(resolvedFile);
          if (stat.isFile()) {
            const ext = path.extname(resolvedFile).toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';
            res.writeHead(200, {
              'Content-Type': contentType,
              'Content-Length': stat.size,
              'Cache-Control': 'public, max-age=31536000, immutable',
              'X-Content-Type-Options': 'nosniff',
            });
            if (method === 'HEAD') {
              res.end();
            } else {
              fs.createReadStream(resolvedFile).pipe(res);
            }
            return;
          }
        }
      }

      // 3. Sub-millisecond mtime-verified HTML cache for `/` (prevents SSR/GC probe timeouts)
      if (
        (method === 'GET' || method === 'HEAD') &&
        urlPath === '/' &&
        !req.headers['x-internal-cache-fill'] &&
        !req.headers['rsc'] &&
        !req.headers['next-router-state-tree'] &&
        !rawUrl.includes('_rsc=')
      ) {
        const currentMtime = getDbMtimeMs();
        if (homePageCache && homePageCache.mtimeMs === currentMtime) {
          res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate',
            'X-Content-Type-Options': 'nosniff',
            'Content-Length': homePageCache.body.length,
          });
          res.end(method === 'HEAD' ? undefined : homePageCache.body);
          return;
        }
        if (method === 'HEAD') {
          res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'private, no-cache, no-store, max-age=0, must-revalidate',
          });
          res.end();
          setImmediate(() => refreshHomePageCache(activePort));
          return;
        }
        res.once('finish', () => {
          setImmediate(() => refreshHomePageCache(activePort));
        });
      }
    } catch {
      // Fall through to Next.js handler on any wrapper error
    }

    return originalListener(req, res);
  };

  const server = hasOptions
    ? originalCreateServer(optionsOrListener, wrappedListener)
    : originalCreateServer(wrappedListener);

  activeHttpServer = server;

  const originalListen = server.listen.bind(server);
  server.listen = function patchedListen(...args) {
    // Ensure wildcard 0.0.0.0 binding on TCP port so both 127.0.0.1 loopback and container eth0 work
    if (
      typeof args[0] === 'number' &&
      typeof args[1] === 'string' &&
      !process.env.PASSENGER_APP_ENV
    ) {
      args[1] = '0.0.0.0';
    }
    return originalListen(...args);
  };

  server.once('listening', () => {
    const addr = server.address();
    if (addr && typeof addr === 'object' && addr.port) {
      activePort = addr.port;
    }
    logEvent(
      `Next.js production server listening on ${JSON.stringify(addr)} (PID ${process.pid})`
    );
    // Warm up homepage cache immediately after bind
    setTimeout(() => refreshHomePageCache(activePort), 150);

    // Keep container loopback & reverse-proxy path warm every 45s
    const keepAliveTimer = setInterval(() => {
      if (!homePageCache || homePageCache.mtimeMs !== getDbMtimeMs()) {
        refreshHomePageCache(activePort);
      }

      // 1. Direct IP HTTPS ping to LiteSpeed on host (bypasses container DNS EAI_AGAIN)
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
          (res) => {
            res.resume();
          }
        );
        directReq.on('error', () => {});
        directReq.on('timeout', () => directReq.destroy());
        directReq.end();
      } catch {
        // ignore
      }

      // 2. Hostname-based HTTPS ping fallback
      const publicUrl = (
        process.env.APP_URL ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        ''
      ).trim();
      if (publicUrl.startsWith('https://')) {
        try {
          const pingUrl = new URL('/api/health', publicUrl);
          const pingReq = https.request(
            pingUrl,
            {
              method: 'HEAD',
              rejectUnauthorized: false,
              timeout: 5000,
              headers: { 'User-Agent': 'Lijemrakel-KeepAlive/1.0' },
            },
            (pingRes) => {
              pingRes.resume();
            }
          );
          pingReq.on('error', () => {});
          pingReq.on('timeout', () => pingReq.destroy());
          pingReq.end();
        } catch {
          // ignore
        }
      }
    }, 45000);
    keepAliveTimer.unref();
  });

  return server;
};

cjsHttp.createServer = patchedCreateServer;
http.createServer = patchedCreateServer;

let shuttingDown = false;
function handleShutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  logEvent(`Received ${signal}, shutting down gracefully...`);
  if (activeHttpServer) {
    activeHttpServer.close(() => {
      process.exit(0);
    });
    setTimeout(() => process.exit(0), 5000).unref();
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

if (fs.existsSync(standaloneServer)) {
  logEvent(`Starting Next.js standalone server in-process on port ${process.env.PORT}`);
  require(standaloneServer);
} else {
  logEvent(`Standalone build not found; starting via next start on port ${process.env.PORT}`);
  const { nextStart } = require('next/dist/cli/next-start');
  nextStart(
    {
      port: parseInt(process.env.PORT || '3000', 10),
      hostname: '0.0.0.0',
    },
    rootDir
  );
}
