import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const dataDir = path.join(rootDir, 'data');
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

function logEvent(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  process.stdout.write(line);
  try {
    fs.appendFileSync(logFile, line, 'utf8');
  } catch {
    // ignore
  }
}

function ensureLinkOrCopy(sourcePath, targetPath) {
  try {
    if (!fs.existsSync(sourcePath)) return;
    try {
      const stat = fs.lstatSync(targetPath);
      if (stat.isSymbolicLink() || stat.isDirectory() || stat.isFile()) {
        fs.rmSync(targetPath, { recursive: true, force: true });
      }
    } catch {
      // target does not exist yet
    }
    ensureDir(path.dirname(targetPath));
    try {
      fs.symlinkSync(sourcePath, targetPath, 'dir');
      logEvent(`Linked ${targetPath} -> ${sourcePath}`);
    } catch {
      fs.cpSync(sourcePath, targetPath, { recursive: true, force: true });
      logEvent(`Copied ${sourcePath} -> ${targetPath}`);
    }
  } catch (err) {
    logEvent(`Warning linking ${sourcePath}: ${err?.message || err}`);
  }
}

const standaloneDir = path.join(rootDir, '.next', 'standalone');
const standaloneServer = path.join(standaloneDir, 'server.js');

if (fs.existsSync(standaloneServer)) {
  ensureLinkOrCopy(path.join(rootDir, 'public'), path.join(standaloneDir, 'public'));
  ensureLinkOrCopy(path.join(rootDir, '.next', 'static'), path.join(standaloneDir, '.next', 'static'));
  ensureLinkOrCopy(dataDir, path.join(standaloneDir, 'data'));
}

let shuttingDown = false;
let childProc = null;

function startWorker() {
  if (shuttingDown) return;

  const useStandalone = fs.existsSync(standaloneServer);
  const args = useStandalone
    ? ['--max-old-space-size=200', standaloneServer]
    : [
        '--max-old-space-size=200',
        path.join(rootDir, 'node_modules', 'next', 'dist', 'bin', 'next'),
        'start',
        '-H',
        '0.0.0.0',
        '-p',
        process.env.PORT || '3000',
      ];

  logEvent(
    `Starting Next.js worker (${useStandalone ? 'standalone' : 'next-start'}) on 0.0.0.0:${process.env.PORT || '3000'}`
  );

  childProc = spawn(process.execPath, args, {
    cwd: rootDir,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      HOSTNAME: '0.0.0.0',
      PORT: process.env.PORT || '3000',
      NEXT_TELEMETRY_DISABLED: '1',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  childProc.stdout.on('data', (chunk) => {
    process.stdout.write(chunk);
  });

  childProc.stderr.on('data', (chunk) => {
    const text = chunk.toString();
    process.stderr.write(chunk);
    logEvent(`[STDERR] ${text.trim()}`);
  });

  childProc.on('exit', (code, signal) => {
    logEvent(`Worker exited (code=${code}, signal=${signal})`);
    childProc = null;
    if (!shuttingDown) {
      setTimeout(startWorker, 250);
    }
  });
}

process.on('SIGTERM', () => {
  shuttingDown = true;
  logEvent('Received SIGTERM, stopping worker...');
  if (childProc) childProc.kill('SIGTERM');
  process.exit(0);
});

process.on('SIGINT', () => {
  shuttingDown = true;
  logEvent('Received SIGINT, stopping worker...');
  if (childProc) childProc.kill('SIGINT');
  process.exit(0);
});

startWorker();
