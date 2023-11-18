<script setup>
import { ref } from 'vue';
import { useDBConnectStore } from '../../stores/DBConnect'
import { storeToRefs } from 'pinia';

const { database, table } = storeToRefs(useDBConnectStore())
const selectedTab = ref('Structure');
const tabs = [
    'Structure',
    'Données'
];

const selectTab = (tabName) => {
    selectedTab.value = tabName
}
</script>

<template>
    <div class="tab-container" v-if="table">
        <div v-for="tab in tabs" :class="(selectedTab === tab ? 'selected' : '')" @click="selectTab(tab)">{{ tab }}</div>
        <!-- <span>+</span> -->
    </div>
</template>

<style scoped>
.tab-container {
    display: flex;
    gap: 0.5em;
}

.tab-container div,
.tab-container span {
    background-color: white;
    cursor: pointer;
}

.tab-container div {
    padding: 0.2em 0.7em;
    border-radius: 0.5em;
    opacity: 0.5;
    transition: all 0.2s ease-in-out;
}

.tab-container div.selected {
    opacity: 1;
}

.tab-container span {
    padding: 0.2em;
    border-radius: 50%;
    width: 1.5em;
    height: 1.5em;
    text-align: center;
}
</style>