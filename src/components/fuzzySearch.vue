<script setup>
import { onBeforeMount, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue';
import { useAxios } from '../hooks/useAxios';
import { useRouter } from 'vue-router'
import { useDBConnectStore } from '../stores/DBConnect'
import { usePandoreConfStore } from '../stores/PandoreConf'
import { useTabStore } from '../stores/Tabs'
import { storeToRefs } from 'pinia';

const { getTabs } = useTabStore()
const { fuzzyTabs } = storeToRefs(useTabStore())
const { setDatabase, setTable } = useDBConnectStore()
const { database, table } = storeToRefs(useDBConnectStore())
const { pandoreConf } = storeToRefs(usePandoreConfStore())
const router = useRouter()
const active = ref(false);
const input = ref(null);
const inputPlaceholder = ref("Search");
const search = ref("");
const databaseList = ref({});
const tableList = ref({});
const propositions = ref([]);
const isActionPropositions = ref(false);
const selectedProposition = ref(-1);
const fuzzySearchParams = ref({
    database: null,
    table: null
})

const hotKey = async (e) => {
    if (e.key == 'k' && e.ctrlKey && active.value === false) {
        active.value = true;
        input.value.focus();

        // if user already in database, trigger fuzzy on this database
        if (database.value) {
            search.value = '> '+database.value;
            selectItem(database.value)
            await getTableList();
            fuzzyTable('');
        }
    } else if (e.key == 'Escape' && active.value === true) {
        active.value = false;
        input.value.blur();
    }
}

const triggerInput = (e) => {
    active.value = true;
    fuzzy(e);
}

const definePropositions = (string) => {
    // pas encore de recherche
    if (string === "") {
        isActionPropositions.value = true;
        propositions.value = fuzzyTabs.value;
    }
    // search for actions
    else if ((string.toLowerCase().match(/^\w/g) || []).length === 1) {
        isActionPropositions.value = true;
        propositions.value = fuzzyTabs.value.filter((tab) => {
            return tab.name.toLowerCase().includes(string) || tab.title.toLowerCase().includes(string);
        });
    }
    // search for databases or tables
    else {
        isActionPropositions.value = false;
        // first char is cmd string luncher
        if ((string.toLowerCase().match(/^>$/g) || []).length === 1) {
            search.value += " ";
            propositions.value = databaseList.value;
        }
        // match table name
        else if ((string.toLowerCase().match(/(?<!^>\s)(?<=>\s)\w+/g) || []).length === 1) {
            fuzzyTable(string.toLowerCase().match(/(?<!^>\s)(?<=>\s)\w+/g)[0])
        }
        // match database name without ">" after : search and click
        else if ((string.toLowerCase().match(/(?<=^>\s)\w+/g) || []).length === 1 && (string.toLowerCase().match(/\w+(?![\w\s>])/g) || []).length === 1) {
            fuzzyDatabase(string.toLowerCase().match(/(?<=^>\s)\w+/g)[0])
        }
        // match database name but no selection was made so we made it auto
        else if ((string.toLowerCase().match(/(?<=^>\s)\w+/g) || []).length === 1 && fuzzySearchParams.value.database === null) {
            fuzzyDatabaseAndSelect(string.toLowerCase().match(/(?<=^>\s)\w+/g)[0])
        }
    }
}

const handlePropositionNav = async (e) => {
    if (e.key === 'ArrowDown' && selectedProposition.value < propositions.value.length - 1) {
        selectedProposition.value += 1;
    } else if (e.key === 'ArrowDown') {
        selectedProposition.value = 0;
    } else if (e.key === 'ArrowUp' && selectedProposition.value > 0) {
        selectedProposition.value -= 1;
        input.value.selectionStart = search.value.length
    } else if (e.key === 'ArrowUp') {
        selectedProposition.value = propositions.value.length -1;
        input.value.selectionStart = search.value.length
    } else if(e.key !== 'Enter') {
        selectedProposition.value = -1;
    } else if(propositions.value[selectedProposition.value]) {
        // on selectionne un action
        if (isActionPropositions.value === true) {
            selectAction(propositions.value[selectedProposition.value])
            return;
        }

        if (search.value === '> ') {
            search.value = `> ${propositions.value[selectedProposition.value]}`;
        } else if (search.value === `> ${fuzzySearchParams.value.database} > `) {
            search.value = `> ${fuzzySearchParams.value.database} > ${propositions.value[selectedProposition.value].TABLE_NAME}`;
        }

        // on selectionne une database -> on cherche les tables
        if (fuzzySearchParams.value.database === null) {
            selectItem(propositions.value[selectedProposition.value])
            await getTableList();
            fuzzyTable('');
        } else {
            selectItem(propositions.value[selectedProposition.value])
            propositions.value = []
            fuzzySearchParams.value = {
                database: null,
                table: null
            }
        }
        selectedProposition.value = -1;
    }
}

const fuzzy = async (e) => {
    const string = e.target.value
    search.value = string;
    definePropositions(string);
    handlePropositionNav(e);
}

const fuzzyDatabase = (value) => {
    if (fuzzySearchParams.value.database !== null) {
        fuzzySearchParams.value.database = null;
    }
    const match = databaseList.value.filter((db) => {
        return db.includes(value)
    })
    propositions.value = match
}

const fuzzyDatabaseAndSelect = (value) => {
    const match = databaseList.value.filter((db) => {
        return db === value
    })
    if (match.length === 1) {
        fuzzySearchParams.value.database = match[0];
        search.value = `> ${match[0]} > `;
        propositions.value = [];
        input.value.focus();
        fuzzyTable('');
    } else {
        propositions.value = match
    }
}

const fuzzyTable = (value) => {
    if (value === '') {
        propositions.value = tableList.value.map((table) => {
            return table.TABLE_NAME
        })
    } else {
        const match = tableList.value.filter((table) => {
            return table.TABLE_NAME.includes(value)
        })
        propositions.value = match
    }
}

const getDatabaseList = () => {
    const result = ref({});
    result.value = useAxios({ url: `/database/list`, method: 'GET' });

    watchEffect(() => {
        if (result.value.isLoading === false && result.value.resp.data.success) {
            databaseList.value = result.value.resp.data.success;
            getTableList();
        }
    })
}

const getTableList = async () => {
    const result = await new Promise((resolve, reject) => {
        const res = ref({});

        res.value = useAxios({ url: `/database/${fuzzySearchParams.value.database}/data`, method: 'GET' });

        watchEffect(() => {
            if (res.value.isLoading === false && res.value.resp.data.success) {
                tableList.value = res.value.resp.data.success;
                return resolve();
            }
        })
    })
}

const selectItem = async (itemName) => {
    propositions.value = [];
    // match table name
    if ((search.value.match(/(?<!^>\s)(?<=>\s)\w+/g) || []).length === 1 || search.value === `> ${fuzzySearchParams.value.database} > `) {
        setDatabase(fuzzySearchParams.value.database);
        setTable(itemName);
        active.value = false;
        search.value = '';
        input.value.blur();
        router.push(`/database/${fuzzySearchParams.value.database}/${itemName}/${pandoreConf.value?.tables?.defaultPage ?? 'structure'}`);
    }
    // match database name
    else if (
        (
            (search.value.match(/(?<=^>\s)\w+/g) || []).length === 1 &&
            (search.value.match(/\w+(?![\w\s>])/g) || []).length === 1
        ) ||
        search.value === '> '
    ) {
        fuzzySearchParams.value.database = itemName;
        search.value = `> ${itemName} > `;
        input.value.focus();

        await getTableList();
        fuzzyTable('');
    }
}

const selectAction = (action) => {
    active.value = false;
    search.value = '';
    propositions.value = [];
    input.value.blur();
    router.push(action.path);
}


onBeforeMount(() => {
    getDatabaseList();
    getTabs(true);
})

onMounted(() => {
    document.addEventListener('keyup', hotKey);

    if (pandoreConf.value?.appDisplay?.displayKeyboardShortcut ?? true === true) inputPlaceholder.value += " (CTRL + K)";
})

onBeforeUnmount(() => {
    document.removeEventListener('keyup', hotKey);
})

watch([database, table], () => {
    getTabs(true);
})
</script>

<template>
    <div :class="'container '+(active ? 'active' : '')">
        <div>
            <input ref="input" type="search" :placeholder="inputPlaceholder" @keyup="fuzzy" @click="triggerInput" v-model="search">
            <div :class="'propositions '+(active && (propositions || []).length ? 'active' : '')" v-if="active && isActionPropositions === false">
                <div
                    v-for="(prop, index) in propositions"
                    @click="selectItem(prop?.TABLE_NAME ?? prop)"
                    :class="(selectedProposition === index ? 'selected-proposition' : '')"
                >
                    {{ prop?.TABLE_NAME ?? prop }}
                </div>
            </div>
            <div :class="'propositions '+(active && (propositions || []).length ? 'active' : '')" v-else-if="active && isActionPropositions === true">
                <div
                    v-for="(prop, index) in propositions"
                    @click="selectAction(prop)"
                    :class="(selectedProposition === index ? 'selected-proposition' : '')"
                >
                    <b>{{ prop.title }}</b> - {{ prop.name }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
input {
    transition: all 0.1s ease-in-out;
    position: relative;
    padding: 0.2em 1em 0.2em 1em;
    border-radius: 1em;
    outline: none;
}

div.container {
    width: calc(13em + 5px);
    height: 1.5em;
}

div.container:not(.active) input {
    outline: none;
    border: 1px solid var(--color-border);
    width: 15em;
}

div.container.active>div {
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 50;
    width: calc(40em + 8em);
    min-height: 3em;
}

div.container.active input {
    padding: 0.5em 1em 0.5em 1em;
    border-radius: 1em;
    border: 1px solid var(--color-border);
    width: 40em;
    font-size: large;
    -webkit-box-shadow: 0px 0px 15px -6px #000000;
    box-shadow: 0px 0px 15px -6px #000000;
}

div.container.active::after {
    content: "";
    display: inline-block;
    width: 1em;
    height: 1em;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 40;
}

div.propositions.active {
    background-color: var(--color-background-light);
    margin: 0 1em 0 1em;
    padding: 0.5em 1em 0.5em 1em;
    width: 44em;
}

div.propositions>div {
    padding: 0.5em 1em 0.5em 1em;
    cursor: pointer;
}

div.propositions>div:hover {
    background-color: var(--color-background);
}

div.propositions>div.selected-proposition {
    background-color: var(--color-background);
}
</style>