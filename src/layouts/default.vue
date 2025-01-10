<template>
    <div class="main-body container-fluid d-flex justify-content-center p-0">
        <div class="app">
            <AppHeader
                :navigation-items="navigationItems"
                class="px-4"
            />

            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
const navigationItems = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
]
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
