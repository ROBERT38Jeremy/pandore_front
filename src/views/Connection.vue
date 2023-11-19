<script setup>
import RightPanel from '../components/connection/rightPanel.vue';
import LeftPanel from '../components/connection/leftPanel.vue';
</script>

<template>
    <div class="connection-form">
        <LeftPanel />
        <RightPanel />
    </div>
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
</style>