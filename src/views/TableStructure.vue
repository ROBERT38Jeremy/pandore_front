<script setup>
import { onMounted, ref, toRef, watch, watchEffect } from 'vue';
import { useAxios } from '../hooks/useAxios.js';
import { useDBConnectStore } from '../stores/DBConnect';
import { useTabStore } from '../stores/Tabs';
import CustomLoader from '../components/global/CustomLoader.vue';

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
            message.value = result.value?.resp?.data?.error ?? 'Une erreur est survenue...'
            loading.value = false;
        }
    })
}

watch([database, table], showTableStructure);
onMounted(() => {
    selectTab('Structure');
    showTableStructure();
})
</script>

<template>
    <h2>
        <RouterLink :to="'/database/'+database+'/structure'" @click="unsetTable">{{ database }}</RouterLink> >
        <RouterLink :to="'/database/'+database+'/'+table+'/datas'">{{ table }}</RouterLink> >
        Structure
    </h2>
    <CustomLoader :loading="loading">
        <table v-if="Object.entries(tableStructure).length > 0">
            <tr>
                <th></th>
                <th>Champs</th>
                <th>Type</th>
                <th>Nullable</th>
                <th>Key</th>
                <th>Default</th>
                <th>Extra</th>
            </tr>
            <tr v-for="(datas, index) in tableStructure">
                <td>{{ index + 1 }}</td>
                <td>{{ datas.Field }}</td>
                <td>{{ datas.Type }}</td>
                <td>{{ datas.Nullable ? 'yes' : '-' }}</td>
                <td>{{ datas.Key }}</td>
                <td>{{ datas.Default }}</td>
                <td>{{ datas.Extra }}</td>
            </tr>
        </table>
        <div v-else-if="message" class="message">{{ message }}</div>

        <hr>
        <h2>Index</h2>
        <table v-if="Object.entries(tableIndexes).length > 0">
            <tr>
                <th></th>
                <th>Type</th>
                <th>Name</th>
            </tr>
            <tr v-for="(datas, index) in tableIndexes">
                <td>{{ index + 1 }}</td>
                <td>{{ datas.CONSTRAINT_TYPE }}</td>
                <td>{{ datas.COLUMN_NAME }}</td>
            </tr>
        </table>
        <div v-else class="error">No index found</div>

        <hr>
        <h2>Foreign Keys</h2>
        <table v-if="Object.entries(tableConstraints).length > 0">
            <tr>
                <th>Name</th>
                <th>Source</th>
                <th>Target</th>
                <th>ON DELETE</th>
                <th>ON UPDATE</th>
            </tr>
            <tr v-for="datas in tableConstraints">
                <td>{{ datas.CONSTRAINT_NAME }}</td>
                <td>{{ datas.FOR_COL_NAME }}</td>
                <td>
                    <RouterLink :to="`/database/${database}/${datas.REFERENCED_TABLE_NAME}/structure`" @click="unsetTable">
                        {{ datas.REFERENCED_TABLE_NAME }}
                    </RouterLink>(<span class="foreign-target">{{ datas.REF_COL_NAME }}</span>)
                </td>
                <td>{{ datas.DELETE_RULE }}</td>
                <td>{{ datas.UPDATE_RULE }}</td>
            </tr>
        </table>
        <div v-else class="error">No foreign key found</div>

        <hr>
        <h2>Triggers</h2>
        <div class="error">This feature is not supported yet</div>
        <br>
    </CustomLoader>
</template>

<style scoped>
h2 {
    padding-left: 2em;
}

hr {
    border: 1px solid var(--color-border);
}

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

.message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.foreign-target {
    opacity: 0.5;
    border-bottom: 1px dotted var(--color-text);
}

.error {
    margin-left: 1em;
}
</style>