<script setup>
import { onBeforeMount, ref, watch } from 'vue';
import { useDBConnectStore } from '../../stores/DBConnect'
import { storeToRefs } from 'pinia';

const { database, table } = storeToRefs(useDBConnectStore())
const selectedTab = ref('Structure');
const tabs = ref([]);
const getTabs = () => {
    selectedTab.value = 'Structure'
    const tabList = [
        // DATABASE structure
        {
            title: 'Structure',
            path: `/database/${database.value}/structure`,
            conditions: {
                display: table.value === null,
                click: database.value !== null && table.value === null
            }
        },
        // TABLE structure
        {
            title: 'Structure',
            path: `/database/${database.value}/${table.value}/structure`,
            conditions: {
                display: table.value !== null,
                click: table.value !== null
            }
        },
        // TABLE datas
        {
            title: 'Datas',
            path: `/database/${database.value}/${table.value}/datas`,
            conditions: {
                display: table.value !== null,
                click: table.value !== null
            }
        },
        // DATABASE SQL
        {
            title: 'SQL',
            path: `/database/${database.value}/sql`,
            conditions: {
                display: true,
                click: database.value !== null
            }
        },
    ]
    tabs.value = tabList.filter((tab) => {
        return tab.conditions.display === true
    })
}
watch([database, table], getTabs);
onBeforeMount(getTabs);


const selectTab = (tabName) => {
    selectedTab.value = tabName
}
</script>

<template>
    <div class="tab-container">
        <div v-for="tab in tabs" :class="(tab.conditions.click && tab.title === selectedTab ? 'selected' : '')+' '+(tab.conditions.click ? 'pointer' : 'default')">
            <RouterLink v-if="tab.conditions.click" @click="selectTab(tab.title)" :to="tab.path">{{ tab.title }}</RouterLink>
            <div v-else>{{ tab.title }}</div>
        </div>
        <!-- <span>+</span> -->
    </div>
</template>

<style scoped>
.tab-container {
    display: flex;
    gap: 0.5em;
}

.tab-container * {
    transition: all 0.2s ease-in-out;
}

.tab-container>div,
.tab-container>span {
    background-color: var(--color-background-light);
}

.tab-container>div.pointer,
.tab-container span {
    cursor: pointer;
}

.tab-container>div.default {
    cursor: default;
}

.tab-container>div {
    padding: 0.2em 0.7em;
    border-radius: 0.5em 0;
    opacity: 0.5;
}

.tab-container>div.selected {
    opacity: 1;
    -webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3);
    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3);
}

.tab-container>span {
    padding: 0.2em;
    border-radius: 50%;
    width: 1.5em;
    height: 1.5em;
    text-align: center;
}
</style>