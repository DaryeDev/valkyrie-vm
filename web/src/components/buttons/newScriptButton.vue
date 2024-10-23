<template>
    <button @click="emit('newScript')" title="New Script">
        <ion-icon name="document"></ion-icon>
    </button>
</template>

<script setup>
    const emit = defineEmits(["newScript"]);
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

        &:hover {
            background-color: #696969;
        }
    }
</style>