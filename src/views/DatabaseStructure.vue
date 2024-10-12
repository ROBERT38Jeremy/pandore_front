<script setup>
import { onMounted, ref, toRef, watch, watchEffect } from 'vue';
import { useAxios } from '../hooks/useAxios.js';
import { formatBytes } from '../hooks/formatBytes.js';
import { useDBConnectStore } from '../stores/DBConnect';
import { usePandoreConfStore } from '../stores/PandoreConf'
import { useTabStore } from '../stores/Tabs';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import CustomLoader from '../components/global/CustomLoader.vue';
import SimpleTable from '../components/simpleTable.vue';

const router = useRouter();
const { setTable, unsetTable } = useDBConnectStore();
const { selectTab } = useTabStore();
const { pandoreConf } = storeToRefs(usePandoreConfStore())
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
    result.value = useAxios({ url: `/sql/database/${database.value}/data`, method: 'GET' });

    watchEffect(() => {
        if (result.value.isLoading === false && result.value.resp.data.success) {
            databaseTables.value = result.value.resp.data.success;
            loading.value = false; // commenter pour tester le chargement
        }
    })
}

watch(database, chooseDatabase);
onMounted(() => {
    selectTab('Structure');
    chooseDatabase();
})
</script>

<template>
    <CustomLoader :loading="loading">
        <SimpleTable
            :columns="{
                'Table': 'Table',
                'Moteur': 'Moteur',
                'Interclassement': 'Interclassement',
                'Nombre de lignes': 'Nombre de lignes',
                'Taille de la table': 'Taille de la table',
                'Taille de l\'index': 'Taille de l\'index',
                'Commentaire': 'Commentaire',
            }"
        >
            <template v-slot:tableContent>
                <tr v-for="(datas, index) in databaseTables">
                    <td>
                        <RouterLink :to="`/database/${database}/${datas.TABLE_NAME}/${pandoreConf?.tables?.defaultPage ?? 'structure'}`" >{{ datas.TABLE_NAME }}</RouterLink>
                    </td>
                    <td>{{ datas.ENGINE }}</td>
                    <td>{{ datas.TABLE_COLLATION }}</td>
                    <td>{{ datas.TABLE_ROWS }}</td>
                    <td>{{ formatBytes(datas.DATA_LENGTH, 2) }}</td>
                    <td>{{ datas.INDEX_LENGTH }}</td>
                    <td>{{ datas.TABLE_COMMENT == '' ? '?' : datas.TABLE_COMMENT }}</td>
                </tr>
            </template>
        </SimpleTable>
    </CustomLoader>
</template>