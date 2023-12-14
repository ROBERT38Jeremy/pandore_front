<script setup>
import { ref } from 'vue';
import SearchableInput from "../global/SearchableInput.vue";

const emit = defineEmits(['searchQuery']);
const props = defineProps({
    tableStructure: {
        type: Array,
        required: false,
    },
});
const conditions = ref({
    select: [],
    where: [],
    limit: 50
})
const storeSelect = (selectIndex, select) => {
    conditions.value.select[selectIndex] = select
}

const storeWhere = (whereIndex, where) => {
    console.log(whereIndex, where)
}
</script>

<template>
    <details class="DQC">
        <summary>Database Query Constructor</summary>
        <div class="select">
            <h3>SELECT</h3>
            <table class="row" v-for="(n, selectNum) in (conditions.select.length + 1)">
                <tr>
                    <td class="row-num">{{ selectNum + 1 }}</td>
                    <td>
                        <SearchableInput :propositions-list="tableStructure" index="Field" value="Field" placeholder="Champs" @find="(find) => storeSelect(selectNum, find)" />
                    </td>
                </tr>
            </table>
        </div>
        <div class="where">
            <h3>WHERE</h3>
            <table class="row" v-for="selectNum in (conditions.where.length + 1)">
                <tr>
                    <td class="row-num">{{ selectNum }}</td>
                    <td>
                        <SearchableInput :propositions-list="tableStructure" index="Field" value="Field" placeholder="Champs" @find="(find) => storeWhere(selectNum, find)" />
                    </td>
                    <td>
                        <select name="" id="">
                            <option value="=">=</option>
                            <option value="!=">!=</option>
                            <option value="<">{{ "<" }}</option>
                            <option value="<=">{{ "<=" }}</option>
                            <option value=">">></option>
                            <option value=">=">>=</option>
                            <option value="IN">IN</option>
                            <option value="NOT IN">NOT IN</option>
                            <option value="IS NULL">IS NULL</option>
                            <option value="IS NOT NULL">IS NOT NULL</option>
                        </select>
                    </td>
                    <td>
                        <input type="text" placeholder="Valeur">
                    </td>
                </tr>
            </table>
        </div>
        <div class="run-DQC-container">
            <button class="run-DQC" @click="emit('searchQuery', conditions)">RUN QUERY</button>
        </div>
    </details>
</template>

<style scoped>
input, select {
    transition: all 0.1s ease-in-out;
    padding: 0.5em;
    border-radius: 1em;
    outline: none;
    border: 1px solid var(--color-border);
    min-width: 5em;
}

.DQC {
    margin-left: 1em;
    background-color: var(--color-background);
    width: fit-content;
    padding: 0.5em 0.7em;
    border-radius: 0.2em;
}

.DQC>summary {
    font-weight: bold;
    outline: none;
    list-style: none;
    cursor: pointer;
    user-select: none;
}

.DQC>summary::-webkit-details-marker {
    display: none;
}

select {
    min-width: 20em;
}

.row {
    background-color: var(--color-background-light);
    border-radius: 5em;
    margin-bottom: 5px;
}

.row-num {
    padding: 0 0.5em 0 1em;
    font-weight: bold;
}

.run-DQC-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 1em;
}

.run-DQC {
    background-color: var(--color-blue);
    padding: 0.5em 0.8em;
    border: none;
    border-radius: 0.3em;
    transition: all 0.1s ease-in-out;
    font-weight: bold;
    color: white;
}

.run-DQC:hover {
    -webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3);
    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3);
}
</style>