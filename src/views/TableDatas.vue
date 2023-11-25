<script setup>
import { onMounted, ref, toRef, watch, watchEffect } from 'vue';
import { useAxios } from '../hooks/useAxios.js';
import { useDBConnectStore } from '../stores/DBConnect';
import { useTabStore } from '../stores/Tabs';
import CustomLoader from '../components/global/CustomLoader.vue';
import SimpleTable from '../components/simpleTable.vue';
import CodeHighlight from "vue-code-highlight/src/CodeHighlight.vue";
import "vue-code-highlight/themes/duotone-sea.css";

const props = defineProps({
    databaseName: {
        type: String,
    },
    tableName: {
        type: String
    },
    primary: {
        required: false
    },
    itemId: {
        required: false
    }
});
const { unsetTable } = useDBConnectStore();
const { selectTab } = useTabStore();
const loading = ref(false);
const rows = ref([]);
const sqlQuery = ref(null);
const constraints = ref(null);
const database = toRef(props, "databaseName");
const table = toRef(props, "tableName");
const primary = toRef(props, "primary");
const itemId = toRef(props, "itemId");
const message = ref(null);
const selectedRows = ref(-1);
const displayTextareaValue = ref([])
const requestParams = ref({
    limit: 50,
    where: {}
});

const showTableStructure = () => {
    const result = ref({});

    loading.value = true;
    if (primary.value !== "" && itemId.value !== "") {
        requestParams.value.where[primary.value] = itemId.value;
    }
    result.value = useAxios({ url: `/database/${database.value}/${table.value}/datas`, method: 'POST', body: {...requestParams.value} });

    watchEffect(() => {
        if (result.value.isLoading === false && result.value?.resp?.data?.success) {
            rows.value = result.value.resp.data.success;
            sqlQuery.value = result.value.resp.data.request;
            constraints.value = result.value.resp.data.constraints;
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

const getContraintData = (col, COL_NAME) => {
    return constraints.value.filter(c => c.FOR_COL_NAME === col)[0][COL_NAME]
}

const clickTd = (e) => {
    if (e.ctrlKey) {
        if (displayTextareaValue.value.includes(e.target.id)) {
            displayTextareaValue.value = displayTextareaValue.value.filter((item) => {
                return item !== e.target.id
            });
        } else {
            displayTextareaValue.value.push(e.target.id)
        }
    }
}

watch([database, table, primary, itemId], showTableStructure);
onMounted(() => {
    selectTab('Datas');
    showTableStructure();
})
</script>

<template>
    <h2>
        <RouterLink :to="'/database/'+database+'/structure'" @click="unsetTable">{{ database }}</RouterLink> >
        <RouterLink :to="'/database/'+database+'/'+table+'/structure'">{{ table }}</RouterLink> >
        Datas
    </h2>
    <CustomLoader :loading="loading">
        <div v-if="sqlQuery" class="code">
            <pre><code-highlight language="javascript">{{ sqlQuery }}</code-highlight></pre>
            <div>
                <RouterLink :to="'/database/'+database+'/sql?query='+sqlQuery">Modify query</RouterLink>
            </div>
        </div>

        <SimpleTable
            v-if="rows.length > 0"
            :columns="rows[0]"
            :nb-result="rows.length"
        >
            <tr v-for="(row, index) in rows" :id="index" @click="selectRow(index)" :class="rows.length > 1 && selectedRows === index ? 'selected-row' : ''">
                <td v-for="(champs, cle) in row" @click="clickTd" :id="`${cle}-${champs}`">
                    <span v-if="displayTextareaValue.includes(`${cle}-${champs}`)">
                        <textarea>{{ champs }}</textarea>
                    </span>

                    <span v-else>
                        <span v-if="champs && isContrained(cle)">
                            <RouterLink :to="'/database/'+database+'/'+getContraintData(cle, 'REFERENCED_TABLE_NAME')+'/datas/'+getContraintData(cle, 'REF_COL_NAME')+'/'+champs">
                                {{ champs }}
                            </RouterLink>
                        </span>
                        <a
                            v-else-if="
                                typeof champs === 'string' &&
                                champs.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/)
                            "
                            :href="champs"
                        >
                            {{ champs }}
                        </a>
                        <span
                            v-else-if="
                                typeof champs === 'string' &&
                                champs.match(/[^\w\s.\d@\.\,-[À-ú]]/)
                            "
                            class="weird-char"
                            title="Value may contain non UTF-8 characters"
                        >
                            {{ champs }}
                        </span>
                        <span v-else-if="champs">{{ champs }}</span>
                        <span v-else class="null-value">NULL</span>
                    </span>
                </td>
            </tr>
        </SimpleTable>
        <div v-else-if="message" class="simple-table-error">{{ message }}</div>
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

</style>