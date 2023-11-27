<script setup>
import { ref, toRef, useSlots } from 'vue';
import ThIndex from './tableDatas/thIndexes.vue';
import TdDatas from './tableDatas/tdDatas.vue';

const props = defineProps({
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
        default: true
    },
    addActionTD: {
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

const isPrimary = (col) => {
    return props.primaries.includes(col);
}

const isForeign = (col) => {
    return props.foreigns.includes(col);
}
</script>

<template>
    <h2 v-if="tableTitle" class="simple-table-title">{{ tableTitle }}</h2>
    <span v-if="nbResult" class="simple-table-nb-result">{{ nbResult }} results</span>
    <br>
    <table class="simple-table" v-if="showTable">
        <thead>
            <tr v-if="props.columns">
                <th v-if="addActionTD" class="action-col-th">Options</th>
                <th v-if="autoIdColumn"></th>
                <th v-for="(column, columnName) in props.columns">
                    <ThIndex
                        :column-name="columnName"
                        :is-primary="isPrimary(columnName)"
                        :is-foreign="isForeign(columnName)"
                    />
                </th>
            </tr>
            <tr v-else-if="datas">
                <th v-if="addActionTD" class="action-col-th">Options</th>
                <th v-if="autoIdColumn"></th>
                <th v-for="(data, column) in datas[0]">
                    <ThIndex
                        :column-name="column"
                        :is-primary="isPrimary(column)"
                        :is-foreign="isForeign(column)"
                    />
                </th>
            </tr>
        </thead>

        <tbody v-if="datas && props.columns">
            <tr v-for="(row, index) in datas">
                <td v-if="addActionTD"></td>
                <td v-if="autoIdColumn" class="colored-col">{{ index + 1 }}</td>
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
                <td v-if="addActionTD"></td>
                <td v-if="autoIdColumn" class="colored-col">{{ index + 1 }}</td>
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
    <div v-if="datas && datas.length === 0 || (!datas && !hasTableContentSlot)" class="simple-table-error">{{ errorText }}</div>
</template>