<script setup>
import { onMounted, ref, toRef, watch } from 'vue';

const props = defineProps({
    currentWord: {
        required: true
    },
    values: {
        type: Array,
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
const values      = toRef(props, "values");
const position    = toRef(props, "position");
const autocompletionIsActive = ref(false);
const autocompletionPropositions = ref([]);
const selectedProposition = ref(-1);

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

watch(values, () => {
    autocompletionPropositions.value = values.value;
})

watch(currentWord, () => {
    if (currentWord !== ' ') {
        autocompletionPropositions.value = [...values.value].filter((word) => word.toLowerCase().startsWith(currentWord.value));
        if ((autocompletionPropositions.value || []).length > 0) autocompletionIsActive.value = true;
    }
})

onMounted(() => {
    autocompletionPropositions.value = values.value;
})

const emit = defineEmits(["select"]);
defineExpose({ prevent });

</script>

<template>
    <div
        v-if="autocompletionIsActive && autocompletionPropositions.length > 0"
        class="autocompletion-container"
        :style="`
            top: calc(${position.top}em * 1.6 + 2.6em);
            left: calc(${position.left}em * 0.55 + 0.5em);
        `"
    >
        <div
            v-for="(prop, index) in autocompletionPropositions"
            :class="(selectedProposition === index ? 'selected-proposition' : '')"
        >
            <span class="last-word">{{ currentWord.toUpperCase() }}</span>{{ prop.slice(currentWord.length) }}
        </div>
    </div>
</template>

<style scoped>
.last-word {
    color: var(--color-blue);
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