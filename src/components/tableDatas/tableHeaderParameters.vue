<script setup>
import eyeSvg from '../SVG/eye.svg.vue';
import eyeSlashSvg from '../SVG/eyeSlash.svg.vue'
import exportSvg from '../SVG/export.svg.vue'
import parametersSvg from '../SVG/parameters.svg.vue';

import { ref, watchEffect } from 'vue';
import { useAxios } from '../../hooks/useAxios.js';
import { useToastStore } from '../../stores/Toast.store';

const props = defineProps({
    database: {
        type: String,
        requiered: true,
    },
    table: {
        type: String,
        requiered: true,
    },
    structure: {
        type: Object,
        requiered: true,
    },
    hiddenColumns: {
        type: Array,
        required: true
    },
});
const emit = defineEmits(['hideColumn']);
const { ToastLoadStart, ToastLoadEnd } = useToastStore();

const actionRunning = ref(false);

const exportCSV = () => {
    actionRunning.value = true;
    const result = ref(null);

    ToastLoadStart()
    result.value = useAxios({ url: `/sql/database/${props.database}/${props.table}/export`, method: 'GET' });

    watchEffect(() => {
        if (result.value.isLoading === false && result.value?.resp?.data?.success) {
            ToastLoadEnd({
                type: "success",
                message: "Export terminé"
            });
            window.location.href = "/public/export.csv"
            actionRunning.value = false;
        } else if (result.value.isLoading === false) {
            ToastLoadEnd({
                type: "error",
                message: "Une erreur est survenue... Impossible de procéder à l'export"
            });
            actionRunning.value = false;
        }
    })
}

</script>

<template>
    <div :class="`parameter-container ${actionRunning ? 'action-running' : ''}`">
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
            <div class="parameter-option" @click="exportCSV">
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

.parameter-container.action-running {
    opacity: 0.4;
}

.parameter-container:not(.action-running):hover>div.parameter-options-container {
    display: block;
}

div.parameter-options-container {
    border-radius: 0.5em;
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