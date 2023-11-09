<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useDBConnectStore } from './stores/DBConnect'
import ConnectionView from './views/Connection.vue';
import { storeToRefs } from 'pinia';

const { isConnected } = storeToRefs(useDBConnectStore())
</script>

<template>
    <header>
        <RouterLink to="/">Home</RouterLink>
    </header>
    CONNECTION : {{ isConnected }}

    <RouterView v-if="isConnected === true" />
    <ConnectionView v-else />
</template>

<style scoped>

</style>
