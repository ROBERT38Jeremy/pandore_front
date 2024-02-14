<script setup>
import { onMounted, ref, toRef, watch, watchEffect } from 'vue';
import { useTabStore } from '../stores/Tabs';
import { usePandoreConfStore } from '../stores/PandoreConf'
import { useToastStore } from '../stores/Toast.store'
import { useAxios } from '../hooks/useAxios.js';
import { storeToRefs } from 'pinia';
import CustomLoader from '../components/global/CustomLoader.vue';
import LeaderLine from 'leader-line-vue';

const { selectTab } = useTabStore();
const { Toast } = useToastStore();
const { pandoreConf } = storeToRefs(usePandoreConfStore())
const props = defineProps({
    databaseName: {
        type: String,
    },
});
const database = toRef(props, "databaseName");
const loading = ref(true);
const structure = ref({});

const getDatabaseTablesStructure = () => {
    const result = ref({});

    loading.value = true;
    result.value = useAxios({ url: `/database/${database.value}/structure`, method: 'GET' });

    watchEffect(() => {
        if (result.value.isLoading === false && result.value.resp?.data?.success) {
            (result.value.resp.data.success).forEach(column => {
                if (!structure.value[column.TABLE_NAME]) {
                    structure.value[column.TABLE_NAME] = {};
                }
                structure.value[column.TABLE_NAME][column.COLUMN_NAME] = {
                    COLUMN_TYPE: column.COLUMN_TYPE,
                    COLUMN_KEY: column.COLUMN_KEY,
                    EXTRA: column.EXTRA,
                    REFERENCED_TABLE_NAME: column.REFERENCED_TABLE_NAME,
                    REFERENCED_COLUMN_NAME: column.REFERENCED_COLUMN_NAME
                }
                // setTimeout(() => {
                //     LeaderLine.setLine(
                //         document.getElementById(`${column.TABLE_NAME}.${column.COLUMN_NAME}`),
                //         document.getElementById(`${column.REFERENCED_TABLE_NAME}.${column.REFERENCED_COLUMN_NAME}`)
                //     );
                // }, 3000)
            });
            loading.value = false;
        } else if (result.value.isLoading === false && result.value.resp?.data?.error) {
            loading.value = false;
            Toast({
                type: "error",
                message: result.value.resp.data.error
            });
        }
    })
}

onMounted(() => {
    selectTab('Schema');
    getDatabaseTablesStructure();
})
</script>

<template>
    <CustomLoader :loading="loading">
        <div class="schema-container">
            <table v-for="(columns, table) in structure" :id="table">
                <tr>
                    <th colspan="2">
                        <RouterLink :to="`/database/${database}/${table}/${pandoreConf?.tables?.defaultPage ?? 'structure'}`">{{ table }}</RouterLink>
                    </th>
                </tr>
                <tr v-for="(column, columnName) in columns" :id="`${table}.${columnName}`">
                    <td class="column-name">
                        <a v-if="column.REFERENCED_TABLE_NAME" :href="`#${column.REFERENCED_TABLE_NAME}.${column.REFERENCED_COLUMN_NAME}`">{{ columnName }}</a>
                        <span v-else>{{ columnName }}</span>
                    </td>
                    <td>{{ column.COLUMN_TYPE }}</td>
                </tr>
            </table>
        </div>
    </CustomLoader>
</template>

<style scoped>
.schema-container {
    display: flex;
    gap: 5em;
    flex-wrap: wrap;
    padding: 1em;
    align-items: flex-start;
}

.schema-container table {
    height: fit-content;
    border: 1px solid var(--color-border);
    border-radius: 0.5em;
    border-spacing: 0;
}

.schema-container table td {
    padding: 0.2em 0.7em;
}

.schema-container table td.column-name {
    font-weight: bold;
}
</style>