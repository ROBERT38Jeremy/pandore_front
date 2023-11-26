<script setup>
defineEmits(['delete', 'update'])

</script>

<template>
    <div class="action-container">
        <svg @click="$emit('delete')" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="17" height="17" viewBox="0 0 30 30" style="fill:#FA5252;">
            <path d="M 13 3 A 1.0001 1.0001 0 0 0 11.986328 4 L 6 4 A 1.0001 1.0001 0 1 0 6 6 L 24 6 A 1.0001 1.0001 0 1 0 24 4 L 18.013672 4 A 1.0001 1.0001 0 0 0 17 3 L 13 3 z M 6 8 L 6 24 C 6 25.105 6.895 26 8 26 L 22 26 C 23.105 26 24 25.105 24 24 L 24 8 L 6 8 z"></path>
        </svg>
        <img style="height: 17px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD/ElEQVR4nO2by48VRRTGD4OYQKLgzOLW91VlJpmIgVEQGCRBiQkhJBhZwIYECfI3sFBMFEWUlyALdro2Gg2PHTsSCMSN7iAQXBAyPnhLZAZQImoOcy80bXXfusydma7u+yW1uOk6XfdXp+rUqe5qkY46Kp2MMX0kvwTwG8l/AVwH8I1zbp6UXSRXALip4OkC4E8Ab0lZBWAlgDs++EQn/EVyoVQRno/KEakA/D8A3uvr65tFcmvq2m0R6ZJYZYyZS/IHADfqwe5/nrfWbm7Ur3fCY9f7+/tnSoyq1WovkrzcZIi/n7TR36nrI1GOgNoo/JUm8DuSNjoSPHUOSmyq1WovBcD/KCJT8uAB3I0uH6hlww97APfneP4+gA0Sk5xz80he9c3znClx3AdvrX1bIoz2lzwwWxt1AMxppLw55T7JTRKTrLXzSV7Lgw/shFLBf5BlkzMdDklMsta+HOr5jE4YTuf+IvKUlB0+I+HRckFiEMkFum9vM/wIgGUSsec/DLEH8K7H9ra1drnE4HlWGR7+Yf9RFeAX1rezTwTv2eM/KMaYN6QCnt+Sk/Wd6unpeUaKKgCLfJ4HsC3EXmNDk7RX73VscHBwmhRNAAYB/N5m+BGSJz333C5VgDfGvO6cm07yROraMIAZUgQZYxZnwH8cYq+xIQs++dwPwK+p+6+UKsA3RPKrZL1J3/8bY17xvaUJhdfpEQo/MDDwNIDzqQ54UwoIv73d8LrbA/Btqp17vb29z8lkyDm3ZILhv/PU/0IKBv9JiL1OjzbAn+3u7n62/XRhS50vvd0zBvis3H4qya89Hf2Tc85KUdZ5VhkewGeB9h14xuh5kktJ/jFRntdjLoWHZ+rlZJZ0VQiN9rqz08fbRYJ/dYzwn7aw1HkfeBYRfud4wNfbPFwIeACvkbw1kfB1uzUk/67XP1c0+F0h9jo9ngQ+0f4ckqt17y+TNOxveebh3jEEvDie3iLD81WH3xdo34Fnx/OMbtgv8x0+Ct3V6aowlmg/2ZoCYMgDoOWwc+75PGOSu2OGF5IvZMA/hAGwtoUkJ45h3xCA9U06oHHWbk2pPN8QgM895+1Oe+CGG9NBY0Mp4FWe10vrNC6QfCeRiz+MCaWCF5GudNKj394EvpKOc84nZYwZSMFce6zC6Eg4mxcgY/X8A+l7tBTQ0dEr0qVHVo0xG/XwQSnhVSQPpKDO1GOCbwtcLngVgO8D5nhTeH0hCeAXzwbqZ9/5naz641Wy/odoAGvxZhd9hxC1gZzGh1qpP46dMOTrgCs5Rro3OKF5giZL1trZyS8zStEBANbqkXP9Aqs+HQ5oYNTVoZUPjHR4+aC0UWPMqtD64wnv+x8dSUX1H9XZAqBcb2y/AAAAAElFTkSuQmCC">
    </div>
</template>

<style scoped>
.action-container {
    display: flex;
    gap: 0.7em;
}

.action-container>* {
    padding: 5px;
    transition: all 0.1s ease-in-out;
    cursor: pointer;
}

.action-container>*:hover {
    background-color: var(--color-background);
}
</style>