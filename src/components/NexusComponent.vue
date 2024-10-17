<template>
  <div class="multi-stack-container">
    <div class="stacks-grid">
      <StackComponent
        v-for="(stack, index) in stacks"
        :key="index"
        :ref="el => { if (el) stackRefs[index] = el }"
        :separatorText="`$${index + 1}`"
        :reverse="index % 2 === 0"
      />
    </div>
    <div class="global-controls">
      <button @click="pushAll">Push All</button>
      <button @click="popAll">Pop All</button>
      <button @click="peekAll">Peek All</button>
    </div>
    <div class="operation-results">
      <div v-for="(result, index) in operationResults" :key="index">
        Stack {{ index + 1 }}: {{ result }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StackComponent from './StackComponent.vue'; // Asegúrate de que la ruta sea correcta

const stacks = ref(Array(8).fill(null));
const stackRefs = ref([]);
const operationResults = ref(Array(8).fill(''));

onMounted(() => {
  // Asegurarse de que tenemos todas las referencias después del montaje
  stackRefs.value = stackRefs.value.filter(ref => ref != null);
});

const pushAll = () => {
  stackRefs.value.forEach((stack, index) => {
    stack.push();
    operationResults.value[index] = `Pushed to stack ${index + 1}`;
  });
};

const popAll = () => {
  stackRefs.value.forEach((stack, index) => {
    const result = stack.pop();
    operationResults.value[index] = result !== null ? `Popped ${result} from stack ${index + 1}` : `Stack ${index + 1} is empty`;
  });
};

const peekAll = () => {
  stackRefs.value.forEach((stack, index) => {
    const result = stack.peek();
    operationResults.value[index] = result !== null ? `Peeked ${result} from stack ${index + 1}` : `Stack ${index + 1} is empty`;
  });
};
</script>

<style scoped>
.multi-stack-container {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.stacks-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.global-controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.global-controls button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.global-controls button:hover {
  background-color: #45a049;
}

.operation-results {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.operation-results div {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
}
</style>