<script setup>
import { onMounted, ref, toRef, watch } from 'vue';
import { SQLWords } from '../../utils/SqlWords';
import { SQLFunctions } from '../../utils/SqlFunctions';
import CodeSvg from '../SVG/code.svg.vue';
import FunctionSvg from '../SVG/function.svg.vue';

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
    }
});

const currentWord = toRef(props, "currentWord");
const position    = toRef(props, "position");
const autocompletionIsActive = ref(false);
const autocompletionPropositions = ref([]);
const selectedProposition = ref(-1);

const propositions = SQLWords.concat(SQLFunctions);

const prevent = (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        emit('select', "\t");
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
        emit('select', propValue);

        selectedProposition.value -= 1;
        autocompletionPropositions.value = [];
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
        autocompletionPropositions.value = [...propositions];
        return;
    } else {
        const regex = getRegex(word);
        autocompletionPropositions.value = [...propositions]
            .filter((prop) => {
                return (prop.value.match(regex) ?? []).length > 0
            })
            .sort((a, b) => {
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
                text += `<span class="word-correspondance">${letter}</span>`
            } else {
                text += letter;
            }
        });
        return text
    } else {
        return prop.value.replace(currentWord.value, `<span class="word-correspondance">${currentWord.value}</span>`);
    }
}

watch(currentWord, () => {
    if (currentWord.value) {
        getAutocompletionPropositions(currentWord.value);
        if ((autocompletionPropositions.value || []).length > 0) autocompletionIsActive.value = true;
    }
})

onMounted(() => {
    autocompletionPropositions.value = [...propositions];
})

const emit = defineEmits(["select"]);
defineExpose({ prevent });

</script>

<template>
    <div
        v-if="autocompletionIsActive && autocompletionPropositions.length > 0"
        class="autocompletion-container"
        :style="`top: calc(${position.top}em * 1.6 + 2.6em); left: calc(${position.left}em * 0.55 + 0.5em);`"
    >
        <div v-for="(prop, index) in autocompletionPropositions" :class="`proposition ${(selectedProposition === index ? 'selected-proposition' : '')}`">
            <span v-if="prop.type === 'word'">
                <CodeSvg/>
            </span>
            <span v-else-if="prop.type === 'function'">
                <FunctionSvg/>
            </span>

            <span v-html="GetPossibilityHTML(prop)"></span>
        </div>
    </div>
</template>

<style>
.last-word {
    color: var(--color-blue);
}

.word-correspondance {
    color: var(--color-blue);
    font-weight: bold;
}

.proposition {
    display: flex;
    gap: 1em;
    align-items: center;
}

.proposition>* {
    height: 25px;
}

div.autocompletion-container {
    position: absolute;
    z-index: 30;
    border: 1px solid var(--color-border);
    border-radius: 0.5em;
    background-color: var(--color-background-light);
    padding: 0.7em;
    box-shadow: 0px 0px 7px -5px #000000;
}

div.autocompletion-container>div {
    padding: 0.2em 0.5em;
    border-radius: 0.4em;
}

div.autocompletion-container>div.selected-proposition {
    background-color: var(--color-background);
}
</style>