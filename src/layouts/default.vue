<template>
    <div class="main-body bg-light vh-100">
        <NuxtLink
            to="/"
            class="text-decoration-none position-fixed top-0 start-0 m-2 ms-4 logo-icon"
        >
            <NuxtImg
                src="/logo-icon.png"
                width="36"
                height="36"
                alt="Logo"
                class="img-fluid"
            />
        </NuxtLink>
        <GroupSideBar />
        <NuxtLoadingIndicator
            :throttle="100"
        />
        <div class="container-fluid p-2 p-md-5">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.logo-icon {
    z-index: 1000;
}
</style>
