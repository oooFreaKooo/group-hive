<template>
    <div
        class="d-none d-md-flex side-nav rounded-end-5 bg-dark bg-gradient shadow"
        :class="{ collapsed: isCollapsed }"
    >
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
                    v-for="groupId in data?.profile.groupIds"
                    :key="groupId"
                    :to="`/dashboard/${groupId}/overview`"
                    :class="{ active: currentGroupId === groupId }"
                    :title="groupsData[groupId]?.name || ''"
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

            <div class="position-relative">
                <button
                    ref="profileButton"
                    class="btn p-0 border border-2 border-primary rounded-circle my-2 overflow-hidden"
                    :title="data?.profile.displayName || 'User Profile'"
                    @click="togglePopover"
                >
                    <NuxtImg
                        :src="avatarUrl || data?.profile.avatarUrl || '/images/default-avatar.png'"
                        width="32"
                        height="32"
                        alt="Avatar"
                        class="rounded-circle"
                    />
                </button>

                <!-- Profile Popover -->
                <div
                    v-if="isPopoverVisible"
                    class="profile-popover shadow-lg"
                    :class="{ show: isPopoverVisible }"
                    @click.stop
                >
                    <div class="popover-body p-3">
                        <div class="d-flex flex-column">
                            <div class="user-info mb-3">
                                <div class="d-flex align-items-center gap-2 mb-2">
                                    <NuxtImg
                                        :src="avatarUrl || data?.profile.avatarUrl || '/images/default-avatar.png'"
                                        width="40"
                                        height="40"
                                        alt="Avatar"
                                        class="rounded-circle"
                                    />
                                    <div class="d-flex flex-column">
                                        <span class="fw-semibold">{{ data?.profile.displayName }}</span>
                                        <span class="text-muted small">{{ user?.email }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex flex-column gap-1">
                                <NuxtLink
                                    :to="`/dashboard/settings/${data?.profile.id}`"
                                    class="btn btn-light text-start d-flex align-items-center"
                                    @click="isPopoverVisible = false"
                                >
                                    <AppIcon
                                        name="gear"
                                        class="me-2"
                                        color="dark"
                                    />
                                    Settings
                                </NuxtLink>
                                <button
                                    class="btn btn-light text-start text-danger d-flex align-items-center"
                                    @click="handleLogout"
                                >
                                    <AppIcon
                                        name="box-arrow-right"
                                        class="me-2"
                                        color="primary"
                                    />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const currentGroupId = computed(() => route.params.id as string)
const isDarkMode = ref(false)

// Store group data
const groupsData = ref<Record<string, { id: string, name: string }>>({})

const user = useSupabaseUser()
const { data } = await useFetch('/api/profile')
const { avatarUrl } = useProfileAvatar()

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
const isCollapsed = useCookie('sidebar-collapsed', { default: () => false })
const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
}

const isPopoverVisible = ref(false)
const profileButton = ref<HTMLElement | null>(null)

// Handle popover visibility
const togglePopover = () => {
    isPopoverVisible.value = !isPopoverVisible.value
}

// Close popover when clicking outside
onMounted(() => {
    document.addEventListener('click', (event) => {
        if (profileButton.value && !profileButton.value.contains(event.target as Node)) {
            isPopoverVisible.value = false
        }
    })
})

onUnmounted(() => {
    document.removeEventListener('click', () => {})
})

// Handle logout
const client = useSupabaseClient()
const router = useRouter()

const handleLogout = async () => {
    await client.auth.signOut()
    router.push('/auth/login')
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

.profile-popover {
    position: absolute;
    left: calc(100% + 16px);
    bottom: 0;
    width: 240px;
    background: var(--bs-white);
    border-radius: 8px;
    opacity: 0;
    transform: translateX(10px);
    transition: all 0.2s ease-in-out;
    pointer-events: none;
    z-index: 1030;

    &.show {
        opacity: 1;
        transform: translateX(0);
        pointer-events: auto;
    }

    &::before {
        content: '';
        position: absolute;
        left: -8px;
        bottom: 20px;
        width: 16px;
        height: 16px;
        background: var(--bs-white);
        transform: rotate(45deg);
    }

    .btn {
        transition: all 0.2s ease;

        &:hover {
            background: var(--bs-gray-100);
        }
    }
}
</style>
