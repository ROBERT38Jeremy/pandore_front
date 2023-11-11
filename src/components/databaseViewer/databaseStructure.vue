<script setup>
import { onMounted, ref, toRef, watch, watchEffect } from 'vue';
import { useAxios } from '../../hooks/useAxios.js';
import { formatBytes } from '../../hooks/formatBytes.js';

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

watch(database, chooseDatabase);
onMounted(chooseDatabase)
</script>

<template>
    <table v-if="databaseTables">
        <tr>
            <th>Table</th>
            <th>Moteur</th>
            <th>Interclassement</th>
            <th>Nombre de lignes</th>
            <th>Taille de la table</th>
            <th>Taille de l'index</th>
            <th>Commentaire</th>
        </tr>
        <tr v-for="datas in databaseTables">
            <td><RouterLink :to="'/database/'+database+'/'+datas.TABLE_NAME+'/datas'">{{ datas.TABLE_NAME }}</RouterLink></td>
            <td>{{ datas.ENGINE }}</td>
            <td>{{ datas.TABLE_COLLATION }}</td>
            <td>{{ datas.TABLE_ROWS }}</td>
            <td>{{ formatBytes(datas.DATA_LENGTH, 2) }}</td>
            <td>{{ datas.INDEX_LENGTH }}</td>
            <td>{{ datas.TABLE_COMMENT }}</td>
        </tr>
    </table>
</template>

<style scoped>
</style>