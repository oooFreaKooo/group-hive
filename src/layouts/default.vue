<template>
    <div class="main-body  d-flex flex-column align-items-center  ms-md-5 m-0">
        <div class="container">
            <AppHeader
                :navigation-items="navigationItems"
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
    font-family: "Be Vietnam Pro", sans-serif;
    transition: margin-left 0.3s ease;
}
</style>
