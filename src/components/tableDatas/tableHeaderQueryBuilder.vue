<script setup>
import { onBeforeUnmount, onMounted, ref, toRef, watch } from 'vue';
import { isString } from '../../utils/UseColumnType';
import { usePandoreConfStore } from '../../stores/PandoreConf';
import { storeToRefs } from 'pinia';
import CustomAutoComplete from '../../components/form/customAutoComplete.vue';

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
const query = ref("");
const inputSqlQuery = ref(null)
const emit = defineEmits(['validQueryWhereString']);
const inputPlaceholder = ref('Enter a SQL expression to filter results');
const queryLastWord = ref('');
const customAutoComplete = ref(null);
const extraPropositions = ref([]);

watch(query, () => {
    queryLastWord.value = query.value.match(/(\w+)(?:\s*)$/g);
})

const replaceWord = (word) => {
    // on replace la recherche par la selection
    const re = new RegExp(`${queryLastWord.value}$`);
    query.value = query.value.replace(re, word)+" "
}

const execQuery = () => {
    emit('validQueryWhereString', query.value);
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

    extraPropositions.value = [...structure.value].map((field) => {
        return { type: 'props', value: field.Field };
    })
})

onBeforeUnmount(() => {
    document.removeEventListener('keyup', hotKey);
})
</script>

<template>
    <div class="query-builder-container">
        <i>WHERE &ensp;</i>
        <div class="input-container">
            <input type="text" ref="inputSqlQuery" v-model="query" @keydown="customAutoComplete.prevent" :placeholder="inputPlaceholder">
            <CustomAutoComplete ref="customAutoComplete" :current-word="queryLastWord?.[0] ?? ''" :position="{ top: -0.5, left: -1 }" :extra-propositions="extraPropositions" @select="replaceWord" @exec="execQuery"/>
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

.query-builder-container .input-container {
    position: relative;
}

.query-builder-container .input-container>input {
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
</style>