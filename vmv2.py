import os
import sys
import turtle
import random


class Stack:
    def __init__(self, display):
        self.items = []
        self.display = display

    def push(self, item):
        self.items.append(item)
        self.display.log_operation(f"PUSH {item}")

    def pop(self):
        if not self.is_empty():
            item = self.items.pop()
            self.display.log_operation(f"POP {item}")
            return item
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
        self.display.log_operation("CLEAR")

    def duplicate(self):
        if not self.is_empty():
            self.push(self.peek())
            self.display.log_operation("DUP")
        else:
            raise IndexError("duplicate from empty stack")

    def swap(self):
        if len(self.items) < 2:
            raise IndexError("swap requires at least two items in stack")
        self.items[-1], self.items[-2] = self.items[-2], self.items[-1]
        self.display.log_operation("SWAP")

    def add(self):
        if len(self.items) < 2:
            raise IndexError("add requires at least two items in stack")
        self.push(self.pop() + self.pop())
        self.display.log_operation("ADD")

    def sub(self):
        if len(self.items) < 2:
            raise IndexError("sub requires at least two items in stack")
        self.push(self.pop() - self.pop())
        self.display.log_operation("SUB")

    def mul(self):
        if len(self.items) < 2:
            raise IndexError("mul requires at least two items in stack")
        self.push(self.pop() * self.pop())
        self.display.log_operation("MUL")

    def div(self):
        if len(self.items) < 2:
            raise IndexError("div requires at least two items in stack")
        self.push(self.pop() / self.pop())
        self.display.log_operation("DIV")

    def mod(self):
        if len(self.items) < 2:
            raise IndexError("mod requires at least two items in stack")
        self.push(self.pop() % self.pop())
        self.display.log_operation("MOD")

    def pow(self):
        if len(self.items) < 2:
            raise IndexError("pow requires at least two items in stack")
        self.push(self.pop() ** self.pop())
        self.display.log_operation("POW")


class TurtleDisplay:
    def __init__(self):
        self.screen = turtle.Screen()
        self.screen.setup(width=800, height=800)
        self.t = turtle.Turtle()
        self.t.speed(0)
        self.t.hideturtle()
        self.operations = []

    def log_operation(self, operation):
        self.operations.append(operation)
        self.draw_operations()

    def draw_operations(self):
        self.t.clear()
        angle = 360 / len(self.operations)
        radius = 300
        for i, operation in enumerate(self.operations):
            self.t.penup()
            self.t.goto(0, 0)
            self.t.setheading(angle * i)
            self.t.forward(radius)
            self.t.pendown()
            self.t.color(random.choice(["red", "green", "blue", "orange", "purple", "yellow"]))
            self.draw_trapezoid()
            self.t.penup()
            self.t.forward(25)  # Adjusted to place text inside the trapezoid
            self.t.color("black")
            self.t.write(operation, align="center", font=("Arial", 12, "normal"))
            self.t.backward(radius + 25)

    def draw_trapezoid(self):
        self.t.begin_fill()
        self.t.forward(50)
        self.t.left(120)
        self.t.forward(30)
        self.t.left(60)
        self.t.forward(50)
        self.t.left(60)
        self.t.forward(30)
        self.t.left(120)
        self.t.end_fill()

    def start(self):
        self.screen.mainloop()


class VM:
    def __init__(self, display):
        self.stack = Stack(display)
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
    display = TurtleDisplay()
    if len(sys.argv) > 1 and sys.argv[1].strip():
        file_path = sys.argv[1]
        instructions = read_instructions_from_file(file_path)
        vm = VM(display)
        vm.load_instructions(instructions)
        vm.run()
        print(vm.stack.pop())
    else:
        directory = os.path.dirname(os.path.abspath(__file__))
        val_files = find_val_files(directory)
        for file_name in val_files:
            file_path = os.path.join(directory, file_name)
            instructions = read_instructions_from_file(file_path)
            vm = VM(display)
            vm.load_instructions(instructions)
            vm.run()
            print(f"Result from {file_name}: {vm.stack.pop()}")
    display.start()
