<template>
    <div class="main-body ms-md-5 m-0">
        <AppHeader
            :navigation-items="navigationItems"
        />
        <GroupSideBar />
        <slot />
    </div>
</template>

<script setup lang="ts">
const navigationItems = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
]
</script>
