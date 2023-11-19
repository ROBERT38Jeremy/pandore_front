<script setup>
import { onMounted, ref, toRef, watch, watchEffect } from 'vue';
import { useAxios } from '../hooks/useAxios.js';
import CustomLoader from '../components/global/CustomLoader.vue'
import { useDBConnectStore } from '../stores/DBConnect'
import { useTabStore } from '../stores/Tabs'

const props = defineProps({
    databaseName: {
        type: String,
    },
    tableName: {
        type: String
    }
});
const { unsetTable } = useDBConnectStore()
const { selectTab } = useTabStore()
const loading = ref(false);
const tableStructure = ref([]);
const database = toRef(props, "databaseName");
const table = toRef(props, "tableName");
const message = ref(null)

const showTableStructure = () => {
    const result = ref({});

    loading.value = true;
    result.value = useAxios({ url: `/database/${database.value}/${table.value}/structure`, method: 'GET' });

    watchEffect(() => {
        if (result.value.isLoading === false && result.value?.resp?.data?.success) {
            tableStructure.value = result.value.resp.data.success;
            loading.value = false;
        } else if (result.value.isLoading === false) {
            message.value = 'Une erreur est survenue...'
            loading.value = false;
        }
    })
}

watch(database, showTableStructure);
onMounted(showTableStructure)
</script>

<template>
    <h2>
        <RouterLink :to="'/database/'+database+'/structure'" @click="unsetTable">{{ database }}</RouterLink> >
        <RouterLink :to="'/database/'+database+'/'+table+'/datas'" @click="selectTab('Datas')">{{ table }}</RouterLink> >
        Structure
    </h2>
    <CustomLoader :loading="loading">
        <table v-if="Object.entries(tableStructure).length > 0">
            <tr>
                <th></th>
                <th>Champs</th>
                <th>Type</th>
                <th>Nullable</th>
                <th>Key</th>
                <th>Default</th>
                <th>Extra</th>
            </tr>
            <tr v-for="(datas, index) in tableStructure">
                <td>{{ index + 1 }}</td>
                <td>{{ datas.Field }}</td>
                <td>{{ datas.Type }}</td>
                <td>{{ datas.Nullable ? 'yes' : '-' }}</td>
                <td>{{ datas.Key }}</td>
                <td>{{ datas.Default }}</td>
                <td>{{ datas.Extra }}</td>
            </tr>
        </table>
        <div v-else-if="message" class="message">{{ message }}</div>
    </CustomLoader>
</template>

<style scoped>
h2 {
    padding-left: 2em;
}

table {
    width: fit-content;
    border-spacing: 0;
    border-left: 1px solid rgba(216, 218, 221, 0.4);
    border-top: 1px solid rgba(216, 218, 221, 0.4);
    margin-left: 1em;
    margin-right: 1em;
}

th {
    text-align: left;
    background-color: rgb(236, 239, 244);
}

td, th {
    padding: 0.4em 0.7em;
    border-right: 1px solid rgba(216, 218, 221, 0.4);
    border-bottom: 1px solid rgba(216, 218, 221, 0.4);
}

tr td:first-child {
    text-align: center;
    background-color: rgb(236, 239, 244);
}

.message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>