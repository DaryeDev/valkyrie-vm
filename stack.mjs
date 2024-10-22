class Stack {
  constructor() {
    this.items = [];
    this.eventListeners = {
      "push": [],
      "pop": [],
      "peek": [],
    };
  }

  async push(element) {
    this.items.push(element);

    // Esperar a que terminen todos los event listeners antes de devolver valor
    await Promise.all(
      this.eventListeners["push"].map((callback) => callback(element))
    );
  }

  async pop() {
    if (this.isEmpty()) {
      throw new Error("No elements in Stack");
    }
    var returnValue = this.items.pop();

    // Esperar a que terminen todos los event listeners antes de devolver valor
    await Promise.all(
      this.eventListeners["pop"].map((callback) => callback(returnValue))
    );

    return returnValue;
  }

  async peek() {
    if (this.isEmpty()) {
      throw new Error("No elements in Stack");
    }

    var returnValue = this.items[this.items.length - 1];

    // Esperar a que terminen todos los event listeners antes de devolver valor
    await Promise.all(
      this.eventListeners["peek"].map((callback) => callback(returnValue))
    );

    return returnValue
  }

  isEmpty() {
    return this.items.length === 0;
  }

  length() {
    return this.items.length;
  }

  async clear() {
    var length = this.items.length;
    for (let i = 0; i < length; i++) {
      await this.pop();
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
}

export default Stack;