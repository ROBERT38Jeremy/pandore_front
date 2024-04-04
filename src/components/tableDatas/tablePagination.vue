<script setup>
import { onMounted, ref, toRef, watch } from 'vue';

const props = defineProps({
    page: {
        type: Number,
        required: true,
    },
    nbResult: {
        type: Number,
        required: true,
    },
    limit: {
        type: Number,
        required: true,
    }
});
const page = toRef(props, "page");
const nbResult = toRef(props, "nbResult");
const limit = toRef(props, "limit");
const maxPage = ref(1);
const pagination = ref([]);
const emit = defineEmits(['selectPage'])

const getPagination = () => {
    pagination.value = [];
    maxPage.value = Math.ceil(nbResult.value / limit.value);
    const realPage = page.value + 1;
    let nbPagePreviw = 9;

    // pagination pour les pages précédentes
    if (realPage != 1) {
        const previousPages = realPage - Math.max(realPage - 4, 1);
        for (let index = realPage - previousPages; index < realPage; index++) {
            pagination.value.push(index);
            nbPagePreviw -= 1;
        }
    }

    // on rajoute la page courante
    pagination.value.push(realPage);
    nbPagePreviw -= 1;

    if (realPage != maxPage) {
        const nextPages = Math.min(realPage + nbPagePreviw, maxPage.value);
        for (let index = realPage + 1; index <= nextPages; index++) {
            pagination.value.push(index);
        }
    }
}

watch([page, nbResult, limit], getPagination);
onMounted(getPagination)

</script>

<template>
    <div class="pagination table-header">
        <div>Page : </div>
        <template v-if="pagination[0] != 1">
            <span @click="emit('selectPage', 1)">1</span>
            <span class="dots">...</span>
        </template>
        <span v-for="nbPage in pagination" :class="nbPage === page + 1 ? 'current' : ''" @click="emit('selectPage', nbPage)">{{ nbPage }}</span>
        <template v-if="pagination.slice(-1)[0] < maxPage">
            <span class="dots">...</span>
            <span @click="emit('selectPage', maxPage)">{{ maxPage }}</span>
        </template>
    </div>
</template>

<style scoped>

.pagination {
    display: flex;
    gap: 0.15em;
    margin-left: auto;
}

.pagination * {
    user-select: none;
}

.pagination>div {
    margin-right: 0.5em;
}

.pagination>span {
    padding: 0 0.4em;
    border: 1px solid var(--color-border);
    border-radius: 0.2em;
}

.pagination>span:not(.dots) {
    cursor: pointer;
}

.pagination>span.dots {
    cursor: default;
}

.pagination>span:not(.dots):not(.current):hover {
    background-color: var(--color-border);
}

.pagination>span.current {
    background-color: var(--color-blue);
    color: white;
}
</style>