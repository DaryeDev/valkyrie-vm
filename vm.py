import os
import sys


class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        if not self.is_empty():
            return self.items.pop()
        else:
            raise IndexError("pop from empty stack")

    def peek(self):
        if not self.is_empty():
            return self.items[-1]
        else:
            raise IndexError("peek from empty stack")

    def is_empty(self):
        return len(self.items) == 0

    def size(self):
        return len(self.items)

    def clear(self):
        self.items = []

    def duplicate(self):
        if not self.is_empty():
            self.push(self.peek())
        else:
            raise IndexError("duplicate from empty stack")

    def swap(self):
        if len(self.items) < 2:
            raise IndexError("swap requires at least two items in stack")
        self.items[-1], self.items[-2] = self.items[-2], self.items[-1]

    def add(self):
        if len(self.items) < 2:
            raise IndexError("add requires at least two items in stack")
        self.push(self.pop() + self.pop())

    def sub(self):
        if len(self.items) < 2:
            raise IndexError("sub requires at least two items in stack")
        self.push(self.pop() - self.pop())

    def mul(self):
        if len(self.items) < 2:
            raise IndexError("mul requires at least two items in stack")
        self.push(self.pop() * self.pop())

    def div(self):
        if len(self.items) < 2:
            raise IndexError("div requires at least two items in stack")
        self.push(self.pop() / self.pop())

    def mod(self):
        if len(self.items) < 2:
            raise IndexError("mod requires at least two items in stack")
        self.push(self.pop() % self.pop())

    def pow(self):
        if len(self.items) < 2:
            raise IndexError("pow requires at least two items in stack")
        self.push(self.pop() ** self.pop())


class VM:
    def __init__(self):
        self.stack = Stack()
        self.instructions = []
        self.instruction_pointer = 0

    def load_instructions(self, instructions):
        self.instructions = instructions

    def run(self):
        while self.instruction_pointer < len(self.instructions):
            instruction = self.instructions[self.instruction_pointer]
            self.execute(instruction)
            self.instruction_pointer += 1

    def execute(self, instruction):
        if instruction == "PUSH":
            self.instruction_pointer += 1
            value = int(self.instructions[self.instruction_pointer])
            self.stack.push(value)
        elif instruction == "POP":
            self.stack.pop()
        elif instruction == "ADD":
            self.stack.add()
        elif instruction == "SUB":
            self.stack.sub()
        elif instruction == "MUL":
            self.stack.mul()
        elif instruction == "DIV":
            self.stack.div()
        elif instruction == "PEEK":
            print(self.stack.peek())
        elif instruction == "PRINT":
            print(self.stack.pop())
        elif instruction == "DUP":
            self.stack.duplicate()
        elif instruction == "SWAP":
            self.stack.swap()
        elif instruction == "CLEAR":
            self.stack.clear()
        else:
            raise ValueError(f"Unknown instruction: {instruction}")


def read_instructions_from_file(file_path):
    with open(file_path, "r") as file:
        instructions = file.read().split()
    return instructions


def find_val_files(directory):
    return [f for f in os.listdir(directory) if f.endswith(".val")]


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1].strip():
        file_path = sys.argv[1]
        instructions = read_instructions_from_file(file_path)
        vm = VM()
        vm.load_instructions(instructions)
        vm.run()
        print(vm.stack.pop())
    else:
        directory = os.path.dirname(os.path.abspath(__file__))
        val_files = find_val_files(directory)
        for file_name in val_files:
            file_path = os.path.join(directory, file_name)
            instructions = read_instructions_from_file(file_path)
            vm = VM()
            vm.load_instructions(instructions)
            vm.run()
            print(f"Result from {file_name}: {vm.stack.pop()}")
