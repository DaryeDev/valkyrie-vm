<script setup>
  import { ref } from 'vue';
  import NexusComponent from './components/NexusComponent.vue';

  // Import buttons
  import LoadButton from './components/buttons/LoadButton.vue';
  import SaveButton from './components/buttons/SaveButton.vue';
  import StartStopButton from './components/buttons/StartStopButton.vue';
  import CleanButton from './components/buttons/cleanButton.vue';
  import newScriptButton from './components/buttons/newScriptButton.vue';

  const text = ref('');
  const delay = ref(500);
  const isRunning = ref(false);

  const nexusComponentElement = ref(null);
</script>

<template>
  <NexusComponent ref="nexusComponentElement" v-model="text" :delay="delay" :isRunning="isRunning" @update:modelValue="newText => text = newText" @startRunning="isRunning = true" @stopRunning="isRunning = false"/>

  <div class="buttons">
    <SaveButton :text="text"/>
    <LoadButton @load-text="newText => text = newText"/>
    <CleanButton @cleanStacks="nexusComponentElement.nuke()"/>
    <newScriptButton @newScript="text = ''"/>
    <StartStopButton :isRunning="isRunning" @start="nexusComponentElement.runAll()" @stop="isRunning = false"/>
  </div>
</template>

<style scoped>
  .buttons {
    position: absolute;
    bottom: 20px;
    right: 20px;
    display: flex;
    gap: 10px;
    flex-direction: column;
  }
</style>
