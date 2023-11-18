import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useDBConnectStore = defineStore('DBConnect', () => {
    const DBConnection = ref({});
    const isConnected = ref(false);
    const database = ref(null);
    const table = ref(null)

    function setDatabase(databaseName) {
        database.value = databaseName;
    }

    function connect(DBUSER, DBPASSWORD, DBHOST = '127.0.0.1', DBPORT = 3306) {
        DBConnection.value = {
            user: DBUSER,
            pwd: DBPASSWORD,
            host: DBHOST,
            port: DBPORT
        };
        isConnected.value = true;
    }

    return { DBConnection, isConnected, connect, setDatabase, database, table }
})
