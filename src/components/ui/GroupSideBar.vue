<template>
    <div
        class="d-none d-md-flex side-nav rounded-end-5 bg-dark bg-gradient shadow"
        :class="{ collapsed: isCollapsed }"
    >
        <!-- Groups Section -->

        <!-- Tab element for collapse/expand -->
        <div
            class="collapse-tab"
            role="button"
            :title="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
            @click="toggleCollapse"
        >
            <AppIcon
                :name="isCollapsed ? 'chevron-right' : 'chevron-left'"
                size="sm"
                color="light"
            />
        </div>

        <!-- Main Navigation Section -->
        <div class="d-flex flex-column flex-grow-1">
            <nav class="py-2 d-flex flex-column align-items-center my-2">
                <NuxtLink
                    v-for="group in userStore.profile?.ownedGroups"
                    :key="group.id"
                    :to="`/dashboard/${group.id}/overview`"
                    :class="{ active: currentGroupId === group.id.toString() }"
                    :title="group.name"
                >
                    <AppIcon
                        name="house"
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
            <div class="d-flex flex-column align-items-center my-2">
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

            <AppIcon
                name="gear"
                color="light"
                class="my-2"
            />

            <NuxtLink
                to="/dashboard/settings"
                :title="userStore.displayName"
                class="border border-2 border-light rounded-circle my-2"
            >
                <NuxtImg
                    :src="userStore.userAvatar || '/default-avatar.png'"
                    width="32"
                    height="32"
                    alt="Avatar"
                    class="rounded-circle"
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

// Add collapse functionality
const isCollapsed = ref(false)
const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
}
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
    width: 56px;
    z-index: 1020;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    transition: transform 0.3s ease;

    &.collapsed {
        transform: translate(-100%, -50%);
    }
}

.collapse-tab {
    position: absolute;
    right: -24px;
    top: 50%;
    transform: translateY(-50%);
    background: var(--bs-primary);
    width: 24px;
    height: 64px;
    border: 1px solid var(--bs-light);
    border-radius: 0 16px 16px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
    z-index: 1;  // Ensure tab stays above sidebar

    &:hover {
        background: var(--bs-dark);
    }
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
