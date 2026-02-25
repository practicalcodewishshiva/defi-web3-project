const { spawn } = require('child_process');
const path = require('path');

const projectRoot = __dirname;

console.log('Starting backend...');
const backend = spawn('npm', ['run', 'backend:dev'], {
  cwd: projectRoot,
  stdio: 'inherit'
});

backend.on('error', (err) => {
  console.error('Backend failed to start:', err);
  process.exit(1);
});

setTimeout(() => {
  console.log('\nStarting frontend...');
  spawn('npm', ['run', 'frontend:dev'], {
    cwd: projectRoot,
    stdio: 'inherit'
  });
}, 3000);
