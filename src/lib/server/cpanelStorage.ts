import { execFileSync } from 'child_process';
import fs from 'fs';
import https from 'https';

const CPANEL_HOST = process.env.CPANEL_STORAGE_HOST || '37.26.105.28';
const CPANEL_USER = process.env.CPANEL_USER || 'lijemriy';
const CPANEL_API_TOKEN =
  process.env.CPANEL_API_TOKEN || '2LXD91N9KBVRVC8HTGDRSMOI768AFG5Y';
const STORAGE_SECRET =
  process.env.AUTH_SECRET ||
  'f4c9a87e2b910d35e671284a9b3d5c0182ef93471092ab34cd56ef7890123456';

let lastRemoteCheckMs = 0;
let lastRemoteMtimeSec = 0;

/**
 * Synchronously checks and pulls the latest `production-db.json` from the
 * cPanel storage bridge (`/home/lijemriy/cpanel-storage/production-db.json`)
 * into `localDbPath` when running on Vercel or when local storage is `/tmp`.
 */
export function pullRemoteDbIfNeeded(localDbPath: string, force = false): void {
  const now = Date.now();
  if (!force && lastRemoteCheckMs > 0 && now - lastRemoteCheckMs < 4000) {
    return;
  }
  lastRemoteCheckMs = now;

  const inlineScript = `
    const fs = require('fs');
    const https = require('https');
    const req = https.request({
      host: ${JSON.stringify(CPANEL_HOST)},
      port: 443,
      path: '/storage-bridge.php?action=read_db&since_mtime=' + ${lastRemoteMtimeSec},
      method: 'GET',
      servername: 'lijemrakel.com',
      rejectUnauthorized: false,
      timeout: 3500,
      headers: {
        Host: 'lijemrakel.com',
        'X-Storage-Secret': ${JSON.stringify(STORAGE_SECRET)}
      }
    }, (res) => {
      const mtime = res.headers['x-db-mtime'] || '0';
      if (res.statusCode === 304) {
        process.stdout.write('304:' + mtime);
        process.exit(0);
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        if (res.statusCode === 200) {
          const buf = Buffer.concat(chunks);
          if (buf.length > 64) {
            fs.writeFileSync(${JSON.stringify(localDbPath)}, buf);
            process.stdout.write('200:' + mtime);
            process.exit(0);
          }
        }
        process.exit(1);
      });
    });
    req.on('error', () => process.exit(1));
    req.on('timeout', () => { req.destroy(); process.exit(1); });
    req.end();
  `;

  try {
    const out = execFileSync(process.execPath, ['-e', inlineScript], {
      timeout: 4000,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const parts = out.trim().split(':');
    const mtimeNum = parseInt(parts[1] || '0', 10);
    if (!Number.isNaN(mtimeNum) && mtimeNum > 0) {
      lastRemoteMtimeSec = mtimeNum;
    }
  } catch {
    // Fallback to existing local / bundled DB if cPanel is temporarily unreachable
  }
}

/**
 * Synchronously pushes `production-db.json` to `/home/lijemriy/cpanel-storage/production-db.json`
 * on the cPanel server so every admin edit, inquiry, or user update is permanently persisted.
 */
export function pushRemoteDbSync(localDbPath: string): void {
  if (!fs.existsSync(localDbPath)) return;

  const inlineScript = `
    const fs = require('fs');
    const https = require('https');
    const fileBuf = fs.readFileSync(${JSON.stringify(localDbPath)});

    function uploadToCpanel(fileName) {
      return new Promise((resolve) => {
        const boundary = '----Boundary' + Date.now() + Math.random().toString(16).slice(2);
        const header = Buffer.from(
          '--' + boundary + '\\r\\n' +
          'Content-Disposition: form-data; name="dir"\\r\\n\\r\\n' +
          '/home/lijemriy/cpanel-storage\\r\\n' +
          '--' + boundary + '\\r\\n' +
          'Content-Disposition: form-data; name="overwrite"\\r\\n\\r\\n1\\r\\n' +
          '--' + boundary + '\\r\\n' +
          'Content-Disposition: form-data; name="file-1"; filename="' + fileName + '"\\r\\n' +
          'Content-Type: application/octet-stream\\r\\n\\r\\n'
        );
        const footer = Buffer.from('\\r\\n--' + boundary + '--\\r\\n');
        const body = Buffer.concat([header, fileBuf, footer]);

        const req = https.request({
          host: ${JSON.stringify(CPANEL_HOST)},
          port: 2083,
          path: '/execute/Fileman/upload_files',
          method: 'POST',
          servername: 'vesper.hostns.io',
          rejectUnauthorized: false,
          timeout: 6000,
          headers: {
            Authorization: 'cpanel ' + ${JSON.stringify(CPANEL_USER)} + ':' + ${JSON.stringify(CPANEL_API_TOKEN)},
            'Content-Type': 'multipart/form-data; boundary=' + boundary,
            'Content-Length': body.length
          }
        }, (res) => {
          res.resume();
          res.on('end', () => resolve(res.statusCode === 200));
        });
        req.on('error', () => resolve(false));
        req.on('timeout', () => { req.destroy(); resolve(false); });
        req.write(body);
        req.end();
      });
    }

    (async () => {
      await uploadToCpanel('production-db.json');
      await uploadToCpanel('production-db.json.bak');
    })();
  `;

  try {
    execFileSync(process.execPath, ['-e', inlineScript], {
      timeout: 8000,
      stdio: 'ignore',
    });
    lastRemoteCheckMs = Date.now();
    lastRemoteMtimeSec = Math.floor(Date.now() / 1000);
  } catch {
    // Ignore remote push failure; local copy remains intact
  }
}

/**
 * Uploads an image/media buffer directly to `/home/lijemriy/public_html/uploads/<fileName>`
 * on the cPanel server and returns true on success.
 */
export function uploadMediaToCpanel(
  fileName: string,
  buffer: Buffer
): Promise<boolean> {
  return new Promise((resolve) => {
    const boundary =
      '----Boundary' + Date.now() + Math.random().toString(16).slice(2);
    const header = Buffer.from(
      '--' +
        boundary +
        '\r\n' +
        'Content-Disposition: form-data; name="dir"\r\n\r\n' +
        '/home/lijemriy/public_html/uploads\r\n' +
        '--' +
        boundary +
        '\r\n' +
        'Content-Disposition: form-data; name="overwrite"\r\n\r\n1\r\n' +
        '--' +
        boundary +
        '\r\n' +
        'Content-Disposition: form-data; name="file-1"; filename="' +
        fileName +
        '"\r\n' +
        'Content-Type: application/octet-stream\r\n\r\n'
    );
    const footer = Buffer.from('\r\n--' + boundary + '--\r\n');
    const body = Buffer.concat([header, buffer, footer]);

    const req = https.request(
      {
        host: CPANEL_HOST,
        port: 2083,
        path: '/execute/Fileman/upload_files',
        method: 'POST',
        servername: 'vesper.hostns.io',
        rejectUnauthorized: false,
        timeout: 12000,
        headers: {
          Authorization: `cpanel ${CPANEL_USER}:${CPANEL_API_TOKEN}`,
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': body.length,
        },
      },
      (res) => {
        let resp = '';
        res.on('data', (c) => (resp += c));
        res.on('end', () => {
          resolve(res.statusCode === 200 && resp.includes('"succeeded":1'));
        });
      }
    );
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.write(body);
    req.end();
  });
}

/**
 * Fetches an uploaded file from `/home/lijemriy/public_html/uploads/<fileName>`
 * on the cPanel server over HTTPS so Vercel can serve and CDN-cache newly uploaded images.
 */
export function fetchUploadedMediaFromCpanel(
  fileName: string
): Promise<{ status: number; contentType: string; buffer: Buffer }> {
  return new Promise((resolve) => {
    const safeName = encodeURIComponent(fileName);
    const req = https.request(
      {
        host: CPANEL_HOST,
        port: 443,
        path: `/uploads/${safeName}`,
        method: 'GET',
        servername: 'lijemrakel.com',
        rejectUnauthorized: false,
        timeout: 8000,
        headers: {
          Host: 'lijemrakel.com',
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(Buffer.from(c)));
        res.on('end', () => {
          resolve({
            status: res.statusCode || 404,
            contentType:
              (res.headers['content-type'] as string) || 'application/octet-stream',
            buffer: Buffer.concat(chunks),
          });
        });
      }
    );
    req.on('error', () =>
      resolve({
        status: 404,
        contentType: 'text/plain',
        buffer: Buffer.alloc(0),
      })
    );
    req.on('timeout', () => {
      req.destroy();
      resolve({
        status: 504,
        contentType: 'text/plain',
        buffer: Buffer.alloc(0),
      });
    });
    req.end();
  });
}

