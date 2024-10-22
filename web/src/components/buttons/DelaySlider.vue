<template>
    <div class="slider-container">
        <input type="range" name="" id="delaySliderInput" min="0" max="1000" :value="delay" @input="emit('update:delay', $event.target.valueAsNumber)">
        <div class="slider-label">
            <p>🐌</p>
            <p>{{ delay }}ms</p>
        </div>
    </div>
</template>

<script setup>
    const props = defineProps({
        delay: {
            type: Number,
            default: 500,
        },
    });
    
    const emit = defineEmits(["update:delay"]);
</script>

<style scoped lang="postcss">
    .slider-container {
        background: #9e9e9e;
        border: none;
        height: 200px;
        width: 60px;
        border-radius: 25px;
        padding: 10px;
        transition: background-color 0.3s;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .slider-label {
            font-family: 'Inter', sans-serif;
            text-align: center;
            color: white;

            p {
                margin: 0;
            }
        }


        #delaySliderInput {
            flex-grow: 1;
            width: 30px;
            height: 100%;
            background: #9e9e9e;
            cursor: pointer;

            writing-mode: vertical-lr;
            direction: rtl;
            appearance: slider-vertical;
            vertical-align: bottom;


            &:hover {
                background-color: #696969;
            }
        }
    }
</style>