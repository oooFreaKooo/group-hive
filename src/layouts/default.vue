<template>
    <div class="main-body container-fluid bg-dark d-flex justify-content-center p-0">
        <div class="app">
            <AppHeader
                :navigation-items="navigationItems"
                class="px-4"
            />

            <main class="p-4">
                <div class="app-body pt-4">
                    <SideNavigation
                        :navigation-items="sideNavConfig.navigationItems"
                        :footer-title="sideNavConfig.footerTitle"
                        :footer-content="sideNavConfig.footerContent"
                    />
                    <slot />
                </div>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
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
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

.main-body {
    --c-gray-900: #000000;
    --c-gray-800: #1f1f1f;
    --c-gray-700: #2e2e2e;
    --c-gray-600: #313131;
    --c-gray-500: #969593;
    --c-gray-400: #a6a6a6;
    --c-gray-300: #bdbbb7;
    --c-gray-200: #f1f1f1;
    --c-gray-100: #ffffff;

    --c-green-500: #45ffbc;
    --c-olive-500: #e3ffa8;

    --c-white: var(--c-gray-100);

    --c-text-primary: var(--c-gray-100);
    --c-text-secondary: var(--c-gray-200);
    --c-text-tertiary: var(--c-gray-500);
    line-height: 1.5;
    min-height: 100vh;
    font-family: "Be Vietnam Pro", sans-serif;
    color: var(--c-text-primary);
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

.app-body {
    height: 100%;
    display: grid;
    grid-template-columns: minmax(min-content, 175px) minmax(max-content, 1fr) minmax(
            min-content,
            400px
        );

    column-gap: 4rem;

    @media (max-width: 1200px) {
        grid-template-columns: 1fr;
        & > * {
            margin-bottom: 3.5rem;
        }
    }
}
</style>
