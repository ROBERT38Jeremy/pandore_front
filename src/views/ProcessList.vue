<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import CustomLoader from '../components/global/CustomLoader.vue'
import SimpleTable from '../components/simpleTable.vue'
import { useTabStore } from '../stores/Tabs';

const { selectTab } = useTabStore();
const socket = new WebSocket('ws://localhost:3002');
const processList = ref([]);
const error = ref(null)
const loading = ref(true);

socket.onmessage = (event) => {
    const response = JSON.parse(event.data);

    if (response.success !== false) {
        processList.value = response.success
    } else {
        error.value = response.error
    }
    loading.value = false;
}
onMounted(() => {
    selectTab('Process List');
    setTimeout(() => {
        socket.send('');
    }, 1000);
})

onBeforeUnmount(() => {
    socket.close();
})
</script>

<template>
    <CustomLoader :loading="loading" :error="error" loading-text="Connecting...">
        <div v-if="processList">
            <h2>Process List</h2>
            <SimpleTable :datas="processList"/>
        </div>
    </CustomLoader>
</template>

<style scoped>

h2 {
    padding-left: 2em;
    width: fit-content;
    position: sticky;
    left: 0;
}
</style>