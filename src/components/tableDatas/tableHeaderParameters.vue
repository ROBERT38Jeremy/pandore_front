<script setup>
import eyeSvg from '../SVG/eye.svg.vue';
import eyeSlashSvg from '../SVG/eyeSlash.svg.vue'
import exportSvg from '../SVG/export.svg.vue'
import parametersSvg from '../SVG/parameters.svg.vue';

const props = defineProps({
    structure: {
        type: Object,
        requiered: true,
    },
    hiddenColumns: {
        type: Array,
        required: true
    },
});
const emit = defineEmits(['hideColumn'])

</script>

<template>
    <div class="parameter-container">
        <parametersSvg/>
        <div class="parameter-options-container">
            <div class="parameter-option">
                <eyeSvg/>
                <div>Show / Hide columns</div>
                <div class="parameter-options-container">
                    <div
                        v-for="field in structure"
                        class="parameter-option"
                        @click="emit('hideColumn', field?.Field)"
                    >
                        <eyeSlashSvg v-if="hiddenColumns.includes(field?.Field)" class="disabled"/>
                        <div>{{ field?.Field }}</div>
                    </div>
                </div>
            </div>
            <div class="parameter-option">
                <exportSvg/>
                <div>Export</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.parameter-container {
    position: relative;
}

.parameter-container:hover>div.parameter-options-container {
    display: block;
}

.parameter-container>div.parameter-options-container {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: var(--color-background-light);
    display: none;
    min-width: 14em;
    font-size: small;
    -webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3);
    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3);
}

div.parameter-options-container>div.parameter-option {
    padding: 0.2em 0.4em;
    cursor: pointer;
    display: flex;
    gap: 1em;
    align-items: center;
    position: relative;
}

div.parameter-options-container>div.parameter-option:hover {
    background-color: var(--color-background);
}

div.parameter-option>div.parameter-options-container {
    position: absolute;
    right: 100%;
    top: 0;
    display: none;
    background-color: var(--color-background-light);
    display: none;
    min-width: 14em;
    font-size: small;
    -webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3);
    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3);
}

div.parameter-option:hover>div.parameter-options-container {
    display: block;
}
</style>