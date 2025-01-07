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
                                class="mx-5"
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
                            <Dropdown>
                                <DropdownToggle class="d-flex align-items-center p-0">
                                    <div class="user-profile">
                                        <span>{{ profile?.displayName }}</span>
                                        <span>
                                            <NuxtImg
                                                :src="profile?.avatarUrl || '/default-avatar.png'"
                                                class="rounded-circle"
                                                width="38"
                                                height="38"
                                            />
                                        </span>
                                    </div>
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem @click="showProfileSettings = true">
                                        Settings
                                    </DropdownItem>
                                    <DropdownItem @click="handleLogout">
                                        Logout
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
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
                <ProfileSettingsModal v-model="showProfileSettings" />
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
const client = useSupabaseClient()
const router = useRouter()
const { profile } = useProfile()
const showProfileSettings = ref(false)

const isMobileNavOpen = ref(false)

function toggleMobileNav () {
    isMobileNavOpen.value = !isMobileNavOpen.value
}

const handleLogout = async () => {
    await client.auth.signOut()
    router.push('/auth/login')
}
</script>

<style scoped lang="scss">
.dropdown-toggle {
    color: transparent;
}

.app-header-actions-buttons {
    display: flex;
    border-left: 1px solid var(--c-gray-600);
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
    border-bottom: 1px solid var(--c-gray-600);
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
        color: var(--c-text-primary);
    }
    span:last-child {
        color: var(--c-text-tertiary);
    }
}

.tabs {
    color: var(--c-text-tertiary);
    border-bottom: 1px solid var(--c-gray-600);

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
            color: var(--c-text-primary);
            border-color: var(--c-text-primary);
        }
    }
}

.user-profile {
    display: flex;
    align-items: center;
    border: 0;
    background: transparent;
    cursor: pointer;
    color: var(--c-text-tertiary);
    transition: 0.25s ease;

    &:hover,
    &:focus {
        color: var(--c-text-primary);
        span:last-child {
            box-shadow: 0 0 0 4px var(--c-gray-800), 0 0 0 5px var(--c-text-tertiary);
        }
    }

    span:first-child {
        display: flex;
        font-size: 1.125rem;
        padding-top: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--c-gray-600);
        font-weight: 300;
    }

    span:last-child {
        transition: 0.25s ease;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        overflow: hidden;
        margin-left: 1.5rem;
        flex-shrink: 0;
    }
}
</style>
