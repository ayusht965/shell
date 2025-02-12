const readline = require("readline");
const fs = require("fs");
const path = require("path");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ "
});
const CMDS = ["type", "echo", "exit"]
rl.prompt();
rl.on("line", (input) => {
  input = input.trim();
  execCmd(input);
  rl.prompt();
 })
function execCmd(command) {
  const {cmd, args} = getCmd(command)
  if (cmd === "exit") {
    process.exit(0);
  } else if(cmd === "echo") {
    console.log(args.join(" "));
  } else if(cmd === "type") {
    printType(args[0]);
  } else {
    console.log(`${command}: command not found`);
  }
}
function getCmd(answer) {
  let args = answer.split(/\s+/);
  cmd = args[0]
  args.shift()
  return{cmd, args}
}
function printType(cmdName) {
  let found = false;
  if(CMDS.includes(cmdName)) {
    console.log(`${cmdName} is a shell builtin`);
    found = true;
  } else {
    const paths = process.env.PATH.split(path.delimiter);
    for(let p of paths) {
      const fullPath = path.join(p, cmdName);
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
        console.log(`${cmdName} is ${fullPath}`);
        found = true;
    }
    }
  }
  if(!found) {
    console.log(`${cmdName}: not found`);
  }
}