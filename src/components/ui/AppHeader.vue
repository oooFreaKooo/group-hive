<template>
    <header class="app-header container">
        <nav class="navbar h-100">
            <!-- Navigation and Actions -->
            <div class="d-flex align-items-center flex-grow-1">
                <!-- Navigation Links -->
                <div
                    v-if="user"
                >
                    <div class="tabs">
                        <NuxtLink
                            v-for="item in navigationItems"
                            :key="item.label"
                            :href="item.href"
                            :class="{ active: item.active }"
                            class="me-5 text-black"
                        >
                            {{ item.label }}
                        </NuxtLink>
                    </div>
                </div>
                <div class="d-flex justify-content-end mx-auto">
                    <MobileButton
                        :is-open="isMobileNavOpen"
                        @toggle="toggleMobileNav"
                    />
                </div>

                <!-- Auth Actions -->

                <div v-if="!user">
                    <NuxtLink
                        to="/auth/login"
                        class="nav-link"
                    >
                        Login
                    </NuxtLink>
                    <NuxtLink
                        to="/auth/register"
                        class="btn btn-primary"
                    >
                        Sign up
                    </NuxtLink>
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
    navigationItems: NavItems
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

.tabs {
    height: 100%;

    a {
        height: 100%;
        display: inline-flex;
        align-items: center;
        color: var(--bs-gray-600);
        text-decoration: none;
        border-bottom: 2px solid transparent;
        transition: 0.25s ease;

        &.active,
        &:hover,
        &:focus {
            color: var(--bs-gray-900);
            border-color: var(--bs-gray-900);
        }
    }
}
</style>
