<script setup>
import { onBeforeUnmount, onMounted, ref, toRef, watch } from 'vue';
import { useDebouncedRef } from '../../utils/UseDebouncedRef';
import { usePandoreConfStore } from '../../stores/PandoreConf'
import { storeToRefs } from 'pinia';

const props = defineProps({
    tableName: {
        type: String,
        requiered: false,
    },
    nbResult: {
        type: Number,
        required: false
    },
});
const nbResult = toRef(props, "nbResult");
const search = useDebouncedRef('');
const searchRef = ref(null);
const emit = defineEmits(['triggerFilter', 'searchInList', 'clearSearchInList']);
const { pandoreConf } = storeToRefs(usePandoreConfStore())
const inputPlaceholder = ref('Search');

const hotKey = async (e) => {
    if (e.key == 'S' && e.ctrlKey && e.shiftKey) {
        searchRef.value.focus();
    }
}

watch(search, () => {
    if (search.value === '') {
        emit('clearSearchInList');
    } else {
        emit('searchInList', search.value);
    }
})

onMounted(() => {
    document.addEventListener('keyup', hotKey);

    if (pandoreConf.value?.appDisplay?.displayKeyboardShortcut ?? true === true) inputPlaceholder.value += " (CTRL + MAJ + S)";
})

onBeforeUnmount(() => {
    document.removeEventListener('keyup', hotKey);
})
</script>

<template>
    <div v-if="tableName" class="table-header">
        <div class="table-header-table-name">{{ tableName }}</div>
        <span v-if="nbResult" class="simple-table-nb-result">{{ nbResult }} results</span>
        <div>
            <div class="tablea-header-search">
                <label for="table-search">
                    <svg fill="var(--color-text)" height="16" width="16" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                        viewBox="0 0 488.4 488.4" xml:space="preserve">
                        <g>
                            <g>
                                <path d="M0,203.25c0,112.1,91.2,203.2,203.2,203.2c51.6,0,98.8-19.4,134.7-51.2l129.5,129.5c2.4,2.4,5.5,3.6,8.7,3.6
                                    s6.3-1.2,8.7-3.6c4.8-4.8,4.8-12.5,0-17.3l-129.6-129.5c31.8-35.9,51.2-83,51.2-134.7c0-112.1-91.2-203.2-203.2-203.2
                                    S0,91.15,0,203.25z M381.9,203.25c0,98.5-80.2,178.7-178.7,178.7s-178.7-80.2-178.7-178.7s80.2-178.7,178.7-178.7
                                    S381.9,104.65,381.9,203.25z"/>
                            </g>
                        </g>
                    </svg>
                </label>
                <input type="search" ref="searchRef" name="table-search" id="table-search" v-model="search" :placeholder="inputPlaceholder">
            </div>
            <svg
                :class="(pandoreConf?.tables?.query?.easyBuilder ?? true) === true ? '' : 'disabled'"
                fill="var(--color-text)" width="15" height="15" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg" @click="emit('triggerFilter')">
                <path d="m0 .011 741.97 984.808v673.566l502.665 251.332V984.82l675.332-896.544-88.154-66.308-697.508 925.891v783.345L852.301 1590.2V947.858L221.322 110.341h1262.289V.011z" fill-rule="evenodd"/>
            </svg>

            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="disabled">
                <path d="M3 8L15 8M15 8C15 9.65686 16.3431 11 18 11C19.6569 11 21 9.65685 21 8C21 6.34315 19.6569 5 18 5C16.3431 5 15 6.34315 15 8ZM9 16L21 16M9 16C9 17.6569 7.65685 19 6 19C4.34315 19 3 17.6569 3 16C3 14.3431 4.34315 13 6 13C7.65685 13 9 14.3431 9 16Z" stroke="var(--color-text)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
    </div>
</template>

<style scoped>
input {
    position: relative;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid var(--color-border);
    outline: none;
    width: calc(100% - 30px);
    font-size: small;
    color: var(--color-text);
}

svg:not(.disabled) {
    cursor: pointer;
}

svg.disabled {
    opacity: 0.2;
}
</style>