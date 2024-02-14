<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
    modelValue: {
        required: false,
    }
});
const emit = defineEmits(["update:modelValue"]);
const checkboxActive = ref(false);

const triggerCheckbox = () => {
    checkboxActive.value = !checkboxActive.value;

    emit('update:modelValue', checkboxActive.value);
}

onMounted(() => {
    checkboxActive.value = props.modelValue;
})
</script>

<template>
    <div :class="`checkbox-back ${checkboxActive ? 'on' : ''}`">
        <div class="checkbox-trigger" @click="triggerCheckbox"></div>
    </div>
</template>

<style scoped>
input[type='checkbox'] {
    display: none;
}

.checkbox-back {
    position: relative;
    height: 1.5em;
    width: 3em;
    border-radius: 2em;
}

.checkbox-back.on {
    background-color: var(--color-blue);
}

.checkbox-back:not(.on) {
    background-color: red;
}

.checkbox-trigger {
    cursor: pointer;
    position: absolute;
    top: 50%;
    left: -2px;
    transform: translateY(-50%);
    height: 1.7em;
    width: 1.7em;
    background-color: var(--color-background-light);
    border-radius: 50%;
    -webkit-box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 2);
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 2);
    transition: all 0.2s ease-in-out;
}

.checkbox-back.on .checkbox-trigger {
    left: calc(100% - 1.7em + 2px);
}
</style>