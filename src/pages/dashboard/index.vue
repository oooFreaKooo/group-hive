<template>
    <div class="d-flex">
        <main class="flex-grow-1 ms-md-5 p-4">
            <div class="container">
                <div
                    v-if="!hasGroups"
                    class="text-center py-5"
                >
                    <div class="mb-4">
                        <AppIcon
                            name="people"
                            size="xl"
                        />
                    </div>
                    <h2 class="mb-3">
                        Welcome to Weekly Goals!
                    </h2>
                    <p class="text-muted mb-4">
                        Get started by creating a new group or joining an existing one.
                    </p>
                    <div class="d-flex gap-3 justify-content-center">
                        <button
                            class="btn btn-primary"
                            @click="showCreateModal = true"
                        >
                            Create New Group
                        </button>
                        <button
                            class="btn btn-outline-primary"
                            @click="showJoinModal = true"
                        >
                            Join Existing Group
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
const { data } = await useFetch('/api/profile')

const hasGroups = computed(() => (data?.value?.profile.groupIds?.length ?? 0) > 0)
const showCreateModal = ref(false)
const showJoinModal = ref(false)

definePageMeta({
    middleware: ['auth'],
})
</script>

<style scoped>
.container {
    max-width: 800px;
}
</style>
