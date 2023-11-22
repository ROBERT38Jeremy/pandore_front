<script setup>
import { onBeforeMount, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router'
import { useAxios } from '../../hooks/useAxios';
import { useDBConnectStore } from '../../stores/DBConnect'
import { storeToRefs } from 'pinia';
import customSelect from '../../components/form/customSelect.vue';
import CustomLoader from '../../components/global/CustomLoader.vue'

const { setDatabase, unsetTable } = useDBConnectStore()
const { database } = storeToRefs(useDBConnectStore())
const router = useRouter()
const databaseList = ref({});
const databaseTables = ref([]);
const loading = ref(false);

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
            getDatabaseTablesList()
        }
    })
}

const getDatabaseTablesList = () => {
    const result = ref({});

    loading.value = true;
    result.value = useAxios({ url: `/database/${database.value}/data`, method: 'GET' });

    watchEffect(() => {
        if (result.value.isLoading === false && result.value.resp.data.success) {
            databaseTables.value = result.value.resp.data.success.map((table) => {
                return table.TABLE_NAME
            });
            loading.value = false; // commenter pour tester le chargement
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
        <div class="select-db">
            <customSelect
                :datas="Object.values(databaseList)"
                v-model="database"
                @change="selectDB"
            />
        </div>

        <div class="tables-list-container">
            <CustomLoader :loading="loading">
                <div class="tables-list" v-if="databaseTables.length > 0">
                    <div v-for="table in databaseTables">
                        <div><img src="@/assets/table.png"></div>
                        <div>
                            <RouterLink :to="'/database/'+database+'/'+table+'/structure'">{{ table }}</RouterLink>
                        </div>
                    </div>
                </div>
            </CustomLoader>
        </div>
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
    padding-bottom: 2em;
}

.select-db {
    text-align: center;
    display: flex;
    justify-content: center;
}

.tables-list-container {
    position: relative;
    min-height: 10em;
    margin-top: 1em;
}

.tables-list>div {
    width: calc(100% - 1em);
    margin-left: 1em;
    padding: 0.2em;
    display: flex;
    gap: 0 1em;
}

.tables-list>div img {
    height: 15px;
    opacity: 0.7;
}
</style>