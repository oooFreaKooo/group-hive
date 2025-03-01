<template>
    <div class="h-100">
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
        <!-- <HexBackground /> -->
        <div class="bg h-100 row  justify-content-center align-items-center m-0 p-2">
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

/* Animation for Hexagonal Grid */
@keyframes diagonalSlide {
    0% {
        background-position: 0 0;
    }
    50% {
        background-position: 350px 600px;
    }
    100% {
        background-position: 0 0;
    }
}

.h-100 {
    min-height: 100vh !important;

}

.bg {
    max-width: 100%;
    width: 100%;
    overflow-x: none;
    -ms-overflow-style: none;  /* IE and Edge */
}

/* background-color: transparent;
    background-image:
        repeating-linear-gradient(
            120deg,
            rgba(var(--bs-dark-rgb), .1),
            rgba(var(--bs-dark-rgb), .1) 1px,
            transparent 1px,
            transparent 60px
        ),
        repeating-linear-gradient(
            60deg,
            rgba(var(--bs-dark-rgb), .1),
            rgba(var(--bs-dark-rgb), .1) 1px,
            transparent 1px,
            transparent 60px
        ),
        repeating-linear-gradient(
            0deg,
            rgba(var(--bs-dark-rgb), .1),
            rgba(var(--bs-dark-rgb), .1) 1px,
            transparent 1px,
            transparent 60px
        );
    background-size: 70px 120px; */
</style>
