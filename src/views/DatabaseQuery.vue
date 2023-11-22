<script setup>
import { ref, toRef, watch, watchEffect } from 'vue';
import CustomLoader from '../components/global/CustomLoader.vue'
import { useDBConnectStore } from '../stores/DBConnect'
import { useAxios } from '../hooks/useAxios.js';
import CodeHighlight from "vue-code-highlight/src/CodeHighlight.vue";
import "vue-code-highlight/themes/duotone-sea.css";

const props = defineProps({
    databaseName: {
        type: String,
    },
    query: {
        type: String
    }
});
const { unsetTable } = useDBConnectStore();
const database = toRef(props, "databaseName");
const query = toRef(props, "query");
const nbLines = ref(10);
const sqlRequest = ref(query.value);
const queryLoading = ref(false);
const queryResult = ref([])
const message = ref(null)

const preventTab = (e) => {
    if (e.key == 'Tab') {
        e.preventDefault();
        sqlRequest.value += "\t"
    }
}

const runQuery = () => {
    if (sqlRequest.value.replaceAll(' ', '').replaceAll("\n", '').replaceAll("\t", '') !== '') {
        const request = sqlRequest.value.replaceAll("\n", ' ').replaceAll("\t", ' ');

        const result = ref({});

        queryLoading.value = true;
        result.value = useAxios({ url: `/${database.value}/raw-query?request=${request}`, method: 'GET' });

        watchEffect(() => {
            if (result.value.isLoading === false && result.value.resp?.data?.success) {
                queryResult.value = result.value.resp.data.success;
                queryLoading.value = false;
            } else if (result.value.isLoading === false && result.value.error) {
                message.value = result.value.error.message;
                queryLoading.value = false;
            }
        })
    }
}

watch(sqlRequest, () => {
    const lines = sqlRequest.value.split("\n").length;
    nbLines.value = lines + 2 > 10 ? lines + 2 : 10
})
</script>

<template>
    <div class="sql-header">
        <h2>
            <RouterLink :to="'/database/'+database+'/structure'" @click="unsetTable">{{ database }}</RouterLink> >
            SQL Request
        </h2>
        <div>
            <button class="run" @click="runQuery">Run</button>
            <button class="save">Save</button>
        </div>
    </div>

    <table class="sql-querier">
        <tr>
            <td>
                <div v-for="index in nbLines">{{ index }}</div>
            </td>
            <td><textarea :rows="nbLines" placeholder="SELECT ..." v-model="sqlRequest" @keydown="preventTab"></textarea></td>
        </tr>
    </table>
    <CustomLoader :class="queryLoading ? 'sql-result' : ''" :loading="queryLoading">
        <br>
        <div v-if="message" class="code">{{ message }}</div>
        <div v-if="(queryResult.length > 0 || message) && sqlRequest" class="code">
            <pre><code-highlight language="javascript">{{ sqlRequest }}</code-highlight></pre>
        </div>
        <br>
        <table v-if="queryResult.length > 0" class="datas-table">
            <tr>
                <th v-for="(champs, cle) in queryResult[0]">{{cle}}</th>
            </tr>
            <tr v-for="(row, index) in queryResult" :id="index" @click="selectRow(index)">
                <td v-for="(champs, cle) in row">
                    <a
                        v-if="typeof champs === 'string' && champs.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/)"
                        :href="champs"
                    >
                        {{ champs }}
                    </a>
                    <span v-else-if="champs">{{ champs }}</span>
                    <span v-else class="null-value">NULL</span>
                </td>
            </tr>
        </table>
    </CustomLoader>
</template>

<style scoped>
.sql-header {
    padding-left: 2em;
    width: fit-content;
    position: sticky;
    left: 0;
    display: flex;
    align-items: center;
    min-width: calc(100vw - 5px - 25em);
}

.sql-header h2 {
    padding-left: 2em;
}

.sql-header div {
    flex: 1;
    padding-right: 2em;
    display: flex;
    gap: 0.4em;
    justify-content: flex-end;
}

button.run,
button.save {
    padding: 0.3em 1em;
    border: none;
    border-radius: 3px;
    font-size: 16px;
}

button.run {
    color: var(--color-background-light);
    background-color: var(--color-button);
}

button.save {
    color: var(color-text);
    background-color: var(--color-background);
    opacity: 0.5;
    cursor: default;
}

.sql-result {
    background-color: var(--color-background);
    width: 100%;
    height: 100%;
}

.sql-querier {
    width: 100%;
    border-spacing: 0;
}

.sql-querier td {
    vertical-align: top;
}

.sql-querier td:first-child {
    width: 1em;
    padding: 1em;
    padding-top: calc(1em + 2px);
    font-size: 15px;
    font-family: sans-serif;
    text-align: right;
    opacity: 0.5;
}

.sql-querier td:first-child div {
    padding: 0;
}

.sql-querier textarea {
    width: calc(100% - 6px - 0.5em);
    border: 1px solid rgba(216, 218, 221, 0.4);
    padding-top: 1em;
    padding-left: 0.5em;
    font-size: 15px;
    font-family: sans-serif;
    line-height: 1.6;
    resize: none;
    outline: none;
    tab-size: 2em;
}




table.datas-table {
    width: fit-content;
    border-spacing: 0;
    border-left: 1px solid rgba(216, 218, 221, 0.4);
    border-top: 1px solid rgba(216, 218, 221, 0.4);
    margin-left: 1em;
    margin-right: 1em;
}

table.datas-table th {
    text-align: left;
    background-color: rgb(236, 239, 244);
}

table.datas-table td, table.datas-table th {
    padding: 0.4em 0.7em;
    border-right: 1px solid rgba(216, 218, 221, 0.4);
    border-bottom: 1px solid rgba(216, 218, 221, 0.4);
}

table.datas-table tr td:first-child {
    text-align: center;
    background-color: rgb(236, 239, 244);
}

table.datas-table tr td {
    white-space: nowrap;
}

.null-value {
    border: 1px solid var(--color-border-hover);
    background-color: var(--color-border);
    padding: 0.2em;
    border-radius: 0.2em;
    font-size: small;
    font-family: sans-serif;
    opacity: 0.5;
    cursor: default;
}

table.datas-table tr.selected-row td {
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
</style>