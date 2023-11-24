<script setup>
import { toRef } from 'vue';

const props = defineProps({
    datas: {
        type: Array,
        required: true
    },
    columns: {
        type: Array,
        required: false
    },
});
const datas = toRef(props, "datas");
</script>

<template>
    <table v-if="datas">
        <thead>
            <tr v-if="props.columns">
                <th v-for="column in props.columns">{{ column }}</th>
            </tr>
            <tr v-else>
                <th v-for="(datas, column) in datas[0]">{{ column }}</th>
            </tr>
        </thead>

        <tbody v-if="props.columns">
            <tr v-for="row in datas">
                <td v-for="column in props.columns">
                    <span v-if="row[column] === null" class="null-value">NULL</span>
                    <span v-else>{{ row[column] }}</span>
                </td>
            </tr>
        </tbody>
        <tbody v-else>
            <tr v-for="row in datas">
                <td v-for="(datas, column) in datas[0]">
                    <span v-if="row[column] === null" class="null-value">NULL</span>
                    <span v-else>{{ row[column] }}</span>
                </td>
            </tr>
        </tbody>

    </table>
</template>

<style scoped>
table {
    width: fit-content;
    border-spacing: 0;
    border-left: 1px solid rgba(216, 218, 221, 0.4);
    border-top: 1px solid rgba(216, 218, 221, 0.4);
    margin-left: 1em;
    margin-right: 1em;
}

th {
    text-align: left;
    background-color: rgb(236, 239, 244);
}

td, th {
    padding: 0.4em 0.7em;
    border-right: 1px solid rgba(216, 218, 221, 0.4);
    border-bottom: 1px solid rgba(216, 218, 221, 0.4);
}

tr td:first-child {
    text-align: center;
    background-color: rgb(236, 239, 244);
}

tr td {
    white-space: nowrap;
    max-width: 40em;
    overflow: hidden;
    white-space: nowrap; /* Don't forget this one */
    text-overflow: ellipsis;
}

.null-value {
    border: 1px solid var(--color-border-hover);
    background-color: var(--color-border);
    padding: 0.2em;
    border-radius: 0.2em;
    font-size: small;
    font-family: sans-serif;
    opacity: 0.5;
    cursor: default;
}
</style>