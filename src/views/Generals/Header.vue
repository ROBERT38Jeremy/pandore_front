<script setup>
import { useDBConnectStore } from '../../stores/DBConnect';
import fuzzySearch from '../../components/fuzzySearch.vue';
import { toRef } from 'vue';

const { unsetTable, unsetDatabase } = useDBConnectStore();
const unsetAll = () => {
    unsetDatabase();
    unsetTable();
}
defineEmits(['displayMenu']);
const props = defineProps({
    isMenuDisplayed: {
        type: Boolean,
        required: true
    },
});
const isMenuDisplayed = toRef(props, "isMenuDisplayed");

</script>

<template>
    <div>
        <svg v-if="!isMenuDisplayed" @click="$emit('displayMenu')" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15" height="15" viewBox="0 0 50 50" style="fill:#1A1A1A;">
            <path d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z"></path>
        </svg>
        <svg v-else @click="$emit('displayMenu')" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="15" height="15" viewBox="0 0 64 64" style="fill:#1A1A1A;">
            <path d="M 16 14 C 15.488 14 14.976938 14.194937 14.585938 14.585938 C 13.804937 15.366937 13.804937 16.633063 14.585938 17.414062 L 29.171875 32 L 14.585938 46.585938 C 13.804938 47.366938 13.804937 48.633063 14.585938 49.414062 C 14.976937 49.805062 15.488 50 16 50 C 16.512 50 17.023062 49.805062 17.414062 49.414062 L 32 34.828125 L 46.585938 49.414062 C 47.366938 50.195063 48.633063 50.195062 49.414062 49.414062 C 50.195063 48.633062 50.195062 47.366937 49.414062 46.585938 L 34.828125 32 L 49.414062 17.414062 C 50.195063 16.633063 50.195062 15.366938 49.414062 14.585938 C 48.633062 13.804938 47.366937 13.804938 46.585938 14.585938 L 32 29.171875 L 17.414062 14.585938 C 17.023062 14.194938 16.512 14 16 14 z"></path>
        </svg>
        <RouterLink to="/" @click="unsetAll">Home</RouterLink>
        <!-- <RouterLink to="/dashboard" @click="unsetAll">Dashboard</RouterLink> -->
        <RouterLink to="/options" @click="unsetAll">Options</RouterLink>
        <fuzzySearch />
    </div>
</template>

<style scoped>
div {
    display: flex;
    gap: 1em;
    align-items: center;
}

div>svg {
    cursor: pointer;
}
</style>