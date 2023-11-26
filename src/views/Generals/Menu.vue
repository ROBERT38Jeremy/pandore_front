<script setup>
import { onBeforeMount, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router'
import { useAxios } from '../../hooks/useAxios';
import { useDBConnectStore } from '../../stores/DBConnect'
import { storeToRefs } from 'pinia';
import customSelect from '../../components/form/customSelect.vue';
import CustomLoader from '../../components/global/CustomLoader.vue'

const { setDatabase, setTable } = useDBConnectStore()
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
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" id="table" style="fill:var(--color-text);">
                                <path d="M20 24H4c-2.2 0-4-1.8-4-4V5c0-.6.4-1 1-1h22c.6 0 1 .4 1 1v15c0 2.2-1.8 4-4 4zM2 6v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6H2z"></path>
                                <path d="M23 5H1V4c0-1.7 1.3-3 3-3h16c1.7 0 3 1.3 3 3v1z"></path>
                                <path d="M23 6H1c-.6 0-1-.4-1-1V4c0-2.2 1.8-4 4-4h16c2.2 0 4 1.8 4 4v1c0 .6-.4 1-1 1zM2 4h20c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2z"></path>
                                <path d="M7 24c-.6 0-1-.4-1-1V5c0-.6.4-1 1-1s1 .4 1 1v18c0 .6-.4 1-1 1z"></path>
                                <path d="M23 12H1c-.6 0-1-.4-1-1s.4-1 1-1h22c.6 0 1 .4 1 1s-.4 1-1 1zM23 18H1c-.6 0-1-.4-1-1s.4-1 1-1h22c.6 0 1 .4 1 1s-.4 1-1 1z"></path>
                            </svg>
                        </div>
                        <div>
                            <RouterLink :to="'/database/'+database+'/'+table+'/structure'" @click="setTable(table)">{{ table }}</RouterLink>
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
    align-items: center;
}

.tables-list>div img {
    height: 15px;
    opacity: 0.7;
}
</style>