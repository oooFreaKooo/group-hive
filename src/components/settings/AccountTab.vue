<template>
    <div>
        <!-- Email Section -->
        <div class="card bg-light border-0 mb-4">
            <div class="card-body">
                <div class="d-flex align-items-center gap-3 mb-3">
                    <AppIcon
                        name="envelope"
                        size="lg"
                        class="text-primary"
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

                <div class="form-group">
                    <input
                        v-model="form.email"
                        type="email"
                        class="form-control"
                        placeholder="Enter your email"
                        disabled
                    >
                </div>
            </div>
        </div>

        <!-- Password Section -->
        <div class="card bg-light border-0 mb-4">
            <div class="card-body">
                <div class="d-flex align-items-center gap-3 mb-3">
                    <AppIcon
                        name="lock"
                        size="lg"
                        class="text-primary"
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

                <button
                    class="btn btn-outline-primary"
                    @click="handleChangePassword"
                >
                    Change Password
                </button>
            </div>
        </div>

        <!-- Delete Account Section -->
        <div class="card bg-danger-subtle border-0">
            <div class="card-body">
                <div class="d-flex align-items-center gap-3 mb-3">
                    <AppIcon
                        name="trash"
                        size="lg"
                        class="text-danger"
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

                <button
                    class="btn btn-danger"
                    @click="handleDeleteAccount"
                >
                    Delete Account
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
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

const handleChangePassword = () => {
    // TODO: Implement password change functionality
    console.log('Change password clicked')
}

const handleDeleteAccount = () => {
    // TODO: Implement account deletion functionality
    console.log('Delete account clicked')
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
</style>
