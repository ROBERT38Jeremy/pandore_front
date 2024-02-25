<script setup>
import { onMounted, ref, toRef, watch, watchEffect } from 'vue';
import { storeToRefs } from 'pinia';
import { useAxios } from '../hooks/useAxios.js';
import { useTabStore } from '../stores/Tabs';
import { useToastStore } from '../stores/Toast.store'
import { usePandoreConfStore } from '../stores/PandoreConf'
import { useDisplayMenu } from '../stores/DisplayMenu.store';
import { isEnum } from '../utils/UseColumnType'
import deleteSvg from '../components/SVG/delete.svg.vue';
import writeSvg from '../components/SVG/write.svg.vue';
import CustomLoader from '../components/global/CustomLoader.vue';
import SimpleTable from '../components/simpleTable.vue';
import tableHeader from '../components/tableDatas/tableHeader.vue';
import tableHeaderQueryBuilder from '../components/tableDatas/tableHeaderQueryBuilder.vue';
import tablePagination from '../components/tableDatas/tablePagination.vue';
import TdDatas from '../components/tableDatas/tdDatas.vue';
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
const emit = defineEmits(['searchInList', 'clearSearchInList', 'triggerFilter', 'validQueryWhereString']);
const { selectTab } = useTabStore();
const { ToastLoadStart, ToastLoadEnd } = useToastStore();
const { pandoreConf } = storeToRefs(usePandoreConfStore())
const { menuIsDisplayed } = storeToRefs(useDisplayMenu());
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
    where: [],
    select: [],
    whereString: ""
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
const hiddenColumns = ref([]);
const page = ref(0);
const limit = ref(pandoreConf.value?.tables?.query?.defaultLimit ?? 50);

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
            rows.value = [...result.value.resp.data.success];
            displayedRows.value = [...result.value.resp.data.success].slice(page.value * limit.value, limit.value + page.value * limit.value);
            conditions.value = result.value.resp.data.conf;
            sqlQuery.value = result.value.resp.data.request;
            structure.value = result.value.resp.data.structure;
            constraints.value = result.value.resp.data.constraints;
            primaryIndexes.value = result.value.resp.data.primary.map((col) => {
                return col.COLUMN_NAME
            });
            loading.value = false;
            hiddenColumns.value = [];
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

    result.value = useAxios({ url: `/database/${database.value}/${table.value}`, method: 'DELETE', body: {...deleteConditions} });
    ToastLoadStart()
    watchEffect(() => {
        if (result.value.isLoading === false && result.value?.resp?.data?.success) {
            // on supprimer la ligne de l'affichage
            rows.value = [...rows.value].filter((r, index) => {
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
    hiddenColumns.value = [];
    displayedRows.value = [...rows.value].slice(page.value * limit.value, limit.value + page.value * limit.value).filter((row) => {
        return Object.values(row).some((item) => {
            if (item !== null && item.toString().toLowerCase().includes(search) === true) {
                return true;
            }
        })
    })
}

const clearSarchInList = () => {
    hiddenColumns.value = [];
    displayedRows.value = [...rows.value].slice(page.value * limit.value, limit.value + page.value * limit.value);
}

const triggerFilter = () => {
    if (databaseQueryBuilderOpen.value === true) {
        databaseQueryBuilderOpen.value = false;
    } else {
        databaseQueryBuilderOpen.value = true
        document.getElementById('main-view').scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
}

const validQueryWhereString = (queryString) => {
    requestParams.value.whereString = queryString;
    showTableDatas();
    hiddenColumns.value = [];
}

const hideColumn = (column = null) => {
    if (column) {
        if (hiddenColumns.value.includes(column)) hiddenColumns.value.splice(hiddenColumns.value.indexOf(column), 1);
        else hiddenColumns.value.push(column)
    }

    displayedRows.value = rows.value.slice(page.value * limit.value, limit.value + page.value * limit.value).map(({...row}) => {
        hiddenColumns.value.forEach(col => {
            delete row[col]
        });
        return row
    });
}

const changePage = (pageNb) => {
    page.value = pageNb - 1;
    displayedRows.value = rows.value.slice(page.value * limit.value, limit.value + page.value * limit.value);
}

watch([database, table, searchColumn, itemId], () => { showTableDatas() });
onMounted(() => {
    selectTab('Datas');
    showTableDatas();
})
</script>

<template>
    <div class="header">
        <tableHeader
            :structure="structure"
            :hidden-columns="hiddenColumns"
            :table-name="tableName"
            :nb-result="rows.length"
            @triggerFilter="triggerFilter"
            @search-in-list="searchInList"
            @clear-search-in-list="clearSarchInList"
            @hide-column="hideColumn"
        />
        <tableHeaderQueryBuilder
            v-if="tableName && structure && (pandoreConf?.tables?.query?.easyBuilder ?? true) === false"
            :structure="structure"
            :where-string="conditions?.whereString"
            @valid-query-where-string="validQueryWhereString"
        />

        <DatabaseSearch
            :table-structure="structure"
            @search-query="(conditions) => showTableDatas(conditions)"
            :query-conditions="conditions"
            :open="databaseQueryBuilderOpen"
        />
        <div v-if="sqlQuery && (pandoreConf?.appDisplay?.displaySQLRequestInDatasView ?? true) === true" class="code">
            <pre><code-highlight language="js">{{ sqlQuery }}</code-highlight></pre>
            <div>
                <RouterLink :to="'/database/'+database+'/sql?query='+sqlQuery">Modify query</RouterLink>
            </div>
        </div>
    </div>
    <CustomLoader :loading="loading" class="datas" :style="`max-width: calc(100vw ${menuIsDisplayed === true ? '- 300px' : ''} - 20px)`">
        <SimpleTable
            v-if="rows.length > 0"
            :columns="rows[0]"
            :hidden-columns="hiddenColumns"
            :foreigns="constraints.map(c => c.FOR_COL_NAME)"
            :primaries="primaryIndexes"
            :structure="structure"
            :sticky-th="true"
            :selection-column="true"
            :check-empty-string="pandoreConf?.tables?.searchForEmpty ?? false"
            :no-margin="true"
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

        <tablePagination
            :page="page"
            :nb-result="rows.length"
            :limit="limit"
            @select-page="changePage"
        />
    </CustomLoader>
</template>

<style scoped>
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

.datas {
    max-height: calc(100% - 76px);
    max-width: calc(100vw - 300px - 20px);
    overflow: auto;
}

.datas::-webkit-scrollbar-track {
    background-color: var(--color-background-light);
    border: 1px solid var(--color-border);
    -webkit-box-shadow: inset 0 0 1px rgba(0,0,0,0.1);
}

.datas::-webkit-scrollbar-thumb {
    background-color: var(--vt-c-blue);
    border-radius: 1em;
}

.datas::-webkit-scrollbar {
    width: 0.5em;
    height: 0.5em;
}
</style>