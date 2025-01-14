<template>
    <div class="profile-settings container-fluid py-4">
        <div class="row">
            <!-- Sidebar Navigation -->
            <div class="col-md-3">
                <div class="card shadow-sm">
                    <div class="card-body p-0">
                        <div class="list-group list-group-flush">
                            <button
                                v-for="tab in tabs"
                                :key="tab.name"
                                :class="[
                                    'list-group-item list-group-item-action d-flex align-items-center gap-2',
                                    currentTab === tab.name ? 'active' : '',
                                ]"
                                @click="currentTab = tab.name"
                            >
                                <AppIcon :name="tab.icon" />
                                {{ tab.label }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content -->
            <div class="col-md-9">
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h2 class="h4 mb-4">
                            {{ currentTabLabel }}
                        </h2>

                        <!-- Profile Tab -->
                        <ProfileTab
                            v-if="currentTab === 'profile'"
                            v-model="profileForm"
                            :profile="props.profile"
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
                            class="alert alert-danger mt-4"
                        >
                            {{ error }}
                        </div>

                        <div class="d-flex justify-content-end mt-4 pt-4 border-top">
                            <button
                                :disabled="loading"
                                class="btn btn-primary px-4"
                                @click="saveChanges"
                            >
                                <span
                                    v-if="loading"
                                    class="d-flex align-items-center gap-2"
                                >
                                    <div
                                        class="spinner-border spinner-border-sm"
                                        role="status"
                                    >
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                    Saving...
                                </span>
                                <span v-else>Save Changes</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Profile } from '@prisma/client'

const props = defineProps<{
    profile: Profile
}>()

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

const user = useSupabaseUser()

const profileForm = ref({
    displayName: props.profile.displayName || '',
    avatarUrl: props.profile.avatarUrl || '',
    bgUrl: props.profile.bgUrl || '',
    city: props.profile.city || '',
    postalCode: props.profile.postalCode || '',
})

// Initialize form with profile data
onMounted(() => {
    if (props.profile) {
        profileForm.value = {
            displayName: props.profile.displayName || '',
            avatarUrl: props.profile.avatarUrl || '',
            bgUrl: props.profile.bgUrl || '',
            city: props.profile.city || '',
            postalCode: props.profile.postalCode || '',
        }
    }
})

const accountForm = ref({
    email: user.value?.email || '',
})

async function saveChanges () {
    if (!user.value?.id) { return }

    loading.value = true
    error.value = ''

    try {
        // Update profile in database
        await $fetch('/api/profile/update', {
            method: 'PUT',
            body: {
                id: user.value.id,
                displayName: profileForm.value.displayName,
                avatarUrl: profileForm.value.avatarUrl || '',
                bgUrl: profileForm.value.bgUrl || '',
                city: profileForm.value.city,
                postalCode: profileForm.value.postalCode,
            },
        })
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
}

.list-group-item {
    border-left: 3px solid transparent;
    padding: 1rem 1.5rem;
}

.list-group-item.active {
    background-color: var(--bs-primary-bg-subtle);
    border-left-color: var(--bs-primary);
    color: var(--bs-primary);
}

.card {
    border: none;
    border-radius: 0.5rem;
}
</style>
