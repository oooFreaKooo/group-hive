<template>
    <div class="d-flex flex-column min-vh-100">
        <NuxtLink
            to="/"
            class="text-decoration-none position-fixed top-0 start-50 translate-middle-x m-2 logo-icon"
        >
            <NuxtImg
                src="/images/logo-icon.png"
                width="45"
                height="36"
                alt="Logo"
                class="img-fluid"
            />
        </NuxtLink>
        <GroupSideBar />
        <NuxtLoadingIndicator
            :throttle="100"
        />
        <div class="bg-light container flex-grow-1 bg-white">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
.logo-icon {
    z-index: 1000;
}
.bg-light {
    max-width: 100%;
    width: 100%;
    overflow-x: none;
    -ms-overflow-style: none;  /* IE and Edge */
}
</style>
