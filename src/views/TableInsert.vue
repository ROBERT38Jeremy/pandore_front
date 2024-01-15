<script setup>
import { onMounted, ref, toRef, watch, watchEffect } from 'vue';
import { useAxios } from '../hooks/useAxios.js';
import { useDBConnectStore } from '../stores/DBConnect';
import { useTabStore } from '../stores/Tabs';
import CustomLoader from '../components/global/CustomLoader.vue';
import SimpleTable from '../components/simpleTable.vue';
import { DateTime } from 'luxon'

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

const getInputAttributes = () => {
    (tableStructure.value || []).forEach((champ) => {
        const currentdate = DateTime.now();
        const date = currentdate.toFormat('yyyy-LL-dd');
        const datetime = currentdate.toFormat('yyyy-LL-dd hh:mm:ss');

        const input = {
            name: champ.Field,
            placeholder: champ.Default ?? '',
        }
        switch (champ.Type) {
            case 'int':
                input.type = 'number';
                break;
            case 'date':
                input.type = 'date'
                input.value = date;
                break;
            case 'datetime':
                input.type = 'datetime-local'
                input.value = datetime;
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
    <h2>
        <RouterLink :to="'/database/'+database+'/structure'" @click="unsetTable">{{ database }}</RouterLink> >
        <RouterLink :to="'/database/'+database+'/'+table+'/datas'">{{ table }}</RouterLink> >
        Insert
    </h2>
    <CustomLoader :loading="loading">
        <SimpleTable
            :show-table="Object.entries(tableConstraints).length > 0"
            :check-empty-string="false"
            :columns="{
                'Champ': 'Field',
                'Type' : 'Type',
                'Value' : 'Value',
            }"
            error-text="Something went wrong"
        >
            <template v-slot:tableContent>
                <tr v-for="champ in tableStructure">
                    <td>{{ champ.Field }}</td>
                    <td>{{ champ.Type }}</td>
                    <td>
                        <input
                            v-if="inputs?.[champ.Field]"
                            :type="inputs[champ.Field]?.type ?? 'text'"
                            :placeholder="inputs[champ.Field]?.placeholder ?? ''"
                            :value="inputs[champ.Field]?.value ?? ''"
                            :maxlength="inputs[champ.Field]?.maxlength"
                        >
                    </td>
                </tr>
            </template>
        </SimpleTable>
    </CustomLoader>
</template>

<style scoped>
h2 {
    padding-left: 2em;
}

hr {
    border: 1px solid var(--color-border);
}

input {
    position: relative;
    background-color: transparent;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    padding: 3px;
    outline: none;
    width: calc(100% - 30px);
    font-size: small;
    color: var(--color-text);
}
</style>