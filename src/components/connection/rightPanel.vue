<script setup>
import { ref } from 'vue';

const displayRightPanel = ref(true);

function closeRightPanel() {
    displayRightPanel.value = false;
}
</script>

<template>
    <div class="right-panel" v-if="displayRightPanel">
        <svg @click="closeRightPanel">
            <line x1="10" y1="10" x2="23" y2="23" stroke="red" stroke-width="2" />
            <line x1="23" y1="10" x2="10" y2="23" stroke="red" stroke-width="2" />
        </svg>
        <h1>NEMESIS</h1>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu lacus rutrum, facilisis ante et, imperdiet dui. Nunc facilisis consectetur lectus, ac commodo leo lacinia ut. Curabitur at leo elementum elit varius posuere non id lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Interdum et malesuada fames ac ante ipsum primis in faucibus.
        </p>
    </div>
</template>

<style scoped>
.ritgh-panel h1 {
    text-transform: uppercase;
    text-align: center;
}

.right-panel {
    background-color: #23283a;
    box-shadow: 0px 0px 40px 0px rgba(0,0,0,0.10);
    max-height: 25em;
    min-width: 25em;
    padding: 3em 6em;
    color: white;
    position: relative;
}

.right-panel p {
    color: rgba(255, 255, 255, 0.5);
}

svg {
    position: absolute;
    top: 1em;
    left: calc(100% - 3em);
}
</style>