<script setup>
import { onMounted, ref, toRef, watch, watchEffect } from 'vue';
import { DateTime } from 'luxon'
import { useAxios } from '../hooks/useAxios.js';
import { useDBConnectStore } from '../stores/DBConnect';
import { useTabStore } from '../stores/Tabs';
import customSubmit from '../components/form/customSubmit.vue'
import CustomLoader from '../components/global/CustomLoader.vue';
import SimpleTable from '../components/simpleTable.vue';

const props = defineProps({
    databaseName: {
        type: String,
    },
    tableName: {
        type: String
    }
});
const { unsetTable } = useDBConnectStore();
const { selectTab } = useTabStore();
const loading = ref(false);
const tableStructure = ref([]);
const tableIndexes = ref([]);
const tableConstraints = ref([]);
const database = toRef(props, "databaseName");
const table = toRef(props, "tableName");
const message = ref(null);
const inputs = ref({});
const insertValues = ref({
    database: database,
    table: table,
    datas: {}
});

const showTableStructure = () => {
    const result = ref({});

    loading.value = true;
    result.value = useAxios({ url: `/database/${database.value}/${table.value}/structure`, method: 'GET' });

    watchEffect(() => {
        if (result.value.isLoading === false && result.value?.resp?.data?.success) {
            tableStructure.value = result.value.resp.data.success;
            tableIndexes.value = result.value.resp.data.index;
            tableConstraints.value = result.value.resp.data.foreign;
            loading.value = false;
        } else if (result.value.isLoading === false) {
            message.value = result.value?.error?.data ?? 'Une erreur est survenue...'
            loading.value = false;
        }
    })
}

const insert = () => {
    const result = ref({});

    result.value = useAxios({ url: `/database/${database.value}/${table.value}/insert`, method: 'POST', body: {...insertValues.value} });

    watchEffect(() => {
        if (result.value.isLoading === false && result.value?.resp?.data?.success) {
            console.log(result.value.resp.data)
            message.value = `Row successfully inserted : ID ${result.value.resp.data.success.insertId}`;
        } else if (result.value.isLoading === false) {
            message.value = result.value?.error?.data ?? 'Une erreur est survenue...'
        }
    })
}

const getInputAttributes = () => {
    (tableStructure.value || []).forEach((champ) => {
        const currentdate = DateTime.now();
        const date = currentdate.toFormat('yyyy-LL-dd');
        const datetime = currentdate.toFormat('yyyy-LL-dd HH:mm:ss');

        const input = {
            name: champ.Field,
            placeholder: champ.Default ?? '',
            options: []
        }
        if (champ.Extra === 'auto_increment') {
            input.placeholder = 'auto_increment';
        }
        switch (champ.Type) {
            case 'int':
                input.type = 'number';
                break;
            case 'date':
                input.type = 'date'
                insertValues.value.datas[champ.Field] = date;
                break;
            case 'datetime':
                input.type = 'datetime-local'
                insertValues.value.datas[champ.Field] = datetime;
                break;
            default:
                input.type = 'text';

                const found = (champ.Type || '').match(/\d+/g);
                if ((found || []).length === 1) {
                    input.maxlength = found[0];
                }
                break;
        }
        inputs.value[champ.Field] = input;

        if (isConstraint(champ.Field) === true) {
            const tableConstraintDefs = tableConstraints.value.filter(c => c.FOR_COL_NAME === champ.Field)[0]
            const tableName = tableConstraintDefs.REFERENCED_TABLE_NAME
            const refColumn = tableConstraintDefs.REF_COL_NAME
            console.log(tableName)
            getConstraintsPossibleValues(tableName, refColumn, champ.Field)
        }
    })
}

const isConstraint = (Field) => {
    return tableConstraints.value.filter(c => c.FOR_COL_NAME === Field).length > 0
}

const getConstraintsPossibleValues = (tableName, refColumn, Field) => {
    const result = ref({});

    result.value = useAxios({
        url: `/database/${database.value}/${tableName}/datas`,
        method: 'POST',
        body: { limit: 50_000_000}
    });

    watchEffect(() => {
        if (result.value.isLoading === false && result.value?.resp?.data?.success) {
            inputs.value[Field].options = result.value.resp.data.success.map((row) => {
                return {
                    REF_COL_NAME: row?.[refColumn],
                    LABEL: Object.values(row)[1]
                }
            });
        }
    })
}

watch(tableStructure, getInputAttributes);
watch([database, table], showTableStructure);
onMounted(() => {
    selectTab('Insert');
    showTableStructure();
})
</script>

<template>
    <CustomLoader :loading="loading">
        <div class="flex-container">
            <SimpleTable
                :check-empty-string="false"
                :columns="{
                    'Champ': 'Field',
                    'Type' : 'Type',
                    'Value' : 'Value',
                    'Summary': 'Summary'
                }"
                error-text="Something went wrong"
                tableClass="no-hover"
            >
                <template v-slot:tableContent>
                    <tr v-for="(champ, idx) in tableStructure">
                        <td>{{ champ.Field }}</td>
                        <td>{{ champ.Type }}</td>
                        <td>
                            <input
                                v-if="inputs?.[champ.Field] && isConstraint(champ.Field) === false"
                                v-model="insertValues.datas[champ.Field]"
                                :type="inputs[champ.Field]?.type ?? 'text'"
                                :placeholder="inputs[champ.Field]?.placeholder ?? ''"
                                :maxlength="inputs[champ.Field]?.maxlength"
                            >
                            <span v-if="isConstraint(champ.Field) === true">
                                <input
                                    :list="champ.Field"
                                    v-model="insertValues.datas[champ.Field]"
                                    :placeholder="inputs[champ.Field]?.placeholder ?? ''"
                                >
                                <datalist :id="champ.Field">
                                    <option v-for="options in inputs[champ.Field].options" :value="options.REF_COL_NAME">{{ options.LABEL }}</option>
                                </datalist>
                            </span>
                        </td>
                        <td v-if="idx === 0" :rowspan="tableStructure.length" class="summary">
                            <pre>{{ insertValues }}</pre>
                            <div class="submit-container">
                                <div class="sumbit-content">
                                    <customSubmit label="Save" @click="insert"/>
                                </div>
                            </div>
                        </td>
                    </tr>
                </template>
            </SimpleTable>
        </div>
    </CustomLoader>
</template>

<style scoped>
input {
    position: relative;
    background-color: transparent;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    padding: 3px 0 3px 5px;
    outline: none;
    width: calc(100% - 30px);
    font-size: small;
    color: var(--color-text);
}

.flex-container {
    display: flex;
    gap: 1em;
}

pre {
    background-color: var(--color-background);
    border-radius: 0.5em;
    padding: 1em;
    width: fit-content;
    height: fit-content;
}

.summary {
    border-left: 1px solid var(--color-border);
    vertical-align: top;
}

.submit-container {
    display: flex;
    justify-content: flex-end;
}

.sumbit-content {
    max-width: 10vw;
    margin-top: auto;
}
</style>