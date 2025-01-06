<template>
    <TransitionRoot
        appear
        :show="modelValue"
        as="template"
    >
        <Dialog
            as="div"
            class="modal-wrapper"
            @close="$emit('update:modelValue', false)"
        >
            <TransitionChild
                as="template"
                enter="fade"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="fade"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="modal-backdrop" />
            </TransitionChild>

            <div class="modal d-block">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <TransitionChild
                        as="template"
                        enter="fade"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="fade"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <DialogPanel class="modal-content">
                            <div class="modal-header">
                                <DialogTitle
                                    as="h5"
                                    class="modal-title"
                                >
                                    Profile Settings
                                </DialogTitle>
                                <button
                                    class="btn-close"
                                    aria-label="Close"
                                    @click="$emit('update:modelValue', false)"
                                />
                            </div>

                            <div class="modal-body">
                                <div class="border-bottom">
                                    <nav class="nav nav-tabs">
                                        <button
                                            v-for="tab in tabs"
                                            :key="tab.name"
                                            :class="[
                                                'nav-link',
                                                currentTab === tab.name ? 'active' : '',
                                            ]"
                                            @click="currentTab = tab.name"
                                        >
                                            {{ tab.label }}
                                        </button>
                                    </nav>
                                </div>

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
                                    class="alert alert-danger mt-3"
                                >
                                    {{ error }}
                                </div>

                                <div class="modal-footer">
                                    <button
                                        class="btn btn-secondary"
                                        @click="$emit('update:modelValue', false)"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        :disabled="loading"
                                        class="btn btn-primary"
                                        @click="saveChanges"
                                    >
                                        <span v-if="loading">Saving...</span>
                                        <span v-else>Save Changes</span>
                                    </button>
                                </div>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
} from '@headlessui/vue'

defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

const tabs = [
    { name: 'profile', label: 'Profile' },
    { name: 'groups', label: 'Groups' },
    { name: 'account', label: 'Account' },
]

const currentTab = ref('profile')
const loading = ref(false)
const error = ref('')

const user = useSupabaseUser()
const { profile, refreshProfile } = useProfile()

const profileForm = ref({
    displayName: profile.value?.displayName || '',
    avatarUrl: profile.value?.avatarUrl || '',
    city: profile.value?.city || '',
    postalCode: profile.value?.postalCode || '',
})

// Initialize form with profile data
onMounted(async () => {
    await refreshProfile()
    if (profile.value) {
        profileForm.value = {
            displayName: profile.value.displayName || '',
            avatarUrl: profile.value.avatarUrl || null,
            city: profile.value.city || '',
            postalCode: profile.value.postalCode || '',
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
                avatarUrl: profileForm.value.avatarUrl || null,
                city: profileForm.value.city,
                postalCode: profileForm.value.postalCode,
            },
        })

        // Refresh the profile data
        await refreshProfile()

        emit('update:modelValue', false)
    } catch (err: any) {
        error.value = err.message || 'Failed to update profile'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.modal-wrapper {
  position: relative;
  z-index: 1050;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
