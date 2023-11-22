<script setup>
import { onBeforeMount, ref, watchEffect } from 'vue';
import { useAxios } from '../hooks/useAxios';
import { useDBConnectStore } from '../stores/DBConnect'
import { storeToRefs } from 'pinia';
import CustomLoader from '../components/global/CustomLoader.vue'

const { setDatabase } = useDBConnectStore()
const { database } = storeToRefs(useDBConnectStore())
const databaseList = ref({});
const loading = ref(false);

const getDatabaseList = () => {
    const result = ref({});
    loading.value = true;
    result.value = useAxios({ url: `/database/list`, method: 'GET' });

    watchEffect(() => {
        if (result.value.isLoading === false && result.value.resp.data.success) {
            databaseList.value = result.value.resp.data.success;
            loading.value = false;
        }
    })
}

onBeforeMount(getDatabaseList);
</script>

<template>
    <!-- <RouterLink to="/">Home</RouterLink> -->
    <div class="container">
        <div class="flex-container">
            <span>PAND</span>
            <img src="@/assets/logo.png">
            <span>RE</span>
        </div>
        <p>Select a Database First.</p>
        <div class="style">
            <div></div>
            <div></div>
        </div>
        <CustomLoader :loading="loading">
            <div class="databases-list">
                <RouterLink v-for="database in databaseList" :to="'/database/'+database+'/structure'">{{ database }}</RouterLink>
            </div>
        </CustomLoader>
    </div>
</template>

<style scoped>
* {
    user-select: none;
}
div.container {
    text-align: center;
    width: 100%;
    height: 100%;
    margin-top: 3.1em;
}
div.flex-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

div.databases-list {
    display: flex;
    gap: 1em 3em;
    align-items: stretch;
    padding: 3em 3em;
}

div.databases-list>a {
   padding: 2em 1em;
   border: 1px solid var(--color-border);
   border-radius: 0.2em;
   cursor: pointer;
   transition: all 0.1s ease-in-out;
   box-shadow: 0px 0px 10px -6px #000000;
}

div.databases-list>a:hover {
    background-color: var(--color-background);
 }

p {
    font-style: italic;
    opacity: 0.7;
}

div>img {
    position: relative;
    top: 0.5em;
    max-height: 100px;
    animation: logo-animation 5s ease-in-out forwards;
}

div>span {
    font-size: 100px;
    font-weight: bold;
    position: relative;
}

div>span:first-child {
    left: 0.1em;
}

div>span:last-child {
    right: 0.15em;
}

@keyframes logo-animation {
    0% {
        transform: rotate(45deg);
    }
    80% {
        transform: rotate(45deg);
    }
}

.style {
    height: 40em;
    position: relative;
    overflow: hidden;
}

.style div {
    position: absolute;
    width: 200%;
    height: 50em;
    -webkit-box-shadow: 0px 0px 15px -6px #000000;
    box-shadow: 0px 0px 15px -6px #000000;
}

.style div:first-child {
    top: 40%;
    left: -10em;
    transform: rotate(9deg);
    background-color: var(--color-button);
}

.style div:nth-child(2) {
    top: 90%;
    right: -10em;
    transform: rotate(-15deg);
    background-color: var(--color-purple);
}


</style>