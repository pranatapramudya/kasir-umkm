#!/usr/bin/env node
/**
 * Orchestrator untuk menjalankan Next.js dev server + service pendukung secara bersamaan
 * Usage: node scripts/orchestrator.js
 */

const { spawn } = require('child_process');
const path = require('path');

const processes = [
  {
    name: 'Next.js Dev Server',
    command: 'npx',
    args: ['next', 'dev'],
    cwd: path.resolve(__dirname, '..'),
    color: '\x1b[36m', // cyan
  },
  {
    name: 'WebSocket Server (KDS Real-time)',
    command: 'npx',
    args: ['tsx', 'scripts/websocket-server.ts'],
    cwd: path.resolve(__dirname, '..'),
    color: '\x1b[35m', // magenta
  },
  // Tambahkan service lain di sini jika diperlukan:
  // {
  //   name: 'Telegram Bot',
  //   command: 'node',
  //   args: ['scripts/telegram-bot.js'],
  //   cwd: path.resolve(__dirname, '..'),
  //   color: '\x1b[33m', // yellow
  // },
  // {
  //   name: 'Worker Process',
  //   command: 'node',
  //   args: ['scripts/worker.js'],
  //   cwd: path.resolve(__dirname, '..'),
  //   color: '\x1b[35m', // magenta
  // },
];

const reset = '\x1b[0m';
const bold = '\x1b[1m';

function log(prefix, message, color = '') {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${color}[${timestamp}] ${bold}${prefix}${reset} ${message}`);
}

function runProcess(config) {
  return new Promise((resolve, reject) => {
    const child = spawn(config.command, config.args, {
      cwd: config.cwd,
      stdio: 'pipe',
      shell: true,
      env: { ...process.env, FORCE_COLOR: '1' },
    });

    child.stdout.on('data', (data) => {
      const lines = data.toString().trim().split('\n');
      lines.forEach(line => {
        if (line.trim()) log(config.name, line, config.color);
      });
    });

    child.stderr.on('data', (data) => {
      const lines = data.toString().trim().split('\n');
      lines.forEach(line => {
        if (line.trim()) log(`${config.name} [ERROR]`, line, '\x1b[31m'); // red
      });
    });

    child.on('close', (code) => {
      log(config.name, `Process exited with code ${code}`, config.color);
      resolve(code);
    });

    child.on('error', (err) => {
      log(config.name, `Failed to start: ${err.message}`, '\x1b[31m');
      reject(err);
    });

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      log('Orchestrator', `Stopping ${config.name}...`, '\x1b[33m');
      child.kill('SIGINT');
    });

    process.on('SIGTERM', () => {
      log('Orchestrator', `Stopping ${config.name}...`, '\x1b[33m');
      child.kill('SIGTERM');
    });

    // Store reference for cleanup
    config.child = child;
  });
}

async function main() {
  console.log(`${bold}\x1b[32m=== KASIR UMKM ORCHESTRATOR ===\x1b[0m`);
  console.log(`${bold}Starting ${processes.length} process(es)...\x1b[0m\n`);

  // Start all processes
  const promises = processes.map(config => runProcess(config));

  // Wait for all (or first to exit)
  try {
    const results = await Promise.all(promises);
    console.log(`\n${bold}\x1b[32mAll processes exited.\x1b[0m`);
    process.exit(Math.max(...results));
  } catch (err) {
    console.error(`\n${bold}\x1b[31mOrchestrator error:\x1b[0m`, err);
    // Kill all children on error
    processes.forEach(config => {
      if (config.child) config.child.kill('SIGTERM');
    });
    process.exit(1);
  }
}

main();