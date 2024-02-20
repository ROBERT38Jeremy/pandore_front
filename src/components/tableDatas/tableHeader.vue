<script setup>
import { onBeforeUnmount, onMounted, ref, toRef, watch } from 'vue';
import { useDebouncedRef } from '../../utils/UseDebouncedRef';
import { usePandoreConfStore } from '../../stores/PandoreConf'
import { storeToRefs } from 'pinia';
import searchSvg from '../SVG/search.svg.vue';
import filterSvg from '../SVG/filter.svg.vue';
import parametersSvg from '../SVG/parameters.svg.vue';

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
                    <searchSvg />
                </label>
                <input type="search" ref="searchRef" name="table-search" id="table-search" v-model="search" :placeholder="inputPlaceholder">
            </div>
            <filterSvg
                v-if="(pandoreConf?.tables?.query?.easyBuilder ?? true) === true"
                @click="emit('triggerFilter')"
            />

            <parametersSvg v-if="(pandoreConf?.tables?.query?.easyBuilder ?? true) === false"/>
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