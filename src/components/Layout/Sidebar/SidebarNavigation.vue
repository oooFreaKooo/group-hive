<template>
    <nav class="py-2 d-flex flex-column align-items-center my-2">
        <NuxtLink
            to="/"
            class="text-decoration-none mb-5"
        >
            <AppIcon
                name="yin-yang"
                size="lg"
                color="light"
                class="nav-icon"
            />
        </NuxtLink>
        <NuxtLink
            v-for="groupId in profileData?.profile?.groupIds"
            :key="groupId"
            :to="`/dashboard/${groupId}/overview`"
            class="nav-link d-flex align-items-center justify-content-center mb-2"
            :class="{ active: currentGroupId === groupId }"
            :title="groupsData[groupId]?.name || ''"
        >
            <AppIcon
                name="house"
                size="lg"
                :color="currentGroupId === groupId ? 'primary' : 'secondary'"
                class="nav-icon"
            />
        </NuxtLink>

        <NuxtLink
            to="/dashboard"
            class="nav-link d-flex align-items-center justify-content-center"
            title="Join New Group"
        >
            <AppIcon
                name="plus-circle"
                size="lg"
                color="secondary"
                class="nav-icon"
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
.nav-link {
    width: 48px;
    height: 48px;
    border-radius: 0.75rem;
    transition: all 0.2s ease;
    position: relative;

    &:hover {
        background: rgba(255, 255, 255, 0.05);

        .nav-icon {
            opacity: 1;
            transform: scale(1.1);
        }
    }

    &.active {
        background: rgba(var(--bs-primary-rgb), 0.1);

        .nav-icon {
            opacity: 1;
            transform: scale(1.1);
        }
    }
}

.nav-icon {
    opacity: 0.8;
    transition: all 0.2s ease;
}
</style>
