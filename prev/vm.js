import Stack from "./stack.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

class ValkyrieVM {
  constructor() {
    this.stacks = {
      $1: new Stack(),
      $2: new Stack(),
      $3: new Stack(),
      $4: new Stack(),
      $5: new Stack(),
      $6: new Stack(),
      $7: new Stack(),
      $B: new Stack(),
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
        var to = args[0];
        var value = this.getValue(args[1]);

        if (!this.isStackReference(to)) {
          throw new Error(`Invalid stack reference: ${to}.`);
        }

        if (value === undefined) {
          throw new Error("PUSH operation requires a value to push");
        }

        this.stacks[to].push(value);
      },
      POP: (args) => {
        var to = args[0];

        if (!this.isStackReference(to)) {
          throw new Error(`Invalid stack reference: ${to}.`);
        }

        this.stacks[to].push(value);
      },
      ADD: (args) => {
        var to, value, delta;
        if (args.length == 3) {
          to = args[0];
          value = this.getValue(args[1]);
          delta = this.getValue(args[2]);
        } else if (args.length >= 2) {
          to = args[0];
          value = this.getValue(args[0]);
          delta = this.getValue(args[1]);
        } else {
          throw new Error("ADD operation requires at least two arguments.");
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
        } else if (args.length >= 2) {
          to = args[0];
          value = this.getValue(args[0]);
          delta = this.getValue(args[1]);
        } else {
          throw new Error("SUB operation requires at least two arguments.");
        }

        if (!this.isStackReference(to)) {
          throw new Error(`Invalid stack reference: ${to}.`);
        }

        if (typeof value !== typeof delta) {
          throw new Error(`Cannot subtract ${typeof delta} from ${typeof value}.`);
        }

        var validDataTypes = ["number", "string", "boolean"];
        if (
          !validDataTypes.includes(typeof value) ||
          !validDataTypes.includes(typeof delta)
        ) {
          throw new Error(`Cannot subtract ${typeof delta} from ${typeof value}.`);
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
          throw new Error(`Cannot divide ${typeof value} by ${typeof divisor}.`);
        }
        var validDataTypes = ["number"];
        if (
          !validDataTypes.includes(typeof value) ||
          !validDataTypes.includes(typeof divisor)
        ) {
          throw new Error(`Cannot divide ${typeof value} by ${typeof divisor}.`);
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
          throw new Error(`Cannot divide ${typeof value} by ${typeof divisor}.`);
        }
        var validDataTypes = ["number"];
        if (
          !validDataTypes.includes(typeof value) ||
          !validDataTypes.includes(typeof divisor)
        ) {
          throw new Error(`Cannot divide ${typeof value} by ${typeof divisor}.`);
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
          throw new Error(`Cannot divide ${typeof value} by ${typeof divisor}.`);
        }
        var validDataTypes = ["number"];
        if (
          !validDataTypes.includes(typeof value) ||
          !validDataTypes.includes(typeof divisor)
        ) {
          throw new Error(`Cannot divide ${typeof value} by ${typeof divisor}.`);
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

        var isStringMultipliedByNumber = (typeof value === "string" && typeof multiple === "number");
        if ((typeof value !== typeof multiple) && !isStringMultipliedByNumber) { // Podremos multiplicar una string por un número, añadida excepción
          throw new Error(`Cannot multiply ${typeof value} by ${typeof multiple}.`);
        }
        var validDataTypes = ["number", "string", "boolean"];
        if (
          !validDataTypes.includes(typeof value) ||
          !validDataTypes.includes(typeof multiple)
        ) {
          throw new Error(`Cannot multiply ${typeof value} by ${typeof multiple}.`);
        }
        if (typeof value === "string") {
          this.stacks[to].push(value.repeat(multiple));
        } else if (typeof multiple === "string") {
          throw new Error(`Cannot multiply ${typeof value} by ${typeof multiple}.`);
        } else {
          this.stacks[to].push(Number(value) * Number(multiple));
        }
      },
      SWAP: (args) => {
        var stack1 = args[0];
        var stack2 = args[1];

        if (!(stack1 && stack2)) {
          throw new Error("SWAP operation requires two operands.");
        }

        if (!this.isStackReference(stack1)) {
          throw new Error(`Invalid stack reference: ${stack1}.`);
        }

        this.stacks["$B"].push(this.stacks[stack1].pop());
        this.stacks[stack1].push(this.getValue(stack2, true));
        if (this.isStackReference(stack2)) {
          this.stacks[stack2].push(this.stacks["$B"].pop());
        } else {
          this.stacks["$B"].pop();
        }
      },
      EMPTY: (args) => {
        var stack = args[0];
        while (!this.stacks[stack].isEmpty()) {
          this.stacks[stack].pop();
        }
      },
      PRINT: (args) => {
        const arg = args[0];

        if (!arg) {
          throw new Error("PRINT operation requires an argument.");
        }

        console.log(this.getValue(arg));
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
