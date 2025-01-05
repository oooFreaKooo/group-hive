<template>
    <div class="container py-5">
        <div class="row min-vh-100 align-items-center">
            <div class="col-12 col-lg-8 mx-auto text-center">
                <h1 class="display-4 fw-bold mb-4">
                    Manage your shared living space with ease
                </h1>
                <p class="lead text-muted mb-5">
                    GroupHive helps you and your roommates stay organized with task management, fair distribution of chores, and a fun
                    point system to keep everyone motivated.
                </p>
                <div class="d-flex justify-content-center gap-3">
                    <NuxtLink
                        to="/auth/register"
                        class="btn btn-primary"
                    >
                        Get started
                    </NuxtLink>
                    <NuxtLink
                        to="/about"
                        class="btn btn-link text-dark text-decoration-none"
                    >
                        Learn more <span aria-hidden="true">→</span>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: 'guest',
})

useSeoMeta({
    title: 'GroupHive',
})
</script>
