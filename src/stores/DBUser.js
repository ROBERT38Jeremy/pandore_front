import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDBUser = defineStore('DBUser', () => {
    const currentUser = ref('');

    const setCurrentUser = (currentUserName) => {
        currentUser.value = currentUserName;
    }

    return {
        currentUser,
        setCurrentUser
    }
})