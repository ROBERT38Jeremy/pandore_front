<script setup>
import { onMounted, ref, toRef, watch, watchEffect } from 'vue';
import { useAxios } from '../hooks/useAxios.js';
import { useDBConnectStore } from '../stores/DBConnect';
import { useTabStore } from '../stores/Tabs';
import CustomLoader from '../components/global/CustomLoader.vue';
import SimpleTable from '../components/simpleTable.vue';

const props = defineProps({
    databaseName: {
        type: String,
    },
    tableName: {
        type: String
    }
});
const { unsetTable } = useDBConnectStore();
const { selectTab } = useTabStore();
const loading = ref(false);
const tableStructure = ref([]);
const tableIndexes = ref([]);
const tableConstraints = ref([]);
const database = toRef(props, "databaseName");
const table = toRef(props, "tableName");
const message = ref(null);

const showTableStructure = () => {
    const result = ref({});

    loading.value = true;
    result.value = useAxios({ url: `/database/${database.value}/${table.value}/structure`, method: 'GET' });

    watchEffect(() => {
        if (result.value.isLoading === false && result.value?.resp?.data?.success) {
            tableStructure.value = result.value.resp.data.success;
            tableIndexes.value = result.value.resp.data.index;
            tableConstraints.value = result.value.resp.data.foreign;
            loading.value = false;
        } else if (result.value.isLoading === false) {
            message.value = result.value?.error?.data ?? 'Une erreur est survenue...'
            loading.value = false;
        }
    })
}

watch([database, table], showTableStructure);
onMounted(() => {
    selectTab('Structure');
    showTableStructure();
})
</script>

<template>
    <h2>
        <RouterLink :to="'/database/'+database+'/structure'" @click="unsetTable">{{ database }}</RouterLink> >
        <RouterLink :to="'/database/'+database+'/'+table+'/datas'">{{ table }}</RouterLink> >
        Structure
    </h2>
    <CustomLoader :loading="loading">
        <SimpleTable
            :datas="tableStructure"
            :auto-id-column="true"
            :error-text="message"
        />

        <hr>
        <SimpleTable
            :datas="tableIndexes"
            :auto-id-column="true"
            :columns="{
                'Type': 'CONSTRAINT_TYPE',
                'Name': 'COLUMN_NAME'
            }"
            table-title="Index"
            error-text="No index found"
        />

        <hr>
        <SimpleTable
            v-if="Object.entries(tableConstraints).length > 0"
            table-title="Foreign Keys"
            :columns="{
                'Name': 'Name',
                'Source' : 'Source',
                'Target' : 'Target',
                'ON DELETE': 'ON DELETE',
                'ON UPDATE': 'ON UPDATE'
            }"
        >
            <tr v-for="datas in tableConstraints">
                <td>{{ datas.CONSTRAINT_NAME }}</td>
                <td>{{ datas.FOR_COL_NAME }}</td>
                <td>
                    <RouterLink :to="`/database/${database}/${datas.REFERENCED_TABLE_NAME}/structure`" @click="unsetTable">
                        {{ datas.REFERENCED_TABLE_NAME }}
                    </RouterLink>(<span class="foreign-target">{{ datas.REF_COL_NAME }}</span>)
                </td>
                <td>{{ datas.DELETE_RULE }}</td>
                <td>{{ datas.UPDATE_RULE }}</td>
            </tr>
        </SimpleTable>
        <div v-else class="simple-table-error">No foreign key found</div>

        <hr>
        <SimpleTable
            :datas="[]"
            table-title="Triggers"
            error-text="This feature is not supported yet"
        />
        <br>
    </CustomLoader>
</template>

<style scoped>
h2 {
    padding-left: 2em;
}

hr {
    border: 1px solid var(--color-border);
}
</style>