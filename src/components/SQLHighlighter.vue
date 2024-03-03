<script setup>
import { onMounted, ref, toRef, watch } from 'vue';
import { SQLWords } from '../utils/SqlWords';
import { SQLOperators } from '../utils/SqlOperators';
import { useRouter } from 'vue-router'
import writeSvg from '../components/SVG/write.svg.vue';

const props = defineProps({
    sqlQuery: {
        type: String,
        required: true,
    },
    database: {
        type: String,
        required: true,
    },
    modifyButton: {
        type: Boolean,
        required: false,
        default: false
    }
});
const sqlQuery = toRef(props, "sqlQuery");
const database = toRef(props, "database");
const modifyButton = toRef(props, "modifyButton");
const highlightedQueryWords = ref([]);
const router = useRouter();

const getSQLWordSpan = (SQLWord) => {
    return `<span style="color: #c792ea;">${SQLWord}</span>`;
}

const getSQLOperatorSpan = (SQLOperator) => {
    return `<span style="color: var(--color-blue);">${SQLOperator}</span>`;
}

const getNumberSpan = (number) => {
    return `<span style="color: #e96542;">${number}</span>`
}

const getHighlightedSQL = () => {
    const sqlQueryWords         = (sqlQuery.value.slice(-1) === ';') ? sqlQuery.value.slice(0, -1).split(' ') : sqlQuery.value.split(' ');
    highlightedQueryWords.value = [];

    sqlQueryWords.forEach((word) => {
        const realWords = word.split('\n');
        realWords.forEach((realWord, idx) => {
            if (realWords.length > 1 && idx % 2 !== 0) highlightedQueryWords.value.push('<br>');

            if (SQLWords.includes(realWord))               highlightedQueryWords.value.push(getSQLWordSpan(realWord));
            else if (SQLOperators.includes(realWord))      highlightedQueryWords.value.push(getSQLOperatorSpan(realWord));
            else if (realWord.match(/^[0-9]+$/))           highlightedQueryWords.value.push(getNumberSpan(realWord));
            else if (realWord.match(/^(\"|\').+(\"|\')$/)) highlightedQueryWords.value.push(`${getSQLOperatorSpan('"')}${getNumberSpan(realWord.slice(1, -1))}${getSQLOperatorSpan('"')}`);
            else highlightedQueryWords.value.push(realWord);
        })
    })
}

onMounted(getHighlightedSQL);
watch(sqlQuery, getHighlightedSQL);
</script>

<template>
    <div v-if="sqlQuery" class="code">
        <span v-html="highlightedQueryWords.join(' ')+getSQLWordSpan(';')"></span>
        <a v-if="modifyButton === true" :href="`/database/${database}/sql?query=${sqlQuery}`">
            <writeSvg fill="white"/>
        </a>
    </div>
</template>

<style scoped>
.code {
    min-width: 50em;
    width: fit-content;
    background-color: #252526;
    color: white;
    padding: 0.5em 1em;
    margin-left: 1em;
    font-family: Consolas;
    display: flex;
    gap: 1em;
}

.code a {
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    height: fit-content;
    width: fit-content;
    padding: 0.3em;
    border-radius: 0.1em;
}
</style>