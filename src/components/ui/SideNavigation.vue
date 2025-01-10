<template>
    <div class="app-body-navigation">
        <nav class="navigation">
            <NuxtLink
                v-for="item in navigationItems"
                :key="item.label"
                :href="item.href"
            >
                <AppIcon
                    :name="item.icon"
                    size="md"
                    class="me-2"
                />
                <span>{{ item.label }}</span>
            </NuxtLink>
        </nav>
        <footer class="footer">
            <h1>{{ footerTitle }}<small>©</small></h1>
            <div v-html="footerContent" />
        </footer>
    </div>
</template>

<script setup lang="ts">
interface NavigationItem {
    label: string
    href: string
    icon: string
}

defineProps<{
    navigationItems: NavigationItem[]
    footerTitle: string
    footerContent: string
}>()
</script>

<style scoped lang="scss">
.app-body-navigation {
    width: 175px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    @media (max-width: 1200px) {
        display: none;
    }
}

.navigation {
    display: flex;

    flex-direction: column;
    align-items: flex-start;
    color: var(--c-text-tertiary);
    a {
        display: flex;
        align-items: center;
        text-decoration: none;
        transition: 0.25s ease;

        * {
            transition: 0.25s ease;
        }

        i {
            margin-right: 0.75rem;
            font-size: 1.25em;
            flex-shrink: 0;
        }

        & + a {
            margin-top: 1.25rem;
        }

        &:hover,
        &:focus {
            transform: translateX(4px);
            color: var(--c-text-primary);
        }
    }
}
</style>
