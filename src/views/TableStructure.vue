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
    <CustomLoader :loading="loading">
        <div class="table-structure-container">
            <div>
                <SimpleTable
                    :datas="tableStructure"
                    :auto-id-column="false"
                    :error-text="message"
                    :check-empty-string="false"
                    table-title="Structure"
                />
            </div>

            <div>
                <SimpleTable
                    :datas="tableIndexes"
                    :auto-id-column="false"
                    :check-empty-string="false"
                    :columns="{
                        'Type': 'CONSTRAINT_TYPE',
                        'Name': 'COLUMN_NAME'
                    }"
                    table-title="Index"
                    error-text="No index found"
                />
            </div>

            <div>
                <SimpleTable
                    :show-table="Object.entries(tableConstraints).length > 0"
                    table-title="Foreign Keys"
                    :check-empty-string="false"
                    :columns="{
                        'Name': 'Name',
                        'Source' : 'Source',
                        'Target' : 'Target',
                        'ON DELETE': 'ON DELETE',
                        'ON UPDATE': 'ON UPDATE'
                    }"
                    error-text="No foreign key found"
                >
                    <template v-slot:tableContent>
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
                    </template>
                </SimpleTable>
            </div>

            <!-- <div>
                <SimpleTable
                    :datas="[]"
                    :check-empty-string="false"
                    table-title="Triggers"
                    error-text="This feature is not supported yet"
                />
            </div> -->
        </div>
    </CustomLoader>
</template>

<style scoped>
.table-structure-container {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
}
</style>