<script setup>
import { onBeforeMount, ref, watchEffect } from 'vue';
import customSelect from '../../components/form/customSelect.vue';
import { useRouter } from 'vue-router'
import { useAxios } from '../../hooks/useAxios';
import { useDBConnectStore } from '../../stores/DBConnect'
import { storeToRefs } from 'pinia';

const { setDatabase } = useDBConnectStore()
const router = useRouter()
const database = ref(null);
const databaseList = ref({});
const testDataDB = {
    lamusee: [],
    lamusee_new: [],
    oneapp: [],
}

const selectDB = () => {
    setDatabase(database.value)
    router.push('/database/'+database.value+'/structure')
}

const getDatabaseList = () => {
    const result = ref({});
    result.value = useAxios({ url: `/database/list`, method: 'GET' });

    watchEffect(() => {
        if (result.value.isLoading === false && result.value.resp.data.success) {
            databaseList.value = result.value.resp.data.success;
        }
    })
}

onBeforeMount(getDatabaseList)
</script>

<template>
    <div class="menu-container">
        <div class="title">TITRE</div>
        <span>Databases managment</span>

        <customSelect
            :datas="Object.values(databaseList)"
            label="Select Database"
            v-model="database"
            @change="selectDB"
        />
    </div>
</template>

<style scoped>
.menu-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

div.title {
    font-size: xx-large;
    text-align: center;
    text-transform: uppercase;
    padding-top: 1em;
}

div.title~span {
    display: inline-block;
    width: 100%;
    text-align: center;
    padding-bottom: 3em;
}
</style>