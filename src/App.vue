<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAppLoaderStore } from './stores/AppLoader'
import { usePandoreConfStore } from './stores/PandoreConf'
import { useDisplayMenu } from './stores/DisplayMenu.store';
import isConnectedView from './components/connection/isConnected.vue';
import Toast from './components/global/Toast.vue';
import AppLoader from './components/global/AppLoader.vue';
import HeaderView from './views/Generals/Header.vue';
import MenuView from './views/Generals/Menu.vue';
import MainTabSelectionView from './views/Generals/MainTabSelection.vue';

const { isLoaded }           = storeToRefs(useAppLoaderStore())
const { setModuleStatus }    = useAppLoaderStore()
const { pandoreConf }        = storeToRefs(usePandoreConfStore())
const { setPandoreConf }     = usePandoreConfStore()
const { setMenuDisplayMode } = useDisplayMenu()
const { menuIsDisplayed }    = storeToRefs(useDisplayMenu())

onMounted(async () => {
    await setPandoreConf()
    setModuleStatus('pandoreConf', true)
})

onMounted(() => {
    if ((pandoreConf.value?.appDisplay?.displayMenu ?? true) === false) {
        setModuleStatus('menu', true);
        setMenuDisplayMode(false)
    }
})

</script>

<template>
    <Toast />
    <AppLoader>
        <isConnectedView>
            <table class="main-table">
                <tr>
                    <td rowspan="3" class="main-menu" v-if="menuIsDisplayed">
                        <MenuView />
                    </td>
                    <td class="main-header">
                        <HeaderView/>
                    </td>
                </tr>
                <tr>
                    <td class="main-tab-selection">
                        <MainTabSelectionView />
                    </td>
                </tr>
                <tr>
                    <td class="main-view" id="main-view">
                        <div class="main-view-container">
                            <RouterView v-if="isLoaded" />
                        </div>
                    </td>
                </tr>
            </table>
        </isConnectedView>
    </AppLoader>
</template>

<style scoped>
.main-table {
    width: 100vw;
    min-height: 100vh;
    border-spacing: 5px 2px;
}

.main-header,
.main-tab-selection {
    height: 1em;
}

.main-header {
    padding: 0.2em 0.7em;
}

.main-menu {
    width: 20em;
    padding: 0;
}

.main-view {
    position: relative;
    padding: 0;
    overflow-y: auto;
}

.main-view::-webkit-scrollbar-track {
    background-color: var(--color-background-light);
    border: 1px solid var(--color-border);
    -webkit-box-shadow: inset 0 0 1px rgba(0,0,0,0.1);
}

.main-view::-webkit-scrollbar-thumb {
    background-color: var(--vt-c-blue);
    border-radius: 1em;
}

.main-view::-webkit-scrollbar {
    width: 0.5em;
    height: 0.5em;
}

.main-menu,
.main-header,
.main-view {
    vertical-align: top;
    background-color: var(--color-background-light);
    border-radius: 5px;
    border: 1px solid transparent;
}

.main-view-container {
    position: absolute;
    height: 100%;
    min-width: calc(100% - 5px);
}
</style>
