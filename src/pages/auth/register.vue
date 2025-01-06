<template>
    <div class="container">
        <div class="row min-vh-100 mt-5 justify-content-center">
            <div class="col-12 col-md-8 col-lg-6 col-xl-4">
                <div class="card p-4">
                    <div class="card-body">
                        <form @submit.prevent="signUpWithCredential">
                            <div class="text-center mb-4">
                                <NuxtImg
                                    src="/logo-icon.png"
                                    class="mb-4 rounded-4"
                                    style="height: 80px;"
                                />
                                <p class="h5 fw-bold">
                                    Create your account
                                </p>
                                <p class="text-muted">
                                    Enter your email and password to register
                                </p>
                            </div>

                            <div class="mb-3">
                                <label
                                    for="email"
                                    class="form-label"
                                >Email</label>
                                <input
                                    id="email"
                                    v-model="form.email"
                                    type="email"
                                    class="form-control"
                                    :class="{ 'is-invalid': errors.email }"
                                    required
                                >
                                <div
                                    v-if="errors.email"
                                    class="invalid-feedback"
                                >
                                    {{ errors.email }}
                                </div>
                            </div>

                            <div class="mb-3">
                                <label
                                    for="password"
                                    class="form-label"
                                >Password</label>
                                <input
                                    id="password"
                                    v-model="form.password"
                                    type="password"
                                    class="form-control"
                                    :class="{ 'is-invalid': errors.password }"
                                    required
                                >
                                <div
                                    v-if="errors.password"
                                    class="invalid-feedback"
                                >
                                    {{ errors.password }}
                                </div>
                                <div
                                    v-if="form.password"
                                    class="password-strength mt-2"
                                >
                                    <div
                                        class="progress"
                                        style="height: 4px;"
                                    >
                                        <div
                                            class="progress-bar"
                                            :class="passwordStrengthClass"
                                            :style="{ width: `${passwordStrength}%` }"
                                        />
                                    </div>
                                    <small class="text-muted mt-1 d-block">
                                        Password strength: {{ passwordStrengthText }}
                                    </small>
                                </div>
                            </div>

                            <div class="mb-4">
                                <label
                                    for="confirmPassword"
                                    class="form-label"
                                >Confirm Password</label>
                                <input
                                    id="confirmPassword"
                                    v-model="form.confirmPassword"
                                    type="password"
                                    class="form-control"
                                    :class="{ 'is-invalid': errors.confirmPassword }"
                                    required
                                >
                                <div
                                    v-if="errors.confirmPassword"
                                    class="invalid-feedback"
                                >
                                    {{ errors.confirmPassword }}
                                </div>
                            </div>

                            <button
                                type="submit"
                                class="btn btn-secondary w-100"
                                :disabled="isLoading"
                            >
                                <span
                                    v-if="isLoading"
                                    class="spinner-border spinner-border-sm me-2"
                                />
                                Register
                            </button>
                        </form>
                    </div>
                </div>

                <div class="text-center mt-3">
                    <span class="text-muted">Already have an account?</span>
                    <router-link
                        to="/auth/login"
                        class="ms-2"
                    >
                        Sign in
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { object, string, ref as yupRef } from 'yup'
import { useErrorHandler } from '~/composables/useErrorHandler'

definePageMeta({
    middleware: 'guest',
})

const { auth } = useSupabaseClient()
const { errorHandler } = useErrorHandler()

const form = reactive({
    email: '',
    password: '',
    confirmPassword: '',
})

const isLoading = ref(false)
const errors = ref<Record<string, string>>({})

// Validation schema
const signUpValidation = object({
    email: string().email('Invalid email').required('Email is required'),
    password: string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    confirmPassword: string()
        .oneOf([yupRef('password')], 'Passwords must match')
        .required('Please confirm your password'),
})

const calculatePasswordStrength = (password: string): number => {
    if (!password) { return 0 }

    let strength = 0
    // Length check
    if (password.length >= 8) { strength += 25 }
    // Uppercase check
    if (/[A-Z]/.test(password)) { strength += 25 }
    // Lowercase check
    if (/[a-z]/.test(password)) { strength += 25 }
    // Number check
    if (/\d/.test(password)) { strength += 12.5 }
    // Special character check
    if (/[^A-Z0-9]/i.test(password)) { strength += 12.5 }

    return strength
}

const passwordStrength = computed(() => calculatePasswordStrength(form.password || ''))

const passwordStrengthText = computed(() => {
    const strength = passwordStrength.value
    if (strength === 0) { return 'None' }
    if (strength < 50) { return 'Weak' }
    if (strength < 75) { return 'Medium' }
    return 'Strong'
})

const passwordStrengthClass = computed(() => {
    const strength = passwordStrength.value
    if (strength < 50) { return 'bg-danger' }
    if (strength < 75) { return 'bg-warning' }
    return 'bg-success'
})

const signUpWithCredential = async () => {
    errors.value = {}

    try {
        isLoading.value = true

        // Validate form
        await signUpValidation.validate(form, { abortEarly: false })

        const signUp = await auth.signUp({
            email: form.email,
            password: form.password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/confirm`,
            },
        })

        if (signUp.error) {
            throw signUp.error
        }

        // After successful signup, user is automatically logged in
        // Just redirect to confirm page
        navigateTo('/auth/confirm')
    } catch (error: any) {
        if (error.inner) {
            error.inner.forEach((err: any) => {
                if (err.path) {
                    errors.value[err.path] = err.message
                }
            })
        } else {
            errorHandler(error)
        }
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped>
.password-strength {
    .progress {
        height: 4px;
    }
}
</style>
