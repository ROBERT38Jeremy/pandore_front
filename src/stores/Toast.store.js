import { defineStore } from 'pinia'
import { ref } from 'vue';

export const useToastStore = defineStore('ToastStore', () => {
    const toastDisplay = ref(false);
    const toastLoading = ref(false);
    const toastConf    = ref();

    const ToastLoadStart = () => {
        setTimeout(() => {
            if (toastDisplay.value === false && toastLoading.value === true) {
                toastDisplay.value = true;
                toastLoading.value = true;
            }
        }, 200)
    }

    const ToastLoadEnd = (conf) => {
        toastConf.value = conf;
        toastDisplay.value = true;
        toastLoading.value = false;
        setTimeout(() => {
            toastDisplay.value = false;
        }, conf?.timer ?? 5000);
    }

    const Toast = (conf) => {
        ToastLoadEnd(conf);
    }

    return {
        Toast,
        ToastLoadStart,
        ToastLoadEnd,
        toastDisplay,
        toastLoading,
        toastConf,
    }
})
