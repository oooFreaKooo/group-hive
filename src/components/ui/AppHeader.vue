<template>
    <header>
        <nav class="navbar pt-4">
            <div class="container-fluid px-0">
                <!-- Logo and Brand -->
                <NuxtLink
                    to="/"
                    class="logo text-decoration-none me-5"
                >
                    <NuxtImg
                        src="/logo-icon.png"
                        width="42"
                        height="42"
                        alt="Logo"
                        class="img-fluid"
                    />
                    <h1 class="logo-title h6">
                        <span>Group</span>
                        <span>Hive</span>
                    </h1>
                </NuxtLink>

                <!-- Navigation and Actions -->
                <div class="d-flex align-items-center flex-lg-grow-1">
                    <!-- Navigation Links -->
                    <div
                        v-if="user"
                        class="d-lg-flex d-none"
                    >
                        <div class="tabs">
                            <NuxtLink
                                v-for="item in navigationItems"
                                :key="item.label"
                                :href="item.href"
                                :class="{ active: item.active }"
                                class="mx-5 text-black"
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
                    <div class="d-lg-flex d-none">
                        <template v-if="user">
                            <ProfileButton />
                        </template>
                        <template v-else>
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
                        </template>
                    </div>
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
.app-header-actions-buttons {
    display: flex;
    border-left: 1px solid var(--bs-gray-400);
    margin-left: 2rem;
    padding-left: 2rem;

    & > * + * {
        margin-left: 1rem;
    }
}

.logo {
    display: flex;
    align-items: center;
    padding-bottom: 0.25rem;
    padding-top: 0.25rem;
    width: 175px;
    border-bottom: 1px solid var(--bs-gray-400);
    @media (max-width: 1200px) {
        border-bottom: 0;
    }
}

.logo-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 42px;
}

.logo-title {
    display: flex;
    flex-direction: column;
    line-height: 1.25;
    margin-left: 0.75rem;
    span:first-child {
        color: var(--bs-gray-900);
    }
    span:last-child {
        color: var(--bs-gray-600);
    }
}

.tabs {
    color: var(--bs-gray-600);
    border-bottom: 1px solid var(--bs-gray-400);

    a {
        padding-top: 1rem;
        padding-bottom: 1rem;
        text-decoration: none;
        border-top: 2px solid transparent;
        display: inline-flex;
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
