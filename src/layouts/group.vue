<template>
    <div class="main-body bg-light vh-100">
        <GroupSideBar />
        <AnimatedNavigation
            :navigation-items="navigationItems"
        />
        <div class="container p-5">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()

// Make navigation items reactive to route changes
const navigationItems = computed<NavigationItem[]>(() => [
    {
        label: 'Overview',
        href: `/dashboard/${route.params.id}`,
        icon: 'house',
    },
    {
        label: 'Chat',
        href: `/dashboard/${route.params.id}/chat`,
        icon: 'chat',
    },
    {
        label: 'Tasks',
        href: `/dashboard/${route.params.id}/tasks`,
        icon: 'list-task',
    },
    {
        label: 'Leaderboard',
        href: `/dashboard/${route.params.id}/leaderboard`,
        icon: 'trophy',
    },
])
</script>
