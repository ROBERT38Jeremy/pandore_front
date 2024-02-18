<script setup>
import { onMounted, ref, toRef, watch, watchEffect } from 'vue';
import { useDBConnectStore } from '../stores/DBConnect';
import { useTabStore } from '../stores/Tabs';
import { useAxios } from '../hooks/useAxios.js';
import CustomLoader from '../components/global/CustomLoader.vue'
import SimpleTable from '../components/simpleTable.vue';
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
const { selectTab } = useTabStore();
const sqlRequestRef = ref(null);
const database = toRef(props, "databaseName");
const query = toRef(props, "query");
const nbLines = ref(10);
const sqlRequest = ref(query.value);
const queryLoading = ref(false);
const queryResult = ref(null)
const message = ref(null)
const autocompletionContainerPosition = ref({
    top: 0,
    left: 0
})
const autocompletionSQL = [
    'ALL', 'ALTER', 'AVG()', 'AND', 'BETWEEN', 'BY', 'CASE', 'CREATE', 'COALESCE', 'COUNT()', 'DATABASE', 'DELETE',
    'DROP', 'EXISTS', 'FROM', 'GROUP', 'HAVING', 'IF()', 'IN()', 'INDEX', 'INNER', 'INSERT', 'INTO', 'IS', 'JOIN',
    'LEFT', 'LIKE', 'LIMIT', 'MAX()', 'MIN()', 'NOT', 'OR', 'ORDER', 'OUTER', 'RIGHT', 'SELECT', 'SET', 'SUM()',
    'TABLE', 'THEN', 'UNION', 'UPDATE', 'WHERE'
];
const autocompletionPropositions = ref([]);
const autocompletionIsActive = ref(false);
const selectedProposition = ref(-1);

const prevent = (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        sqlRequest.value = (sqlRequest.value ?? "")+"\t"
    } else if (e.key === 'ArrowDown' && selectedProposition.value < autocompletionPropositions.value.length - 1) {
        selectedProposition.value += 1;
    } else if (e.key === 'ArrowDown' && autocompletionIsActive.value === true) {
        e.preventDefault();
        selectedProposition.value = 0;
    } else if (e.key === 'ArrowUp' && selectedProposition.value > 0) {
        e.preventDefault();
        selectedProposition.value -= 1;
    } else if (e.key === 'ArrowUp' && autocompletionIsActive.value === true) {
        e.preventDefault();
        selectedProposition.value = autocompletionPropositions.value.length -1;
    } else if (e.key === 'Escape' && autocompletionIsActive.value === true) {
        e.preventDefault();
        selectedProposition.value -= 1;
        autocompletionPropositions.value = [];
        autocompletionIsActive.value = false;
    } else if (e.key === 'Enter' && selectedProposition.value > -1) {
        e.preventDefault();
        const propValue = autocompletionPropositions.value?.[selectedProposition.value];
        const selectionStart = sqlRequestRef.value.selectionStart;
        const lastWord = sqlRequest.value.toLowerCase().slice(0, selectionStart).match(/(\w+)$/g)?.[0] ?? "";

        sqlRequest.value = sqlRequest.value.slice(0, selectionStart - lastWord.length) + propValue + sqlRequest.value.slice(selectionStart + 1)+" ";

        selectedProposition.value -= 1;
        autocompletionPropositions.value = [];
        autocompletionIsActive.value = false;
    }
}

watch(sqlRequest, () => {
    const lines = (sqlRequest.value || "").split("\n").length;
    nbLines.value = lines + 2 > 10 ? lines + 2 : 10;

    const selectionStart = sqlRequestRef.value.selectionStart;
    const selectionLineNumber = sqlRequest.value.slice(0, selectionStart).split("\n").length - 1;
    autocompletionContainerPosition.value.top = selectionLineNumber;

    const charsCount = sqlRequest.value.split("\n", selectionLineNumber + 1).slice(-1)?.[0].length + sqlRequest.value.split("\n", selectionLineNumber + 1).slice(-1)?.[0].split("\t").length
    autocompletionContainerPosition.value.left = charsCount;

    const lastWord = sqlRequest.value.toLowerCase().slice(0, selectionStart).match(/(\w+)$/g)?.[0];
    autocompletionPropositions.value = autocompletionSQL.filter((word) => word.toLowerCase().includes(lastWord));

    if (autocompletionPropositions.value.length > 0) autocompletionIsActive.value = true;
    else autocompletionIsActive.value = false;
})

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
                message.value = null;
            } else if (result.value.isLoading === false && result.value.resp?.data?.error) {
                message.value = result.value.resp.data.error;
                queryLoading.value = false;
                queryResult.value = []
            }
        })
    }
}

onMounted(() => {
    selectTab('SQL');
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
    {{ selectedProposition }}<br>
    {{ autocompletionIsActive }}
    <table class="sql-querier">
        <tr>
            <td>
                <div v-for="index in nbLines">{{ index }}</div>
            </td>
            <td class="textarea-container">
                <textarea :rows="nbLines" placeholder="SELECT ..." v-model="sqlRequest" ref="sqlRequestRef" @keyup="getPropositions" @keydown="prevent"></textarea>
                <div
                    v-if="autocompletionPropositions.length > 0"
                    class="autocompletion-container"
                    :style="`
                        top: calc(${autocompletionContainerPosition.top}em * 1.6 + 2.6em);
                        left: calc(${autocompletionContainerPosition.left}em * 0.55 + 0.5em);
                    `"
                >
                    <div
                        v-for="(prop, index) in autocompletionPropositions"
                        :class="(selectedProposition === index ? 'selected-proposition' : '')"
                    >
                        {{ prop }}
                    </div>
                </div>
            </td>
        </tr>
    </table>
    <CustomLoader :class="queryLoading ? 'sql-result' : ''" :loading="queryLoading">
        <br>
        <div v-if="message" class="error">{{ message }}</div>
        <div v-if="((queryResult || []).length > 0 || message) && sqlRequest" class="code">
            <pre><code-highlight language="javascript">{{ sqlRequest }}</code-highlight></pre>
        </div>
        <br>
        <SimpleTable
            v-if="(queryResult || []).length > 0"
            :datas="queryResult"
            table-title="SQL Result"
            error-text="No result found"
            :nb-result="queryResult.length"
        />
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

.code,
.error {
    min-width: 50em;
    width: fit-content;
    position: sticky;
    left: 1em;
}

.error {
    color: red;
}

.code pre {
    margin: 0;
    position: relative;
    border-radius: 0.5em;
    overflow: hidden;
}

.textarea-container {
    position: relative;
    padding: 0;
}

.textarea-container>div.autocompletion-container {
    position: absolute;
    z-index: 30;
    border: 1px solid var(--color-border);
    background-color: var(--color-background-light);
}

.textarea-container>div.autocompletion-container>div {
    padding: 0.2em 0.5em;
}

.textarea-container>div.autocompletion-container>div.selected-proposition {
    background-color: var(--color-background);
}

textarea {
    font-family: Consolas !important;
}
</style>