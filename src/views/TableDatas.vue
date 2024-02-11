<script setup>
import { onMounted, ref, toRef, watch, watchEffect } from 'vue';
import { useAxios } from '../hooks/useAxios.js';
import { useDBConnectStore } from '../stores/DBConnect';
import { useTabStore } from '../stores/Tabs';
import { useToastStore } from '../stores/Toast.store'
import { isEnum } from '../utils/UseColumnType'
import { usePandoreConfStore } from '../stores/PandoreConf'
import CustomLoader from '../components/global/CustomLoader.vue';
import SimpleTable from '../components/simpleTable.vue';
import TdDatas from '../components/tableDatas/tdDatas.vue';
import DatabaseSearch from '../components/tableDatas/databaseSearch.vue';
import CodeHighlight from "vue-code-highlight/src/CodeHighlight.vue";
import "vue-code-highlight/themes/duotone-sea.css";
import { storeToRefs } from 'pinia';

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
const { pandoreConf } = storeToRefs(usePandoreConfStore())
const loading = ref(false);
const rows = ref([]);
const displayedRows = ref([]);
const sqlQuery = ref(null);
const constraints = ref(null);
const conditions = ref(null);
const structure = ref(null);
const primaryIndexes = ref([]);
const database = toRef(props, "databaseName");
const table = toRef(props, "tableName");
const searchColumn = toRef(props, "searchColumn");
const itemId = toRef(props, "itemId");
const message = ref(null);
const selectedRows = ref(-1);
const showRowOptions = ref(false);
const databaseQueryBuilderOpen = ref(false);
const requestParams = ref({
    limit: pandoreConf.value?.tables?.query?.defaultLimit ?? 50,
    where: [],
    select: []
});
const colors = [
    'rgba(0, 128, 0, 0.1)',     // green
    'rgba(0, 119, 255, 0.1)',   // blue
    'rgb(245, 9, 226, 0.1)',    // purple
    'rgba(255, 238, 0, 0.3)',   // yellow
    'rgba(255, 0, 0, 0.2)',     // red
];
const enumColor = ref({});
const newEnumNumber = ref(0);

const getEnumColor = (value) => {
    if (enumColor.value?.[value]) return enumColor.value[value];
    else {
        const color = colors[newEnumNumber.value];
        enumColor.value[value] = color;
        if (newEnumNumber.value >= colors.length) newEnumNumber.value = 0;
        else newEnumNumber.value++;
        return color;
    }
}

const showTableDatas = (params = {}) => {
    const result = ref({});

    loading.value = true;
    if (searchColumn.value !== "" && itemId.value !== "") {
        requestParams.value.where = [{
            isAuto: true,
            field: searchColumn.value,
            operator: '=',
            value: itemId.value
        }]
    } else if (requestParams.value.where.length > 0) {
        requestParams.value.where = requestParams.value.where.filter((condition) => {
            return !condition?.isAuto
        })
    }

    if (Object.entries(params).length > 0) {
        requestParams.value = {...params}
    }
    result.value = useAxios({ url: `/database/${database.value}/${table.value}/datas`, method: 'POST', body: {...requestParams.value} });

    watchEffect(() => {
        if (result.value.isLoading === false && result.value?.resp?.data?.success) {
            conditions.value = result.value.resp.data.conf;
            rows.value = result.value.resp.data.success;
            displayedRows.value= result.value.resp.data.success;
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

const searchInList = (search) => {
    displayedRows.value = rows.value.filter((row) => {
        let flagFound = false;
        Object.values(row).forEach((value) => {
            if (value !== null && value.toString().toLowerCase().includes(search) === true) {
                flagFound = true;
            }
        })
        return flagFound === true;
    })
}

const clearSarchInList = () => {
    displayedRows.value = rows.value;
}

const triggerFilter = () => {
    if (databaseQueryBuilderOpen.value === true) {
        databaseQueryBuilderOpen.value = false;
    } else {
        databaseQueryBuilderOpen.value = true
        document.getElementById('main-view').scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
}

watch([database, table, searchColumn, itemId], () => { showTableDatas() });
onMounted(() => {
    selectTab('Datas');
    showTableDatas();
})
</script>

<template>
    <h2>
        <RouterLink :to="'/database/'+database+'/structure'" @click="unsetTable">{{ database }}</RouterLink> >
        <RouterLink :to="'/database/'+database+'/'+table+'/structure'">{{ table }}</RouterLink> >
        Datas
    </h2>
    <CustomLoader :loading="loading">
        <DatabaseSearch
            :table-structure="structure"
            @search-query="(conditions) => showTableDatas(conditions)"
            :query-conditions="conditions"
            :open="databaseQueryBuilderOpen"
        />
        <br>
        <div v-if="sqlQuery" class="code">
            <pre><code-highlight language="js">{{ sqlQuery }}</code-highlight></pre>
            <div>
                <RouterLink :to="'/database/'+database+'/sql?query='+sqlQuery">Modify query</RouterLink>
            </div>
        </div>

        <SimpleTable
            v-if="rows.length > 0"
            :table-name="table"
            :columns="rows[0]"
            :foreigns="constraints.map(c => c.FOR_COL_NAME)"
            :primaries="primaryIndexes"
            :structure="structure"
            :nb-result="rows.length"
            :sticky-th="true"
            :selection-column="true"
            :check-empty-string="pandoreConf?.tables?.searchForEmpty ?? false"
            @search-in-list="searchInList"
            @clear-search-in-list="clearSarchInList"
            @trigger-filter="triggerFilter"
        >
            <template v-slot:tableContent>
                <tr v-for="(row, index) in displayedRows" :id="index" :class="displayedRows.length > 1 && selectedRows === index ? 'selected-row' : ''">
                    <td>
                        <input type="checkbox">
                    </td>
                    <td
                        v-for="(champs, cle) in row"
                        @click="selectRow(index)"
                        :id="`${cle}-${champs}`"
                        :class="isPrimaryIndex(cle) ? 'primary-col' : ''"
                        >
                        <span v-if="champs !== null && isContrained(cle)">
                            <RouterLink :to="'/database/'+database+'/'+getContraintData(cle, 'REFERENCED_TABLE_NAME')+'/datas/'+getContraintData(cle, 'REF_COL_NAME')+'/'+champs">
                                {{ champs }}
                            </RouterLink>
                        </span>
                        <TdDatas
                            v-else-if="isEnum((structure.filter(s => s.Field === cle) || [])[0]?.Type) === true"
                            :data-value="champs"
                            :structure="(structure.filter(s => s.Field === cle) || [])[0]"
                            :style="'background-color: '+getEnumColor(champs)+';'"
                            :check-empty-string="pandoreConf?.tables?.searchForEmpty ?? false"
                        />
                        <TdDatas v-else
                            :data-value="champs"
                            :structure="(structure.filter(s => s.Field === cle) || [])[0]"
                            :check-empty-string="pandoreConf?.tables?.searchForEmpty ?? false"
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