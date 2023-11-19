<script setup>
import { onMounted, ref } from 'vue';
import { onBeforeUnmount } from 'vue';

const active = ref(false);
const search = ref(null)

const hotKey = (e) => {
    if (e.key == 'k' && e.ctrlKey) {
        active.value = true;
        search.value.focus();
    } else if (e.key == 'Escape') {
        active.value = false;
        search.value.blur();
    }
}

onMounted(() => {
    document.addEventListener('keyup', hotKey);
})

onBeforeUnmount(() => {
    document.removeEventListener('keyup', hotKey);
})
</script>

<template>
    <input ref="search" type="search" placeholder="Search (CTRL + K)" :class="active ? 'active' : ''">
</template>

<style scoped>
input {
    transition: all 0.2s ease-in-out;
    position: relative;
}

input:not(.active) {
    outline: none;
    border: 1px solid var(--color-border);
}

input.active {
    outline: none;
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 50000;
    padding: 0.5em;
    -webkit-box-shadow: 0px 0px 0px 200vh rgba(0, 0, 0, 0.3);
    box-shadow: 0px 0px 0px 200vh rgba(0, 0, 0, 0.3);
    border: 1px solid var(--color-border);
    width: 40em;
    font-size: large;
}
</style>