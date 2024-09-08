<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import CustomLoader from '../components/global/CustomLoader.vue'
import CustomSubmit from '../components/form/customSubmit.vue';
import SimpleTable from '../components/simpleTable.vue'
import { useTabStore } from '../stores/Tabs';
import { useAxios } from '../hooks/useAxios.js';

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

const killProcess = (processId) => {
    console.log(processId);

    const request = `KILL ${parseInt(processId)};`

    const result = ref({});
    result.value = useAxios({ url: `/sql/information_schema/raw-query?request=${request}`, method: 'GET' });
}

onBeforeUnmount(() => {
    socket.close();
})
</script>

<template>
    <CustomLoader :loading="loading" :error="error" loading-text="Connecting...">
        <div v-if="processList">
            <SimpleTable
                :no-margin="true"
                :columns="{'Kill': 0, 'Id': 0, 'User': 0, 'Host': 0, 'db': 0, 'Command': 0, 'Time': 0, 'State': 0, 'Info': 0}"
            >
                <template v-slot:tableContent>
                    <tr v-for="process in processList">
                        <td>
                            <CustomSubmit
                                label="KILL"
                                type="button"
                                @click="() => killProcess(process.Id)"
                            />
                        </td>
                        <td>{{ process.Id }}</td>
                        <td>{{ process.User }}</td>
                        <td>{{ process.Host }}</td>
                        <td>{{ process.db }}</td>
                        <td>{{ process.Command }}</td>
                        <td>{{ process.Time }}</td>
                        <td>{{ process.State }}</td>
                        <td>{{ process.Info }}</td>
                    </tr>
                </template>
            </SimpleTable>
        </div>
    </CustomLoader>
</template>

<style scoped>
button {
    padding: 0.2em 0.5em;
    background-color: red;
    font-size: small;
}
</style>