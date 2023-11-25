<script setup>
import { createPinia } from 'pinia';
import { onMounted, ref, toRef, watch } from 'vue';

const props = defineProps({
    datas: {
        type: Array,
        required: false
    },
    columns: {
        required: false
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
    }
});
const datas = toRef(props, "datas");
const errorText = toRef(props, "errorText");
const nbResult = toRef(props, "nbResult");
</script>

<template>
    <h2 v-if="tableTitle" class="simple-table-title">{{ tableTitle }}</h2>
    <span v-if="nbResult" class="simple-table-nb-result">{{ nbResult }} results</span>
    <br>
    <table class="simple-table">
        <thead>
            <tr v-if="props.columns">
                <th v-if="autoIdColumn"></th>
                <th v-for="(column, columnName) in props.columns">{{ columnName }}</th>
            </tr>
            <tr v-else-if="datas">
                <th v-if="autoIdColumn"></th>
                <th v-for="(datas, column) in datas[0]">{{ column }}</th>
            </tr>
        </thead>

        <tbody v-if="datas && props.columns">
            <tr v-for="(row, index) in datas">
                <td v-if="autoIdColumn">{{ index + 1 }}</td>
                <td v-for="(column, columnName) in props.columns">
                    <span v-if="row[column] === null" class="null-value">NULL</span>
                    <span v-else>{{ row[column] }}</span>
                </td>
            </tr>
        </tbody>
        <tbody v-else-if="datas">
            <tr v-for="(row, index) in datas">
                <td v-if="autoIdColumn">{{ index + 1 }}</td>
                <td v-for="(datas, column) in datas[0]">
                    <span v-if="row[column] === null" class="null-value">NULL</span>
                    <span v-else>{{ row[column] }}</span>
                </td>
            </tr>
        </tbody>
        <slot v-else/>

    </table>
    <div v-if="datas && datas.length === 0" class="simple-table-error">{{ errorText }}</div>
</template>