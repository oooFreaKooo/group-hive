<template>
    <div class="d-none d-md-flex side-nav position-fixed start-0 top-50 flex-column rounded-5 m-2 translate-middle-y bg-dark bg-gradient shadow">
        <!-- Groups Section -->
        <div class="p-3 bg-gradient bg-dark rounded-top-5">
            <AppIcon
                name="chevron-compact-up"
                color="light"
                size="md"
            />
        </div>

        <!-- Main Navigation Section -->
        <div class="d-flex flex-column flex-grow-1">
            <nav class="py-2 d-flex flex-column align-items-center">
                <NuxtLink
                    v-for="group in userStore.profile?.ownedGroups"
                    :key="group.id"
                    :to="`/dashboard/${group.id}/overview`"
                    :class="{ active: currentGroupId === group.id.toString() }"
                    :title="group.name"
                >
                    <AppIcon
                        name="house"
                        size="lg"
                        btn
                        circle
                        bg="light"
                        color="dark"
                        class="my-2 p-2"
                    />
                </NuxtLink>

                <NuxtLink
                    to="/dashboard"
                    title="Join New Group"
                >
                    <AppIcon
                        name="plus-circle"
                        size="md"
                        btn
                        circle
                        color="light"
                        class="my-2 opacity-75"
                    />
                </NuxtLink>
            </nav>
        </div>

        <!-- Footer Section -->
        <div class="mt-auto pb-2 d-flex flex-column align-items-center">
            <div class="d-flex flex-column align-items-center py-4">
                <div
                    class="theme-switch d-flex justify-content-center bg-light"
                    :class="{ dark: isDarkMode }"
                    @click="toggleTheme"
                >
                    <div class="switch-handle">
                        <AppIcon
                            name="sun-fill"
                            size="sm"
                            class="icon-sun rounded-circle"
                            color="dark"
                            :class="{ active: !isDarkMode }"
                        />
                        <AppIcon
                            name="moon-fill"
                            size="sm"
                            class="icon-moon rounded-circle"
                            color="dark"
                            :class="{ active: isDarkMode }"
                        />
                    </div>
                </div>
            </div>

            <NuxtLink
                to="/dashboard/settings"
                class="btn btn-dark rounded-circle p-2"
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
const isDarkMode = ref(false)

const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark'
    setStoredTheme(currentTheme.value)
    setTheme(currentTheme.value)
    isDarkMode.value = !isDarkMode.value
}

const currentTheme = ref(getPreferredTheme())

onMounted(() => {
    setTheme(currentTheme.value)
})
</script>

<style scoped lang="scss">
.transition-all {
    transition: all 0.35s ease;
}

.cursor-pointer {
    cursor: pointer;
}

// Required custom styles that can't be replaced with Bootstrap
.side-nav {
    height: 75vh;
    width: 64px;
    z-index: 1020;
    display: flex;
    flex-direction: column;
}

// Theme switch specific styles
.theme-switch {
    border-radius: 20px;
    width: 32px;
    height: 56px;
    position: relative;
    cursor: pointer;
    padding: 2px;
}

.switch-handle {
    width: 24px;
    height: 24px;
    background: rgba(var(--bs-light-rgb), 1);
    border-radius: 50%;
    position: absolute;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-switch.dark .switch-handle {
    transform: translateY(28px) rotate(360deg);
}

.icon-sun,
.icon-moon {
    position: absolute;
    opacity: 0;
    transition: opacity 0.3s ease;

    &.active {
        opacity: 1;
    }
}
</style>
