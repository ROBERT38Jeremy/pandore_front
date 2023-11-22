<script setup>
import { onBeforeMount, ref, watchEffect } from 'vue';
import customSelect from '../../components/form/customSelect.vue';
import { useRouter } from 'vue-router'
import { useAxios } from '../../hooks/useAxios';
import { useDBConnectStore } from '../../stores/DBConnect'
import { storeToRefs } from 'pinia';

const { setDatabase, unsetTable } = useDBConnectStore()
const { database } = storeToRefs(useDBConnectStore())
const router = useRouter()
const databaseList = ref({});

const selectDB = () => {
    setDatabase(database.value);
    router.push('/database/'+database.value+'/structure');
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
        <div class="logo">
            <img src="@/assets/logo.png">
        </div>
        <div class="title">Pandore</div>
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

.logo {
    max-height: 100px;
    text-align: center;
    position: relative;
    padding-top: 1em;
}

.logo>img {
    max-height: 100px;
}

div.title {
    font-size: xx-large;
    text-align: center;
    text-transform: uppercase;
    padding-top: 0.2em;
}

div.title~span {
    display: inline-block;
    width: 100%;
    text-align: center;
    padding-bottom: 3em;
}
</style>