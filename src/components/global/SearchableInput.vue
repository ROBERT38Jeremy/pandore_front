<script setup>
import { ref, toRef, watch } from 'vue';

const emit = defineEmits(['find']);
const props = defineProps({
    propositionsList: {
        type: Array,
        required: false,
    },
    index: {
        type: String,
        required: true,
    },
    value: {
        type: String,
        required: true,
    },
    placeholder: {
        type: String,
        required: false,
        default: ''
    }
});
const input = ref(null);
const search = ref("");
const searching = ref(false);
const selectedProposition = ref(-1);
const propositions = ref([]);
const propositionsList = toRef(props, 'propositionsList');

const searchInPropositions = () => {
    propositions.value = propositionsList.value.filter((proposition) => {
        return proposition?.[props.index].includes(search.value) || proposition?.[props.value].includes(search.value)
    })
}

const triggerFocus = (bool) => {
    if (bool) {
        searching.value = true;
        searchInPropositions();
    } else {
        setTimeout(() => {
            searching.value = false
        }, 100);
    }
}

const navigate = (e) => {
    if (e.key === 'ArrowDown' && selectedProposition.value < propositions.value.length - 1) {
        selectedProposition.value += 1;
    } else if (e.key === 'ArrowDown') {
        selectedProposition.value = 0;
    } else if (e.key === 'ArrowUp' && selectedProposition.value > 0) {
        selectedProposition.value -= 1;
        input.value.selectionStart = search.value.length
    } else if (e.key === 'ArrowUp') {
        selectedProposition.value = propositions.value.length -1;
        input.value.selectionStart = search.value.length
    } else if(e.key === 'Enter') {
        selectItem(selectedProposition.value)
    }
}

const selectItem = (propIndex) => {
    const find = propositions.value?.[propIndex]?.[props.index];
    emit('find', find);
    search.value = find;
    selectedProposition.value = propositions.value.length -1;
    input.value.blur();
}

watch([propositionsList, search], searchInPropositions);
</script>

<template>
    <div class="container">
        <input
            ref="input"
            type="search"
            v-model="search"
            @focusin="triggerFocus(true)"
            @focusout="triggerFocus(false)"
            @keyup="navigate, emit('find', search)"
            :placeholder="placeholder"
        >
        <div class="propositions" v-if="propositions.length > 0 && searching">
            <div
                v-for="(prop, idx) in propositions"
                :class="(selectedProposition === idx ? 'selected-proposition' : '')"
                @click="selectItem(idx)"
            >
                {{ prop?.[props.value] }}
            </div>
        </div>
    </div>
</template>

<style scoped>
input {
    transition: all 0.1s ease-in-out;
    padding: 0.5em;
    border-radius: 1em;
    outline: none;
    border: 1px solid var(--color-border);
    min-width: 20em;
}

div.container {
    position: relative;
}

div.propositions {
    background-color: var(--color-background-light);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 1em);
    z-index: 4;
    max-height: 20vh;
    overflow: auto;
}

div.propositions>div {
    padding: 0.5em 1em 0.5em 1em;
    cursor: pointer;
}

div.propositions>div:hover {
    background-color: var(--color-background);
}

div.propositions>div.selected-proposition {
    background-color: var(--color-background);
}

</style>