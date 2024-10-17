<template>
  <div class="stack" :class="{ 'reverse': reverse }">
    <transition-group name="stack-anim">
      <div v-if="stackItems.length > 0" key="first-item" class="stack-item first-item" :class="{ 'reverse': reverse }">
        {{ stackItems[0].value }}
      </div>
      <div key="separator" class="separator">
        <div class="line"></div>
        <span class="separator-text">{{ separatorText }}</span>
        <div class="line"></div>
      </div>
      <div v-for="item in stackItems.slice(1)" :key="item.id" class="stack-item other-item">
        {{ item.value }}
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  separatorText: {
    type: String,
    default: '$5'
  },
  reverse: {
    type: Boolean,
    default: false
  }
});

const stackItems = ref([
  { id: 1, value: 1 },
  { id: 2, value: 1 },
  { id: 3, value: 1 },
  { id: 4, value: 1 },
  { id: 5, value: 1 }
]);
const lastOperation = ref('');
let nextId = 6;

const push = () => {
  const newItem = { id: nextId++, value: Math.floor(Math.random() * 10) + 1 };
  stackItems.value.unshift(newItem);
  lastOperation.value = `Pushed: ${newItem.value}`;
};

const pop = () => {
  if (stackItems.value.length > 0) {
    const poppedItem = stackItems.value.shift();
    lastOperation.value = `Popped: ${poppedItem.value}`;
    return poppedItem.value;
  }
  lastOperation.value = 'Stack is empty';
  return null;
};

const peek = () => {
  if (stackItems.value.length > 0) {
    lastOperation.value = `Peeked: ${stackItems.value[0].value}`;
    return stackItems.value[0].value;
  }
  lastOperation.value = 'Stack is empty';
  return null;
};


defineExpose({ 
  push,
  pop,
  peek
})
</script>

<style scoped>
.stack {
  max-width: 200px;
  margin: 0 auto;
  text-align: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
}

.stack.reverse {
  flex-direction: column-reverse;
}

.stack-item {
  margin: 5px 0;
  transition: transform 0.3s ease;
}

.first-item {
  font-size: 48px;
  margin: 0;
  font-weight: bold;
  color: #000;
  order: -1;
}

.other-item {
  font-size: 24px;
  color: #888;
}

.separator {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;

  .line {
    flex-grow: 1;
    height: 1px;
    background-color: #000;
  }
}

.separator-text {
  background-color: white;
  padding: 0 10px;
  font-size: 24px;
  font-weight: 150;
}

.stack-anim-move {
  transition: transform 0.5s ease;
}

.stack-anim-enter-active,
.stack-anim-leave-active {
  transition: all 0.5s ease;
}

.stack-anim-leave-active {
  position: absolute;
}

.stack-anim-enter-active,
.stack-anim-leave-active {
  transition: all 0.5s ease;
}

.stack-anim-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.stack.reverse .stack-anim-enter-from {
  transform: translateY(20px);
}

.stack-anim-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.stack.reverse .stack-anim-leave-to {
  transform: translateY(-20px);
}

</style>