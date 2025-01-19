<template>
    <div class="main-body ms-md-5 m-0">
        <AppHeader
            :navigation-items="headerItems"
        />
        <SideNavigation
            :navigation-items="navigationItems"
            :footer-items="footerItems"
            :profile-items="profileItems"
        />
        <slot />
    </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const route = useRoute()

const headerItems: HeaderItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
]

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

const footerItems = computed<NavigationItem[]>(() => [
    {
        label: 'App Settings',
        href: `/dashboard/${route.params.id}/settings`,
        icon: 'gear',
    },
])

const profileItems = computed<ProfileItem[]>(() => [
    {
        name: userStore.displayName ?? '',
        email: userStore.userEmail ?? '',
        href: `/dashboard/settings`,
        avatar: userStore.userAvatar ?? '',
    },
])
</script>
