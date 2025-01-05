<template>
    <div class="container">
        <div class="min-vh-100 d-flex flex-column justify-content-center py-5">
            <div class="row">
                <div class="col-12 col-md-6 col-lg-4 mx-auto">
                    <div class="card shadow">
                        <div class="card-body p-4 text-center">
                            <h2 class="fw-bold mb-3">
                                Confirming your authentication...
                            </h2>
                            <p class="text-muted">
                                You will be redirected automatically.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()

watch(user, () => {
    if (user.value) {
        return navigateTo('/dashboard')
    }
}, { immediate: true })
</script>
