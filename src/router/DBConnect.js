import { watchEffect, toRefs, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useDBConnectStore } from '../stores/DBConnect'

export const checkDBConnection = (to, from) => {
    const { isConnected } = useDBConnectStore()
    const { DBConnect } = storeToRefs(useDBConnectStore())

    console.log(isConnected().value);

    return sConnected().value

}
