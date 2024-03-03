<script setup>
import { storeToRefs } from 'pinia';
import { useToastStore } from '../../stores/Toast.store'

const { toastDisplay, toastLoading, toastConf } = storeToRefs(useToastStore())
</script>

<template>
    <div v-show="toastDisplay" :class="'Toaster ' + (toastConf?.type ?? 'info')">
        <span v-if="!toastLoading" v-html="toastConf?.message"></span>
        <span v-else class="loader-container">
            <span class="circle-container">
                <svg fill="none" class="circle-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle class="circle" cx="50" cy="50" r="45" />
                </svg>
            </span>
        </span>
    </div>
</template>

<style scoped>
.Toaster {
    position: absolute;
    top: 2em;
    right: 5em;
    background-color: var(--color-background-light);
    padding: 1em;
    z-index: 60;
    border-radius: 0.3em;
    -webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3);
    box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3);
    min-width: 10em;
    max-width: 30em;
    min-height: 3em;
    max-height: 10em;
    border-left-width: 5px;
    border-left-style: solid;
    display: flex;
    align-items: center;
}

.Toaster.info {
    border-left-color: var(--color-blue);
}

.Toaster.success {
    border-left-color: green;
}

.Toaster.error {
    border-left-color: red;
}

.loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.circle-container {
    display: flex;

    justify-content: center;
    align-items: center;

    width: 100px;
    aspect-ratio: 1/1;
}

.circle-svg {
    --_circle-radius: 45px;
    --_svg-width: 100px;
    --_stroke-width: 10px; /* svg-width - (circle-radius * 2) */

    width: var(--_svg-width);
    height: var(--_svg-width);

    /*   stroke-linecap: round; */
    stroke-width: var(--_stroke-width);

    stroke-dashoffset: 1;
    stroke-dasharray: 1 1000;

    animation: loader 1500ms infinite linear, spin 3000ms infinite linear;
}

@keyframes loader {
    0% {
      stroke-dashoffset: 1;
      stroke-dasharray: 1 1000;
    }

    100% {
      stroke-dashoffset: calc(var(--_circle-radius) * -2 * 3.1415);
      stroke-dasharray: calc(var(--_circle-radius) * 2 * 3.1415) 1000;
    }
}

@keyframes spin {
    0% {
      rotate: 0deg;
      stroke: var(--color-blue);
    }

    100% {
      rotate: 360deg;
      stroke: var(--color-purple);
    }
}
</style>