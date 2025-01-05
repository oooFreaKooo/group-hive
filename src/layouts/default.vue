<template>
    <div>
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
                                    <NuxtImg
                                        :src="user.user_metadata?.avatar_url || '/default-avatar.png'"
                                        class="rounded-circle"
                                        width="32"
                                        height="32"
                                        style="object-fit: cover;"
                                    />
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
            </nav>
        </header>

        <main>
            <div class="container py-4">
                <slot />
            </div>
        </main>

        <ProfileSettingsModal v-model="showProfileSettings" />
    </div>
</template>

<script setup lang="ts">
import ProfileSettingsModal from '~/components/profile/ProfileSettingsModal.vue'

const user = useSupabaseUser()
const client = useSupabaseClient()
const router = useRouter()
const showProfileSettings = ref(false)

const handleLogout = async () => {
    await client.auth.signOut()
    router.push('/auth/login')
}
</script>

<style scoped>
/* We can remove all the dropdown styles since we're using Bootstrap's dropdown */
</style>
