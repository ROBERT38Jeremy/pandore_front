import { ref, watch, watchEffect } from 'vue'
import { defineStore } from 'pinia'

export const useAppLoaderStore = defineStore('AppLoader', () => {
    const isLoaded = ref(false);
    const appLoad = ref({
        menu: false
    });

    const setModuleStatus = (module, status) => {
        if (appLoad.value?.[module] !== undefined) appLoad.value[module] = status

        const moduleNotLoaded = ref(false);
        (Object.entries(appLoad.value) || []).forEach((module) => {
            if (module === false) {
                isLoaded.value = false;
                moduleNotLoaded.value = true;
            }
        })
        // peut-être un porblème d'asynchrone ici dans le future
        if (moduleNotLoaded.value === false) isLoaded.value = true;
    }

    return {
        appLoad,
        isLoaded,
        setModuleStatus
    }
})
