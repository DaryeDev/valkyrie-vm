<template>
    <button @click="downloadFile" title="Save">
        <ion-icon name="cloud-download"></ion-icon>
    </button>
</template>

<script setup>
    const props = defineProps({
        text: {
            type: String,
            default: '',
        },
    })

    const downloadFile = () => {
        if (props.text) {
            const blob = new Blob([props.text], {type: "text/plain"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "output.val";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
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