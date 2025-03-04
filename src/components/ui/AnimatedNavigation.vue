<template>
    <div
        class="navigation position-fixed start-50 translate-middle-x z-3"
        :class="[
            smallerThanLg ? 'bottom-0 mobile w-75' : 'top-0 desktop w-100',
            { 'nav-expanded': isExpanded },
        ]"
        @mouseenter="isExpanded = true"
        @mouseleave="isExpanded = false"
    >
        <div class="nav-container">
            <ul class="nav-list">
                <li
                    v-for="(item, index) in navigationItems"
                    :key="item.label + index"
                    class="nav-item"
                >
                    <NuxtLink
                        :to="item.href"
                        class="nav-link"
                        :class="{ active: activeIndex === index }"
                        @click="handleNavClick(index)"
                    >
                        <div class="nav-link-content">
                            <i :class="`bi bi-${item.icon}`" />
                            <span class="nav-text">{{ item.label }}</span>
                        </div>
                    </NuxtLink>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { breakpointsBootstrapV5, useBreakpoints } from '@vueuse/core'

const route = useRoute()
const isExpanded = ref(false)

const props = defineProps<{
    navigationItems: NavigationItem[]
}>()

const breakpoints = useBreakpoints(breakpointsBootstrapV5)
const smallerThanLg = breakpoints.smaller('lg')

// Track clicked index separately from route for immediate feedback
const clickedIndex = ref(-1)

// Calculate active index based on clicked index or current route
const activeIndex = computed(() => {
    // Use clicked index if set, otherwise fall back to route-based index
    if (clickedIndex.value !== -1) { return clickedIndex.value }
    return props.navigationItems.findIndex((item: NavigationItem) => item.href === route.path)
})

// Watch route changes to reset clicked index
watch(
    () => route.path,
    () => {
        clickedIndex.value = -1
    },
)

// Handle navigation item clicks
function handleNavClick (index: number) {
    clickedIndex.value = index
}
</script>

<style scoped lang="scss">
.navigation {
    --nav-height: 72px;
    --nav-bg: var(--bs-dark);
    --nav-color: var(--bs-gray-400);
    --nav-active-color: var(--bs-primary);
    --nav-transition: 0.2s ease;

    height: var(--nav-height);
    background: var(--nav-bg);
    transition: background var(--nav-transition);
    backdrop-filter: blur(8px);

    &.mobile {
        border-radius: 1.25rem 1.25rem 0 0;
        box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.08);
        border: 1px solid var(--bs-gray-800);
        border-bottom: none;
    }

    &.desktop {
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
        border: 1px solid var(--bs-gray-800);
        border-top: none;
    }
}

.nav-container {
    height: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.nav-list {
    height: 100%;
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.nav-item {
    flex: 1;
    height: 100%;
    max-width: 100px;
}

.nav-link {
    position: relative;
    height: 100%;
    width: 100%;
    color: var(--nav-color);
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color var(--nav-transition);
    border-radius: 0.75rem;
    padding: 0.5rem;

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 2px;
        background: var(--nav-active-color);
        transition: all var(--nav-transition);
        transform: translateX(-50%);
        opacity: 0;
    }

    &:hover {
        color: var(--bs-white);
    }

    &.active {
        color: var(--nav-active-color);

        &::after {
            width: 24px;
            opacity: 1;
        }

        .nav-text {
            opacity: 1;
            transform: translateY(0);
        }

        i {
            opacity: 1;
        }
    }
}

.nav-link-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;

    i {
        font-size: 1.5rem;
        line-height: 1;
        opacity: 0.8;
        transition: opacity var(--nav-transition);
    }
}

.nav-text {
    font-size: 0.75rem;
    font-weight: 500;
    opacity: 0.8;
    transform: translateY(0);
    transition: all var(--nav-transition);
    white-space: nowrap;
    margin-top: 0.25rem;
}

@media (prefers-reduced-motion: reduce) {
    .navigation,
    .nav-link,
    .nav-link-content,
    .nav-text {
        transition: none !important;
    }
}
</style>
