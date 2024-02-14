<script setup>
import { onMounted, ref, watchEffect } from 'vue';
import { useAxios } from '../hooks/useAxios.js';
import { storeToRefs } from 'pinia';
import { useTabStore } from '../stores/Tabs';
import { usePandoreConfStore } from '../stores/PandoreConf'
import { useToastStore } from '../stores/Toast.store'
import "vue-code-highlight/themes/duotone-sea.css";
import CustomSubmit from '../components/form/customSubmit.vue';
import CustomCheckbox from '../components/form/customCheckbox.vue';

const { pandoreConf } = storeToRefs(usePandoreConfStore())
const { ToastLoadStart, ToastLoadEnd } = useToastStore();
const { selectTab } = useTabStore();
const conf = ref({...pandoreConf.value})

const saveNewConf = () => {
    const result = ref({});

    result.value = useAxios({ url: `/pandore-user/conf`, method: 'POST', body: {...conf.value} });
    ToastLoadStart()
    watchEffect(() => {
        if (result.value.isLoading === false && result.value?.resp?.data?.success) {
            ToastLoadEnd({
                type: "success",
                message: "Configuration enregistrée"
            });
        } else if (result.value.isLoading === false) {
            ToastLoadEnd({
                type: "error",
                message: "Une erreur est survenue... Impossible sauvegarder la configuration"
            });
        }
    })
}

onMounted(() => {
    selectTab('');
})
</script>

<template>
    <h2>Pandore Configuration</h2>

    <table>
        <tr class="section">
            <td colspan="2">
                <h2>Display</h2>
            </td>
        </tr>

        <tr>
            <td class="title">Show Menu When Application Starts</td>
            <td><CustomCheckbox v-model="conf.appDisplay.displayMenu"/></td>
        </tr>

        <tr>
            <td class="title">Enable Fuzzy Search</td>
            <td><CustomCheckbox v-model="conf.fuzzySearch.enabled"/></td>
        </tr>

        <tr>
            <td class="title">Date Format</td>
            <td>
                <select v-model="conf.tables.dateFormat">
                    <option value="dd/LL/yyyy">Dates FR : 26/01/2024</option>
                    <option value="yyyy-LL-dd">Dates EN : 2024-01-26</option>
                </select>
            </td>
        </tr>

        <tr>
            <td class="title">Display Boolean As Check Symbol</td>
            <td><CustomCheckbox v-model="conf.tables.showBooleanAsCheck"/></td>
        </tr>

        <tr>
            <td class="title">Highlight Empty Strings</td>
            <td><CustomCheckbox v-model="conf.tables.searchForEmpty"/></td>
        </tr>


        <tr class="section">
            <td colspan="2">
                <h2>Navigation</h2>
            </td>
        </tr>

        <tr>
            <td class="title">Default page when navigating through tables</td>
            <td>
                <select v-model="conf.tables.defaultPage">
                    <option value="datas">Visualisation de données</option>
                    <option value="structure">Visualisation de la structure</option>
                </select>
            </td>
        </tr>


        <tr class="section">
            <td colspan="2">
                <h2>SQL Request</h2>
            </td>
        </tr>

        <tr>
            <td class="title">Limit on the number of data displayed</td>
            <td><input type="number" v-model="conf.tables.query.defaultLimit"></td>
        </tr>

        <tr>
            <td class="title">
                Maximum limit on the number of data displayed<br>
                <span class="sub-title">
                    (This limit is used to preserve the<br>responsiveness of the application)
                </span>
            </td>
            <td><input type="number" v-model="conf.tables.query.absolutLimit"></td>
        </tr>


        <tr>
            <td></td>
            <td>
                <CustomSubmit type="button" label="Enregistrer" @click="saveNewConf"/>
            </td>
        </tr>
    </table>
</template>

<style scoped>
h2 {
    padding-left: 2em;
}

table {
    border-spacing: 1em;
}

table tr td.title {
    font-weight: bold;
}

table tr td span.sub-title {
    font-weight: normal;
    font-style: italic;
}

input {
    background-color: transparent;
    border: none;
    border-bottom: 1px solid var(--color-border);
    outline: none;
    font-size: small;
    color: var(--color-text);
}

.section td {
    border-bottom: 1px solid var(--color-border);
}
</style>