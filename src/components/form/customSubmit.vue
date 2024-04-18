<script setup>
const props = defineProps({
  label: {
      type: String,
      required: true,
  },
  type: {
    type: String,
    required: false,
    default: 'submit'
  }
});

</script>

<template>
    <button
        :type="type"
        @mousedown="(e) => e.target.classList.add('mouse-down')"
        @mouseup="(e) => e.target.classList.remove('mouse-down')"
    >
        {{ label }}
    </button>
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
    transition: all .1s ease-in;
}

button:hover {
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.10);
}

button.mouse-down {
    transform: scale(0.9);
}
</style>