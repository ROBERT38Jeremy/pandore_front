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
const router = useRouter()

const getHighlightedSQL = () => {
    const sqlQueryWords         = sqlQuery.value.slice(0, -1).split(' ');
    highlightedQueryWords.value = [];

    sqlQueryWords.forEach((word) => {
        if (SQLWords.includes(word)) highlightedQueryWords.value.push(`<span style="color: #c792ea;">${word}</span>`);
        else if (SQLOperators.includes(word)) highlightedQueryWords.value.push(`<span style="color: var(--color-blue);">${word}</span>`);
        else if (word.match(/^[0-9]+$/)) highlightedQueryWords.value.push(`<span style="color: #e96542;">${word}</span>`);
        else highlightedQueryWords.value.push(word);
    })

}

const modifyQuery = () => {
    router.push(`/database/${database.value}/sql?query=${sqlQuery.value}`);
}


onMounted(getHighlightedSQL);
watch(sqlQuery, getHighlightedSQL);

</script>

<template>
    <div v-if="sqlQuery" class="code">
        <span v-html="highlightedQueryWords.join(' ')+';'"></span>
        <span v-if="modifyButton === true">
            <writeSvg @click="modifyQuery" fill="white"/>
        </span>
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

.code span:nth-child(2) {
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