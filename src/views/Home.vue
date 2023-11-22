<script setup>
</script>

<template>
    <!-- <RouterLink to="/">Home</RouterLink> -->
    <div class="container">
        <div class="flex-container">
            <span>PAND</span>
            <img src="@/assets/logo.png">
            <span>RE</span>
        </div>
        <p>Select a Database First.</p>
    </div>
</template>

<style scoped>
div.container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}
div.flex-container {
    display: flex;
    align-items: center;
}

p {
    font-style: italic;
    opacity: 0.7;
}

div>img {
    position: relative;
    top: 0.5em;
    max-height: 100px;
    animation: logo-animation 5s ease-in-out forwards;
}

div>span {
    font-size: 100px;
    font-weight: bold;
    position: relative;
}

div>span:first-child {
    left: 0.1em;
}

div>span:last-child {
    right: 0.15em;
}

@keyframes logo-animation {
    0% {
        transform: rotate(45deg);
    }
    80% {
        transform: rotate(45deg);
    }
}
</style>