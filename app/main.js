const readline = require("readline");
const fs = require("fs");
const { execFileSync } = require('child_process');
const path = require("path");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const PATH = process.argv[2].split('=')[1];
const paths = PATH.split(path.delimiter);
// Uncomment this block to pass the first stage
const types = ['echo', 'exit', 'type'];
let recursive = function() {
  rl.question("$ ", (answer) => {
    const [commandType, text] = answer.split(' ');
    const targetPath = paths.filter((path) => fs.existsSync(`${path}/${text}`));
    if(commandType.startsWith('type')) {
      if(types.includes(text)) {
        console.log(`${text} is a shell builtin`)
      } else if(targetPath.length) {
        console.log(`${text} is ${targetPath}/${text}`);
      } else {
        console.log(`${text}: not found`);
      }
      recursive();
    } else if (answer === 'exit 0') {
      rl.close();
      return;
    } else if(commandType.startsWith('echo')) {
      const echoText = answer.split('echo ');
      console.log(echoText[1]);
      recursive();
    } else if(!targetPath.length) {
      let found = false
      const args = answer.split(' ').slice(1)
      for(const pathEnv of paths) {
        let destPath = path.join(pathEnv, commandType);
        if(fs.existsSync(destPath) && fs.statSync(destPath).isFile()){      
          found = true;  
          execFileSync(destPath, args, { encoding: 'utf-8', stdio: 'inherit' })
        }
      }
      if (!found) {
        console.log(`${answer}: command not found`);
      }
      recursive();
    }
  })
};
recursive();