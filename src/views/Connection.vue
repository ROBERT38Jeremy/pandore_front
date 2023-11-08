<script setup>
import { FormKit } from '@formkit/vue'

const testSubmit = (form) => {
    console.log(form)
}
</script>

<template>
    <div class="connection-form">
        <h3>Connection</h3>

        <FormKit
            type="form"
            submit-label="Valider"
            @submit="testSubmit"
        >
            <FormKit
                type="text"
                name="host"
                id="host"
                label="Host"
                placeholder="localhost"
            />
            <FormKit
                type="text"
                name="port"
                id="port"
                label="Port"
                placeholder="3306"
            />
            <FormKit
                type="text"
                name="user"
                id="user"
                label="Utilisateur"
                placeholder="root"
            />
            <FormKit
                type="password"
                name="pwd"
                id="pwd"
                label="Mot de passe"
            />
            <FormKit
                type="text"
                name="database"
                id="database"
                label="Base de données"
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
    border: 1px solid red;
    padding: 0.5em;

}
</style>