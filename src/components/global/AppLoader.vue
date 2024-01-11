<script setup>
import { useAppLoaderStore } from '../../stores/AppLoader'
import { useDBConnectStore } from '../../stores/DBConnect'
import { storeToRefs } from 'pinia';

const { isConnected } = storeToRefs(useDBConnectStore())
const { isLoaded, pctLoaded } = storeToRefs(useAppLoaderStore())
</script>

<template>
    <slot />
    <div v-if="!isLoaded && isConnected" class="app-loader">
        <div class="logo-container">
            <div class="logo-contour1"></div>
            <div class="logo-contour2"></div>
            <div class="logo-contour3"></div>
            <img src="@/assets/logo.png">
            <div class="pct-container">
                <div class="pct-content">
                    <div class="pct-value" :style="'width: '+pctLoaded+'%;'"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.app-loader {
    position: absolute;
    top: 0;
    z-index: 50000000000;
    width: 100vw;
    height: 100vh;
    background-color: var(--color-background);
}

.logo-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.logo-contour1,
.logo-contour2,
.logo-contour3 {
    position: absolute;
    top: 47%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
    width: 100px;
    height: 100px;
    border-radius: 50%;
    z-index: 3;
}

.logo-contour1 {
    padding: 0.5em;
    border: 2px solid var(--color-blue);
    border-top: 0;
    border-bottom: 0;
    border-left: 0;
    animation: rotate 2s infinite;
    animation-timing-function: linear;
}

.logo-contour2 {
    padding: 1em;
    border: 2px solid var(--color-blue-dark);
    border-top: 0;
    border-bottom: 0;
    border-left: 0;
    animation: rotate 4s infinite;
    animation-timing-function: linear;
    animation-direction:reverse;
}

.logo-contour3 {
    padding: 1.5em;
    border: 2px solid var(--color-purple);
    border-top: 0;
    border-bottom: 0;
    border-left: 0;
    transform: rotateZ(0deg);
    animation: rotate 1s infinite;
    animation-timing-function: linear;
}

img {
    max-height: 100px;
    animation: logo-animation 2s ease-in-out;
    z-index: 50;
}

@keyframes rotate {
    from {
      transform: translate(-50%, -50%) rotateZ(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotateZ(360deg);
    }
}

.pct-container {
    --width: 300px;
    --height: 10px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: calc(100% + 5em);
    width: var(--width);
    height: var(--height);
    border-radius: 10px;
}

.pct-content {
    position: relative;
    border: 1px solid var(--color-border);
    width: var(--width);
    height: var(--height);
    border-radius: 10px;
    overflow: hidden;
}

.pct-value {
    position: relative;
    background: linear-gradient(90deg, rgba(5,159,251,1) 0%, rgba(65,32,233,1) 50%, rgba(245,9,226,1) 100%);
    width: 0;
    height: var(--height);
    border-radius: 10px;
    transition: all 0.4s ease-in-out;
}

</style>