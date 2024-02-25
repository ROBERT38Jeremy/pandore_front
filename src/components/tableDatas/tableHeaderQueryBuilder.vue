<script setup>
import { onBeforeUnmount, onMounted, ref, toRef } from 'vue';
import { isString } from '../../utils/UseColumnType';
import { usePandoreConfStore } from '../../stores/PandoreConf';
import { storeToRefs } from 'pinia';

const props = defineProps({
    structure: {
        type: Array,
        required: false,
        default: []
    },
    whereString: {
        type: String,
        required: false,
        default: "",
    }
});
const structure = toRef(props, "structure");
const { pandoreConf } = storeToRefs(usePandoreConfStore())
const fieldsPossibilities = ref([]);
const query = ref("");
const inputSqlQuery = ref(null)
const indexSelectedProposition = ref(-1);
const emit = defineEmits(['validQueryWhereString']);
const inputPlaceholder = ref('Enter a SQL expression to filter results');
const queryLastWord = ref('');


const typeText = (e) => {
    e.preventDefault();

    queryLastWord.value = query.value.match(/(\w+)(?:\s*)$/g);

    if (e.key === 'ArrowUp') {
        inputSqlQuery.value.selectionStart = query.value.length
        if (indexSelectedProposition.value <= 0) indexSelectedProposition.value = fieldsPossibilities.value.length - 1;
        else indexSelectedProposition.value -= 1;
        return;
    } else if (e.key === 'ArrowDown') {
        if (indexSelectedProposition.value >= fieldsPossibilities.value.length - 1) indexSelectedProposition.value = 0;
        else indexSelectedProposition.value += 1;
        inputSqlQuery.value.selectionStart = query.value.length
        return;
    } else if (e.key === 'Enter') {
        // on veut exécuter la requête
        if (indexSelectedProposition.value === -1 || fieldsPossibilities.value.length <= 0) {
            emit('validQueryWhereString', query.value);
        } else {
            const selectedProposition = fieldsPossibilities.value[indexSelectedProposition.value];

            // on replace la recherche par la selection
            const re = new RegExp(`${queryLastWord.value}$`);
            query.value = query.value.replace(re, selectedProposition.Field)+" "

            if (isString(selectedProposition.Type)) {
                query.value = query.value+"= \"\""
                // on met le curseur entre les ""
                setTimeout(() => {
                    inputSqlQuery.value.setSelectionRange(query.value.length - 1, query.value.length - 1)
                }, 100)
            }

            indexSelectedProposition.value = -1;
            fieldsPossibilities.value = [];
        }
        return;
    } else if (e.key === 'Escape') {
        fieldsPossibilities.value = [];
        indexSelectedProposition.value = -1;
        return;
    } else {
        getFieldsPossibilities(queryLastWord.value);
    }
}

const getFieldsPossibilities = (word) => {
    if (word === "") {
        fieldsPossibilities.value = structure.value;
        return;
    } else {
        fieldsPossibilities.value = structure.value.filter((s) => {
            return s.Field.includes(word)
        })
    }
}

const hotKey = async (e) => {
    if (e.key == 'b' && e.ctrlKey) {
        inputSqlQuery.value.focus();
    }
}

onMounted(() => {
    document.addEventListener('keyup', hotKey);
    if (props.whereString !== "") query.value = props.whereString

    if (pandoreConf.value?.appDisplay?.displayKeyboardShortcut ?? true === true) inputPlaceholder.value += " (CTRL + B)";
})

onBeforeUnmount(() => {
    document.removeEventListener('keyup', hotKey);
})
</script>

<template>
    <div class="query-builder-container">
        <i>WHERE &ensp;</i>
        <div class="input-container">
            <input type="text" ref="inputSqlQuery" v-model="query" @keyup="typeText" :placeholder="inputPlaceholder">
            <div>
                <div v-for="(field, idx) in fieldsPossibilities" :class="indexSelectedProposition === idx ? 'selected' : ''">
                    <span class="word-correspondance">{{ queryLastWord[0] }}</span>{{ field.Field.replace(queryLastWord, '') }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.query-builder-container {
    max-width: calc(100vw - 12em - 200px + 10px);
    padding: 0.4em 1em;
    display: flex;
    gap: 1.5em;
    align-items: center;
    background-color: var(--color-background-light);
    border-radius: 5px;
    z-index: 3;
}

.input-container {
    position: relative;
}

.input-container>input {
    position: relative;
    background-color: transparent;
    border: none;
    border: 1px solid var(--color-border);
    border-radius: 0.5em;
    outline: none;
    color: var(--color-text);
    padding: 0.4em 0.3em;
    width: 600px;
}

.input-container>div {
    position: absolute;
    top: 100%;
    width: 100%;
    z-index: 5;
    background-color: var(--color-background-light);
    -webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3);
    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3);
    border-radius: 0.5em;
}

.input-container>div>div {
    padding: 0.2em 0.5em;
}

.input-container>div>div.selected {
    background-color: var(--color-border);
}

.word-correspondance {
    color: var(--color-blue);
    font-weight: bold;
}
</style>