import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useDBConnectStore } from '../stores/DBConnect'

export const checkDBConnection = (to, from) => {
    const { isConnected } = storeToRefs(useDBConnectStore())
    watch(isConnected, () => {
        return isConnected.value
    })
    return setTimeout(() => {
        return isConnected.value
    }, 1000);
}
