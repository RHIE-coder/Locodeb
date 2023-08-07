// const { exec } = require('child_process');

// function $(command) {
//   const childProcess = exec(command[0], { stdio: 'inherit' });

  // childProcess.on('close', (code) => {
  //   console.log(`Child process exited with code ${code}`);
  // });
  // return new Promise((resolve, reject)=>{
    // exec(command[0], { stdio: 'inherit' }, (err, stdout, stderr)=>{
    //   if(err){
    //     console.error("node couldn't execute the command");
    //     console.error(err)
    //     return;
    //   }

    //   if(stderr === "") {
    //     if($.consoleMode) {
    //       console.log(stdout)
    //     }
    //     resolve(stdout);
    //   } else {
    //     if($.consoleMode) {
    //       console.error(stderr)
    //     }
    //     reject(stderr);
    //   }

    // })
  // });
// }

// (async()=>{
//   console.log(process.platform)
//   $.consoleMode = true;
//   // await $`mkdir teeest` 
//   // await $`git clone https://github.com/ethereum-optimism/optimism` 
//   $`git clone https://github.com/ethereum-optimism/optimism` 
// })()






var child=require('child_process');
var spawn=child.spawn('git',['clone', 'https://github.com/ethereum-optimism/optimism'], { stdio: 'inherit' });

const cmd = 'git clone https://github.com/ethereum-optimism/optimism';

spawn.on('exit',function(code,signal){
   console.log('exit: ', code, signal);
});