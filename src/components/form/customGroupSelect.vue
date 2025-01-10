<script setup>
const props = defineProps({
    datas: {
        type: Object,
        required: true
    },
    label: {
        type: String,
        required: false,
    },
    info: {
        type: String,
        required: false,
    },
    modelValue: {
        required: false,
    },
});
defineEmits(["update:modelValue"]);

</script>

<template>
    <div class="input-contain">
        <div>
            <select
                :placeholder="props.label"
                :value="props.modelValue"
                @input="$emit('update:modelValue', $event.target.value)"
            >
                <optgroup v-for="(values, group) in datas" :label="group">
                    <option v-for="item in values" :value="item">{{ item }}</option>
                </optgroup>
            </select>
            <span v-if="props.label">{{ props.label }}</span>
        </div>
        <div v-if="props.info" class="div-info">{{ props.info }}</div>
    </div>
</template>

<style scoped>

select {
    position: relative;
    padding: 0.5em 1em;
    background-color: transparent;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 0.2em;
    outline: none;
    width: 100%;
    font-size: large;
    color: var(--color-text);
}

.input-contain {
    position: relative;
    padding-top: 1.5em;
    width: calc(100% - 30px);
}

.input-contain input::placeholder {
    opacity: 0;
}

.input-contain input {
    z-index: 2;
}

.input-contain span {
    position: absolute;
    top: 0;
    left: 0.25em;
    transition: all 0.2s ease-in-out;
    z-index: 1;
    user-select: none;
    font-size: large;
}

.input-contain input:placeholder-shown~span {
    top: 1.6em;
    left: 1.2em;
    opacity: 0.6;
}

.input-contain:not(:first-child) {
    margin-top: 0.8em;
}

.input-contain div.div-info {
    font-size: small;
    opacity: 0.8;
    padding-left: 0.2em;
}

.input-contain>div:first-child {
    width: 100%;
}
</style>