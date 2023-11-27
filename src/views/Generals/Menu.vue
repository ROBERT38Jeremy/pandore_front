<script setup>
import { onBeforeMount, ref, watchEffect } from 'vue';
import { useAxios } from '../../hooks/useAxios';
import { useDBConnectStore } from '../../stores/DBConnect'
import CustomLoader from '../../components/global/CustomLoader.vue'

const { setDatabase, setTable, unsetTable } = useDBConnectStore()
const databaseList = ref({});
const loading = ref(false);
const showDatabase = ref(null);

const getDatabaseList = () => {
    const result = ref({});
    result.value = useAxios({ url: `/database/menu-list`, method: 'GET' });
    loading.value = true;

    watchEffect(() => {
        if (result.value.isLoading === false && result.value.resp.data.success) {
            databaseList.value = result.value.resp.data.success;
            loading.value = false;
        }
    })
}

const triggerShowDatabase = (databaseName) => {
    showDatabase.value = databaseName;
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

        <CustomLoader :loading="loading">
            <div class="database-list-global-container">
                <div v-for="(tables, database) in databaseList" class="database-list-container"  @click="triggerShowDatabase(database)">
                    <div>
                        <div>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 18V6" stroke="var(--color-text)" stroke-width="1.5" stroke-linecap="round"/>
                                <path d="M20 6V18" stroke="var(--color-text)" stroke-width="1.5" stroke-linecap="round"/>
                                <path d="M12 10C16.4183 10 20 8.20914 20 6C20 3.79086 16.4183 2 12 2C7.58172 2 4 3.79086 4 6C4 8.20914 7.58172 10 12 10Z" stroke="var(--color-text)" stroke-width="1.5"/>
                                <path d="M20 12C20 14.2091 16.4183 16 12 16C7.58172 16 4 14.2091 4 12" stroke="var(--color-text)" stroke-width="1.5"/>
                                <path d="M20 18C20 20.2091 16.4183 22 12 22C7.58172 22 4 20.2091 4 18" stroke="var(--color-text)" stroke-width="1.5"/>
                            </svg>
                        </div>
                        <div>
                            <RouterLink :to="'/database/'+database+'/structure'" @click="setDatabase(database), unsetTable()">{{ database }}</RouterLink>
                        </div>
                    </div>
                    <div v-if="showDatabase === database">
                        <div class="tables-list" v-if="tables.length > 0">
                            <div v-for="table in tables">
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
                                    <RouterLink :to="'/database/'+database+'/'+table+'/structure'" @click="setTable(table), setDatabase(database)">{{ table }}</RouterLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomLoader>
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

.database-list-global-container {
    max-height: 70vh;
    overflow-y: auto;
    overflow-x: hidden;
}

.database-list-container {
    padding-left: 1em;
    margin-bottom: 0.5em;
}

.database-list-container>div:first-child {
    display: flex;
    gap: 1em;
    align-items: center;
    padding-left: 1em;
}

.database-list-container>div:first-child svg {
    cursor: pointer;
}

.database-list-container>div:nth-child(2) {
    display: flex;
    flex-direction: column;
    gap: 0.2em;
    padding-left: 1em;
}

.database-list-container>a {
    width: fit-content;
}
</style>