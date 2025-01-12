<template>
    <div class="container">
        <div class="min-vh-100 d-flex align-items-center justify-content-center">
            <div class="col-14 col-md-6 col-lg-4">
                <div class="card shadow">
                    <div class="card-body p-4">
                        <form
                            class="d-flex flex-column gap-4"
                            @submit="handleSubmit"
                        >
                            <div class="text-center">
                                <NuxtImg
                                    src="/WG_SVG.svg"
                                    class="mx-auto mb-4 rounded"
                                    height="80"
                                />
                                <h2 class="fw-bold mb-2">
                                    Login
                                </h2>
                                <p class="text-muted">
                                    Geben Sie Ihre Anmeldedaten unten ein.
                                </p>
                            </div>

                            <div>
                                <label
                                    for="email"
                                    class="form-label"
                                >E-Mail</label>
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

                            <div>
                                <label
                                    for="password"
                                    class="form-label"
                                >Passwort</label>
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
                            </div>

                            <button
                                type="submit"
                                class="btn btn-primary w-100"
                                :disabled="isLoading"
                            >
                                <div
                                    v-if="isLoading"
                                    class="spinner-border spinner-border-sm me-2"
                                    role="status"
                                >
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                                Anmelden
                            </button>
                        </form>
                    </div>
                </div>

                <div class="text-center mt-4">
                    <span class="text-muted">Noch kein Konto?</span>
                    <router-link
                        to="/auth/register"
                        class="text-primary text-decoration-none ms-2"
                    >
                        Registrieren
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ValidationError } from 'yup'
import { signInValidation } from '~/utils/formValidation'
import { BaseError, useErrorHandler } from '~/composables/useErrorHandler'

definePageMeta({
    middleware: ['guest'],
})

useSeoMeta({
    title: 'Anmelden - GroupHive',
})

const { auth } = useSupabaseClient()
const { errorHandler } = useErrorHandler()

const form = reactive({
    email: undefined,
    password: undefined,
})
const isLoading = ref(false)
const errors = ref<Record<string, string>>({})

const signInWithCredential = async () => {
    try {
        isLoading.value = true

        const signIn = await auth.signInWithPassword({
            email: form.email ?? '',
            password: form.password ?? '',
        })

        if (signIn.error) {
            throw new BaseError(signIn.error.status, signIn.error.message)
        }

        navigateTo('/dashboard')
        isLoading.value = false
    } catch (error) {
        isLoading.value = false
        errorHandler(error as BaseError)
    }
}

const handleSubmit = async (event: Event) => {
    event.preventDefault()
    errors.value = {}

    try {
        // Validate form using Yup schema
        await signInValidation.validate(form, { abortEarly: false })

        isLoading.value = true
        await signInWithCredential()
    } catch (error) {
        if (error instanceof Error) {
            // Handle Yup validation errors
            if (error instanceof ValidationError) {
                error.inner.forEach((err) => {
                    if (err.path) {
                        errors.value[err.path] = err.message
                    }
                })
            } else if (error instanceof BaseError) {
                errorHandler(error)
            }
        }
        isLoading.value = false
    }
}
</script>

<style scoped>

</style>
