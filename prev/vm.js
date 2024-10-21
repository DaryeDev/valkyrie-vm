import Stack from "./stack.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

class ValkyrieVM {
  constructor() {
    this.stacks = {
      1: new Stack(),
      2: new Stack(),
      3: new Stack(),
      4: new Stack(),
      5: new Stack(),
      6: new Stack(),
      7: new Stack(),
      B: new Stack(),
    };
    this.registers = {};
  }

  getValue(arg) {
    if (arg.startsWith('"') && arg.endsWith('"')) {
      return arg.slice(1, -1);
    } else if (!isNaN(Number(arg))) {
      return Number(arg);
    } else if (arg.startsWith("$")) {
      return this.stacks[arg].peek();
    }
  }

  execute(instruction) {
    const parts = instruction.trim().split(/\s+/);
    const op = parts[0];
    const arg = parts[1] ? (isNaN(Number(parts[1])) ? parts[1] : Number(parts[1])) : undefined;
    const stackNumber = parts[2] ? Number(parts[2]) : 1; // Default to stack 1
    const stack = this.stacks[stackNumber];
    var args = parts.slice(1);

    // fix string args
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

    if (!stack) {
      console.log(`Stack ${stackNumber} does not exist`);
      return;
    }

    switch (op) {
      case "PUSH":
        if (arg !== undefined) {
          stack.push(arg);
        } else {
          console.log("PUSH operation requires an argument");
        }
        break;
      case "POP":
        stack.pop();
        break;
      case "ADD":
        const a = Number(stack.pop());
        const b = Number(stack.pop());
        if (!isNaN(a) && !isNaN(b)) {
          stack.push(a + b);
        } else {
          console.log("ADD operation requires two numeric operands");
        }
        break;
      case "SUB":
        const x = Number(stack.pop());
        const y = Number(stack.pop());
        if (!isNaN(x) && !isNaN(y)) {
          stack.push(x - y);
        } else {
          console.log("SUB operation requires two numeric operands");
        }
        break;
      case "MUL":
        const m = Number(stack.pop());
        const n = Number(stack.pop());
        if (!isNaN(m) && !isNaN(n)) {
          stack.push(m * n);
        } else {
          console.log("MUL operation requires numeric operands");
        }
        break;
      case "DIV":
        const d1 = Number(stack.pop());
        const d2 = Number(stack.pop());
        if (!isNaN(d1) && !isNaN(d2)) {
          if (d2 !== 0) {
            stack.push(d1 / d2);
          } else {
            console.log("Cannot divide by zero");
          }
        } else {
          console.log("DIV operation requires numeric operands");
        }
        break;
      case "SWAP":
        const s1 = stack.pop();
        const s2 = stack.pop();
        if (s1 !== undefined && s2 !== undefined) {
          stack.push(s1);
          stack.push(s2);
        } else {
          console.log("SWAP operation requires two operands");
        }
        break;
      case "EMPTY":
        while (!stack.isEmpty()) {
          stack.pop();
        }
        break;
      case "PRINT":
        console.log(stack.peek());
        break;
      default:
        console.log(`Unknown instruction: ${op}`);
  }
}


  readInstructionsFromFile(filePath) {
    let data = fs.readFileSync(filePath, "utf8");
    return data.trim().split("\n");
  }

  findValFiles(directory) {
    return fs.readdirSync(directory).filter((file) => file.endsWith(".val"));
  }

  run(filePath) {
    const instructions = this.readInstructionsFromFile(filePath);
    instructions.forEach((instruction) => this.execute(instruction));
  }
}

// Example usage:
const vm = new ValkyrieVM();
// vm.execute("PUSH 10");
// vm.execute("PUSH 20");
// vm.execute("ADD");
// vm.execute("PRINT"); // Should print 30

// Execute instructions from a .val file or execute all .val files in the directory
if (process.argv.length > 2 && process.argv[2].trim()) {
  const filePath = process.argv[2];
  vm.run(filePath); // This will read and execute all instructions from the file
} else {
  const __filename = fileURLToPath(import.meta.url);
  const directory = path.dirname(__filename);
  const valFiles = vm.findValFiles(directory);
  valFiles.forEach((fileName) => {
    const filePath = path.join(directory, fileName);
    vm.run(filePath); // For each .val file, read and execute the instructions
  });
}
