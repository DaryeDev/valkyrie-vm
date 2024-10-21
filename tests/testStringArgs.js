var instruction = 'PUSH $1 \"Hello everyone my name is market plier"'

const parts = instruction.trim().split(/\s+/);
const op = parts[0];
var args = parts.slice(1);

// fix args
let currentArg = "";
var argsJoined = 1;
for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('"')) {
        currentArg += args[i];
        for (let j = i + 1; j < args.length; j++) {
            currentArg += ` ${args[j]}`;
            argsJoined++;
            if (args[j].endsWith('"')) {
                break;
            }
        }
        args.splice(i, argsJoined, currentArg);
        currentArg = "";
        argsJoined = 1;
    }
}

console.log(args)