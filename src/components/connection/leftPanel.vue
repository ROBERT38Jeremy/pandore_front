<script setup>
import { useAxios } from '../../hooks/useAxios.js';
import { ref, watch } from 'vue';
import { useDBConnectStore } from '../../stores/DBConnect.js'
import CustomInput from '../../components/form/customInput.vue';
import CustomSubmit from '../../components/form/customSubmit.vue';
import CustomLoader from '../../components/global/CustomLoader.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { connect, setDatabase } = useDBConnectStore()
const loading = ref(false);
const message = ref(null);
const form = ref({
    serveur: null,
    user: null,
    pwd: null,
    db: null
});

function submit() {
    const connection = ref({});
    const formData = {...form.value}

    loading.value = true;
    connection.value = useAxios({ url: '/try/connect', method: 'POST', body: formData });

    watch(connection.value, () => {
        if (connection.value.isLoading === false) {
            loading.value = false; // commenter pour tester le chargement
        }

        if (connection.value.error) {
            message.value = {
                type: 'ERROR',
                msg: connection.value.error.message,
                code: connection.value.error.code,
                url: connection.value.error?.config?.baseURL,
                method: connection.value.error?.config?.method,
            }
        } else if (connection.value?.resp?.data?.success !== true) {
            message.value = {
                type: 'ERROR',
                msg: 'Connection failed'
            }
        } else {
            connect()
            message.value = {
                type: 'SUCCESS',
                msg: 'Connexion établie',
            }
            if (formData.db) {
                setDatabase(formData.db);
                router.push(`/database/${formData.db}/structure`)
            }
        }
    })
}
</script>

<template>
    <form class="left-panel" v-on:submit.prevent="submit">
        <CustomLoader :loading="loading">
            <h1>Connection</h1>

            <div v-if="message" class="error-message">Failed to connect : {{ message?.msg }}</div>

            <CustomInput
                type="text"
                label="Host"
                v-model="form.serveur"
            />
            <CustomInput
                type="text"
                label="User"
                v-model="form.user"
            />
            <CustomInput
                type="text"
                label="Password"
                v-model="form.pwd"
            />
            <CustomInput
                type="text"
                label="Database"
                v-model="form.db"
            />
            <br>
            <CustomSubmit label="Authentification" />
        </CustomLoader>
    </form>
</template>

<style scoped>
.connection-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
}

.left-panel {
    padding: 5em 6em;
    background-color: #ffffff;
    box-shadow: 0px 0px 40px 0px rgba(0,0,0,0.10);
    transition: all 0.2s ease-in-out;
}

.left-panel h1,
.ritgh-panel h1 {
    text-transform: uppercase;
    text-align: center;
}

.right-panel {
    background-color: #23283a;
    box-shadow: 0px 0px 40px 0px rgba(0,0,0,0.10);
    max-height: 20em;
    min-width: 25em;
    padding: 3em 6em;
    color: white;
    position: relative;
}

.right-panel p {
    color: rgba(255, 255, 255, 0.5);
}

svg {
    position: absolute;
    top: 1em;
    left: calc(100% - 3em);
}

pre {
    padding: 0.5em;
    background-color: rgb(216, 216, 216);
}

.error-message {
    color: red;
}
</style>