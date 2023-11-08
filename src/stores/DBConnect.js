import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useDBConnectStore = defineStore('DBConnect', () => {
    const DBConnection = ref({});
    const isConnected = ref(false);

    function connect(DBUSER, DBPASSWORD, DBHOST = '127.0.0.1', DBPORT = 3306) {
        console.log(DBUSER, DBPASSWORD, DBHOST, DBPORT)
        DBConnection.value = {
            user: DBUSER,
            pwd: DBPASSWORD,
            host: DBHOST,
            port: DBPORT
        };
        console.log(DBConnection.value)
    }

    return { DBConnection, isConnected, connect }
})
