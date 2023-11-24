<script setup>
import { onMounted, ref, watch, watchEffect } from 'vue';
import { useAxios } from '../hooks/useAxios.js';
import CustomLoader from '../components/global/CustomLoader.vue'
import Simpletable from '../components/simpleTable.vue';
import { useTabStore } from '../stores/Tabs';

const { selectTab } = useTabStore();
const loading = ref(false);
const userPrivileges = ref([]);
const error = ref(null)

const getUserPrivileges = () => {
    const result = ref({});

    loading.value = true;
    result.value = useAxios({ url: `/user/privileges`, method: 'GET' });

    watchEffect(() => {
        if (result.value.isLoading === false && result.value?.resp?.data?.success) {
            userPrivileges.value = result.value.resp.data.success;
            loading.value = false;
        } else if (result.value.isLoading === false && result.value?.error) {
            error.value = result.value.error.message
            loading.value = false;
        }
    })
}

onMounted(() => {
    selectTab('Privileges');
    getUserPrivileges();
})
</script>

<template>
    <h2>
        Users Privileges
    </h2>
    <CustomLoader :loading="loading" :error="error">
        <Simpletable :datas="userPrivileges" />
    </CustomLoader>
</template>

<style scoped>
h2 {
    padding-left: 2em;
}
</style>