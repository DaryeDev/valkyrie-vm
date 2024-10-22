<template>
  <div class="editor-container" @wheel="interpretScroll" @keydown="handleKeyDown">
    <div class="editor">
      <div class="lines" ref="linesElement">
        <div
          v-for="(line, index) in lines"
          :key="index"
          class="line-wrapper"
          :class="{ current: index === currentIndex }"
          :ref="
            (el) => {
              if (index === currentIndex) currentLineRef = el;
            }
          "
        >
          <input v-model="lines[index]" @input="updateText" />
        </div>
      </div>
    </div>
    <div class="fade-top" @click="goUp"></div>
    <div class="fade-bottom" @click="goDown"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  currentLineIndex: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["update:modelValue", "update:currentLineIndex"]);

const currentLineRef = ref(null);
const lines = ref(props.modelValue.split("\n").concat(""));
const linesElement = ref(null);

const currentIndex = computed({
  get: () => props.currentLineIndex,
  set: (value) => {
    if (value >= 0 && value < lines.value.length) {
      currentLineRef.value?.lastElementChild?.focus();
      currentLineRef.value?.lastElementChild?.blur();
      emit("update:currentLineIndex", value);
      nextTick(() => {
        currentLineRef.value?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        
        setTimeout(() => {
          currentLineRef.value?.lastElementChild?.focus();
        }, 150);
      });
    }
  },
});

watch(
  () => props.modelValue,
  (newValue) => {
    lines.value = newValue.split("\n").concat("");
  }
);

watch(
  () => props.currentLineIndex,
  (newValue) => {
    currentIndex.value = newValue;
  }
);

function goUp() {
  currentIndex.value = currentIndex.value - 1;
}

function goDown() {
  currentIndex.value = currentIndex.value + 1;
}

function interpretScroll(e) {
  e.preventDefault();
  if (e.deltaY > 0) {
    goDown();
  } else if (e.deltaY < 0) {
    goUp();
  }
}

const updateText = () => {
  emit("update:modelValue", lines.value.join("\n"));
};

const handleKeyDown = (e) => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    goDown();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    goUp();
  } else if (e.target === currentLineRef.value?.lastElementChild) {
    if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) {
        goUp();
      } else {
        goDown();
      }
    } else if (e.key === "Enter") { // Add new line below
      e.preventDefault();
      lines.value.splice(currentIndex.value+1, 0, "");
      emit("update:modelValue", lines.value.join("\n"));
      goDown();
    } else if (e.key === "Backspace") {
      if (lines.value[currentIndex.value].length === 0) { // If it's an empty line, remove when hitting backspace
        e.preventDefault();
        lines.value.splice(currentIndex.value, 1);
        emit("update:modelValue", lines.value.join("\n"));
        goUp();
      }
    }
  }
};
</script>

<style scoped lang="postcss">
.editor-container {
  position: relative;
  height: 192px; /* Alto exacto para 3 líneas (64px * 3) */
  overflow: hidden;
}

.editor {
  height: 192px;
  overflow-y: hidden;

  .lines {
    overflow-y: scroll;
    overflow-y: auto;
    padding: 64px 0;
  }
}

.line-wrapper {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:not(.current) {
    pointer-events: none;
    user-select: none;
  }
}

.line-wrapper input {
  width: 100%;
  height: 100%;
  text-align: center;
  font-family: monospace;
  font-size: 2rem;
  background: transparent;
  border: none;
  outline: none;
}

/* Degradados */
.fade-top,
.fade-bottom {
  position: absolute;
  left: 0;
  right: 0;
  height: 64px;
}

.fade-top {
  top: 0;
  background: linear-gradient(
    to bottom,
    rgb(255, 255, 255) 0%,
    rgba(255, 255, 255, 0.8) 50%,
    rgba(255, 255, 255, 0) 100%
  );
}

.fade-bottom {
  bottom: 0;
  background: linear-gradient(
    to top,
    rgb(255, 255, 255) 0%,
    rgba(255, 255, 255, 0.8) 50%,
    rgba(255, 255, 255, 0) 100%
  );
}

/* Ocultar scrollbar pero mantener funcionalidad */
.editor {
  scrollbar-width: none; /* Firefox */
}

.editor::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}
</style>