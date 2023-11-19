<script setup>
import { useDBConnectStore } from '../../stores/DBConnect';

const { unsetTable, unsetDatabase } = useDBConnectStore();
const unsetAll = () => {
    unsetDatabase();
    unsetTable();
}
</script>

<template>
    <div>
        <RouterLink to="/" @click="unsetAll">Home</RouterLink>
        <!-- <RouterLink to="/dashboard" @click="unsetAll">Dashboard</RouterLink> -->
        <RouterLink to="/options" @click="unsetAll">Options</RouterLink>
    </div>
</template>

<style scoped>
div {
    display: flex;
    gap: 1em;
}
</style>