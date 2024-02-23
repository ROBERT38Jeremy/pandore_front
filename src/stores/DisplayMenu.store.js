import { defineStore } from 'pinia'
import { ref } from 'vue';

export const useDisplayMenu = defineStore('DisplayMenu', () => {
    const menuIsDisplayed = ref(true);

    const setMenuDisplayMode = (displayMode) => {
        menuIsDisplayed.value = displayMode;
    }

    return {
        menuIsDisplayed,
        setMenuDisplayMode
    }
})
