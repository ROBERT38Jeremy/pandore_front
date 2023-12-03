<template>
    <img src="@/assets/logo.png">
    <div class="style">
        <div class="circle c1">
            <div class="circle c2">
                <div class="circle c3">
                    <div class="circle c4">
                        <div class="circle c5">
                            <div class="circle c6"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
* {
    user-select: none;
}

img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: 100px;
    animation: logo-animation 2s ease-in-out;
    z-index: 50;
}

@keyframes logo-animation {
    0% {
        transform: translate(-50%, -50%) scale(1);
    }
    10% {
        transform: translate(-50%, -50%) scale(0.9);
    }
    20% {
        transform: translate(-50%, -50%) scale(1.05);
    }
    30% {
        transform: translate(-50%, -50%) scale(0.95);
    }
    40% {
        transform: translate(-50%, -50%) scale(1);
    }
}

.circle {
    width: calc(min(100% - 25vmin, 100% - 17.5vmax));
    aspect-ratio: 1;
    background: radial-gradient(circle at 60% 20%, var(--color-background-light) 37%, var(--color-background) 97%, var(--color-background) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: -0.25em 0.35em 5em var(--color-background-light), 0.075em -0.125em 0.1em var(--color-border);
    animation: circle-animation 2s ease-in-out;
}

.c5 {
    animation-delay: 0.1s;
}
.c4 {
    animation-delay: 0.2s;
}
.c3 {
    animation-delay: 0.3s;
}
.c2 {
    animation-delay: 0.4s;
}
.c1 {
    animation-delay: 0.5s;
}


@keyframes circle-animation {
    0% {
        transform: scale(1);
    }
    10% {
        transform: scale(0.9);
    }
    20% {
        transform: scale(1.05);
    }
    30% {
        transform: scale(0.95);
    }
    40% {
        transform: scale(1);
    }
}

.style > .circle {
    width: 100%;
}

.style {
    margin: 0;
    max-height: 100%;
    max-width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--color-background);
}

</style>