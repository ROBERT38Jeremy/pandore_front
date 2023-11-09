<script setup>
import { useDBConnectStore } from '../../stores/DBConnect'
import connectionView from '../../views/Connection.vue'
import { storeToRefs } from 'pinia';

const { isConnected } = storeToRefs(useDBConnectStore())
</script>

<template>
    <slot v-if="isConnected"/>
    <connectionView v-else/>
</template>

<style scoped>
</style>