import Stack from './stack.js';
import fs from 'fs';
import path from 'path';

class SimpleVM {
    constructor() {
        this.stack = new Stack();
        this.registers = {};
    }

    execute(instruction) {
        const [op, arg] = instruction.split(' ');

        switch (op) {
            case 'PUSH':
                this.stack.push(parseInt(arg, 10));
                break;
            case 'POP':
                this.stack.pop();
                break;
            case 'ADD':
                const a = this.stack.pop();
                const b = this.stack.pop();
                this.stack.push(a + b);
                break;
            case 'SUB':
                const x = this.stack.pop();
                const y = this.stack.pop();
                this.stack.push(y - x);
                break;
            case 'MUL':
                const m = this.stack.pop();
                const n = this.stack.pop();
                this.stack.push(m * n);
                break;
            case 'DIV':
                const d1 = this.stack.pop();
                const d2 = this.stack.pop();
                this.stack.push(Math.floor(d2 / d1));
                break;
            case 'SWAP':
                const s1 = this.stack.pop();
                const s2 = this.stack.pop();
                this.stack.push(s1);
                this.stack.push(s2);
                break;
            case 'EMPTY':
                while (!this.stack.isEmpty()) {
                    this.stack.pop();
                }
                break;
            case 'PRINT':
                console.log(this.stack.peek());
                break;
            default:
                console.log(`Unknown instruction: ${op}`);
        }
    }

    executeFile(filePath) {
        const instructions = fs.readFileSync(filePath, 'utf-8').split('\n');
        instructions.forEach(instruction => this.execute(instruction.trim()));
    }

    executeAllValFiles(directory) {
        const files = fs.readdirSync(directory).filter(file => path.extname(file) === '.val');
        files.forEach(file => this.executeFile(path.join(directory, file)));
    }
}

// Example usage:
const vm = new SimpleVM();
vm.execute('PUSH 10');
vm.execute('PUSH 20');
vm.execute('ADD');
vm.execute('PRINT'); // Should print 30

// Execute all .val files in the directory
vm.executeAllValFiles('/path/to/your/directory');