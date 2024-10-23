<script setup>
import { ref, onMounted } from "vue";
import NexusComponent from "./components/NexusComponent.vue";

// Import buttons
import LoadButton from "./components/buttons/LoadButton.vue";
import SaveButton from "./components/buttons/SaveButton.vue";
import StartStopButton from "./components/buttons/StartStopButton.vue";
import CleanButton from "./components/buttons/cleanButton.vue";
import newScriptButton from "./components/buttons/newScriptButton.vue";
import DelaySlider from "./components/buttons/DelaySlider.vue";

const text = ref("");
const delay = ref(500);
const isRunning = ref(false);

const nexusComponentElement = ref(null);

onMounted(() => {
	const fileInput = document.getElementById("fileDropperInput");
	const dropOverlayElement = document.getElementById("dropOverlay");

	function showDropZone() {
		dropOverlayElement.classList.add("show");
	}
	function hideDropZone() {
		dropOverlayElement.classList.remove("show");
	}

	function allowDrag(e) {
		e.dataTransfer.dropEffect = "copy";
		e.preventDefault();
	}

	function handleDrop(e) {
		e.preventDefault();
		hideDropZone();

		const archivo = e.dataTransfer.files[0];
		fileInput.files = e.dataTransfer.files;
		if (archivo && archivo.name.endsWith(".val")) {
			const reader = new FileReader();
			reader.onload = (event) => {
				text.value = event.target.result;
			};
			reader.readAsText(archivo);
		}
	}

	// 1
	window.addEventListener("dragenter", function (e) {
		showDropZone();
	});

	// 2
	dropOverlayElement.addEventListener("dragenter", allowDrag);
	dropOverlayElement.addEventListener("dragover", allowDrag);

	// 3
	dropOverlayElement.addEventListener("dragleave", function (e) {
		console.log("dragleave");
		hideDropZone();
	});

	// 4
	dropOverlayElement.addEventListener("drop", handleDrop);
});
</script>

<template>
	<div id="appWrapper">
		<div id="dropOverlay">
			<p>Drop a .val file here</p>
		</div>
		<NexusComponent ref="nexusComponentElement" v-model="text" :delay="delay" :isRunning="isRunning"
			@update:modelValue="(newText) => (text = newText)" @startRunning="isRunning = true"
			@stopRunning="isRunning = false" />

		<div class="buttons">
			<CleanButton @cleanStacks="nexusComponentElement.nuke()" />
			<SaveButton :text="text" />
			<LoadButton @load-text="(newText) => (text = newText)" />
			<newScriptButton @newScript="text = ''" />
			<StartStopButton :isRunning="isRunning" @start="nexusComponentElement.runAll()" @stop="isRunning = false" />
		</div>

		<DelaySlider class="delay-slider" :delay="delay" @update:delay="(newDelay) => (delay = newDelay)" />

		<input type="file" id="fileDropperInput" style="display: none" accept=".val" />
	</div>
</template>

<style scoped lang="postcss">
#appWrapper {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.buttons {
	position: absolute;
	bottom: 20px;
	right: 20px;
	display: flex;
	gap: 10px;
	flex-direction: column;
}

.delay-slider {
	position: absolute;
	bottom: 20px;
	left: 20px;
}

#dropOverlay {
	position: absolute;
	width: 100%;
	height: 100%;
	display: none;
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, 0.5);
	z-index: 1000;

	p {
		font-family: "Inter", sans-serif;
		color: white;
		pointer-events: none;
		user-select: none;
	}

	&.show {
		display: flex;
	}
}
</style>
