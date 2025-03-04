<template>
    <div class="position-relative">
        <button
            ref="profileButton"
            class="btn p-0 border border-2 border-primary rounded-circle my-2"
            :title="profileData?.profile?.displayName || 'User Profile'"
            @click="togglePopover"
        >
            <NuxtImg
                :src="avatarUrl || profileData?.profile?.avatarUrl || '/images/images/default-avatar.png'"
                width="32"
                height="32"
                alt="Avatar"
                class="rounded-circle"
            />
        </button>

        <!-- Profile Popover -->
        <div
            v-if="isPopoverVisible"
            class="profile-popover position-absolute bg-white rounded-3 shadow-lg z-1000"
            :class="{ show: isPopoverVisible }"
            @click.stop
        >
            <div class="p-3">
                <div class="d-flex flex-column">
                    <div class="mb-3">
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <NuxtImg
                                :src="avatarUrl || profileData?.profile?.avatarUrl || '/images/images/default-avatar.png'"
                                width="40"
                                height="40"
                                alt="Avatar"
                                class="rounded-circle"
                            />
                            <div class="d-flex flex-column">
                                <span class="fw-semibold">{{ profileData?.profile?.displayName }}</span>
                                <span class="text-muted small">{{ user?.email }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex flex-column gap-1">
                        <NuxtLink
                            :to="`/dashboard/settings/${profileData?.profile?.id}`"
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
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const { avatarUrl } = useProfileAvatar()
const { data: profileData } = await useFetch('/api/profile')

// Profile popover
const isPopoverVisible = ref(false)
const profileButton = ref<HTMLElement | null>(null)

// Handle popover visibility
const togglePopover = () => {
    isPopoverVisible.value = !isPopoverVisible.value
}

// Handle logout
const client = useSupabaseClient()
const router = useRouter()

const handleLogout = async () => {
    await client.auth.signOut()
    router.push('/auth/login')
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
</script>

<style scoped lang="scss">
button {
    width: 48px;
    height: 48px;
    padding: 0;
    border-radius: 0.75rem;
    transition: all 0.2s ease;
    border: none;
    background: transparent;
    overflow: hidden;

    &:hover {
        background: rgba(255, 255, 255, 0.05);

        img {
            transform: scale(1.1);
        }
    }

    img {
        width: 32px;
        height: 32px;
        transition: transform 0.2s ease;
        object-fit: cover;
    }
}

.profile-popover {
    left: calc(100% + 16px);
    bottom: 0;
    width: 240px;
    opacity: 0;
    transform: translateX(10px);
    transition: all 0.2s ease;
    pointer-events: none;
    border: 1px solid var(--bs-gray-200);
    background: var(--bs-white);

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
        border-left: 1px solid var(--bs-gray-200);
        border-bottom: 1px solid var(--bs-gray-200);
    }

    .btn {
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        transition: all 0.2s ease;

        &:hover {
            background: var(--bs-gray-100);
            transform: translateX(4px);
        }
    }
}

@media (prefers-reduced-motion: reduce) {
    button,
    .profile-popover,
    .btn {
        transition: none !important;
    }
}
</style>
