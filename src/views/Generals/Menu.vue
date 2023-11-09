<script setup>
import { ref } from 'vue';
import customSelect from '../../components/form/customSelect.vue';
import { useRouter } from 'vue-router'

const router = useRouter()
const database = ref(null);
const testDataDB = {
    lamusee: [],
    lamusee_new: [],
    oneapp: [],
}

const selectDB = () => {
    router.push('/database/'+database.value)
}
</script>

<template>
    <div class="menu-container">
        <div class="title">TITRE</div>
        <span>Databases managment</span>

        <customSelect
            :datas="testDataDB"
            label="Select Database"
            v-model="database"
            @change="selectDB"
        />
    </div>
</template>

<style scoped>
.menu-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

div.title {
    font-size: xx-large;
    text-align: center;
    text-transform: uppercase;
    padding-top: 1em;
}

div.title~span {
    display: inline-block;
    width: 100%;
    text-align: center;
    padding-bottom: 3em;
}
</style>