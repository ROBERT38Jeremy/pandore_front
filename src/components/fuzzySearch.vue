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
    <div :class="active ? 'active' : ''">
        <input ref="search" type="search" placeholder="Search (CTRL + K)">
    </div>
</template>

<style scoped>
input {
    transition: all 0.1s ease-in-out;
    position: relative;
    padding: 0 1em 0 1em;
    border-radius: 1em;
}

div:not(.active) input {
    outline: none;
    border: 1px solid var(--color-border);
}

div.active input {
    outline: none;
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.5em 1em 0.5em 1em;
    border-radius: 1em;
    z-index: 50;
    border: 1px solid var(--color-border);
    width: 40em;
    font-size: large;
    -webkit-box-shadow: 0px 0px 15px -6px #000000;
    box-shadow: 0px 0px 15px -6px #000000;
}

div.active::after {
    content: "";
    display: inline-block;
    width: 1em;
    height: 1em;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 40;
}
</style>