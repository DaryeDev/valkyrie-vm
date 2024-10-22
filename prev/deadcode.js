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