<template>
    <nav class="py-2 d-flex flex-column align-items-center my-2">
        <NuxtLink
            v-for="groupId in profileData?.profile?.groupIds"
            :key="groupId"
            :to="`/dashboard/${groupId}/overview`"
            :class="{ active: currentGroupId === groupId }"
            :title="groupsData[groupId]?.name || ''"
        >
            <AppIcon
                name="house"
                btn
                circle
                bg="light"
                color="dark"
                class="my-2 p-2"
            />
        </NuxtLink>

        <NuxtLink
            to="/dashboard"
            title="Join New Group"
        >
            <AppIcon
                name="plus-circle"
                btn
                circle
                color="light"
                class="my-2 opacity-75"
            />
        </NuxtLink>
    </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const currentGroupId = computed(() => route.params.id as string)

// Store group data
const groupsData = ref<Record<string, { id: string, name: string }>>({})

// Get profile data
const { data: profileData } = await useFetch('/api/profile')
</script>

<style scoped lang="scss">
// Add any specific navigation styles here
</style>
