<script setup>
import { onMounted, ref, watch, watchEffect } from 'vue';
import { useAxios } from '../hooks/useAxios.js';
import { storeToRefs } from 'pinia';
import { useTabStore } from '../stores/Tabs';
import { usePandoreConfStore } from '../stores/PandoreConf'
import CustomLoader from '../components/global/CustomLoader.vue'
import CodeHighlight from "vue-code-highlight/src/CodeHighlight.vue";
import "vue-code-highlight/themes/duotone-sea.css";

const { pandoreConf } = storeToRefs(usePandoreConfStore())
const { selectTab } = useTabStore();
const loading = ref(false);
const loadingText = ref(null);
const loadingError = ref(null);

onMounted(() => {
    selectTab('');
})
</script>

<template>
    <h2>
        Workspace configuration
    </h2>
    <CustomLoader :loading="loading" :error="loadingError" :loading-text="loadingText">
        <div v-if="pandoreConf" class="code">
            <pre><code-highlight language="js">{{ pandoreConf }}</code-highlight></pre>
        </div>
    </CustomLoader>
</template>

<style scoped>
h2 {
    padding-left: 2em;
}

.code {
    min-width: 50em;
    width: fit-content;
    position: sticky;
    left: 1em;
}

.code pre {
    margin: 0;
    position: relative;
    border-radius: 0.5em;
    overflow: hidden;
}

.code>div {
    text-align: right;
}
</style>