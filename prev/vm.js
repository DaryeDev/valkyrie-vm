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

  getValue(arg, pop = false) {
    if (arg.startsWith('"') && arg.endsWith('"')) {
      return arg.slice(1, -1);
    } else if (!isNaN(Number(arg))) {
      return Number(arg);
    } else if (arg.startsWith("$")) {
      return pop ? this.stacks[arg].pop() : this.stacks[arg].peek();
    }
  }

  isStackReference(arg) {
    return arg.startsWith("$") && Object.keys(this.stacks).includes(arg);
  }

  execute(instruction) {
    const parts = instruction.trim().split(/\s+/);
    const op = parts[0];
    var args = parts.slice(1);
    const arg = parts[1]
      ? isNaN(Number(parts[1]))
        ? parts[1]
        : Number(parts[1])
      : undefined;
    const stackNumber = parts[2] ? Number(parts[2]) : 1;
    const stack = this.stacks[stackNumber];

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

    const operations = {
      PUSH: (args) => {
        const arg = args[0];
        if (arg && arg.startsWith("$")) {
          const targetStackNumber = Number(arg.slice(1));
          const targetStack = this.stacks[targetStackNumber];
          if (!targetStack) {
            throw new Error(`Stack ${targetStackNumber} does not exist`);
          }
          const valueToPush = args[1]
            ? isNaN(Number(args[1]))
              ? args[1]
              : Number(args[1])
            : undefined;
          if (valueToPush !== undefined) {
            targetStack.push(valueToPush); // PUSH
          } else {
            throw new Error("PUSH operation requires a value to push");
          }
        } else {
          throw new Error(
            "PUSH operation requires a stack reference starting with '$'"
          );
        }
      },
      POP: (args) => {
        const arg = args[0];
        if (arg && arg.startsWith("$")) {
          const targetStackNumber = Number(arg.slice(1));
          const targetStack = this.stacks[targetStackNumber];
          if (!targetStack) {
            throw new Error(`Stack ${targetStackNumber} does not exist`);
          }
          targetStack.pop(); // POP target
        } else {
          throw new Error(
            "POP operation requires a stack reference starting with '$'"
          );
        }
      },
      ADD: (args) => {
        var to, value, delta;
        if (args.length == 3) {
          to = args[0];
          value = this.getValue(args[1]);
          delta = this.getValue(args[2]);
        } else {
          to = args[0];
          value = this.getValue(args[0]);
          delta = this.getValue(args[1]);
        }
        if (!this.isStackReference(to)) {
          throw new Error(`Invalid stack reference: ${to}.`);
        }
        this.stacks[to].push(value + delta);
      },
      SUB: (args) => {
        var to, value, delta;
        if (args.length == 3) {
          to = args[0];
          value = this.getValue(args[1]);
          delta = this.getValue(args[2]);
        } else {
          to = args[0];
          value = this.getValue(args[0]);
          delta = this.getValue(args[1]);
        }
        if (!this.isStackReference(to)) {
          throw new Error(`Invalid stack reference: ${to}.`);
        }
        if (typeof value !== typeof delta) {
          throw new Error(
            `Cannot subtract ${typeof delta} from ${typeof value}.`
          );
        }
        var validDataTypes = ["number", "string", "boolean"];
        if (
          !validDataTypes.includes(typeof value) ||
          !validDataTypes.includes(typeof delta)
        ) {
          throw new Error(
            `Cannot subtract ${typeof delta} from ${typeof value}.`
          );
        }
        if (typeof value === "string") {
          this.stacks[to].push(value.replace(delta, ""));
        } else {
          this.stacks[to].push(value - delta);
        }
      },
      DIV: (args) => {
        var to, value, divisor;
        if (args.length == 3) {
          to = args[0];
          value = this.getValue(args[1]);
          divisor = this.getValue(args[2]);
        } else {
          to = args[0];
          value = this.getValue(args[0]);
          divisor = this.getValue(args[1]);
        }
        if (!this.isStackReference(to)) {
          throw new Error(`Invalid stack reference: ${to}.`);
        }
        if (typeof value !== typeof divisor) {
          throw new Error(
            `Cannot divide ${typeof value} by ${typeof divisor}.`
          );
        }
        var validDataTypes = ["number"];
        if (
          !validDataTypes.includes(typeof value) ||
          !validDataTypes.includes(typeof divisor)
        ) {
          throw new Error(
            `Cannot divide ${typeof value} by ${typeof divisor}.`
          );
        }
        this.stacks[to].push(value / divisor);
      },
      DIVINT: (args) => {
        var to, value, divisor;
        if (args.length == 3) {
          to = args[0];
          value = this.getValue(args[1]);
          divisor = this.getValue(args[2]);
        } else {
          to = args[0];
          value = this.getValue(args[0]);
          divisor = this.getValue(args[1]);
        }
        if (!this.isStackReference(to)) {
          throw new Error(`Invalid stack reference: ${to}.`);
        }
        if (typeof value !== typeof divisor) {
          throw new Error(
            `Cannot divide ${typeof value} by ${typeof divisor}.`
          );
        }
        var validDataTypes = ["number"];
        if (
          !validDataTypes.includes(typeof value) ||
          !validDataTypes.includes(typeof divisor)
        ) {
          throw new Error(
            `Cannot divide ${typeof value} by ${typeof divisor}.`
          );
        }
        this.stacks[to].push(Math.trunc(value / divisor));
      },
      MOD: (args) => {
        var to, value, divisor;
        if (args.length == 3) {
          to = args[0];
          value = this.getValue(args[1]);
          divisor = this.getValue(args[2]);
        } else {
          to = args[0];
          value = this.getValue(args[0]);
          divisor = this.getValue(args[1]);
        }
        if (!this.isStackReference(to)) {
          throw new Error(`Invalid stack reference: ${to}.`);
        }
        if (typeof value !== typeof divisor) {
          throw new Error(
            `Cannot divide ${typeof value} by ${typeof divisor}.`
          );
        }
        var validDataTypes = ["number"];
        if (
          !validDataTypes.includes(typeof value) ||
          !validDataTypes.includes(typeof divisor)
        ) {
          throw new Error(
            `Cannot divide ${typeof value} by ${typeof divisor}.`
          );
        }
        this.stacks[to].push(value % divisor);
      },
      MUL: (args) => {
        var to, value, multiple;
        if (args.length == 3) {
          to = args[0];
          value = this.getValue(args[1]);
          multiple = this.getValue(args[2]);
        } else {
          to = args[0];
          value = this.getValue(args[0]);
          multiple = this.getValue(args[1]);
        }
        if (!this.isStackReference(to)) {
          throw new Error(`Invalid stack reference: ${to}.`);
        }
        if (typeof value !== typeof multiple) {
          throw new Error(
            `Cannot multiply ${typeof value} by ${typeof multiple}.`
          );
        }
        var validDataTypes = ["number", "string", "boolean"];
        if (
          !validDataTypes.includes(typeof value) ||
          !validDataTypes.includes(typeof multiple)
        ) {
          throw new Error(
            `Cannot multiply ${typeof value} by ${typeof multiple}.`
          );
        }
        if (typeof value === "string") {
          this.stacks[to].push(value.repeat(multiple));
        } else if (typeof multiple === "string") {
          throw new Error(
            `Cannot multiply ${typeof value} by ${typeof multiple}.`
          );
        } else {
          this.stacks[to].push(Number(value) * Number(multiple));
        }
      },
      SWAP: (args) => {
        const stackNumber = args[0] ? Number(args[0]) : 1;
        const stack = this.stacks[stackNumber];
        const s1 = stack.pop();
        const s2 = stack.pop();
        if (s1 !== undefined && s2 !== undefined) {
          stack.push(s1);
          stack.push(s2);
        } else {
          console.log("SWAP operation requires two operands");
        }
      },
      EMPTY: (args) => {
        const stackNumber = args[0] ? Number(args[0]) : 1;
        const stack = this.stacks[stackNumber];
        while (!stack.isEmpty()) {
          stack.pop();
        }
      },
      PRINT: (args) => {
        const arg = args[0];
        if (arg && arg.startsWith("$")) {
          const targetStackNumber = Number(arg.slice(1));
          const targetStack = this.stacks[targetStackNumber];
          if (!targetStack) {
            throw new Error(`Stack ${targetStackNumber} does not exist`);
          }
          console.log(targetStack.peek()); //Print from target
        } else {
          throw new Error(
            "PRINT operation requires a stack reference starting with '$'"
          );
        }
      },
    };

    const aliases = { // Add aliases for instructions in a dictionary to map to runes
      PUSH: "PUSH",
      PUSHVAL: "PUSH",
      POP: "POP",
      REMOVE: "POP",
      ADD: "ADD",
      SUM: "ADD",
      SUB: "SUB",
      SUBTRACT: "SUB",
      DIV: "DIV",
      DIVIDE: "DIV",
      DIVINT: "DIVINT",
      DIVIDEINT: "DIVINT",
      MOD: "MOD",
      MODULUS: "MOD",
      MUL: "MUL",
      MULTIPLY: "MUL",
      SWAP: "SWAP",
      EXCHANGE: "SWAP",
      EMPTY: "EMPTY",
      CLEAR: "EMPTY",
      PRINT: "PRINT",
      DISPLAY: "PRINT",
    };

    const operation = aliases[op];
    if (operation && operations[operation]) {
      operations[operation](args);
    } else {
      console.error(`Unknown instruction: ${op}`);
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
