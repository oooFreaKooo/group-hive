<template>
    <header class="app-header container">
        <nav class="navbar h-100">
            <!-- Navigation and Actions -->
            <div class="d-flex align-items-center justify-content-center flex-grow-1">
                <!-- Navigation Links -->
                <div
                    v-if="user"
                    class="d-flex justify-content-center w-100"
                >
                    <NuxtLink
                        v-for="item in navigationItems"
                        :key="item.label"
                        :href="item.href"
                        class="me-5 btn rounded-pill"
                    >
                        {{ item.label }}
                        <span />
                    </NuxtLink>
                </div>
                <div class="d-flex justify-content-end mx-auto">
                    <MobileButton
                        :is-open="isMobileNavOpen"
                        @toggle="toggleMobileNav"
                    />
                </div>
            </div>
        </nav>

        <!-- Mobile Navigation -->
        <MobileNavigation
            :is-open="isMobileNavOpen"
            :nav-items="navigationItems"
            @close="isMobileNavOpen = false"
        />
    </header>
</template>

<script setup lang="ts">
defineProps<{
    navigationItems: NavigationItem[]
}>()

const user = useSupabaseUser()

const isMobileNavOpen = ref(false)

function toggleMobileNav () {
    isMobileNavOpen.value = !isMobileNavOpen.value
}
</script>

<style scoped lang="scss">
.app-header {
    height: 72px;
    border-bottom: 1px solid var(--bs-gray-200);
    background: white;
}

.btn {
    text-decoration: none;

    background-color: transparent;
    color: var(--bs-black);
    &.router-link-active {
        background-color: black;
        color: white;
    }
}
</style>
