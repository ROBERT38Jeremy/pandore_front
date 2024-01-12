import { ref } from 'vue'
import { defineStore } from 'pinia'
import json from '../../config/PandoreUserConf.json';

export const usePandoreConfStore = defineStore('PandoreConf', () => {
    const pandoreConf = ref({});
    const pandoreConfPath = ref('../../config/PandoreUserConf.json');

    async function setPandoreConf() {
        const result = await new Promise((resolve) => {
            pandoreConf.value = {...json}
            return resolve();
        })
        return result;
    }

    return {
        pandoreConfPath,
        pandoreConf,
        setPandoreConf
    }
})
