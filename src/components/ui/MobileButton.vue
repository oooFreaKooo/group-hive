<template>
    <div
        class="button-container d-lg-none d-flex align-items-center justify-content-center"
        @click="$emit('toggle')"
    >
        <div
            class="hamburger bg-transparent"
            :class="{ 'is-active': isOpen }"
        >
            <span class="hamburger-line" />
            <span class="hamburger-line" />
            <span class="hamburger-line" />
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    showRoute: {
        type: Boolean,
        default: false,
    },
})

defineEmits<{
    toggle: []
}>()

const btnScale = ref('2.5rem')
</script>

<style scoped lang="scss">
/* Hamburger menu button styles */
.button-container {
    cursor: pointer;
    width: v-bind(btnScale);
    height: v-bind(btnScale);
    z-index: 1030;

    &:hover .hamburger-line {
        background-color: var(--bs-primary);
    }
}

.hamburger {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
}

.hamburger-line {
    display: block;
    width: 30px;
    height: 2px;
    background-color: var(--bs-white);
    transition: all 0.3s ease-in-out;
}

.hamburger.is-active {
    .hamburger-line {
        &:nth-child(1) {
            transform: translateY(0.6rem) rotate(35deg);
        }

        &:nth-child(2) {
            opacity: 0;
        }

        &:nth-child(3) {
            transform: translateY(-0.6rem) rotate(-15deg);
        }
    }
}
</style>
