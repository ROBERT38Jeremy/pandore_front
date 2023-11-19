<script setup>
import { onMounted, ref, toRef, watch, watchEffect } from 'vue';
import { useAxios } from '../hooks/useAxios.js';
import { formatBytes } from '../hooks/formatBytes.js';
import CustomLoader from '../components/global/CustomLoader.vue'
import { useDBConnectStore } from '../stores/DBConnect'
import { useRouter } from 'vue-router'

const router = useRouter()
const { setTable, unsetTable } = useDBConnectStore()
const props = defineProps({
    databaseName: {
        type: String,
    },
});
const loading = ref(false);
const databaseTables = ref({});
const database = toRef(props, "databaseName");

const chooseDatabase = () => {
    const result = ref({});

    loading.value = true;
    result.value = useAxios({ url: `/database/${database.value}/data`, method: 'GET' });

    watchEffect(() => {
        if (result.value.isLoading === false && result.value.resp.data.success) {
            databaseTables.value = result.value.resp.data.success;
            loading.value = false; // commenter pour tester le chargement
        }
    })
}

const selectTable = (tableName) => {
    setTable(tableName)
    router.push('/database/'+database.value+'/'+tableName+'/structure')
}

watch(database, chooseDatabase);
onMounted(chooseDatabase)
</script>

<template>
    <h2>
        <RouterLink :to="'/database/'+database+'/structure'" @click="unsetTable">{{ database }}</RouterLink> >
        Structure
    </h2>
    <CustomLoader :loading="loading">
        <table v-if="databaseTables">
            <tr>
                <th></th>
                <th>Table</th>
                <th>Moteur</th>
                <th>Interclassement</th>
                <th>Nombre de lignes</th>
                <th>Taille de la table</th>
                <th>Taille de l'index</th>
                <th>Commentaire</th>
            </tr>
            <tr v-for="(datas, index) in databaseTables">
                <td>{{ index + 1 }}</td>
                <td @click="selectTable(datas.TABLE_NAME)"><a>{{ datas.TABLE_NAME }}</a></td>
                <td>{{ datas.ENGINE }}</td>
                <td>{{ datas.TABLE_COLLATION }}</td>
                <td>{{ datas.TABLE_ROWS }}</td>
                <td>{{ formatBytes(datas.DATA_LENGTH, 2) }}</td>
                <td>{{ datas.INDEX_LENGTH }}</td>
                <td>{{ datas.TABLE_COMMENT == '' ? '?' : datas.TABLE_COMMENT }}</td>
            </tr>
        </table>
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

a {
    cursor: pointer;
}
</style>