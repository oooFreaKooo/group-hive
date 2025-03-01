<template>
    <div
        v-if="!hasGroups"
        class="text-center py-5"
    >
        <CreateOrJoinGroup />
    </div>
    <div v-else>
        <h3 class="h4 text-center">
            Welcome to GroupHive!
        </h3>
        <p class="small mb-4 text-center">
            Select a group or create/join a new one in the sidebar.
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
