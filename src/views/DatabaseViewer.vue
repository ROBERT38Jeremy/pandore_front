<script setup>
import { onMounted, ref, toRef, watch, watchEffect } from 'vue';
import { useAxios } from '../hooks/useAxios.js';
import { formatBytes } from '../hooks/formatBytes.js';
import CustomLoader from '../components/global/CustomLoader.vue'
import DatabaseStructure from '../components/databaseViewer/databaseStructure.vue'

const loading = ref(false);
const props = defineProps({
    databaseName: {
        type: String,
    },
});

const database = toRef(props, "databaseName");
</script>

<template>
    <div class="container">
        <CustomLoader :loading="loading" style="height: ;">
            DATABASE VIEWER
            <br>
            {{ props?.databaseName }}
            <br>
            <DatabaseStructure :databaseName="database" />
        </CustomLoader>
    </div>
</template>

<style scoped>
.container {
    position: absolute;
    width: 100%;
    height: 100%;
}
</style>