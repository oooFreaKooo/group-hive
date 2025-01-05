<template>
    <div class="container">
        <div class="min-vh-100 d-flex flex-column justify-content-center py-5">
            <div class="row">
                <div class="col-12 col-md-6 col-lg-4 mx-auto">
                    <div class="text-center">
                        <NuxtImg
                            src="/logo-icon.png"
                            class="mx-auto mb-4 rounded"
                            height="80"
                        />
                        <h2 class="text-center display-6 fw-bold mb-4">
                            Create your account
                        </h2>
                    </div>
                    <div class="card shadow">
                        <div class="card-body p-4">
                            <AuthForm
                                mode="register"
                                button-text="Sign up"
                                @submit="handleRegister"
                            />
                            <div class="mt-4">
                                <div class="text-center">
                                    <span class="text-muted">
                                        Already have an account?
                                        <NuxtLink
                                            to="/auth/login"
                                            class="text-primary text-decoration-none ms-2"
                                        >
                                            Sign in
                                        </NuxtLink>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const { handleRegister } = useAuthForm()
</script>
