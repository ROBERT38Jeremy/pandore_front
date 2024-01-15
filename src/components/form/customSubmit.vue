<script setup>
const props = defineProps({
  label: {
      type: String,
      required: true,
  }
});

</script>

<template>
    <button type="submit">{{ label }}</button>
</template>

<style scoped>

button {
    padding: 1em 1em;
    border: none;
    outline: none;
    width: 100%;
    font-weight: bold;
    font-size: medium;
    border-radius: 0.2em;
    color: var(--color-background-light);
    background-color: var(--color-button);
    cursor: pointer;
}
</style>