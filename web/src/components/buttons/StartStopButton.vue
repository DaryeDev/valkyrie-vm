<template>
    <button @click="emit(isRunning?'stop':'start')" title="Start">
        <ion-icon :name="isRunning?'stop':'play'"></ion-icon>
    </button>
</template>

<script setup>
    const emit = defineEmits(["start", "stop"]);

    const props = defineProps({
        isRunning: {
            type: Boolean,
            default: false,
        },
    });
</script>

<style scoped lang="postcss">
    button {
        background: #9e9e9e;
        border: none;
        height: 50px;
        width: 50px;
        border-radius: 50%;
        padding: 10px;
        cursor: pointer;
        transition: background-color 0.3s;

        ion-icon {
            color: white;
            font-size: 24px;
        }

        &:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }

        &:hover {
            background-color: #696969;
        }
    }
</style>