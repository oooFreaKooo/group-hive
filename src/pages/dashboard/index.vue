<template>
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
            Welcome to GroupHive!
        </h2>
        <p class="text-muted mb-4">
            Get started by creating a new group or joining an existing one.
        </p>
    </div>
</template>

<script setup lang="ts">
const { data } = await useFetch('/api/profile')

const hasGroups = computed(() => (data?.value?.profile?.groupIds?.length ?? 0) > 0)

definePageMeta({
    middleware: ['auth'],
})
</script>

<style scoped>
.container {
    max-width: 800px;
}
</style>
