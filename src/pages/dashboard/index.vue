<template>
    <main>
        <AppSection>
            <div v-if="userStore.loading">
                <div
                    class="spinner-border"
                    role="status"
                >
                    Loading...
                </div>
            </div>
            <div v-else>
                <CreateOrJoinGroup v-if="!hasGroups" />
                <div
                    v-else
                    class="container"
                >
                    <h2 class="mb-4">
                        Select a Group
                    </h2>
                    <div class="row g-4">
                        <div
                            v-for="group in allGroups"
                            :key="group.id"
                            class="col-14 col-lg-4"
                        >
                            <div class="card shadow h-100">
                                <div class="card-body">
                                    <h5 class="card-title">
                                        {{ group.name }}
                                    </h5>
                                    <p class="card-text">
                                        {{ group.description }}
                                    </p>
                                    <NuxtLink
                                        :to="`/dashboard/${group.id}`"
                                        class="btn btn-primary"
                                    >
                                        Open Dashboard
                                    </NuxtLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppSection>
    </main>
</template>

<script setup lang="ts">
const userStore = useUserStore()

// Compute all groups (both owned and member of)
const allGroups = computed(() => {
    if (!userStore.profile) { return [] }
    const ownedGroups = userStore.profile.ownedGroups || []
    return [...ownedGroups]
})

const hasGroups = computed(() => allGroups.value.length > 0)

definePageMeta({
    middleware: ['auth'],
})
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
