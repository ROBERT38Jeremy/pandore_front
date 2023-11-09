<script setup>
import { RouterView } from 'vue-router'
import isConnectedView from './components/connection/isConnected.vue';
import HeaderView from './views/Generals/Header.vue';
import MenuView from './views/Generals/Menu.vue';
import MainTabSelectionView from './views/Generals/MainTabSelection.vue';
</script>

<template>
    <isConnectedView>
        <table class="main-table">
            <tr>
                <td rowspan="3" class="main-menu">
                    <MenuView />
                </td>
                <td class="main-header">
                    <HeaderView />
                </td>
            </tr>
            <!-- <tr>
                <td class="main-tab-selection">
                    <MainTabSelectionView />
                </td>
            </tr> -->
            <tr>
                <td class="main-view">
                    <RouterView />
                </td>
            </tr>
        </table>
    </isConnectedView>
</template>

<style scoped>
.main-table {
    width: 100vw;
    min-height: 100vh;
    border-spacing: 5px 2px;
}

.main-header,
.main-tab-selection {
    height: 3em;
}

.main-menu {
    width: 20em;
}

.main-menu,
.main-header,
.main-view {
    vertical-align: top;
    background-color: white;
    border-radius: 5px;
    padding: 0.2em;
}

.main-view {
    overflow: auto;
}
</style>
