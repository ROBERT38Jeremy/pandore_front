<script setup>
import { ref } from 'vue';

const displayExtendedDataValue = ref(false);

const triggerExtendedDataValue = (e) => {
    if (props.enableExtended === false) return;
    if (e.ctrlKey === true) displayExtendedDataValue.value = !displayExtendedDataValue.value;
}

const props = defineProps({
    enableExtended: {
        type: Boolean,
        required: false,
        default: true
    }
});
</script>

<template>
    <span @click="triggerExtendedDataValue">
        <slot v-if="displayExtendedDataValue === false || enableExtended === false"/>
        <textarea v-else cols="30" rows="10" readonly>{{ $slots.default ? $slots.default()[0].children : ''}}</textarea>
    </span>
</template>