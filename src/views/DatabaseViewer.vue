<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
    databaseName: {
        type: String,
    },
});
const router = useRouter()
</script>

<template>
    DATABASE VIEWER
    <br>
    {{ props?.databaseName }}
</template>

<style scoped>

</style>