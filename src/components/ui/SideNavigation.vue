<template>
    <div class="app-body-navigation vh-100 d-flex flex-column justify-content-between">
        <nav class="navigation">
            <button
                v-for="item in navigationItems"
                :key="item.label"
                class="text-black d-flex align-items-center text-decoration-none transition-hover mb-4 last-mb-0 bg-transparent border-0"
                :class="{ active: currentComponent === item.component }"
                @click="$emit('navigate', item.component)"
            >
                <AppIcon
                    :name="item.icon"
                    size="md"
                    color="black"
                    class="me-2 fs-5 flex-shrink-0"
                />
                <span>{{ item.label }}</span>
            </button>
        </nav>
        <footer class="footer">
            <h1 class="fs-4 lh-sm d-flex align-items-start">
                {{ footerTitle }}<small class="fs-6 ms-1">©</small>
            </h1>
            <div class="border-top border-gray-400 mt-4 pt-3 fs-8 text-gray-600">
                {{ footerContent }}
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface NavigationItem {
    label: string
    component: string
    icon: string
}

const props = defineProps<{
    navigationItems: NavigationItem[]
    footerTitle: string
    footerContent: string
    activeComponent: string
}>()

const currentComponent = computed(() => props.activeComponent)

defineEmits<{
    navigate: [component: string]
}>()
</script>

<style scoped lang="scss">
.app-body-navigation {
    width: 175px;

    @media (max-width: 1200px) {
        display: none;
    }
}

.navigation {
    button {
        width: 100%;
        text-align: left;
        cursor: pointer;
        color: var(--bs-gray-600);
        transition: 0.25s ease;

        * {
            transition: 0.25s ease;
        }

        &:hover,
        &:focus {
            transform: translateX(4px);
            color: var(--bs-gray-900);
        }

        &.active {
            color: var(--bs-gray-900);
            transform: translateX(4px);
        }
    }
}

.last-mb-0:last-child {
    margin-bottom: 0 !important;
}

.transition-hover {
    transition: 0.25s ease;
}

.fs-8 {
    font-size: 0.75rem;
}
</style>
