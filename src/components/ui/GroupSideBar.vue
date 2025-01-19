<template>
    <div class="d-none d-md-flex side-nav vh-100 position-fixed start-0 top-0 flex-column justify-content-between">
        <!-- Logo Section -->
        <div class="logo-section mb-2">
            <NuxtLink
                to="/"
                class="text-decoration-none"
            >
                <NuxtImg
                    src="/WG_SVG.svg"
                    width="32"
                    height="32"
                    alt="Logo"
                    class="img-fluid logo-icon"
                />
                <h1 class="logo-title h6 mb-0 ms-3">
                    <span class="d-block">Weekly</span>
                    <span class="d-block">Goals</span>
                </h1>
            </NuxtLink>
        </div>

        <!-- Groups Section -->
        <nav class="py-3 flex-grow-1">
            <NuxtLink
                v-for="group in userStore.profile?.ownedGroups"
                :key="group.id"
                :to="`/dashboard/${group.id}`"
                class="nav-item d-flex align-items-center text-decoration-none w-100 bg-transparent border-0 px-3 mb-3"
                :class="{ active: currentGroupId === group.id.toString() }"
            >
                <AppIcon
                    name="house"
                    size="md"
                    color="black"
                    class="nav-icon flex-shrink-0"
                />
                <span class="nav-label ms-3">{{ group.name }}</span>
            </NuxtLink>

            <NuxtLink
                to="/dashboard"
                class="nav-item d-flex align-items-center text-decoration-none w-100 bg-transparent border-0 px-3 mb-3"
            >
                <AppIcon
                    name="plus-circle"
                    size="md"
                    color="black"
                    class="nav-icon flex-shrink-0"
                />
                <span class="nav-label ms-3">Join New Group</span>
            </NuxtLink>
        </nav>

        <!-- Footer Section -->
        <footer class="navigation">
            <NuxtLink
                to="/dashboard/settings"
                class="nav-item d-flex align-items-center text-decoration-none w-100 bg-transparent border-0 px-3 mb-2"
            >
                <NuxtImg
                    :src="userStore.userAvatar || '/default-avatar.png'"
                    width="32"
                    height="32"
                    alt="Avatar"
                    class="nav-icon flex-shrink-0 rounded-circle"
                />
                <div class="d-flex flex-column align-items-start">
                    <span class="nav-label ms-3 fw-bold">{{ userStore.displayName }}</span>
                    <span class="nav-label ms-3 small">{{ userStore.userEmail }}</span>
                </div>
            </NuxtLink>
        </footer>
    </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const route = useRoute()
const currentGroupId = computed(() => route.params.id)
</script>

<style scoped lang="scss">
.side-nav {
    width: 64px;
    background: white;
    border-right: 1px solid var(--bs-gray-200);
    transition: width 0.3s ease;
    overflow: hidden;
    z-index: 1030;

    &:hover {
        width: 240px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }

    .logo-section {
        height: 72px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid var(--bs-gray-200);

        a {
            height: 100%;
            display: flex;
            align-items: center;
            padding: 0 1rem;
        }

        .logo-title {
            opacity: 0;
            transition: opacity 0.2s ease;
            white-space: nowrap;

            span:first-child {
                color: var(--bs-gray-900);
            }
            span:last-child {
                color: var(--bs-gray-600);
            }
        }
    }

    &:hover .logo-title {
        opacity: 1;
    }

    .nav-item {
        cursor: pointer;
        color: var(--bs-gray-600);
        transition: all 0.2s ease;
        white-space: nowrap;
        height: 40px;

        &:hover, &.active {
            color: var(--bs-gray-900);
            background-color: var(--bs-gray-100);
        }

        .nav-icon {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .nav-label {
            opacity: 0;
            transition: opacity 0.2s ease;
        }
    }

    &:hover .nav-label {
        opacity: 1;
    }
}
</style>
