<script setup>
import { FormKit } from '@formkit/vue'
import { useAxios } from '../hooks/useAxios.js';
import { ref } from 'vue';
import { watch } from 'vue';
import { useDBConnectStore } from '../stores/DBConnect.js'

const { connect } = useDBConnectStore()
const loading = ref(false);
const message = ref(null);

function submit(form) {
    const connection = ref({});
    console.log(form)

    loading.value = true;
    connection.value = useAxios({ url: '/', method: 'POST', body: form });

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
        } else {
            connect(form.user, form.pwd, form.host, form.port)
            message.value = {
                type: 'SUCCESS',
                msg: 'Connexion établie',
            }
        }
    })
}
</script>

<template>
    <br> LOADING : {{ loading }}
    <span v-if="message !== null">
        <br> {{ message?.type }} : {{ message }}
    </span>
    <div class="connection-form">
        <h3>Connection</h3>

        <FormKit
            type="form"
            :actions="false"
            @submit="submit"
        >
            <FormKit
                type="text"
                name="host"
                id="host"
                label="Host"
                placeholder="localhost"
                outer-class="connection-form-input"
            />
            <FormKit
                type="text"
                name="port"
                id="port"
                label="Port"
                placeholder="3306"
                outer-class="connection-form-input"
            />
            <FormKit
                type="text"
                name="user"
                id="user"
                label="Utilisateur"
                placeholder="root"
                outer-class="connection-form-input"
            />
            <FormKit
                type="password"
                name="pwd"
                id="pwd"
                label="Mot de passe"
                outer-class="connection-form-input"
            />
            <FormKit
                type="text"
                name="database"
                id="database"
                label="Base de données"
                outer-class="connection-form-input"
            />

            <FormKit
                type="submit"
                label="Valider"
                outer-class="connection-form-submit"
            />
        </FormKit>
    </div>
</template>

<style scoped>
.connection-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0.5em 3em;
    background-color: rgb(255, 255, 255);
    box-shadow: 0px 0px 2px 0px rgba(0,0,0,0.62);
    border-radius: 1em;
}

.connection-form .connection-form-input {
    width: 25em;
}

.connection-form .connection-form-submit button{
    width: 100% !important;
}

[data-type="submit"] .formkit-input {
    width: 100% !important;
}
</style>