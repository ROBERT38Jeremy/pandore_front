<script setup>
import { toRef } from "vue";

const props = defineProps({
    loading: {
        type: Boolean,
        required: true,
        default: true
    },
    error: {
        type: String,
        required: false
    }
});
const loading = toRef(props, "loading");
const error = toRef(props, "error");
</script>

<template>
  <div class="loader-contain">
    <div v-if="loading" class="loader">
      <div></div>
      <div></div>
      <div></div>
    </div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.loader-contain {
    position: relative;
    height: 100%;
}

@keyframes loader {
  to {
      opacity: 0.1;
      transform: translate3d(0, -1rem, 0);
  }
}
.loader {
  display: flex;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.loader > div {
  width: 1rem;
  height: 1rem;
  margin: 3rem 0.2rem;
  background: black;
  border-radius: 50%;
  animation: loader 0.6s infinite alternate;
}

.loader > div:first-child {
    background: var(--color-purple);
  }
.loader > div:nth-child(2) {
    background-color: #4120e9;
    animation-delay: 0.2s;
}
.loader > div:nth-child(3) {
    animation-delay: 0.4s;
    background: var(--color-button);
}

div.error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-style: italic;
  color: red;
}
</style>
