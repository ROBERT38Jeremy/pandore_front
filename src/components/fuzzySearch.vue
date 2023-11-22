<script setup>
import { onBeforeMount, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue';
import { useAxios } from '../hooks/useAxios';
import { useRouter } from 'vue-router'
import { useDBConnectStore } from '../stores/DBConnect'
import { useTabStore } from '../stores/Tabs'

const { setDatabase, setTable } = useDBConnectStore()
const { selectTab } = useTabStore()
const router = useRouter()
const active = ref(false);
const input = ref(null);
const search = ref("");
const databaseList = ref({});
const tableList = ref({});
const propositions = ref([]);
const selectedProposition = ref(-1);
const fuzzySearchParams = ref({
    database: null,
    table: null
})

const hotKey = (e) => {
    if (e.key == 'k' && e.ctrlKey && active.value === false) {
        active.value = true;
        input.value.focus();
    } else if (e.key == 'Escape' && active.value === true) {
        active.value = false;
        input.value.blur();
    }
}

const fuzzy = async (e) => {
    const string = e.target.value
    search.value = string;

    // first char is cmd string luncher
    if ((string.match(/^>$/g) || []).length === 1) {
        search.value += " ";
    }
    // match table name
    else if ((string.match(/(?<!^>\s)(?<=>\s)\w+/g) || []).length === 1) {
        fuzzyTable(string.match(/(?<!^>\s)(?<=>\s)\w+/g)[0])
    }
    // match database name without ">" after : search and click
    else if ((string.match(/(?<=^>\s)\w+/g) || []).length === 1 && (string.match(/\w+(?![\w\s>])/g) || []).length === 1) {
        fuzzyDatabase(string.match(/(?<=^>\s)\w+/g)[0])
    }
    // match database name but no selection was made so we made it auto
    else if ((string.match(/(?<=^>\s)\w+/g) || []).length === 1 && fuzzySearchParams.value.database === null) {
        fuzzyDatabaseAndSelect(string.match(/(?<=^>\s)\w+/g)[0])
    }

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
    } else {
        selectItem(propositions.value[selectedProposition.value].TABLE_NAME ?? propositions.value[selectedProposition.value])
        selectedProposition.value = -1;
        await getTableList();
        fuzzyTable('');
    }
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

const selectItem = (itemName) => {
    propositions.value = [];
    // match table name
    if ((search.value.match(/(?<!^>\s)(?<=>\s)\w+/g) || []).length === 1) {
        router.push(`/database/${fuzzySearchParams.value.database}/${itemName}/datas`);
        setDatabase(fuzzySearchParams.value.database);
        setTable(itemName);
        selectTab('Datas');
        active.value = false;
        search.value = `> ${fuzzySearchParams.value.database} > `;
        input.value.blur();
    }
    // match database name
    else if ((search.value.match(/(?<=^>\s)\w+/g) || []).length === 1 && (search.value.match(/\w+(?![\w\s>])/g) || []).length === 1) {
        fuzzySearchParams.value.database = itemName;
        search.value = `> ${itemName} > `;
        input.value.focus();
    }
}


onBeforeMount(getDatabaseList)

onMounted(() => {
    document.addEventListener('keyup', hotKey);
})

onBeforeUnmount(() => {
    document.removeEventListener('keyup', hotKey);
})
</script>

<template>
    <div :class="'container '+(active ? 'active' : '')">
        <div>
            <input ref="input" type="search" placeholder="Search (CTRL + K)" @keyup="fuzzy" v-model="search">
            <div :class="'propositions '+(active && propositions.length ? 'active' : '')">
                <div
                    v-for="(prop, index) in propositions"
                    @click="selectItem(prop.TABLE_NAME ?? prop)"
                    :class="(selectedProposition === index ? 'selected-proposition' : '')"
                >
                    {{ prop.TABLE_NAME ?? prop }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
input {
    transition: all 0.1s ease-in-out;
    position: relative;
    padding: 0 1em 0 1em;
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