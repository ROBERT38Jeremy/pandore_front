<script setup>
import { onMounted, ref, toRef, watch, watchEffect } from 'vue';
import { useAxios } from '../hooks/useAxios.js';
import CustomLoader from '../components/global/CustomLoader.vue'
import { useDBConnectStore } from '../stores/DBConnect'
import CodeHighlight from "vue-code-highlight/src/CodeHighlight.vue";
import "vue-code-highlight/themes/duotone-sea.css";
import { useTabStore } from '../stores/Tabs'

const props = defineProps({
    databaseName: {
        type: String,
    },
    tableName: {
        type: String
    }
});
const { unsetTable } = useDBConnectStore()
const { selectTab } = useTabStore()
const loading = ref(false);
const rows = ref([]);
const sqlQuery = ref(null);
const database = toRef(props, "databaseName");
const table = toRef(props, "tableName");
const message = ref(null)
const selectedRows = ref(-1);
const requestParams = ref({
    limit: 50
})

const showTableStructure = () => {
    const result = ref({});

    loading.value = true;
    result.value = useAxios({ url: `/database/${database.value}/${table.value}/datas`, method: 'GET', body: requestParams.value });

    watchEffect(() => {
        if (result.value.isLoading === false && result.value?.resp?.data?.success) {
            rows.value = result.value.resp.data.success;
            sqlQuery.value = result.value.resp.data.request;
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

watch(database, showTableStructure);
onMounted(showTableStructure)
</script>

<template>
    <h2>
        <RouterLink :to="'/database/'+database+'/structure'" @click="unsetTable, selectTab('Structure')">{{ database }}</RouterLink> >
        <RouterLink :to="'/database/'+database+'/'+table+'/structure'" @click="selectTab('Structure')">{{ table }}</RouterLink> >
        Datas
    </h2>
    <CustomLoader :loading="loading">
        <div v-if="sqlQuery" class="code">
            <pre><code-highlight language="javascript">{{ sqlQuery }}</code-highlight></pre>
            <div>
                <RouterLink :to="'/database/'+database+'/sql?query='+sqlQuery" @click="selectTab('SQL')">Modify query</RouterLink>
            </div>
        </div>
        <span class="nb-result">{{ rows.length }} résultats</span>
        <table v-if="rows.length > 0">
            <tr>
                <th v-for="(champs, cle) in rows[0]">{{cle}}</th>
            </tr>
            <tr v-for="(row, index) in rows" :id="index" @click="selectRow(index)" :class="selectedRows === index ? 'selected-row' : ''">
                <td v-for="(champs, cle) in row">
                    <span v-if="champs">{{ champs }}</span>
                    <span v-else class="null-value">NULL</span>
                </td>
            </tr>
        </table>
        <div v-else-if="message" class="message">{{ message }}</div>
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

tr td {
    white-space: nowrap;
}

.message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.null-value {
    border: 1px solid hsla(160, 100%, 37%, 1);
    background-color: hsla(160, 100%, 37%, 0.1);
    padding: 0.2em;
    border-radius: 0.2em;
    font-size: small;
    font-family: sans-serif;
}

tr.selected-row td {
    background-color: rgb(236, 239, 244)
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

.code~span {
    width: fit-content;
    position: sticky;
    left: 1em;
}

</style>