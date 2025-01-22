<script setup>
import { onMounted, ref, toRef, watch } from 'vue';
import { SQLWords } from '../../utils/SqlWords';
import { SQLFunctions } from '../../utils/SqlFunctions';
import CodeSvg from '../SVG/code.svg.vue';
import FunctionSvg from '../SVG/function.svg.vue';
import TextSvg from '../SVG/text.vue';

const props = defineProps({
    currentWord: {
        required: true
    },
    position: {
        type: Object,
        required: false,
        default: {
            top: 0,
            left: 0
        }
    },
    extraPropositions: {
        required: false,
        type: Array,
        default: []
    },
});

const currentWord                = toRef(props, "currentWord");
const position                   = toRef(props, "position");
const extraPropositions          = toRef(props, "extraPropositions");
const autocompletionIsActive     = ref(false);
const autocompletionPropositions = ref([]);
const selectedProposition        = ref(-1);
const propositions               = ref(SQLWords.concat(SQLFunctions));

const selectProposition = (value = '') => {
    if (typeof value === 'string' && value) {
        emit('select', value);
    }

    selectedProposition.value       -= 1;
    autocompletionPropositions.value = [];
    autocompletionIsActive.value     = false;
}

const prevent = (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        selectProposition("\t");
    } else if (e.key === 'ArrowDown' && selectedProposition.value < autocompletionPropositions.value.length - 1) {
        e.preventDefault();
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
        selectProposition();
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedProposition.value === -1 || (autocompletionPropositions.value || []).length <= 0) {
            emit('exec');
        } else {
            const propValue = autocompletionPropositions.value?.[selectedProposition.value];
            selectProposition(propValue.value);
        }
    }
}

const getRegex = (search) => {
    const letters = search.split('').map((letter) => {
        return `(${letter.toLowerCase()}|${letter.toUpperCase()})`
    });
    const regexBuilt = '.*';
    const regex = new RegExp(`${letters.join(regexBuilt)}${regexBuilt}`);

    return regex;
}

const getAutocompletionPropositions = (word) => {
    if (word === "" || word === " ") {
        autocompletionPropositions.value = [...propositions.value];
        return;
    } else {
        const regex = getRegex(word);
        autocompletionPropositions.value = [...propositions.value]
            .filter((prop) => {
                return (prop.value.match(regex) ?? []).length > 0
            })
            .sort((a, b) => {
                if (a.value.toLowerCase() === word.toLowerCase()) return -1;
                if (b.value.toLowerCase() === word.toLowerCase()) return 1;

                // Vérifier si les mots commencent par le terme de recherche
                const aStartsWith = a.value.toLowerCase().startsWith(word.toLowerCase());
                const bStartsWith = b.value.toLowerCase().startsWith(word.toLowerCase());

                // Si les deux mots commencent par le terme de recherche ou aucun ne le fait
                if (aStartsWith && !bStartsWith) return -1;
                if (!aStartsWith && bStartsWith) return 1;

                // Vérifier si les mots contiennent le terme de recherche
                const aIncludes = a.value.toLowerCase().includes(word.toLowerCase());
                const bIncludes = b.value.toLowerCase().includes(word.toLowerCase());

                // Si les deux mots contiennent le terme de recherche ou aucun ne le fait
                if (aIncludes && !bIncludes) return -1;
                if (!aIncludes && bIncludes) return 1;

                // Si aucune des conditions précédentes ne s'applique, conserver l'ordre d'origine
                return 0;
            })
    }
}

const GetPossibilityHTML = (prop) => {
    let text = '';
    if (currentWord.value) {
        const searchLetters = currentWord.value.toLowerCase().split('');

        prop.value.split('').forEach(letter => {
            if (searchLetters.includes(letter.toLowerCase())) {
                text += `<span style="color: var(--color-blue); font-weight: bold;">${letter}</span>`
            } else {
                text += letter;
            }
        });
        return text
    } else {
        return prop.value.replace(currentWord.value, `<span style="color: var(--color-blue); font-weight: bold;">${currentWord.value}</span>`);
    }
}

watch(currentWord, () => {
    if (currentWord.value) {
        getAutocompletionPropositions(currentWord.value);
        if ((autocompletionPropositions.value || []).length > 0) autocompletionIsActive.value = true;
    }
})

watch(extraPropositions, () => {
    propositions.value = propositions.value.concat(extraPropositions.value);

    autocompletionPropositions.value = [...propositions.value];
})

const emit = defineEmits(["select", "exec"]);
defineExpose({ prevent });

</script>

<template>
    <div
        v-if="autocompletionIsActive && autocompletionPropositions.length > 0"
        class="autocompletion-container"
        :style="`top: calc(${position.top}em * 1.6 + 2.6em); left: calc(${position.left}em * 0.55 + 0.5em);`"
    >
        <table>
            <tr v-for="(prop, index) in autocompletionPropositions" :class="`proposition ${(selectedProposition === index ? 'selected-proposition' : '')}`" @click="selectProposition(prop.value)">
                <td>
                    <CodeSvg v-if="prop.type === 'word'" />
                    <FunctionSvg v-else-if="prop.type === 'function'" />
                    <TextSvg v-else />
                </td>
                <td v-html="GetPossibilityHTML(prop)"></td>
            </tr>
        </table>
    </div>
</template>

<style scoped>
div.autocompletion-container {
    position: absolute;
    z-index: 30;
    border: 1px solid var(--color-border);
    border-radius: 0.5em;
    background-color: var(--color-background-light);
    padding: 0.7em;
    box-shadow: 0px 0px 7px -5px #000000;
    max-height: 40vh;
    overflow-y: auto;
}

div.autocompletion-container>table {
    border-spacing: 0;
}

div.autocompletion-container>table tr {
    padding: 0.2em 0.5em;
    border-radius: 0.4em;
}

div.autocompletion-container>table td:first-child {
    border-radius: 0.4em 0 0 0.4em;
}

div.autocompletion-container>table td:first-child>svg {
    position: relative;
    top: 5px;
}

div.autocompletion-container>table td:last-child {
    border-radius: 0 0.4em 0.4em 0;
}


div.autocompletion-container>table tr:hover td,
div.autocompletion-container>table tr.selected-proposition td {
    background-color: var(--color-background);
    cursor: pointer;
}
</style>