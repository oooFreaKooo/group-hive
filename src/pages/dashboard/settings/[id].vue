<template>
    <div class="profile-settings d-flex flex-column min-vh-100">
        <!-- Top Navigation -->
        <div class="container-fluid border-bottom mb-4">
            <NuxtLink
                to="/dashboard"
                class="text-decoration-none text-dark d-inline-flex align-items-center gap-2 mb-3"
            >
                <AppIcon
                    name="arrow-left"
                    color="primary"
                />
                <span>Back</span>
            </NuxtLink>
        </div>

        <!-- Main Content Area -->
        <div class="container-fluid flex-grow-1 pb-5 pb-md-0">
            <div class="row h-100">
                <!-- Sidebar Navigation (Desktop Only) -->
                <div class="col-md-3 d-none d-lg-block">
                    <div class="list-group list-group-flush pe-4">
                        <AppButton
                            v-for="tab in tabs"
                            :key="tab.name"
                            variant="ghost"
                            :active="currentTab === tab.name"
                            :icon="tab.icon"
                            size="md"
                            shape="rounded"
                            justify="start"
                            class="mb-2"
                            @click="currentTab = tab.name"
                        >
                            {{ tab.label }}
                        </AppButton>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="col-14 col-lg-11">
                    <h2 class="display-4 mb-4 d-none d-lg-block text-center">
                        {{ currentTabLabel }}
                    </h2>

                    <!-- Profile Tab -->
                    <ProfileTab
                        v-if="currentTab === 'profile'"
                        v-model="profileForm"
                        @error="error = $event"
                    />

                    <!-- Groups Tab -->
                    <GroupsTab
                        v-if="currentTab === 'groups'"
                        @error="error = $event"
                    />

                    <!-- Account Tab -->
                    <AccountTab
                        v-if="currentTab === 'account'"
                        v-model="accountForm"
                    />

                    <div
                        v-if="error"
                        class="alert alert-danger mt-3 mt-md-4"
                    >
                        {{ error }}
                    </div>

                    <div class="d-flex justify-content-end mt-3 mt-md-4 pt-3 pt-md-4 border-top">
                        <AppButton
                            :loading="loading"
                            variant="primary"
                            width="auto"
                            class="mx-auto"
                            @click="saveChanges"
                        >
                            Save Changes
                        </AppButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bottom Navigation (Mobile Only) -->
        <div class="mobile-tabs d-lg-none">
            <div class="container-fluid">
                <div class="row g-0">
                    <div
                        v-for="tab in tabs"
                        :key="tab.name"
                        class="col"
                    >
                        <button
                            :class="[
                                'mobile-tab-button w-100 d-flex flex-column align-items-center gap-1 py-2',
                                currentTab === tab.name ? 'active' : '',
                            ]"
                            @click="currentTab = tab.name"
                        >
                            <AppIcon
                                :name="tab.icon"
                                :color="currentTab === tab.name ? 'primary' : 'dark'"
                            />
                            <small>{{ tab.label }}</small>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface IProfile {
    id: string
    displayName: string
    avatarUrl: string
    bgUrl: string
    city: string
    postalCode: string
    email: string
}

const user = useSupabaseUser()

const { data, refresh } = await useFetch<IProfile>(`/api/profile/${user.value?.id}`)
const { updateAvatar } = useProfileAvatar()

const tabs = [
    { name: 'profile', label: 'Profile', icon: 'person' },
    { name: 'groups', label: 'Groups', icon: 'people' },
    { name: 'account', label: 'Account', icon: 'gear' },
]

const currentTab = ref('profile')
const loading = ref(false)
const error = ref('')

const currentTabLabel = computed(() => {
    return tabs.find(tab => tab.name === currentTab.value)?.label || ''
})

const profileForm = ref({
    displayName: data.value?.displayName || '',
    avatarUrl: data.value?.avatarUrl || '',
    bgUrl: data.value?.bgUrl || '',
    city: data.value?.city || '',
    postalCode: data.value?.postalCode || '',
})

const accountForm = ref({
    email: data.value?.email || user.value?.email || '',
})

async function saveChanges () {
    if (!data.value?.id) { return }

    loading.value = true
    error.value = ''

    try {
        await $fetch(`/api/profile/edit/${data.value.id}`, {
            method: 'POST',
            body: profileForm.value,
        })

        // Refresh the data after successful save
        await refresh()

        // Update the avatar state
        updateAvatar(profileForm.value.avatarUrl)

        error.value = ''
    } catch (err: any) {
        error.value = err.message || 'Failed to update profile'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.profile-settings {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
}

/* Mobile Styles */
.mobile-tabs {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    padding: 0.5rem 0;
}

.mobile-tab-button {
    background: none;
    border: none;
    color: var(--bs-dark);
    transition: all 0.2s ease;
}

.mobile-tab-button.active {
    color: var(--bs-primary);
}

.mobile-tab-button small {
    font-size: 0.75rem;
    font-weight: 500;
}
</style>
