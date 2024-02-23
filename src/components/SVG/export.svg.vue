<template>
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12" stroke="var(--color-text)" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M12 14L12 4M12 4L15 7M12 4L9 7" stroke="var(--color-text)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
</template>

<style scoped>
svg:not(.disabled) {
    cursor: pointer;
}

svg.disabled {
    opacity: 0.2;
}
</style>