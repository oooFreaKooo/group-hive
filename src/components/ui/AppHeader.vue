<template>
    <header class="bg-white shadow-sm">
        <nav
            class="navbar navbar-expand navbar-light container-fluid"
            aria-label="Top"
        >
            <div class="container">
                <NuxtLink
                    class="navbar-brand"
                    to="/"
                >
                    <NuxtImg
                        src="/logo.png"
                        width="70"
                        height="50"
                        alt="Logo"
                    />
                </NuxtLink>

                <div class="d-flex align-items-center gap-4">
                    <template v-if="user">
                        <NuxtLink
                            to="/dashboard"
                            class="nav-link"
                        >
                            Dashboard
                        </NuxtLink>
                        <Dropdown>
                            <DropdownToggle class="d-flex align-items-center gap-2 btn btn-link text-dark text-decoration-none p-0">
                                <div class="d-flex align-items-center gap-2">
                                    <NuxtImg
                                        :src="profile?.avatarUrl || '/default-avatar.png'"
                                        class="rounded-circle"
                                        width="32"
                                        height="32"
                                        style="object-fit: cover;"
                                    />
                                    <span class="text-body">{{ profile?.displayName }}</span>
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
        </nav>
    </header>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const client = useSupabaseClient()
const router = useRouter()
const { profile } = useProfile()
const showProfileSettings = ref(false)

const handleLogout = async () => {
    await client.auth.signOut()
    router.push('/auth/login')
}
</script>
