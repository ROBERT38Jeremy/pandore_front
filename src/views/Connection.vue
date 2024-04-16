<script setup>
import LeftPanel from '../components/connection/leftPanel.vue';
import { onMounted, ref } from 'vue';

const displayForm = ref(false);

onMounted(() => {
    setTimeout(() => {
        displayForm.value = true;
    }, 1300)
})
</script>

<template>
    <div class="connection-background">
        <div class="connection-container">
            <img src="@/assets/logo.png" v-if="!displayForm">
            <LeftPanel v-if="displayForm" />
        </div>
    </div>
</template>

<style scoped>
.connection-background {
    background: rgb(5,159,251);
    background: linear-gradient(349deg, rgba(5,159,251,1) 0%, rgba(245,9,226,1) 100%);
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.connection-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-background-light);
    box-shadow: 0px 0px 40px 0px rgba(0,0,0,0.10);
    min-width: 200px;
    min-height: 200px;
    border-radius: 2em;
    transition: all 1s ease-in-out;
    animation: 0.5s expand 0.8s forwards;
}

.connection-container img {
    width: 100px;
    animation: 0.5s disapear 0.8s forwards;
}

@keyframes expand {
    0% {
        min-width: 200px;
        min-height: 200px;
        border-radius: 2em;
    }
    100% {
        min-width: 480px;
        min-height: 600px;
        border-radius: 0;
    }
}

@keyframes disapear {
    0% {
        opacity: 1;
        display: block;
    }
    90% {
        opacity: 0;
        display: block;
    }
    100% {
        opacity: 0;
        display: none;
    }
}
</style>