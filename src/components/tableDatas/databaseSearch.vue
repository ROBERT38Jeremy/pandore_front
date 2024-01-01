<script setup>
import { onBeforeMount, onMounted, toRef } from 'vue';
import SearchableInput from "../global/SearchableInput.vue";

const emit = defineEmits(['searchQuery']);
const props = defineProps({
    tableStructure: {
        type: Array,
        required: false,
    },
    queryConditions: {
        required: false,
        default: {
            select: [],
            where: [],
            limit: 50
        }
    }
});
const conditions = toRef(props, 'queryConditions');
const storeSelect = (select) => {
    conditions.value.select.push(select)
}
const deleteSelect = (index) => {
    conditions.value.select.splice(index, 1);
}

const storeWhere = (index, object, value) => {
    if (!conditions.value.where[index]) {
        conditions.value.where[index] = {
            field: '',
            operator: '=',
            value: ''
        }
    }
    conditions.value.where[index][object] = value
}
const deleteWhere = (index) => {
    conditions.value.where.splice(index, 1);
}
</script>

<template>
    <details class="DQB">
        <summary>Database Query Builder</summary>
        <div class="select">
            <table class="select-table">
                <tr>
                    <td><h4>SELECT</h4></td>
                    <td>
                        <SearchableInput
                            :propositions-list="tableStructure"
                            index="Field"
                            value="Field"
                            placeholder="Champs"
                            @find="storeSelect"
                            :empty-on-find="true"
                        />
                    </td>
                </tr>
            </table>
            <div class="select-list">
                <div v-for="(column, idx) in conditions?.select" @click="deleteSelect(idx)">
                    <div>
                        <svg height="10px" width="10px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 490 490" xml:space="preserve">
                            <polygon points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490 489.292,457.678 277.331,245.004 489.292,32.337 "/>
                        </svg>
                    </div>
                    <div>{{ column }}</div>
                </div>
            </div>
        </div>
        <div class="where">
            <h4>WHERE</h4>
            <table class="row" v-for="(value, selectNum) in ((conditions?.where || []).length + 1)">
                <tr>
                    <td @click="deleteWhere(selectNum)">
                        <svg v-if="conditions?.where?.[selectNum]" height="10px" width="10px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 490 490" xml:space="preserve">
                            <polygon points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490 489.292,457.678 277.331,245.004 489.292,32.337 "/>
                        </svg>
                    </td>
                    <td>
                        <SearchableInput
                            :propositions-list="tableStructure"
                            index="Field"
                            value="Field"
                            placeholder="Champs"
                            @find="(find) => storeWhere(selectNum, 'field', find)"
                        />
                    </td>
                    <td>
                        <select name="" id="" @change="(e) => { storeWhere(selectNum, 'operator', e.target.value) }">
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
                        <input
                            v-if="!['IS NULL', 'IS NOT NULL'].includes(conditions?.where?.[selectNum]?.operator)"
                            type="text"
                            placeholder="Valeur"
                            @keyup="(e) => { storeWhere(selectNum, 'value', e.target.value) }"
                        >
                    </td>
                </tr>
            </table>
        </div>
        <div class="limit">
            <table class="select-table">
                <tr>
                    <td><h4>LIMIT</h4></td>
                    <td><input type="number" @input="(e) => conditions.limit = e.target.value" :value="conditions?.limit"></td>
                </tr>
            </table>
        </div>
        <div class="run-DQB-container">
            <button class="run-DQB" @click="emit('searchQuery', conditions)">RUN QUERY</button>
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

.DQB {
    margin-left: 1em;
    background-color: var(--color-background);
    width: fit-content;
    padding: 0.5em 0.7em;
    border-radius: 0.2em;
    transition: all 0.2s ease-in-out;
}

.DQB[open] {
    -webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3);
    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3);
}

.DQB>summary {
    font-weight: bold;
    outline: none;
    list-style: none;
    cursor: pointer;
    user-select: none;
}

.DQB>summary::-webkit-details-marker {
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

.row tr td:first-child {
    min-width: 32px;
}

.row tr td:first-child svg {
    fill: #000000;
    opacity: 0.5;
    padding: 0 0.5em 0 1em;
    cursor: pointer;
}

.row tr td:first-child:hover svg {
    fill: red;
    opacity: 1;
}

.run-DQB-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 1em;
}

.run-DQB {
    background-color: var(--color-blue);
    padding: 0.5em 0.8em;
    border: none;
    border-radius: 0.3em;
    transition: all 0.1s ease-in-out;
    font-weight: bold;
    color: white;
}

.run-DQB:hover {
    -webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3);
    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3);
}

.select-table {
    border-spacing: 0.5em 0;
}

.select-list {
    border: 1px dashed var(--color-border);
    min-height: 1em;
    max-width: 50vw;
    display: flex;
    gap: 1.5em 0.5em;
    padding: 0.3em;
    flex-wrap: wrap;
}

.select-list>div {
    background-color: var(--color-background-light);
    padding: 0.3em 1em;
    display: flex;
    align-items: center;
    gap: 0.3em;
    cursor: pointer;
}

.select-list>div svg {
    fill: #000000;
    opacity: 0.5;
}

.select-list>div:hover svg {
    fill: red;
    opacity: 1;
}
</style>