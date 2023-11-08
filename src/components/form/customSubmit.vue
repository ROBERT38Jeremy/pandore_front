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
    background-color: #008ffc;
    border: none;
    outline: none;
    width: 100%;
    color: white;
    font-weight: bold;
    font-size: medium;
    border-radius: 0.2em;
}
</style>