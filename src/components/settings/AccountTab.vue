<template>
    <div>
        <!-- Email Section -->
        <div class="card border rounded-4 mb-4 p-4">
            <div class="d-flex align-items-center gap-3 mb-3">
                <AppIcon
                    name="envelope"
                    size="lg"
                    color="dark"
                />
                <div>
                    <h3 class="h6 mb-1">
                        Email Address
                    </h3>
                    <p class="text-muted small mb-0">
                        Your email address is used for notifications and account recovery
                    </p>
                </div>
            </div>

            <div
                v-if="!isEditingEmail"
                class="d-flex align-items-center justify-content-between"
            >
                <div class="text-body-secondary">
                    {{ form.email }}
                </div>
                <button
                    class="btn btn-outline-primary btn-sm"
                    @click="startEmailEdit"
                >
                    Change Email
                </button>
            </div>
        </div>

        <!-- Password Section -->
        <div class="card border rounded-4 mb-4 p-4">
            <div class="d-flex align-items-center gap-3 mb-3">
                <AppIcon
                    name="key"
                    size="lg"
                    color="dark"
                />
                <div>
                    <h3 class="h6 mb-1">
                        Password
                    </h3>
                    <p class="text-muted small mb-0">
                        Change your password to keep your account secure
                    </p>
                </div>
            </div>

            <div
                v-if="!isChangingPassword"
                class="d-flex align-items-center justify-content-between"
            >
                <div class="text-body-secondary">
                    ••••••••
                </div>
                <button
                    class="btn btn-outline-primary btn-sm"
                    @click="startPasswordChange"
                >
                    Change Password
                </button>
            </div>
        </div>

        <!-- Delete Account Section -->
        <div class="card bg-danger-subtle border rounded-4 p-4">
            <div class="d-flex align-items-center gap-3 mb-3">
                <AppIcon
                    name="trash"
                    size="lg"
                    color="danger"
                />
                <div>
                    <h3 class="h6 mb-1">
                        Delete Account
                    </h3>
                    <p class="text-muted small mb-0">
                        Permanently delete your account and all associated data
                    </p>
                </div>
            </div>

            <div v-if="!isDeletingAccount">
                <button
                    class="btn btn-danger"
                    @click="startAccountDeletion"
                >
                    Delete Account
                </button>
            </div>
        </div>

        <!-- Email Change Popover -->
        <AppPopover
            v-if="activePopover === 'email'"
            title="Change Email Address"
            overlay
            @close="cancelEmailEdit"
        >
            <form @submit.prevent="handleEmailChange">
                <div class="mb-3">
                    <label class="form-label">New Email Address</label>
                    <input
                        v-model="newEmail"
                        type="email"
                        class="form-control"
                        required
                        placeholder="Enter new email"
                    >
                </div>
                <div class="mb-3">
                    <label class="form-label">Current Password</label>
                    <input
                        v-model="emailChangePassword"
                        type="password"
                        class="form-control"
                        required
                        placeholder="Enter your password"
                    >
                </div>
                <div class="d-flex gap-2 justify-content-end">
                    <button
                        type="button"
                        class="btn btn-light"
                        @click="cancelEmailEdit"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="btn btn-primary"
                        :disabled="isLoading"
                    >
                        <span
                            v-if="isLoading"
                            class="d-flex align-items-center gap-2"
                        >
                            <div
                                class="spinner-border spinner-border-sm"
                                role="status"
                            >
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            Updating...
                        </span>
                        <span v-else>Update Email</span>
                    </button>
                </div>
            </form>
        </AppPopover>

        <!-- Password Change Popover -->
        <AppPopover
            v-if="activePopover === 'password'"
            title="Change Password"
            overlay
            @close="cancelPasswordChange"
        >
            <form @submit.prevent="handlePasswordChange">
                <div class="mb-4">
                    <label class="form-label">Current Password</label>
                    <input
                        v-model="currentPassword"
                        type="password"
                        class="form-control"
                        required
                        placeholder="Enter current password"
                    >
                </div>
                <div class="mb-4">
                    <label class="form-label">New Password</label>
                    <input
                        v-model="newPassword"
                        type="password"
                        class="form-control"
                        required
                        placeholder="Enter new password"
                        @input="validateNewPassword"
                    >
                    <div
                        v-if="hasAttemptedSubmit && passwordErrors.length > 0"
                        class="form-text text-danger"
                    >
                        <ul class="list-unstyled mb-0 small">
                            <li
                                v-for="error in passwordErrors"
                                :key="error"
                                class="d-flex align-items-center gap-1"
                            >
                                <i
                                    class="bi bi-exclamation-circle-fill fs-6 me-1"
                                    color="danger"
                                />
                                {{ error }}
                            </li>
                        </ul>
                    </div>
                    <div class="form-text small mt-2">
                        <p class="mb-2">
                            Password requirements:
                        </p>
                        <ul class="list-unstyled mb-0">
                            <li
                                v-for="(value, key) in passwordValidation"
                                :key="key"
                                class="d-flex align-items-center gap-2 mb-1 requirement-item"
                                :class="{ 'text-success': value }"
                            >
                                <i
                                    class="bi"
                                    :class="value ? 'bi-check-circle-fill' : 'bi-circle'"
                                />
                                {{ getRequirementText(key) }}
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="mb-4">
                    <label class="form-label">Confirm New Password</label>
                    <input
                        v-model="confirmPassword"
                        type="password"
                        class="form-control"
                        required
                        placeholder="Confirm new password"
                    >
                </div>
                <div class="d-flex gap-2 justify-content-end">
                    <button
                        type="button"
                        class="btn btn-light"
                        @click="cancelPasswordChange"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="btn btn-primary"
                        :disabled="isLoading || newPassword !== confirmPassword"
                    >
                        <span
                            v-if="isLoading"
                            class="d-flex align-items-center gap-2"
                        >
                            <div
                                class="spinner-border spinner-border-sm"
                                role="status"
                            >
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            Updating...
                        </span>
                        <span v-else>Update Password</span>
                    </button>
                </div>
            </form>
        </AppPopover>

        <!-- Delete Account Popover -->
        <AppPopover
            v-if="activePopover === 'delete'"
            title="Delete Account"
            overlay
            @close="cancelAccountDeletion"
        >
            <div class="alert alert-danger">
                <h4 class="alert-heading h6">
                    ⚠️ Warning: This action cannot be undone
                </h4>
                <p class="small mb-2">
                    This will permanently delete:
                </p>
                <ul class="small mb-3">
                    <li>Your profile and personal information</li>
                    <li>Your group memberships and data</li>
                    <li>All associated content and settings</li>
                </ul>
                <p class="small mb-0">
                    To confirm deletion, please type your password and the text "DELETE" below.
                </p>
            </div>

            <form @submit.prevent="handleDeleteAccount">
                <div class="mb-3">
                    <label class="form-label">Your Password</label>
                    <input
                        v-model="deleteAccountPassword"
                        type="password"
                        class="form-control"
                        required
                        placeholder="Enter your password"
                    >
                </div>
                <div class="mb-3">
                    <label class="form-label">Type "DELETE" to confirm</label>
                    <input
                        v-model="deleteConfirmation"
                        type="text"
                        class="form-control"
                        required
                        placeholder="Type &quot;DELETE&quot;"
                    >
                </div>
                <div class="d-flex gap-2 justify-content-end">
                    <button
                        type="button"
                        class="btn btn-light"
                        @click="cancelAccountDeletion"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="btn btn-danger"
                        :disabled="isLoading || deleteConfirmation !== 'DELETE'"
                    >
                        <span
                            v-if="isLoading"
                            class="d-flex align-items-center gap-2"
                        >
                            <div
                                class="spinner-border spinner-border-sm"
                                role="status"
                            >
                                <span class="visually-hidden">Loading...</span>
                            </div>
                            Deleting...
                        </span>
                        <span v-else>Permanently Delete Account</span>
                    </button>
                </div>
            </form>
        </AppPopover>
    </div>
</template>

<script setup lang="ts">
import { signUpValidation } from '~/utils/formValidation'
import AppPopover from '~/components/ui/AppPopover.vue'

const props = defineProps<{
    modelValue: {
        email: string
    }
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: { email: string }): void
}>()

const form = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
})

// State management
const isLoading = ref(false)
const isEditingEmail = ref(false)
const isChangingPassword = ref(false)
const isDeletingAccount = ref(false)

// Email change state
const newEmail = ref('')
const emailChangePassword = ref('')

// Password change state
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

// Delete account state
const deleteAccountPassword = ref('')
const deleteConfirmation = ref('')

// Supabase client
const client = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

// Add popover state management
const activePopover = ref<'email' | 'password' | 'delete' | null>(null)

// Add new state for tracking form submission attempt
const hasAttemptedSubmit = ref(false)

// Email management
function startEmailEdit () {
    activePopover.value = 'email'
    newEmail.value = form.value.email
}

function cancelEmailEdit () {
    activePopover.value = null
    newEmail.value = ''
    emailChangePassword.value = ''
}

async function handleEmailChange () {
    if (!user.value) { return }

    isLoading.value = true
    try {
        const { error } = await client.auth.updateUser({
            email: newEmail.value,
            password: emailChangePassword.value,
        })

        if (error) { throw error }

        // Update the form value
        form.value = { ...form.value, email: newEmail.value }

        // Reset the form
        cancelEmailEdit()

        // Show success message (you might want to implement a toast notification system)
        alert('Email updated successfully. Please check your new email for verification.')
    } catch (error: any) {
        alert(error.message || 'Failed to update email')
    } finally {
        isLoading.value = false
    }
}

// Password management
function startPasswordChange () {
    activePopover.value = 'password'
}

function cancelPasswordChange () {
    activePopover.value = null
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    hasAttemptedSubmit.value = false
    passwordErrors.value = []
}

// Password validation
const passwordErrors = ref<string[]>([])
const passwordValidation = reactive({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
})

const validateNewPassword = () => {
    // Update individual requirement states
    passwordValidation.hasMinLength = newPassword.value.length >= 8
    passwordValidation.hasUpperCase = /[A-Z]/.test(newPassword.value)
    passwordValidation.hasLowerCase = /[a-z]/.test(newPassword.value)
    passwordValidation.hasNumber = /\d/.test(newPassword.value)
    passwordValidation.hasSpecialChar = /[^A-Z0-9]/i.test(newPassword.value)

    try {
        // Extract the password schema and validate
        const passwordSchema = signUpValidation.fields.password as any
        passwordSchema.validateSync(newPassword.value)
        passwordErrors.value = []
        return true
    } catch (error: any) {
        passwordErrors.value = error.errors
        return false
    }
}

// Update password change handler
async function handlePasswordChange () {
    if (!user.value) { return }

    hasAttemptedSubmit.value = true

    // Validate password requirements
    if (!validateNewPassword()) {
        return
    }

    if (newPassword.value !== confirmPassword.value) {
        alert('New passwords do not match')
        return
    }

    isLoading.value = true
    try {
        // First verify the current password
        const { error: signInError } = await client.auth.signInWithPassword({
            email: user.value.email!,
            password: currentPassword.value,
        })

        if (signInError) {
            throw new Error('Current password is incorrect')
        }

        // If verification successful, update to new password
        const { error } = await client.auth.updateUser({
            password: newPassword.value,
        })

        if (error) { throw error }

        // Reset the form and validation state
        hasAttemptedSubmit.value = false
        cancelPasswordChange()

        // Show success message
        alert('Password updated successfully')
    } catch (error: any) {
        alert(error.message || 'Failed to update password')
    } finally {
        isLoading.value = false
    }
}

// Account deletion
function startAccountDeletion () {
    activePopover.value = 'delete'
}

function cancelAccountDeletion () {
    activePopover.value = null
    deleteAccountPassword.value = ''
    deleteConfirmation.value = ''
}

async function handleDeleteAccount () {
    if (!user.value || deleteConfirmation.value !== 'DELETE') { return }

    isLoading.value = true
    try {
        // First verify the password
        const { error: signInError } = await client.auth.signInWithPassword({
            email: user.value.email!,
            password: deleteAccountPassword.value,
        })

        if (signInError) { throw new Error('Invalid password') }

        // Delete profile data from the database
        await $fetch(`/api/profile/delete/${user.value.id}`, {
            method: 'DELETE',
        })

        // Delete Supabase user account
        const { error: deleteError } = await client.auth.admin.deleteUser(
            user.value.id,
        )

        if (deleteError) { throw deleteError }

        // Sign out and redirect to home
        await client.auth.signOut()
        router.push('/')
    } catch (error: any) {
        alert(error.message || 'Failed to delete account')
    } finally {
        isLoading.value = false
    }
}

// Helper function to get requirement text
function getRequirementText (key: string): string {
    const texts = {
        hasMinLength: 'At least 8 characters long',
        hasUpperCase: 'One uppercase letter',
        hasLowerCase: 'One lowercase letter',
        hasNumber: 'One number',
        hasSpecialChar: 'One special character',
    }
    return texts[key as keyof typeof texts] || ''
}
</script>

<style scoped>
.form-group {
    margin-bottom: 1rem;
}

.form-label {
    font-weight: 500;
    margin-bottom: 0.5rem;
}

.card {
    border-radius: 0.5rem;
}

.list-unstyled {
    padding-left: 0;
    list-style: none;
}

.requirement-item {
    transition: all 0.3s ease;
    opacity: 0.75;
}

.requirement-item.text-success {
    opacity: 1;

}

.bi {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.bi-check-circle-fill {
    transform: scale(1.2);
}
</style>
