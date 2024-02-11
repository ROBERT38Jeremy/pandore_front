<script setup>
import { ref } from 'vue';
import thIndexesTypes from './thIndexesTypes.vue';

const props = defineProps({
    columnName: {
        type: String,
        required: true,
    },
    structure: {
        type: Object,
        required: false,
    },
});
const structureIsShown  = ref(false);
const structureIsToShow = ref(false);

const showStructure = (isToShow) => {
    structureIsToShow.value = isToShow
    if (isToShow) {
        setTimeout(() => {
            if (structureIsToShow.value) {
                structureIsShown.value = true;
            }
        }, 700)
    } else {
        structureIsShown.value = false;
    }
}

</script>

<template>
    <span @mouseover="showStructure(true)" @mouseout="showStructure(false)">
        <div class="th">
            <thIndexesTypes v-if="structure?.Type" :type="structure?.Type" />
            <div><slot /></div>
            <div>{{ columnName }}</div>
        </div>
    </span>
</template>

<style scoped>
span {
    position: relative;
    padding: 0;
}

.th,
.th>div {
    display: flex;
    align-items: center;
    gap: 0.2em;
}

table.structure {
    position: absolute;
    top: calc(100% + 0.5em);
    left: calc(50%);
    transform: translateX(-50%);
    background-color: var(--color-background-light);
    z-index: 4;
    -webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3);
    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3);
    padding: 0;
    border-spacing: 0;
    border-radius: 5px;
}
</style>