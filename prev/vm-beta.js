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

  // executeInstructionSet(instructions) {
  //   instructions.forEach((instruction) => {
  //     this.executeSingle(instruction);
  //   });
  // }

  // Modified IF logic
  execute(instructionSet) {
    let instructions = instructionSet.slice(); // Make a copy of the instructionSet
    let i = 0;

    while (i < instructions.length) {
      const instruction = instructions[i];
      const parts = instruction.trim().split(/\s+/);
      const op = parts[0];
      let args = parts.slice(1);

      // Detect IF blocks and handle conditional execution
      if (op === "IF") {
        const conditionValue = this.getValue(args[0], true);
        const ifBlock = this.extractConditionalBlock(instructions, i);

        if (this.isTruthy(conditionValue)) {
          // Execute the IF block if the condition is true
          this.executeInstructionSet(ifBlock.ifInstructions);
        } else if (ifBlock.elseInstructions) {
          // Execute ELSE block if the condition is false
          this.executeInstructionSet(ifBlock.elseInstructions);
        }

        i = ifBlock.endIndex; // Saltar al final del bloque
      } else if (op === "WHILE") {
        const whileBlock = this.extractConditionalBlock(
          instructions,
          i,
          "WHILE"
        );
        const conditionValue = this.getValue(args[0], true);

        while (this.isTruthy(conditionValue)) {
          this.executeInstructionSet(whileBlock.ifInstructions);
          // Re-evaluar la condición después de cada iteración
          const newConditionValue = this.getValue(args[0], true);
          if (!this.isTruthy(newConditionValue)) break;
        }
        i = whileBlock.endIndex;
      } else if (op === "FOR") {
        const forBlock = this.extractConditionalBlock(instructions, i, "FOR");
        let iterations = this.getValue(args[0], true);

        for (let j = 0; j < iterations; j++) {
          this.executeInstructionSet(forBlock.ifInstructions);
        }
        i = forBlock.endIndex;
      } else {
        // For all other instructions
        this.executeSingle(instruction);
        i++;
      }
    }
  }

  isTruthy(value) {
    return (
      value !== 0 &&
      value !== false &&
      value !== undefined &&
      value !== null &&
      value !== ""
    );
  }

  isFalsy(value) {
    return !this.isTruthy(value);
  }

  // Extract the block of instructions for IF, ELSE, ENDIF
  extractConditionalBlock(instructions, startIndex) {
    // TODO: Verify this function
    let ifInstructions = [];
    let elseInstructions = null;
    let depth = 0;
    let i = startIndex + 1;

    while (i < instructions.length) {
      const instruction = instructions[i].trim();
      const op = instruction.split(/\s+/)[0];

      if (op === "IF") {
        // Nested IF, increase depth
        depth++;
        ifInstructions.push(instruction);
      } else if (op === "ENDIF" || op === `${blockType}END`) {
        if (depth === 0) {
          // End of the current IF block
          break;
        } else {
          // End of a nested IF block
          depth--;
          ifInstructions.push(instruction);
        }
      } else if (op === "ELSE" && depth === 0 && blockType === "IF") {
        elseInstructions = [];
      } else {
        // Regular instruction inside the block
        if (elseInstructions !== null) {
          elseInstructions.push(instruction);
        } else {
          ifInstructions.push(instruction);
        }
      }
      i++;
    }

    return {
      ifInstructions,
      elseInstructions,
      endIndex: i + 1, // Índice después de ENDIF o FOR/WHILEEND
    };
  }

  // Corrección de WHILE y FOR para integración con instrucciones
  executeInstructionSet(instructions) {
    instructions.forEach((instruction) => {
      this.executeSingle(instruction);
    });
  }

  executeSingle(instruction) {
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
          this.stacks[to].push(value.repeat(multiple));
        } else if (typeof multiple === "string") {
          throw new Error(
            `Cannot multiply ${typeof value} by ${typeof multiple}.`
          );
        } else {
          this.stacks[to].push(Number(value) * Number(multiple));
        }
      },
      EXP: (args) => {
        var to, value, exponent;
        if (args.length == 3) {
          to = args[0];
          value = this.getValue(args[1]);
          exponent = this.getValue(args[2]);
        } else {
          to = args[0];
          value = this.getValue(args[0]);
          exponent = this.getValue(args[1]);
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
          this.stacks[to].push(Number(value) ** Number(exponent));
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
      CLEAR: (args) => {
        var stack = args[0];

        if (!this.isStackReference(stack)) {
          throw new Error(`Invalid stack reference: ${stack}.`);
        }

        while (!this.stacks[stack].isEmpty()) {
          //Clear stack
          this.stacks[stack].pop();
        }
      },
      COMPACT: (args) => {
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
            typeof targetStack.peek() !== "number" &&
            typeof targetStack.peek() !== "string"
          ) {
            throw new Error(`Stack ${stack} contains non-numeric values.`);
          }
          if (sum === undefined) {
            sum = targetStack.pop();
          } else {
            sum += targetStack.pop();
          }
        }

        targetStack.push(sum); //push result
      },

      // FIXME: Implementar WHILE, FOR, IF, ELSE, IF-ELSE
      WHILE: (args, bodyInstructions) => {
        const stack = args[0];
        const targetStack = this.stacks[stack];

        if (!this.isStackReference(stack)) {
          throw new Error(`Invalid stack reference: ${stack}.`);
        }
        if (targetStack.isEmpty()) {
          throw new Error(`Stack ${stack} is empty.`);
        }

        // Pop the condition value from the stack
        let condition = this.getValue(stack, true);

        while (this.isTruthy(condition)) {
          this.executeInstructionSet(bodyInstructions);

          // Re-check condition after each iteration
          if (!targetStack.isEmpty()) {
            condition = this.getValue(stack, true);
          } else {
            break;
          }
        }
      },

      FOR: (args, bodyInstructions) => {
        const stack = args[0];
        const targetStack = this.stacks[stack];

        if (!this.isStackReference(stack)) {
          throw new Error(`Invalid stack reference: ${stack}.`);
        }
        if (targetStack.isEmpty()) {
          throw new Error(`Stack ${stack} is empty.`);
        }

        // Pop the number of iterations from the stack
        let iterations = this.getValue(stack, true);

        if (typeof iterations !== "number") {
          throw new Error("FOR loop requires a number of iterations.");
        }

        for (let i = 0; i < iterations; i++) {
          this.executeInstructionSet(bodyInstructions);
        }
      },

      IF: (args, bodyInstructions) => {
        const stack = args[0];
        const targetStack = this.stacks[stack];

        if (!this.isStackReference(stack)) {
          throw new Error(`Invalid stack reference: ${stack}.`);
        }
        if (targetStack.isEmpty()) {
          throw new Error(`Stack ${stack} is empty.`);
        }

        // Pop the condition value from the stack
        const condition = this.getValue(stack, true);

        if (this.isTruthy(condition)) {
          this.executeInstructionSet(bodyInstructions);
        }
      },

      ELSE: (args, bodyInstructions) => {
        // This simply runs if the ELSE clause was reached, assuming the IF was false.
        this.executeInstructionSet(bodyInstructions);
      },

      "IF-ELSE": (args, ifInstructions, elseInstructions) => {
        const stack = args[0];
        const targetStack = this.stacks[stack];

        if (!this.isStackReference(stack)) {
          throw new Error(`Invalid stack reference: ${stack}.`);
        }
        if (targetStack.isEmpty()) {
          throw new Error(`Stack ${stack} is empty.`);
        }

        // Pop the condition value from the stack
        const condition = this.getValue(stack, true);

        if (this.isTruthy(condition)) {
          this.executeInstructionSet(ifInstructions);
        } else {
          this.executeInstructionSet(elseInstructions);
        }
      },
    };

    const aliases = {
      // Add aliases for instructions in a dictionary to map to runes
      PUSH: "PUSH",
      "𖤍": "PUSH",
      POP: "POP",
      "♅": "POP",
      ADD: "ADD",
      "↟": "ADD",
      COMPACT: "COMPACT",
      "↟↟": "COMPACT",
      SUB: "SUB",
      "↡": "SUB",
      DIV: "DIV",
      "↞": "DIV",
      DIVINT: "DIVINT",
      "↞↞": "DIVINT",
      MOD: "MOD",
      "↡↞": "MOD",
      MUL: "MUL",
      "↠": "MUL",
      EXP: "EXP",
      "↠↠": "EXP",
      SWAP: "SWAP",
      "↡↟": "SWAP",
      EMPTY: "EMPTY",
      "𒌐": "EMPTY",
      PRINT: "PRINT",
      "♅♅": "PRINT",
      CLEAR: "CLEAR",
      // "𒌑": "CLEAR",
      WHILE: "WHILE",
      // "𒀱": "WHILE",
      FOR: "FOR",
      // "𒀲": "FOR",
      IF: "IF",
      // "𒀳": "IF",
      ELSE: "ELSE",
      // "𒀴": "ELSE",
      "IF-ELSE": "IF-ELSE",
      // "𒀵": "IF-ELSE",
      ENDIF: "ENDIF",
      // "𒀶": "ENDIF",
      END: "END",
      // "𒀷": "END",
      "FOR-END": "FOR-END",
      // "𒀷": "FOR-END",
      "WHILE-END": "WHILE-END",
      // "𒀸": "WHILE-END",
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
    instructions.forEach((instruction) => this.executeSingle(instruction));
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
