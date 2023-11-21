import { ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'
import { useAxios } from '../hooks/useAxios.js';
import { useRoute } from 'vue-router'

export const useDBConnectStore = defineStore('DBConnect', (currentRoutePath) => {
    const isConnected = ref(false);
    const database = ref(null);
    const table = ref(null)
    const route = useRoute()

    if (isConnected.value === false) {
        const result = ref({});

        result.value = useAxios({ url: `/is-connected`, method: 'GET' });

        watchEffect(() => {
            if (result.value.isLoading === false && result.value?.resp?.data?.success) {
                isConnected.value = true;
                if (route.params.databaseName) {
                    setDatabase(route.params.databaseName)
                }
                if (route.params.tableName) {
                    setTable(route.params.tableName)
                }
            }
        })
    }

    function setDatabase(databaseName) {
        database.value = databaseName;
        unsetTable();
    }

    function unsetDatabase() {
        database.value = null;
    }

    function setTable(tableName) {
        table.value = tableName;
    }

    function unsetTable() {
        table.value = null;
    }

    function connect() {
        isConnected.value = true;
    }

    return {
        isConnected,
        connect,
        database,
        setDatabase,
        unsetDatabase,
        table,
        setTable,
        unsetTable,
    }
})
