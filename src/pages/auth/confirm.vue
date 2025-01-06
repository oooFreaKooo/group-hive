<template>
    <div class="container">
        <div class="min-vh-100 d-flex flex-column justify-content-center py-5">
            <div class="row">
                <div class="col-12 col-md-6 col-lg-4 mx-auto">
                    <div class="card shadow">
                        <div class="card-body p-4">
                            <div
                                v-if="!user?.email_confirmed_at"
                                class="text-center"
                            >
                                <NuxtImg
                                    src="/logo-icon.png"
                                    class="mb-4 rounded-4"
                                    style="height: 80px;"
                                />
                                <h2 class="fw-bold mb-3">
                                    Check your email
                                </h2>
                                <p class="text-muted mb-4">
                                    We've sent you a verification email. Please click the link in the email to verify your account.
                                </p>
                                <div class="d-flex justify-content-center">
                                    <div class="spinner-border text-primary" />
                                </div>
                            </div>

                            <div v-else>
                                <h2 class="text-center fw-bold mb-4">
                                    Complete Your Profile
                                </h2>
                                <form @submit.prevent="saveProfile">
                                    <div class="mb-3">
                                        <label
                                            for="displayName"
                                            class="form-label"
                                        >Display Name</label>
                                        <input
                                            id="displayName"
                                            v-model="profileForm.displayName"
                                            type="text"
                                            class="form-control"
                                            :class="{ 'is-invalid': errors.displayName }"
                                            required
                                        >
                                        <div
                                            v-if="errors.displayName"
                                            class="invalid-feedback"
                                        >
                                            {{ errors.displayName }}
                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        <label
                                            for="city"
                                            class="form-label"
                                        >City</label>
                                        <input
                                            id="city"
                                            v-model="profileForm.city"
                                            type="text"
                                            class="form-control"
                                            :class="{ 'is-invalid': errors.city }"
                                            required
                                        >
                                        <div
                                            v-if="errors.city"
                                            class="invalid-feedback"
                                        >
                                            {{ errors.city }}
                                        </div>
                                    </div>

                                    <div class="mb-4">
                                        <label
                                            for="postalCode"
                                            class="form-label"
                                        >Postal Code</label>
                                        <input
                                            id="postalCode"
                                            v-model="profileForm.postalCode"
                                            type="text"
                                            class="form-control"
                                            :class="{ 'is-invalid': errors.postalCode }"
                                            required
                                        >
                                        <div
                                            v-if="errors.postalCode"
                                            class="invalid-feedback"
                                        >
                                            {{ errors.postalCode }}
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
                                        Complete Profile
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PrismaClient } from '@prisma/client'
import { object, string } from 'yup'
import { useErrorHandler } from '~/composables/useErrorHandler'

definePageMeta({
    middleware: ['auth'], // Ensure user is authenticated
})

const prisma = new PrismaClient()
const user = useSupabaseUser()
const client = useSupabaseClient()
const { errorHandler } = useErrorHandler()

const isLoading = ref(false)
const errors = ref<Record<string, string>>({})

const profileForm = reactive({
    displayName: '',
    city: '',
    postalCode: '',
})

// Profile validation schema
const profileValidation = object({
    displayName: string().required('Display name is required'),
    city: string().required('City is required'),
    postalCode: string().required('Postal code is required'),
})

const saveProfile = async () => {
    if (!user.value?.id) { return }

    try {
        isLoading.value = true

        // Validate form
        await profileValidation.validate(profileForm, { abortEarly: false })

        // Create profile in database using Prisma client
        await prisma.profile.create({
            data: {
                id: user.value.id,
                displayName: profileForm.displayName,
                city: profileForm.city,
                postalCode: profileForm.postalCode,
                role: 'USER',
            },
        })

        // Redirect to dashboard since user is already logged in
        navigateTo('/dashboard')
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

// Check for email verification status periodically if not confirmed
if (!user.value?.email_confirmed_at) {
    const checkEmailVerification = async () => {
        const { data: { user: currentUser } } = await client.auth.getUser()
        if (currentUser?.email_confirmed_at) {
            window.location.reload()
        }
    }

    const interval = setInterval(checkEmailVerification, 5000)
    onUnmounted(() => clearInterval(interval))
}
</script>
