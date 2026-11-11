import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';
const nodeCmd = process.execPath || (isWindows ? 'node.exe' : 'node');
const viteBin = path.join(__dirname, 'client', 'node_modules', 'vite', 'bin', 'vite.js');

console.log('\x1b[36m%s\x1b[0m', '=====================================================');
console.log('\x1b[1m\x1b[35m%s\x1b[0m', '   🚀 TMS PRO ENTERPRISE — FULL-STACK DEV RUNNER');
console.log('\x1b[36m%s\x1b[0m', '=====================================================');
console.log('Starting Backend Server (port 5000) & Vite Frontend (port 5173)...\n');

// 1. Spawn Backend Express Server
const server = spawn(nodeCmd, ['server.js'], {
  cwd: path.join(__dirname, 'server'),
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: false
});

server.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach((line) => {
    console.log('\x1b[34m[SERVER]\x1b[0m ' + line);
  });
});

server.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach((line) => {
    console.error('\x1b[31m[SERVER ERROR]\x1b[0m ' + line);
  });
});

// 2. Spawn Frontend Vite Dev Server
const client = spawn(nodeCmd, [viteBin], {
  cwd: path.join(__dirname, 'client'),
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: false
});

client.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach((line) => {
    console.log('\x1b[32m[CLIENT]\x1b[0m ' + line);
  });
});

client.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach((line) => {
    console.error('\x1b[33m[CLIENT WARN]\x1b[0m ' + line);
  });
});

const cleanup = () => {
  console.log('\n\x1b[33mShutting down TMS processes...\x1b[0m');
  try {
    server.kill();
    client.kill();
  } catch (e) {}
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
