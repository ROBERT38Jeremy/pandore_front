<script setup>
import { onBeforeMount, onMounted, ref, watch, watchEffect } from 'vue';
import { useAxios } from '../../hooks/useAxios';
import { useDBConnectStore } from '../../stores/DBConnect'
import { useAppLoaderStore } from '../../stores/AppLoader'
import { usePandoreConfStore } from '../../stores/PandoreConf'
import { useDBUser } from '../../stores/DBUser'
import { storeToRefs } from 'pinia';
import CustomLoader from '../../components/global/CustomLoader.vue'
import databaseSvg from '../../components/SVG/database.svg.vue';
import tableSvg from '../../components/SVG/table.svg.vue';

const { database: selectedDatabase, table: selectedTable } = storeToRefs(useDBConnectStore())
const { setDatabase, unsetTable } = useDBConnectStore()
const { setModuleStatus } = useAppLoaderStore()
const { pandoreConf } = storeToRefs(usePandoreConfStore())
const { currentUser } = storeToRefs(useDBUser())
const { setCurrentUser } = useDBUser()
const databaseList = ref({});
const loading = ref(false);
const showDatabase = ref(null);
const search = ref('');
const showSearchProposition = ref({});

const getDatabaseList = () => {
    const result = ref({});
    result.value = useAxios({ url: `/sql/database/menu-list`, method: 'GET' });
    loading.value = true;

    watchEffect(() => {
        if (result.value.isLoading === false && result.value.resp.data.success) {
            databaseList.value = result.value.resp.data.success;
            showSearchProposition.value = {...databaseList.value};

            loading.value = false;
            setModuleStatus('menu', true);
        }
    })
}

const getCurrentUser = () => {
    const result = ref({});
    result.value = useAxios({ url: `/sql/user/current`, method: 'GET' });

    watchEffect(() => {
        if (result.value.isLoading === false && result.value.resp.data.success && currentUser.value === '') {
            setCurrentUser(result.value.resp.data.success?.[0]?.['CURRENT_USER()']);
            setModuleStatus('DBUser', true);
        }
    })
}

const triggerShowDatabase = (databaseName) => {
    showDatabase.value = databaseName;
}

const searchInTables = () => {
    if (search.value === '') return showSearchProposition.value = {...databaseList.value};

    showSearchProposition.value = [];

    (Object.entries({...databaseList.value}) || []).forEach(database => {
        const databaseName = database[0];
        const databaseNameMatch = databaseName.includes(search.value);
        const tables = database[1].filter((table) => { return table.includes(search.value) || databaseNameMatch === true });


        if (databaseNameMatch === false && (tables || []).length <= 0) {
            if (showSearchProposition.value?.[databaseName]) delete showSearchProposition.value.databaseName;
            return;
        }

        showSearchProposition.value[databaseName] = [...tables];
    });
}

onBeforeMount(getDatabaseList)
onMounted(getCurrentUser)
watchEffect(() => {
    if (selectedDatabase.value !== '') {
        triggerShowDatabase(selectedDatabase.value)
    }
})

watch(search, searchInTables)
</script>

<template>
    <div class="menu-container">
        <div class="logo">
            <img src="@/assets/logo.png">
        </div>
        <div class="title">Pandore</div>
        <span><i>Authenticated as : <b>{{ currentUser }}</b></i></span>

        <CustomLoader :loading="loading">
            <div
                v-if="(pandoreConf?.appDisplay?.displayMenuSearchBar ?? false) == true"
                class="database-search-input-container">
                <input type="search" placeholder="Search Table" v-model="search">
            </div>
            <div class="database-list-global-container">
                <div
                    v-if="(pandoreConf?.appDisplay?.displayMenuSearchBar ?? false) == false"
                    v-for="(tables, database) in databaseList"
                    class="database-list-container"
                >
                    <div @click="triggerShowDatabase(database)">
                        <div>
                            <databaseSvg/>
                        </div>
                        <div>
                            <RouterLink :to="'/database/'+database+'/structure'" @click="setDatabase(database), unsetTable()">{{ database }}</RouterLink>
                        </div>
                    </div>
                    <div v-if="showDatabase === database">
                        <div class="tables-list" v-if="tables.length > 0">
                            <div v-for="table in tables" :class="(table === selectedTable ? 'selected' : '')">
                                <div>
                                    <tableSvg/>
                                </div>
                                <div>
                                    <RouterLink :to="`/database/${database}/${table}/${pandoreConf?.tables?.defaultPage ?? 'structure'}`" >{{ table }}</RouterLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <br>
                    <div v-if="(Object.entries(showSearchProposition) || []).length > 0">
                        <template v-for="[database, tables] of Object.entries(showSearchProposition)">
                            <div class="database-list-container">
                                <div>
                                    <div>
                                        <databaseSvg/>
                                    </div>
                                    <div>
                                        <RouterLink :to="'/database/'+database+'/structure'" @click="setDatabase(database), unsetTable()">{{ database }}</RouterLink>
                                    </div>
                                </div>
                                <template v-if="(tables || []).length > 0">
                                    <div>
                                        <div class="tables-list" v-if="tables.length > 0">
                                            <div v-for="table in tables" :class="(table === selectedTable ? 'selected' : '')">
                                                <div>
                                                    <tableSvg/>
                                                </div>
                                                <div>
                                                    <RouterLink :to="`/database/${database}/${table}/${pandoreConf?.tables?.defaultPage ?? 'structure'}`" >{{ table }}</RouterLink>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>

                        </template>
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
    padding: 0.2em;
    padding-left: 1em;
    display: flex;
    gap: 0 1em;
    align-items: center;
}

.tables-list>div.selected {
    background-color: var(--color-background);
    border-top-left-radius: 0.5em;
    border-bottom-left-radius: 0.5em;
    position: relative;
}

.tables-list>div.selected::after {
    content: "";
    position: absolute;
    bottom: 100%;
    right: 2px;
    background-color: var(--color-background-light);
    border-bottom-right-radius: 100%;
    width: 1em;
    height: 1em;
    -webkit-box-shadow: 10px 9px 0px 10px var(--color-background);
    box-shadow: 10px 10px 0px 10px var(--color-background);
}

.tables-list>div.selected::before {
    content: "";
    position: absolute;
    top: 100%;
    right: 2px;
    background-color: var(--color-background-light);
    border-top-right-radius: 100%;
    width: 1em;
    height: 1em;
    -webkit-box-shadow: 10px -9px 0px 10px var(--color-background);
    box-shadow: 10px -10px 0px 10px var(--color-background);
}

.tables-list>div img {
    height: 15px;
    opacity: 0.7;
}

.database-list-global-container {
    max-height: 70vh;
    min-height: 20vh;
    overflow-y: auto;
    overflow-x: hidden;
    direction: rtl;       /* scrollbar à gauche */
}

.database-list-container {
    margin-bottom: 0.5em;
    direction: ltr;
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


.database-search-input-container {
    display: flex;
    justify-content: center;
}

input {
    width: 80%;
    outline: none;
    border: 1px solid var(--color-border);
    padding: 0.5em 1em;
    border-radius: 0.5em;
}
</style>