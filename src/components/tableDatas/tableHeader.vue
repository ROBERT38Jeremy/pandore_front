<script setup>
import { toRef, watch } from 'vue';
import { useDebouncedRef } from '../../utils/UseDebouncedRef';

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
const emit = defineEmits(['triggerFilter']);

watch(search, () => {
    if (search.value === '') {
        emit('clearSearchInList');
    } else {
        emit('searchInList', search.value);
    }
})
</script>

<template>
    <div v-if="tableName" class="table-header">
        <div class="table-header-table-name">{{ tableName }}</div>
        <span v-if="nbResult" class="simple-table-nb-result">{{ nbResult }} results</span>
        <div>
            <div class="tablea-header-search">
                <img src="@/assets/search.png" class="no-pointer">
                <input type="search" v-model="search">
            </div>
            <img src="@/assets/filter.png" @click="emit('triggerFilter')">
            <img src="@/assets/settings.png" class="disabled">
        </div>
    </div>
</template>

<style scoped>
input {
    position: relative;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    outline: none;
    width: calc(100% - 30px);
    font-size: small;
    color: var(--color-text);
}
</style>