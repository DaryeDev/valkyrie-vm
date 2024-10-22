 //   switch (op) {
  //     case "PUSH":
  //       if (arg && arg.startsWith("$")) {
  //         const targetStackNumber = Number(parts[1].slice(1));
  //         const targetStack = this.stacks[targetStackNumber];
  //         if (!targetStack) {
  //           throw new Error(`Stack ${targetStackNumber} does not exist`);
  //         }
  //         const valueToPush = parts[2]
  //           ? isNaN(Number(parts[2]))
  //             ? parts[2]
  //             : Number(parts[2])
  //           : undefined;
  //         if (valueToPush !== undefined) {
  //           targetStack.push(valueToPush); // PUSH
  //         } else {
  //           throw new Error("PUSH operation requires a value to push");
  //         }
  //       } else {
  //         throw new Error(
  //           "PUSH operation requires a stack reference starting with '&'"
  //         );
  //       }
  //       break;

  //     case "POP":
  //       if (arg && arg.startsWith("$")) {
  //         const targetStackNumber = Number(arg.slice(1));
  //         const targetStack = this.stacks[targetStackNumber];
  //         if (!targetStack) {
  //           throw new Error(`Stack ${targetStackNumber} does not exist`);
  //         }
  //         targetStack.pop(); // POP target
  //       } else {
  //         throw new Error(
  //           "POP operation requires a stack reference starting with '$'"
  //         );
  //       }
  //       break;

  //     case "ADD":
  //       var to, value, delta;

  //       if (args.length == 3) {
  //         to = args[0];
  //         value = this.getValue(args[1]);
  //         delta = this.getValue(args[2]);
  //       } else {
  //         to = args[0];
  //         value = this.getValue(args[0]);
  //         delta = this.getValue(args[1]);
  //       }

  //       if (!this.isStackReference(to)) {
  //         throw new Error(`Invalid stack reference: ${to}.`);
  //       }

  //       this.stacks[to].push(value + delta);
  //       break;

  //     case "SUB":
  //       var to, value, delta;

  //       if (args.length == 3) {
  //         to = args[0];
  //         value = this.getValue(args[1]);
  //         delta = this.getValue(args[2]);
  //       } else {
  //         to = args[0];
  //         value = this.getValue(args[0]);
  //         delta = this.getValue(args[1]);
  //       }

  //       // Checks and errors
  //       if (!this.isStackReference(to)) {
  //         throw new Error(`Invalid stack reference: ${to}.`);
  //       }

  //       if (typeof value !== typeof delta) {
  //         throw new Error(
  //           `Cannot subtract ${typeof delta} from ${typeof value}.`
  //         );
  //       }

  //       var validDataTypes = ["number", "string", "boolean"];
  //       if (
  //         !validDataTypes.includes(typeof value) ||
  //         !validDataTypes.includes(typeof delta)
  //       ) {
  //         throw new Error(
  //           `Cannot subtract ${typeof delta} from ${typeof value}.`
  //         );
  //       }

  //       // Value setting
  //       if (typeof value === "string") {
  //         this.stacks[to].push(value.replace(delta, ""));
  //       } else {
  //         this.stacks[to].push(value - delta);
  //       }
  //       break;

  //     case "DIV":
  //       var to, value, divisor;

  //       if (args.length == 3) {
  //         to = args[0];
  //         value = this.getValue(args[1]);
  //         divisor = this.getValue(args[2]);
  //       } else {
  //         to = args[0];
  //         value = this.getValue(args[0]);
  //         divisor = this.getValue(args[1]);
  //       }

  //       // Checks and errors
  //       if (!this.isStackReference(to)) {
  //         throw new Error(`Invalid stack reference: ${to}.`);
  //       }

  //       if (typeof value !== typeof divisor) {
  //         throw new Error(
  //           `Cannot divide ${typeof value} by ${typeof divisor}.`
  //         );
  //       }

  //       var validDataTypes = ["number"];
  //       if (
  //         !validDataTypes.includes(typeof value) ||
  //         !validDataTypes.includes(typeof divisor)
  //       ) {
  //         throw new Error(
  //           `Cannot divide ${typeof value} by ${typeof divisor}.`
  //         );
  //       }

  //       // Value setting
  //       this.stacks[to].push(value / divisor);
  //       break;

  //     case "DIVINT":
  //       var to, value, divisor;

  //       if (args.length == 3) {
  //         to = args[0];
  //         value = this.getValue(args[1]);
  //         divisor = this.getValue(args[2]);
  //       } else {
  //         to = args[0];
  //         value = this.getValue(args[0]);
  //         divisor = this.getValue(args[1]);
  //       }

  //       // Checks and errors
  //       if (!this.isStackReference(to)) {
  //         throw new Error(`Invalid stack reference: ${to}.`);
  //       }

  //       if (typeof value !== typeof divisor) {
  //         throw new Error(
  //           `Cannot divide ${typeof value} by ${typeof divisor}.`
  //         );
  //       }

  //       var validDataTypes = ["number"];
  //       if (
  //         !validDataTypes.includes(typeof value) ||
  //         !validDataTypes.includes(typeof divisor)
  //       ) {
  //         throw new Error(
  //           `Cannot divide ${typeof value} by ${typeof divisor}.`
  //         );
  //       }

  //       // Value setting
  //       this.stacks[to].push(Math.trunc(value / divisor));
  //       break;

  //     case "MOD":
  //       var to, value, divisor;

  //       if (args.length == 3) {
  //         to = args[0];
  //         value = this.getValue(args[1]);
  //         divisor = this.getValue(args[2]);
  //       } else {
  //         to = args[0];
  //         value = this.getValue(args[0]);
  //         divisor = this.getValue(args[1]);
  //       }

  //       // Checks and errors
  //       if (!this.isStackReference(to)) {
  //         throw new Error(`Invalid stack reference: ${to}.`);
  //       }

  //       if (typeof value !== typeof divisor) {
  //         throw new Error(
  //           `Cannot divide ${typeof value} by ${typeof divisor}.`
  //         );
  //       }

  //       var validDataTypes = ["number"];
  //       if (
  //         !validDataTypes.includes(typeof value) ||
  //         !validDataTypes.includes(typeof divisor)
  //       ) {
  //         throw new Error(
  //           `Cannot divide ${typeof value} by ${typeof divisor}.`
  //         );
  //       }

  //       // Value setting
  //       if (op == "MOD") {
  //         this.stacks[to].push(value % divisor);
  //       } else {
  //         this.stacks[to].push(
  //           op == "DIVINT" ? Math.trunc(value / divisor) : value / delta
  //         );
  //       }
  //       break;

  //     case "MUL":
  //       var to, value, multiple;

  //       if (args.length == 3) {
  //         to = args[0];
  //         value = this.getValue(args[1]);
  //         multiple = this.getValue(args[2]);
  //       } else {
  //         to = args[0];
  //         value = this.getValue(args[0]);
  //         multiple = this.getValue(args[1]);
  //       }

  //       // Checks and errors
  //       if (!this.isStackReference(to)) {
  //         throw new Error(`Invalid stack reference: ${to}.`);
  //       }

  //       if (typeof value !== typeof multiple) {
  //         throw new Error(
  //           `Cannot multiply ${typeof value} by ${typeof multiple}.`
  //         );
  //       }

  //       var validDataTypes = ["number", "string", "boolean"];
  //       if (
  //         !validDataTypes.includes(typeof value) ||
  //         !validDataTypes.includes(typeof multiple)
  //       ) {
  //         throw new Error(
  //           `Cannot multiply ${typeof value} by ${typeof multiple}.`
  //         );
  //       }

  //       // Value setting
  //       if (typeof value === "string") {
  //         this.stacks[to].push(value.repeat(multiple));
  //       } else if (typeof multiple === "string") {
  //         throw new Error(
  //           `Cannot multiply ${typeof value} by ${typeof multiple}.`
  //         );
  //       } else {
  //         this.stacks[to].push(Number(value) * Number(multiple));
  //       }
  //       break;

  //     case "SWAP":
  //       const s1 = stack.pop();
  //       const s2 = stack.pop();
  //       if (s1 !== undefined && s2 !== undefined) {
  //         stack.push(s1);
  //         stack.push(s2);
  //       } else {
  //         console.log("SWAP operation requires two operands");
  //       }
  //       break;

  //     case "EMPTY":
  //       while (!stack.isEmpty()) {
  //         stack.pop();
  //       }
  //       break;

  //     case "PRINT":
  //       if (arg && arg.startsWith("$")) {
  //         const targetStackNumber = Number(arg.slice(1));
  //         const targetStack = this.stacks[targetStackNumber];
  //         if (!targetStack) {
  //           throw new Error(`Stack ${targetStackNumber} does not exist`);
  //         }
  //         console.log(targetStack.peek()); //Print from target
  //       } else {
  //         throw new Error(
  //           "PRINT operation requires a stack reference starting with '$'"
  //         );
  //       }
  //       break;

  //     default:
  //       console.error(`Unknown instruction: ${op}`);
  //   }
//   }






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

  // Other methods like getValue, isStackReference, etc. remain unchanged

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
        // Skip over the processed block
        i = ifBlock.endIndex;
      } else if (op === "ELSE" || op === "ENDIF") {
        // These are handled during block extraction, so just continue
        i++;
      } else {
        // For all other instructions
        this.executeSingle(instruction);
        i++;
      }
    }
  }

  // Extract the block of instructions for IF, ELSE, ENDIF
  extractConditionalBlock(instructions, startIndex) {
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
      } else if (op === "ENDIF") {
        if (depth === 0) {
          // End of the current IF block
          break;
        } else {
          // End of a nested IF block
          depth--;
          ifInstructions.push(instruction);
        }
      } else if (op === "ELSE" && depth === 0) {
        // Found ELSE at the current IF block level
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
      endIndex: i + 1, // The index of the instruction after ENDIF
    };
  }

  executeSingle(instruction) {
    const parts = instruction.trim().split(/\s+/);
    const op = parts[0];
    let args = parts.slice(1);

    const operations = {
      // Other operations like PUSH, ADD, etc. remain unchanged
    };

    const aliases = {
      PUSH: "PUSH",
      "𖤍": "PUSH",
      IF: "IF",
      "𖤛": "IF", // Example of using runes as aliases
      ELSE: "ELSE",
      "𖤚": "ELSE",
      ENDIF: "ENDIF",
      "𖤜": "ENDIF",
    };

    const operation = aliases[op];
    if (operation && operations[operation]) {
      operations[operation](args);
    } else {
      console.error(`Unknown instruction: ${op}`);
    }
  }
}
