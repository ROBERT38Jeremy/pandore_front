<script setup>
import { onMounted, ref, toRef, watch, watchEffect } from 'vue';
import { useAxios } from '../hooks/useAxios.js';
import { useDBConnectStore } from '../stores/DBConnect';
import { useTabStore } from '../stores/Tabs';
import { useToastStore } from '../stores/Toast.store'
import CustomLoader from '../components/global/CustomLoader.vue';
import SimpleTable from '../components/simpleTable.vue';
import TdDatas from '../components/tableDatas/tdDatas.vue';
import RowActions from '../components/tableDatas/rowActions.vue';
import DatabaseSearch from '../components/tableDatas/databaseSearch.vue';
import CodeHighlight from "vue-code-highlight/src/CodeHighlight.vue";
import "vue-code-highlight/themes/duotone-sea.css";

const props = defineProps({
    databaseName: {
        type: String,
    },
    tableName: {
        type: String
    },
    searchColumn: {
        required: false
    },
    itemId: {
        required: false
    }
});
const { unsetTable } = useDBConnectStore();
const { selectTab } = useTabStore();
const { ToastLoadStart, ToastLoadEnd } = useToastStore();
const loading = ref(false);
const rows = ref([]);
const sqlQuery = ref(null);
const constraints = ref(null);
const structure = ref(null);
const primaryIndexes = ref([]);
const database = toRef(props, "databaseName");
const table = toRef(props, "tableName");
const searchColumn = toRef(props, "searchColumn");
const itemId = toRef(props, "itemId");
const message = ref(null);
const selectedRows = ref(-1);
const showRowOptions = ref(false);
const requestParams = ref({
    limit: 50,
    where: [],
    select: []
});

const showTableDatas = (params = {}) => {
    const result = ref({});

    loading.value = true;
    if (searchColumn.value !== "" && itemId.value !== "") {
        requestParams.value.where = [{
            field: searchColumn.value,
            operator: '=',
            value: itemId.value
        }]
    }

    if (Object.entries(params).length > 0) {
        requestParams.value = {...params}
    }
    result.value = useAxios({ url: `/database/${database.value}/${table.value}/datas`, method: 'POST', body: {...requestParams.value} });

    watchEffect(() => {
        if (result.value.isLoading === false && result.value?.resp?.data?.success) {
            rows.value = result.value.resp.data.success;
            sqlQuery.value = result.value.resp.data.request;
            structure.value = result.value.resp.data.structure;
            constraints.value = result.value.resp.data.constraints;
            primaryIndexes.value = result.value.resp.data.primary.map((col) => {
                return col.COLUMN_NAME
            });
            loading.value = false;
        } else if (result.value.isLoading === false) {
            message.value = 'Une erreur est survenue...'
            loading.value = false;
        }
    })
}

const selectRow = (rowIndex) => {
    if (selectedRows.value === rowIndex) {
        selectedRows.value = -1;
    } else {
        selectedRows.value = rowIndex;
    }
}

const isContrained = (col) => {
    return constraints.value.filter(c => c.FOR_COL_NAME === col).length > 0
}

const isPrimaryIndex = (col) => {
    return primaryIndexes.value.includes(col)
}

const getContraintData = (col, COL_NAME) => {
    return constraints.value.filter(c => c.FOR_COL_NAME === col)[0][COL_NAME]
}

const triggerShowRowOptions = () => {
    showRowOptions.value = !showRowOptions.value;
}

const deleteRow = (rowIndex, row) => {
    const deleteConditions = {};
    const result = ref({});

    // on cherche la valeurs de la ou des clés primaires de la ligne pour en faire des conditions
    primaryIndexes.value.forEach((primary) => {
        deleteConditions[primary] = row[primary];
    })

    result.value = useAxios({ url: `/database/${database.value}/${table.value}`, method: 'DELETE', body: {...primaryIndexes} });
    ToastLoadStart()
    watchEffect(() => {
        if (result.value.isLoading === false && result.value?.resp?.data?.success) {
            // on supprimer la ligne de l'affichage
            rows.value = rows.value.filter((r, index) => {
                return index !== rowIndex
            })
            ToastLoadEnd({
                type: "success",
                message: "L'élément a été supprimé"
            });
        } else if (result.value.isLoading === false) {
            ToastLoadEnd({
                type: "error",
                message: "Une erreur est survenue... Impossible de supprimer l'item"
            });
        }
    })
}

const updateRow = (rowIndex, row) => {
    console.log(rowIndex, row);
}

watch([database, table, searchColumn, itemId], showTableDatas);
onMounted(() => {
    selectTab('Datas');
    showTableDatas();
})
</script>

<template>
    {{ searchColumn }} {{ itemId }}
    <h2>
        <RouterLink :to="'/database/'+database+'/structure'" @click="unsetTable">{{ database }}</RouterLink> >
        <RouterLink :to="'/database/'+database+'/'+table+'/structure'">{{ table }}</RouterLink> >
        Datas
    </h2>
    <CustomLoader :loading="loading">
        <DatabaseSearch :table-structure="structure" @search-query="(conditions) => showTableDatas(conditions)" />

        <div v-if="sqlQuery" class="code">
            <pre><code-highlight language="js">{{ sqlQuery }}</code-highlight></pre>
            <div>
                <RouterLink :to="'/database/'+database+'/sql?query='+sqlQuery">Modify query</RouterLink>
            </div>
        </div>

        <span v-if="rows.length > 0" class="table-options">
            <span v-if="showRowOptions" @click="triggerShowRowOptions" >Hide rows options</span>
            <span v-else @click="triggerShowRowOptions" >Show rows options</span>
        </span>
        <SimpleTable
            v-if="rows.length > 0"
            :columns="rows[0]"
            :foreigns="constraints.map(c => c.FOR_COL_NAME)"
            :primaries="primaryIndexes"
            :structure="structure"
            :nb-result="rows.length"
            :add-action-t-d="showRowOptions"
        >
            <template v-slot:tableContent>
                <tr v-for="(row, index) in rows" :id="index" :class="rows.length > 1 && selectedRows === index ? 'selected-row' : ''">
                    <td v-if="showRowOptions" class="action-col">
                        <RowActions
                            @delete="deleteRow(index, row)"
                            @update="updateRow(index, row)"
                        />
                    </td>
                    <td
                        v-for="(champs, cle) in row"
                        @click="selectRow(index)"
                        :id="`${cle}-${champs}`"
                        :class="isPrimaryIndex(cle) ? 'colored-col' : ''"
                    >
                        <span v-if="champs !== null && isContrained(cle)">
                            <RouterLink :to="'/database/'+database+'/'+getContraintData(cle, 'REFERENCED_TABLE_NAME')+'/datas/'+getContraintData(cle, 'REF_COL_NAME')+'/'+champs">
                                {{ champs }}
                            </RouterLink>
                        </span>
                        <TdDatas v-else
                            :data-value="champs"
                        />
                    </td>
                </tr>
            </template>
        </SimpleTable>
        <div v-else-if="message" class="simple-table-error">{{ message }}</div>
        <div v-else class="simple-table-error">No result</div>
        <br>
    </CustomLoader>
</template>

<style scoped>
h2 {
    padding-left: 2em;
    width: fit-content;
    position: sticky;
    left: 0;
}


.code {
    min-width: 50em;
    width: fit-content;
    position: sticky;
    left: 1em;
}

.code pre {
    margin: 0;
    position: relative;
    border-radius: 0.5em;
    overflow: hidden;
}

.code>div {
    text-align: right;
}


.table-options {
    padding-left: 2em;
    margin-right: 1em;
}

.table-options>span {
    color: var(--color-blue);
    cursor: pointer;
}
</style>