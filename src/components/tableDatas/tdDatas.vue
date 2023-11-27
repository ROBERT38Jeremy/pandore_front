<script setup>
const props = defineProps({
    dataValue: {
        required: true
    },
    checkEmptyString: {
        type: Boolean,
        required: false,
        default: true
    },
});

</script>

<template>
    <a
        v-if="typeof dataValue === 'string' && dataValue.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/)"
        :href="dataValue"
    >
        {{ dataValue }}
    </a>
    <span v-else-if="dataValue">{{ dataValue }}</span>
    <span v-else-if="dataValue === null" class="null-value">NULL</span>
    <span v-else-if="checkEmptyString === true && dataValue === ''" class="empty-value" title="String is empty but not null">EMPTY</span>
    <span v-else>{{ dataValue }}</span>
</template>