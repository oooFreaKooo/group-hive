<template>
    <div class="main-body container-fluid d-flex justify-content-center p-0">
        <div class="app">
            <AppHeader
                :navigation-items="navigationItems"
                class="px-4"
            />

            <main class="row p-4">
                <div class="col-12 col-lg-2 pt-4">
                    <SideNavigation
                        :navigation-items="sideNavConfig.navigationItems"
                        :footer-title="sideNavConfig.footerTitle"
                        :footer-content="sideNavConfig.footerContent"
                        :group="currentGroup"
                    />
                </div>
                <div class="col-12 col-lg-10 pt-4">
                    <slot />
                </div>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
const { groups, fetchGroups } = useGroup()
const currentGroup = computed(() => groups.value[0])

const navigationItems = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
]

const sideNavConfig = ref({
    navigationItems: [
        {
            label: 'Overview',
            href: '/',
            icon: 'house',
        },
        {
            label: 'Chat',
            href: '/',
            icon: 'chat',
        },
        {
            label: 'My Tasks',
            href: '/',
            icon: 'list',
        },
        {
            label: 'Leaderboard',
            href: '/',
            icon: 'trophy',
        },
        {
            label: 'Account',
            href: '/',
            icon: 'person',
        },
    ],
    footerTitle: 'Almeria',
    footerContent: 'All Rights Reserved 2021',
})

onMounted(() => {
    fetchGroups()
})
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

.main-body {
    line-height: 1.5;
    min-height: 100vh;
    font-family: "Be Vietnam Pro", sans-serif;
    padding-top: 0vw;
    padding-bottom: 0vw;
}

.app {
    min-height: 80vh;
    width: 100%;
    max-width: 1600px;
    display: flex;
    flex-direction: column;
}
</style>
