<template>
  <div class="py-6">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div v-if="!currentGroup" class="mt-6">
        <NoGroup />
      </div>
      
      <div v-else class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Group Overview -->
        <GroupOverview :group="currentGroup" />
        
        <!-- Tasks Section -->
        <div class="space-y-6">
          <TaskList />
          <CreateTaskButton />
        </div>
        
        <!-- Leaderboard -->
        <div class="lg:col-span-2">
          <Leaderboard />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { currentGroup } = useGroup()
</script>