const { spawn } = require('node:child_process');
const hardhatNode = spawn('npx', ['hardhat', 'node', '--port 10545']);

hardhatNode.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

hardhatNode.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

hardhatNode.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

// const subprocess = execa('node');

// setTimeout(() => {
// 	subprocess.kill('SIGTERM', {
// 		forceKillAfterTimeout: 2000
// 	});
// }, 1000);