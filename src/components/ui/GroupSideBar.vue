<template>
    <div class="d-none d-md-flex side-nav vh-100 position-fixed start-0 top-0 flex-column justify-content-between">
        <NuxtLink
            to="/"
            class="text-decoration-none position-absolute top-0 start-0 m-2 ms-4"
        >
            <NuxtImg
                src="/logo-icon.png"
                width="32"
                height="32"
                alt="Logo"
                class="img-fluid"
            />

        </NuxtLink>
        <!-- Groups Section -->
        <nav class="py-3 flex-grow-1 d-flex flex-column align-items-center">
            <NuxtLink
                v-for="group in userStore.profile?.ownedGroups"
                :key="group.id"
                :to="`/dashboard/${group.id}`"
                class="nav-item d-flex align-items-center justify-content-center position-relative mb-3  text-decoration-none"
                :class="{ active: currentGroupId === group.id.toString() }"
                :title="group.name"
            >
                <AppIcon
                    name="house"
                    size="md"
                    class="nav-icon"
                />
            </NuxtLink>

            <NuxtLink
                to="/dashboard"
                class="nav-item d-flex align-items-center justify-content-center position-relative text-decoration-none"
                title="Join New Group"
            >
                <AppIcon
                    name="plus-circle"
                    size="md"
                    class="nav-icon"
                />
            </NuxtLink>
        </nav>

        <!-- Footer Section -->
        <div class="pb-5 d-flex flex-column align-items-center">
            <NuxtLink
                to="/dashboard/settings"
                class="nav-item d-flex align-items-center justify-content-center position-relative"
                :title="userStore.displayName"
            >
                <NuxtImg
                    :src="userStore.userAvatar || '/default-avatar.png'"
                    width="32"
                    height="32"
                    alt="Avatar"
                    class="nav-icon rounded-circle"
                />
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const route = useRoute()
const currentGroupId = computed(() => route.params.id)
</script>

<style scoped lang="scss">
.side-nav {
    width: 72px;
    padding-top: 5rem;
    z-index: 1020;
    padding-bottom: calc(46px + 1rem);
    position: relative;

    .nav-item {
        width: 48px;
        height: 48px;
        cursor: pointer;
        transition: all 0.35s ease;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(5px);
        border: 2px solid rgba(255, 255, 255, 0.1);
        position: relative;

        &::before {
            content: attr(title);
            position: absolute;
            left: 120%;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 0.875rem;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s ease;
            pointer-events: none;
        }

        &:hover::before {
            opacity: 1;
            visibility: visible;
        }

        &:hover, &.active {
            background: var(--bs-dark);
            border-color: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(var(--bs-primary-rgb), 0.5);
        }

        .nav-icon {
            transition: all 0.35s ease;
        }
    }
}
</style>
