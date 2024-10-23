import Stack from "./stack.mjs";
import fs from "fs";

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

    this.eventListeners = {
      "print": [],
      "pause": [],
    };
  }

  async getValue(arg, pop = false) {
    if (arg.startsWith('"') && arg.endsWith('"')) {
      return arg.slice(1, -1);
    } else if (!isNaN(Number(arg))) {
      return Number(arg);
    } else if (arg.startsWith("$")) {
      return pop ? await this.stacks[arg].pop() : await this.stacks[arg].peek();
    }
  }

  isStackReference(arg) {
    return arg.startsWith("$") && Object.keys(this.stacks).includes(arg);
  }

  async execute(instruction) {
    const parts = instruction.trim().split(/\s+/);
    const op = parts[0];
    var rawArgs = parts.slice(1);

    // fix args
    let currentStringArg = false;
    var args = [];

    for (let i = 0; i < rawArgs.length; i++) {
      if (currentStringArg) {
        currentStringArg += ` ${rawArgs[i]}`;
        if (rawArgs[i].endsWith('"')) {
          args.push(currentStringArg);
          currentStringArg = false;
        }
      } else if (!rawArgs[i]) {
        continue;
      } else if (rawArgs[i].startsWith('"')) {
        currentStringArg = rawArgs[i];
        if (rawArgs[i].endsWith('"')) {
          args.push(currentStringArg);
          currentStringArg = false;
        }
      } else if (rawArgs[i].startsWith('#')) {
        break;
      } else {
        args.push(rawArgs[i]);
      }
    }

    const operations = {
      PUSH: async (args) => {
        var to = args[0];
        var value = await this.getValue(args[1]);

        if (!this.isStackReference(to)) {
          throw new Error(`Invalid stack reference: ${to}.`);
        }

        if (value === undefined) {
          throw new Error("PUSH operation requires a value to push");
        }

        await this.stacks[to].push(value);
      },
      POP: async (args) => {
        var from = args[0];

        if (!this.isStackReference(from)) {
          throw new Error(`Invalid stack reference: ${from}.`);
        }

        await this.stacks[from].pop();
      },
      ADD: async (args) => {
        var to, value, delta;
        if (args.length == 3) {
          to = args[0];
          value = await this.getValue(args[1]);
          delta = await this.getValue(args[2]);
        } else if (args.length >= 2) {
          to = args[0];
          value = await this.getValue(args[0]);
          delta = await this.getValue(args[1]);
        } else {
          throw new Error("ADD operation requires at least two arguments.");
        }

        if (!this.isStackReference(to)) {
          throw new Error(`Invalid stack reference: ${to}.`);
        }

        await this.stacks[to].push(value + delta);
      },
      SUB: async (args) => {
        var to, value, delta;
        if (args.length == 3) {
          to = args[0];
          value = await this.getValue(args[1]);
          delta = await this.getValue(args[2]);
        } else if (args.length >= 2) {
          to = args[0];
          value = await this.getValue(args[0]);
          delta = await this.getValue(args[1]);
        } else {
          throw new Error("SUB operation requires at least two arguments.");
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
          await this.stacks[to].push(value.replace(delta, ""));
        } else {
          await this.stacks[to].push(value - delta);
        }
      },
      DIV: async (args) => {
        var to, value, divisor;
        if (args.length == 3) {
          to = args[0];
          value = await this.getValue(args[1]);
          divisor = await this.getValue(args[2]);
        } else {
          to = args[0];
          value = await this.getValue(args[0]);
          divisor = await this.getValue(args[1]);
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
        await this.stacks[to].push(value / divisor);
      },
      DIVINT: async (args) => {
        var to, value, divisor;
        if (args.length == 3) {
          to = args[0];
          value = await this.getValue(args[1]);
          divisor = await this.getValue(args[2]);
        } else {
          to = args[0];
          value = await this.getValue(args[0]);
          divisor = await this.getValue(args[1]);
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
        await this.stacks[to].push(Math.trunc(value / divisor));
      },
      MOD: async (args) => {
        var to, value, divisor;
        if (args.length == 3) {
          to = args[0];
          value = await this.getValue(args[1]);
          divisor = await this.getValue(args[2]);
        } else {
          to = args[0];
          value = await this.getValue(args[0]);
          divisor = await this.getValue(args[1]);
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
        await this.stacks[to].push(value % divisor);
      },
      MUL: async (args) => {
        var to, value, multiple;
        if (args.length == 3) {
          to = args[0];
          value = await this.getValue(args[1]);
          multiple = await this.getValue(args[2]);
        } else {
          to = args[0];
          value = await this.getValue(args[0]);
          multiple = await this.getValue(args[1]);
        }
        if (!this.isStackReference(to)) {
          throw new Error(`Invalid stack reference: ${to}.`);
        }

        var isStringMultipliedByNumber =
          typeof value === "string" && typeof multiple === "number";
        if (typeof value !== typeof multiple && !isStringMultipliedByNumber) {
          // Podremos multiplicar una string por un número, añadida excepción
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
          await this.stacks[to].push(value.repeat(multiple));
        } else if (typeof multiple === "string") {
          throw new Error(
            `Cannot multiply ${typeof value} by ${typeof multiple}.`
          );
        } else {
          await this.stacks[to].push(Number(value) * Number(multiple));
        }
      },
      EXP: async (args) => {
        var to, value, exponent;
        if (args.length == 3) {
          to = args[0];
          value = await this.getValue(args[1]);
          exponent = await this.getValue(args[2]);
        } else {
          to = args[0];
          value = await this.getValue(args[0]);
          exponent = await this.getValue(args[1]);
        }
        if (!this.isStackReference(to)) {
          throw new Error(`Invalid stack reference: ${to}.`);
        }

        if (typeof value !== typeof exponent) {
          // Podremos multiplicar una string por un número, añadida excepción
          throw new Error(
            `Cannot multiply ${typeof value} by ${typeof exponent}.`
          );
        }
        var validDataTypes = ["number"];
        if (
          !validDataTypes.includes(typeof value) ||
          !validDataTypes.includes(typeof exponent)
        ) {
          throw new Error(
            `Cannot multiply ${typeof value} by ${typeof exponent}.`
          );
        } else {
          await this.stacks[to].push(Number(value) ** Number(exponent));
        }
      },
      SWAP: async (args) => {
        var stack1 = args[0];
        var stack2 = args[1];

        if (!(stack1 && stack2)) {
          throw new Error("SWAP operation requires two operands.");
        }

        if (!this.isStackReference(stack1)) {
          throw new Error(`Invalid stack reference: ${stack1}.`);
        }

        await this.stacks["$B"].push(await this.stacks[stack1].pop());
        await this.stacks[stack1].push(await this.getValue(stack2, true));
        if (this.isStackReference(stack2)) {
          await this.stacks[stack2].push(await this.stacks["$B"].pop());
        } else {
          await this.stacks["$B"].pop();
        }
      },
      PRINT: async (args) => {
        const arg = args[0];

        if (!arg) {
          throw new Error("PRINT operation requires an argument.");
        }

        var value = await this.getValue(arg);

        console.log(value);

        await Promise.all(
          this.eventListeners["print"].map((callback) => callback(value))
        );
      },
      CLEAR: async (args) => {
        var stack = args[0];

        if (!this.isStackReference(stack)) {
          throw new Error(`Invalid stack reference: ${stack}.`);
        }

        while (!this.stacks[stack].isEmpty()) {
          //Clear stack
          await this.stacks[stack].pop();
        }
      },
      COMPACT: async (args) => {
        var stack = args[0];
        var targetStack = this.stacks[stack];

        if (!this.isStackReference(stack)) {
          throw new Error(`Invalid stack reference: ${stack}.`);
        }
        if (targetStack.isEmpty()) {
          throw new Error(`Stack ${stack} is empty.`);
        }

        var sum;
        while (!targetStack.isEmpty()) {
          //Clear stack
          if (
            typeof await targetStack.peek() !== "number" &&
            typeof await targetStack.peek() !== "string"
          ) {
            throw new Error(`Stack ${stack} contains non-numeric values.`);
          }
          if (sum === undefined) {
            sum = await targetStack.pop();
          } else {
            sum += await targetStack.pop();
          }
        }

        await targetStack.push(sum); //push result
      },
      RANDINT: async (args) => {
        var stack = args[0];
        var min = await this.getValue(args[1]);
        var max = await this.getValue(args[2]);

        if (!this.isStackReference(stack)) {
          throw new Error(`Invalid stack reference: ${stack}.`);
        }

        if (min == undefined || max == undefined) {
          throw new Error("RANDINT operation requires a max and a min values.");
        }

        if (typeof min !== "number" || typeof max !== "number") {
          throw new Error("RANDINT operation requires numeric operands.");
        }

        if (min >= max) {
          throw new Error("RANDINT operation requires min < max.");
        }

        await this.stacks[stack].push(Math.floor(Math.random() * (max - min + 1)) + min);
      },
      CLEARALL: async (args) => {
        for (let i = 0; i < Object.keys(this.stacks).length; i++) {
          const stack = this.stacks[Object.keys(this.stacks)[i]];
          await stack.clear();
        }
      },
      PAUSE: async (args) => {
        await Promise.all(
          this.eventListeners["pause"].map((callback) => callback())
        );
      }
    };

    const aliasesDictionary = {
      PUSH: [
        "PUSH",
        "𖤍",
      ],
      POP: [
        "POP",
        "♅",
      ],
      ADD: [
        "ADD",
        "↟",
      ],
      COMPACT: [
        "COMPACT",
        "↟↟"
      ],
      SUB: [
        "SUB",
        "↡",
      ],
      DIV: [
        "DIV",
        "↞",
      ],
      DIVINT: [
        "DIVINT",
        "↞↞",
      ],
      MOD: [
        "MOD",
        "↡↞",
      ],
      MUL: [
        "MUL",
        "↠",
      ],
      EXP: [
        "EXP",
        "↠↠",
      ],
      SWAP: [
        "SWAP",
        "↡↟",
      ],
      CLEAR: [
        "CLEAR",
        "EMPTY",
        "𒌐",
      ],
      CLEARALL: [
        "CLEARALL",
        "NUKE",
        "RAGNAROK",
        "𒌐𒌐",
      ],
      PRINT: [
        "PRINT",
        "♅♅",
      ],
      RANDINT: [
        "RANDINT",
        "𖤓☽",
      ],
      PAUSE: [
        "PAUSE"
      ],
    }

    function getOperationByAlias(alias) {
      for (const [key, values] of Object.entries(aliasesDictionary)) {
        if (values.includes(alias)) {
            return key;
        }
      }
    }

    if (op && op !== "" && !op.startsWith("#")) {
      const operation = getOperationByAlias(op.toUpperCase());
      if (operation && operations[operation]) {
        await operations[operation](args);
      } else {
        throw new Error(`Unknown instruction: ${op}`);
      }
    }
    
  }

  addEventListener(type, callback = async (value) => {}, wait=false) {
    var waitedCallback = async (value) => {
      if (wait) {
        await callback(value);
      } else {
        callback(value);
      }
    }
    this.eventListeners[type].push(waitedCallback);
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

if (typeof process !== 'undefined' && process.argv.length > 2 && process.argv[2].trim()) {
  const filePath = process.argv[2];

  // Example usage:
  const vm = new ValkyrieVM();
  // vm.execute("PUSH $1 10");
  // vm.execute("PUSH $2 20");
  // vm.execute("ADD $3 $1 $2");
  // vm.execute("PRINT $3"); // Should print 30

  vm.run(filePath); // This will read and execute all instructions from the file
}

export default ValkyrieVM;