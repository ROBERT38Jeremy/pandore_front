<script setup>
import { ref, toRef, useSlots, watch } from 'vue';
import { useDebouncedRef } from '../utils/UseDebouncedRef';
import ThIndex from './tableDatas/thIndexes.vue';
import TdDatas from './tableDatas/tdDatas.vue';
import tableHeader from './tableDatas/tableHeader.vue';

const props = defineProps({
    tableName: {
        type: String,
        requiered: false,
    },
    tableClass: {
        type: String,
        requiered: false,
    },
    datas: {
        type: Array,
        required: false
    },
    showTable: {
        type: Boolean,
        required: false,
        default: true
    },
    columns: {
        required: false
    },
    primaries: {
        type: Array,
        required: false,
        default: []
    },
    foreigns: {
        type: Array,
        required: false,
        default: []
    },
    structure: {
        type: Array,
        required: false,
        default: []
    },
    autoIdColumn: {
        type: Boolean,
        required: false,
        default: false
    },
    errorText: {
        type: String,
        required: false,
        default: 'Something went wrong'
    },
    nbResult: {
        type: Number,
        required: false
    },
    tableTitle: {
        type: String,
        required: false
    },
    checkEmptyString: {
        type: Boolean,
        required: false,
        default: false
    },
    stickyTh: {
        type: Boolean,
        required: false,
        default: false,
    },
    selectionColumn: {
        type: Boolean,
        required: false,
        default: false,
    }
});
const datas = toRef(props, "datas");
const errorText = toRef(props, "errorText");
const nbResult = toRef(props, "nbResult");
const slots = useSlots();
const hasTableContentSlot = ref(!!slots?.tableContent);
const emit = defineEmits(['searchInList', 'clearSearchInList', 'triggerFilter']);

const isPrimary = (col) => {
    return props.primaries.includes(col);
}

const isForeign = (col) => {
    return props.foreigns.includes(col);
}
</script>

<template>
    <h2 v-if="tableTitle" class="simple-table-title">{{ tableTitle }}</h2>
    <br>
    <div v-if="showTable" class="table-container">
        <tableHeader
            v-if="tableName"
            :table-name="tableName"
            :nb-result="nbResult"
            @triggerFilter="emit('triggerFilter')"
            @search-in-list="(value) => emit('searchInList', value)"
            @clear-search-in-list="emit('clearSearchInList')"
        />
        <table :class="'simple-table ' + tableClass">
            <thead>
                <tr v-if="props.columns" :class="stickyTh === true ? 'sticky-th' : ''">
                    <th v-if="selectionColumn"></th>
                    <th v-if="autoIdColumn"></th>
                    <th v-for="(column, columnName) in props.columns">
                        <ThIndex
                            :column-name="columnName"
                            :is-primary="isPrimary(columnName)"
                            :is-foreign="isForeign(columnName)"
                            :structure="structure"
                        />
                    </th>
                </tr>
                <tr v-else-if="datas" :class="stickyTh === true ? 'sticky-th' : ''">
                    <th v-if="selectionColumn"></th>
                    <th v-if="autoIdColumn"></th>
                    <th v-for="(data, column) in datas[0]">
                        <ThIndex
                            :column-name="column"
                            :is-primary="isPrimary(column)"
                            :is-foreign="isForeign(column)"
                            :structure="structure"
                        />
                    </th>
                </tr>
            </thead>
    
            <tbody v-if="datas && props.columns">
                <tr v-for="(row, index) in datas">
                    <th v-if="selectionColumn">
                        <input type="checkbox" name="" id="">
                    </th>
                    <td v-if="autoIdColumn" class="primary-col">{{ index + 1 }}</td>
                    <td v-for="(column, columnName) in props.columns">
                        <TdDatas
                            :data-value="row[column]"
                            :check-empty-string="checkEmptyString"
                        />
                    </td>
                </tr>
            </tbody>
            <tbody v-else-if="datas">
                <tr v-for="(row, index) in datas">
                    <th v-if="selectionColumn">
                        <input type="checkbox" name="" id="">
                    </th>
                    <td v-if="autoIdColumn" class="primary-col">{{ index + 1 }}</td>
                    <td v-for="(datas, column) in datas[0]">
                        <TdDatas
                            :data-value="row[column]"
                            :check-empty-string="checkEmptyString"
                        />
                    </td>
                </tr>
            </tbody>
            <slot name="tableContent" v-else/>
    
        </table>
    </div>
    <div v-if="datas && datas.length === 0 || (!datas && !hasTableContentSlot)" class="simple-table-error">{{ errorText }}</div>
</template>

<style scoped></style>