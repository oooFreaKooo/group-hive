<template>
    <div class="py-4">
        <div class="container">
            <h1 class="h2">
                Dashboard
            </h1>

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
    </div>
</template>

<script setup lang="ts">
const { currentGroup, fetchCurrentGroup } = useGroup()

definePageMeta({
    middleware: ['auth'],
})

onMounted(() => {
    fetchCurrentGroup()
})
</script>
