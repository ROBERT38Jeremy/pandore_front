import { ref, watch, watchEffect } from 'vue'
import { defineStore } from 'pinia'

export const useAppLoaderStore = defineStore('AppLoader', () => {
    const isLoaded = ref(false);
    const appLoad = ref({
        menu: false
    });
    const pctLoaded = ref(0);

    const setModuleStatus = (module, status) => {
        if (appLoad.value?.[module] !== undefined) appLoad.value[module] = status

        const moduleNotLoaded = ref(false);
        (Object.entries(appLoad.value) || []).forEach(([module, value]) => {
            if (value === false) {
                isLoaded.value = false;
                moduleNotLoaded.value = true;
            } else {
                pctLoaded.value += 1 / Object.entries(appLoad.value).length * 100
            }
        })
        // peut-être un porblème d'asynchrone ici dans le future
        if (moduleNotLoaded.value === false) setTimeout(() => { isLoaded.value = true; }, 400);
    }

    return {
        appLoad,
        isLoaded,
        pctLoaded,
        setModuleStatus
    }
})
