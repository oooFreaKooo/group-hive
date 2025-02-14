<template>
    <div
        class="mobile-nav position-fixed top-0 start-0 w-100 h-100 bg-secondary"
        :class="{ show: isOpen }"
        style="z-index: 1000"
    >
        <div class="container h-100 d-flex align-items-center">
            <div class="row w-100 justify-content-center">
                <div class="col-11 col-sm-11 col-md-10 col-lg-8">
                    <ul class="nav flex-column text-center gap-3 gap-lg-5">
                        <li
                            v-for="item in navItems"
                            :key="item.label"
                            class="nav-item mb-2"
                        >
                            <div class="text-center overflow-hidden w-100">
                                <NuxtLink
                                    :to="item.href"
                                    class="nav-animation text-decoration-none text-white display-3 position-relative d-inline-block w-100 text-center"
                                    @click="$emit('close')"
                                >
                                    <span class="link-text d-block">{{ item.label.toUpperCase() }}</span>
                                    <span class="link-hover position-absolute top-0 start-0 w-100">{{ item.label.toUpperCase() }}</span>
                                </NuxtLink>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    navItems: {
        type: Array as PropType<HeaderItem[]>,
        required: true,
    },
})

defineEmits<{
    close: []
}>()
</script>

<style scoped lang="scss">
span {
    font-weight: 700;
    font-family: "SourceSans3", sans-serif !important;
    font-style: oblique;
    overflow: visible;
}

.mobile-nav {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    pointer-events: none;

    &.show {
        opacity: 0.9;
        pointer-events: auto;
    }

    .link-text,
    .link-hover {
        transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .link-hover {
        color: var(--bs-primary);
        opacity: 0;
        transform: translateX(-10%);
    }

    .nav-animation:hover {
        .link-text {
            transform: translateX(10%);
            opacity: 0;
        }

        .link-hover {
            transform: translateX(0);
            opacity: 1;
        }
    }
}
</style>
