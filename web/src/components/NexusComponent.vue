<script setup>
  import { ref, onMounted } from 'vue';
  import StackComponent from './StackComponent.vue';
  import LineEditor from './LineEditor.vue';

  import ValkyrieVM from "../../../vm.mjs"
  const vm = new ValkyrieVM();

  vm.execute("PRINT \"Hola desde ValkyrieVM!\"")

  const stackNumber = ref(8); // No cambiar de 8, no se ve bonito en la interfaz
  const stacks = ref(Array(stackNumber.value).fill(null));

  const lineEditor = ref();
  const fullText = ref('PUSH $1 10\nPUSH $1 23\nPUSH $1 3\nPRINT $1\nCOMPACT $1\nPRINT $1');
  const currentLine = ref(0);

  const outputText = ref('Hola Mundo!');

  onMounted(() => {
    stacks.value = stacks.value.filter(ref => ref != null);

    var stackNames = Object.keys(vm.stacks);
    for (let i = 0; i < stacks.value.length; i++) {
      vm.stacks[stackNames[i]].addEventListener('push', async (value) => {
        stacks.value[i].push(value);

        // Pausa falsa
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 500);
        });
      }, true);

      vm.stacks[stackNames[i]].addEventListener('pop', async (value) => {
        stacks.value[i].pop();

        // Pausa falsa
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 500);
        });
      }, true);

      vm.addEventListener('print', async (value) => {
        outputText.value = value;

        // Pausa falsa
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 500);
        });
      }, true)
    }
  });

  const pushAll = () => {
    var stackNames = Object.keys(vm.stacks);
    stackNames.forEach((stackName, index) => {
      vm.stacks[stackName].push(Math.floor(Math.random() * 9) + 1);
    });
  };

  const popAll = () => {
    var stackNames = Object.keys(vm.stacks);
    stackNames.forEach((stackName, index) => {
      vm.stacks[stackName].pop();
    });
  };

  const nuke = () => {
    var stackNames = Object.keys(vm.stacks);
    stackNames.forEach((stackName, index) => {
      vm.stacks[stackName].clear();
    });
  };

  const runAll = async () => {
    var commands = fullText.value.split('\n')

    for (let i = 0; i < commands.length; i++) {
      currentLine.value = i;
      await vm.execute(commands[i]);
    }
  }
</script>

<template>
  <div class="nexusWrapper">
    <div class="stacksContainer">
      <StackComponent
          v-for="(stack, index) in stacks"
          class="stack"
          :key="index"
          :ref="el => { if (el) stacks[index] = el }"
          :separatorText="index === stacks.length - 1 ? '$B' : `$${index + 1}`"
          :rotation="((360 / stackNumber) * (index % stackNumber))+180"
        />
    </div>

    <div class="lineEditor">
      <LineEditor
        ref="lineEditor"
        v-model="fullText"
        v-model:current-line-index="currentLine"
      />
    </div>

    <p class="outputText">{{ outputText }}</p>

    <div class="global-controls" style="z-index: 1;">
      <button @click="pushAll">Push All</button>
      <button @click="popAll">Pop All</button>
      <button @click="nuke">Nuke</button>
      <button @click="runAll">Run All</button>
      <textarea name="" id="" cols="30" rows="10" v-model="fullText"></textarea>
    </div>
  </div>
</template>

<style scoped lang="postcss">
  .nexusWrapper {
    font-family: 'Inter', sans-serif;
    width: 100vw;
    height: 100vh;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

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

  .outputText {
    font-family: monospace;
    font-size: 20px;
    position: absolute;
    bottom: 380px;
    display: flex;
    justify-content: center;
    align-items: center;

    &.error {
      color: red;
    }
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