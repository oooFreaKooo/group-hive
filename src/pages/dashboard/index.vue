<template>
    <div class="">
        <MainLayout />
        <div
            v-if="!currentGroup"
            class="mt-4"
        >
            <NoGroup />
        </div>

        <div
            v-else
            class="mt-4 row g-4"
        >
            <!-- Group Overview -->
            <div class="col-12 col-lg-6">
                <GroupOverview :group="currentGroup" />
            </div>

            <!-- Members Section -->
            <div class="col-12 col-lg-6">
                <MembersSection :group="currentGroup" />
            </div>

            <!-- Tasks Section -->
            <div class="col-12 col-lg-6">
                <div class="d-flex flex-column gap-4">
                    <TaskList />
                    <CreateTaskButton />
                </div>
            </div>

            <!-- Leaderboard -->
            <div class="col-12">
                <Leaderboard />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import MembersSection from '~/components/dashboard/Group/MembersSection.vue'

const { groups, fetchGroups } = useGroup()
const currentGroup = computed(() => groups.value[0])

definePageMeta({
    middleware: ['auth'],
})

onMounted(() => {
    fetchGroups()
})
</script>
