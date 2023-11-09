<script setup>
</script>

<template>
    <div class="tab-container">
        <div>TAB 1</div>
        <div>TAB 2</div>
        <span>+</span>
    </div>
</template>

<style scoped>
.tab-container {
    display: flex;
    gap: 0.5em;
}

.tab-container div,
.tab-container span {
    background-color: white;
    cursor: pointer;
}

.tab-container div {
    padding: 0.2em 0.7em;
    border-radius: 0.5em;
}

.tab-container span {
    padding: 0.2em;
    border-radius: 50%;
    width: 1.5em;
    height: 1.5em;
    text-align: center;
}
</style>