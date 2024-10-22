<script setup>
  import { ref, onMounted } from 'vue';
  import StackComponent from './StackComponent.vue';
  import LineEditor from './LineEditor.vue';

  const stackNumber = ref(8); // No cambiar de 8, no se ve bonito en la interfaz
  const stacks = ref(Array(stackNumber.value).fill(null));
  const stackRefs = ref([]);

  var lineEditor = ref();
  const fullText = ref('PUSH $10\nPUSH $11\nPUSH $12\nPUSH $11\nPUSH $12\nPUSH $11\nPUSH $12');
  const currentLine = ref(0);

  onMounted(() => {
    stackRefs.value = stackRefs.value.filter(ref => ref != null);
  });

  const pushAll = () => {
    stackRefs.value.forEach((stack, index) => {
      stack.push();
    });
  };

  const popAll = () => {
    stackRefs.value.forEach((stack, index) => {
      const result = stack.pop();
    });
  };
</script>

<template>
  <div class="stacksContainer">
    <StackComponent
        v-for="(stack, index) in stacks"
        class="stack"
        :key="index"
        :ref="el => { if (el) stackRefs[index] = el }"
        :separatorText="index === stacks.length - 1 ? '$B' : `$${index + 1}`"
        :rotation="((360 / stackNumber) * (index % stackNumber))+180"
      />
  </div>
  <div class="lineEditor">
    <LineEditor
      ref="lineEditor"
      v-model="fullText"
      v-model:currentLineIndex="currentLine"
    />
  </div>
  <div class="global-controls" style="z-index: 1;">
    <button @click="pushAll">Push All</button>
    <button @click="popAll">Pop All</button>
    <textarea name="" id="" cols="30" rows="10" v-model="fullText"></textarea>
  </div>
</template>

<style scoped lang="postcss">
  .stacksContainer {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    position: relative;
    width: 500px;
    height: 440px;

    .stack {
      transform-origin: top;
      margin: 10px;
      position: absolute;

      &:nth-child(2) {
        top: 62px;
        right: -10px;
      }
      &:nth-child(3) {
        top: 210px;
        right: -72px;
      }
      &:nth-child(4) {
        top: 358px;
        right: -10px;
      }
      &:nth-child(5) {
        top: 420px;
      }
      &:nth-child(6) {
        top: 358px;
        left: -10px;
      }
      &:nth-child(7) {
        top: 210px;
        left: -72px;
      }
      &:nth-child(8) {
        top: 62px;
        left: -10px;
      }
    }
  }

  .lineEditor {
    display: flex;
    position: absolute;
    justify-content: center;
    gap: 10px;
  }

  .global-controls {
    display: flex;
    position: absolute;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
    bottom: 0;
    left: 0;
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