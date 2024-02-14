<script setup>
import { onMounted, ref, watchEffect } from 'vue';
import { useAxios } from '../hooks/useAxios.js';
import { storeToRefs } from 'pinia';
import { useTabStore } from '../stores/Tabs';
import { usePandoreConfStore } from '../stores/PandoreConf'
import { useToastStore } from '../stores/Toast.store'
import "vue-code-highlight/themes/duotone-sea.css";
import CustomSubmit from '../components/form/customSubmit.vue';

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
            console.log('OK');
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
    <h2>Workspace configuration</h2>

    <table>
        <tr>
            <td colspan="3">
                <h2>Affichage</h2>
            </td>
        </tr>

        <tr>
            <td class="title">Recherche rapide</td>
            <td>:</td>
            <td><input type="checkbox" v-model="conf.fuzzySearch.enabled" ></td>
        </tr>

        <tr>
            <td class="title">Format de date</td>
            <td>:</td>
            <td><input type="text" v-model="conf.tables.dateFormat"></td>
        </tr>

        <tr>
            <td class="title">Afficher les champs booléen<br>avec des checks</td>
            <td>:</td>
            <td><input type="checkbox" v-model="conf.tables.showBooleanAsCheck"></td>
        </tr>

        <tr>
            <td class="title">Mettre en évidence les chaines vides</td>
            <td>:</td>
            <td><input type="checkbox" v-model="conf.tables.searchForEmpty"></td>
        </tr>


        <tr>
            <td colspan="3">
                <h2>Navigation</h2>
            </td>
        </tr>

        <tr>
            <td class="title">Page par défaut lors de la<br>navigation dans les tables</td>
            <td>:</td>
            <td>
                <select v-model="conf.tables.defaultPage">
                    <option value="datas">Visualisation de données</option>
                    <option value="structure">Visualisation de la structure</option>
                </select>
            </td>
        </tr>


        <tr>
            <td colspan="3">
                <h2>Requêtes</h2>
            </td>
        </tr>

        <tr>
            <td class="title">Limite du nombre de données affichées</td>
            <td>:</td>
            <td><input type="number" v-model="conf.tables.query.defaultLimit"></td>
        </tr>

        <tr>
            <td class="title">
                Limite maximale du nombre de données affichées<br>
                <span class="sub-title">
                    (Cette limite est utilisé pour préservé la <br>réactivité de l'application)
                </span>
            </td>
            <td>:</td>
            <td><input type="number" v-model="conf.tables.query.absolutLimit"></td>
        </tr>


        <tr>
            <td colspan="2"></td>
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
    border-spacing: 1em 0.2em;
}

table tr td.title {
    font-weight: bold;
}

table tr td span.sub-title {
    font-weight: normal;
    font-style: italic;
}
</style>