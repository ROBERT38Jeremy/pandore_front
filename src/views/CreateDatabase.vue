<script setup>
import { onMounted, ref, watchEffect } from 'vue';
import { useAxios } from '../hooks/useAxios.js';
import { useToastStore } from '../stores/Toast.store'
import { useTabStore } from '../stores/Tabs';
import CustomGroupSelect from '../components/form/customGroupSelect.vue';
import CustomInput from '../components/form/customInput.vue'
import CustomSubmit from '../components/form/customSubmit.vue';

const { selectTab } = useTabStore();
const { Toast } = useToastStore();
const collations = ref({});
const collation = ref(null);
const databaseName = ref(null);

const getCollations = () => {
    const result = ref({});

    result.value = useAxios({ url: `/sql/general/collation`, method: 'GET' });

    watchEffect(() => {
        if (result.value.isLoading === false && result.value.resp?.data?.success) {
            collations.value = result.value.resp.data.success
        } else if (result.value.isLoading === false && result.value.resp?.data?.error) {
            Toast({
                type: "error",
                message: result.value.resp.data.error
            });
        }
    })
}

const createDatabase = () => {
    const result = ref({});

    result.value = useAxios({ url: `/sql/database/create`, method: 'POST', body: { databaseName: databaseName.value, collation: collation.value } });

    watchEffect(() => {
        if (result.value.isLoading === false && result.value.resp?.data?.success) {
            window.location.reload();
            Toast({
                type: "success",
                message: result.value.resp.data.success
            });
        } else if (result.value.isLoading === false && result.value.resp?.data?.error) {
            Toast({
                type: "error",
                message: result.value.resp.data.error
            });
        }
    })
}

onMounted(() => {
    selectTab('Create Database');
    getCollations();
})
</script>

<template>
    <div v-if="collations" class="form-container">
        <div class="form">
            <h2>New Database</h2>

            <CustomInput type="text" label="Database Name" v-model="databaseName" />

            <CustomGroupSelect :datas="collations" label="interclassification" v-model="collation" />

            <br>
            <CustomSubmit label="Create Database" type="button" @click="createDatabase"/>
        </div>
    </div>

</template>

<style scoped>
.form-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.form {
    min-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>