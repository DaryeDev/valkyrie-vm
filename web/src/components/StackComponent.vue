<template>
  <div class="stack" :style="{ '--rotation': rotation+'deg', '--counterrotation': (360 - rotation)+'deg', '--pushAnimation': getTranslateString(rotation), '--popAnimation': getTranslateString(rotation+180) }"  @click="dcmnt.execCommand('insertText', false, `${separatorText}`)">
    <transition-group name="stack-anim">
      <div v-if="stackItems.length > 0" key="first-item" class="stack-item first-item">
        {{ stackItems[0].value }}
      </div>
      <div v-else class="stack-item first-item">
        &nbsp;
      </div>
      <div key="separator" class="separator">
        <div class="line"></div>
        <span class="separator-text">{{ separatorText }}</span>
        <div class="line"></div>
      </div>
      <div v-for="item in stackItems.slice(1)" :key="item.id" class="stack-item other-item">
        {{ item.value }}
      </div>
    </transition-group>
  </div>
</template>

<script setup>
const dcmnt = document;
import { ref } from 'vue';

const props = defineProps({
  separatorText: {
    type: String,
    default: ''
  },
  rotation: {
    type: Number,
    default: 0
  }
});

const stackItems = ref([]);
const lastOperation = ref('');
let nextId = stackItems.value.length + 1;

function getCoordinatesFromAngle(angle) {
    // Asegurarse de que el ángulo esté en el rango de 0 a 360
    angle = angle % 360;
    if (angle < 0) angle += 360;

    // Definir las coordenadas correspondientes a cada ángulo predefinido
    const coordinates = [
        { angle: 0, x: 0, y: -20 },
        { angle: 45, x: 20, y: -20 },
        { angle: 90, x: 20, y: 0 },
        { angle: 135, x: 20, y: 20 },
        { angle: 180, x: 0, y: 20 },
        { angle: 225, x: -20, y: 20 },
        { angle: 270, x: -20, y: 0 },
        { angle: 315, x: -20, y: -20 }
    ];

    // Función para interpolar entre dos puntos
    function interpolate(point1, point2, t) {
        const x = point1.x + (point2.x - point1.x) * t;
        const y = point1.y + (point2.y - point1.y) * t;
        return { x, y };
    }

    // Encontrar los dos puntos entre los cuales se encuentra el ángulo dado
    for (let i = 0; i < coordinates.length; i++) {
        const currentPoint = coordinates[i];
        const nextPoint = coordinates[(i + 1) % coordinates.length];
        
        if (angle >= currentPoint.angle && angle <= nextPoint.angle) {
            // Calcular el factor de interpolación t
            const t = (angle - currentPoint.angle) / (nextPoint.angle - currentPoint.angle);
            // Interpolar para encontrar el punto en el ángulo dado
            return interpolate(currentPoint, nextPoint, t);
        }
    }

    // Si el ángulo es exactamente 0 o 360, devolver el punto correspondiente
    return coordinates[0];
}

const getTranslateString = (rotation) => {
  var { x, y } = getCoordinatesFromAngle(rotation);
  return `translateY(${y}px) translateX(${x}px)`;
};

const push = (value) => {
  const newItem = { id: nextId++, value: value };
  stackItems.value.unshift(newItem);
  lastOperation.value = `Pushed: ${newItem.value}`;
};

const pop = () => {
  if (stackItems.value.length > 0) {
    const poppedItem = stackItems.value.shift();
    lastOperation.value = `Popped: ${poppedItem.value}`;
    return poppedItem.value;
  }
  lastOperation.value = 'Stack is empty';
  return null;
};

const peek = () => {
  if (stackItems.value.length > 0) {
    lastOperation.value = `Peeked: ${stackItems.value[0].value}`;
    return stackItems.value[0].value;
  }
  lastOperation.value = 'Stack is empty';
  return null;
};

defineExpose({ 
  push,
  pop,
  peek
})
</script>

<style scoped lang="postcss">
.stack {
  max-width: 200px;
  text-align: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: rotate(var(--rotation));
  user-select: none;
}

.stack-item {
  margin: 5px 0;
  transition: transform 0.3s ease;
  rotate: var(--counterrotation);
  z-index: 1;
}

.first-item {
  font-size: 48px;
  margin: 0;
  font-weight: bold;
  color: #000;
  order: -1;
}

.other-item {
  font-size: 24px;
  color: #888;
}

.separator {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;

  .line {
    flex-grow: 1;
    height: 1px;
    background-color: #000;
  }
}

.separator-text {
  background-color: white;
  padding: 0 10px;
  font-size: 24px;
  font-weight: 150;
  rotate: var(--counterrotation);
}

.stack-anim-move {
  transition: transform 0.5s ease;
}

.stack-anim-enter-active,
.stack-anim-leave-active {
  transition: all 0.5s ease;
}

.stack-anim-leave-active {
  position: absolute;
}

.stack-anim-enter-active,
.stack-anim-leave-active {
  transition: all 0.5s ease;
}

.stack-anim-enter-from {
  opacity: 0;
  transform: var(--pushAnimation);
}

.stack-anim-leave-to {
  opacity: 0;
  transform: var(--popAnimation);
}

</style>