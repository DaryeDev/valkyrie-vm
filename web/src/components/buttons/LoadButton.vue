<template>
    <button @click="loadFile" title="Load">
        <ion-icon name="cloud-upload"></ion-icon>
    </button>
</template>

<script setup>
    const emit = defineEmits(["loadText"]);

    const loadFile = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.val';
        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const text = event.target.result;
                    emit('loadText', text);
                };
                reader.readAsText(file);
            }
        });
        fileInput.click();
    }
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