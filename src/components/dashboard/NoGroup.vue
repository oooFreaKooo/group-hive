<template>
  <div class="rounded-lg bg-white p-6 shadow">
    <div class="text-center">
      <h3 class="text-lg font-medium text-gray-900">Welcome to FlatMate!</h3>
      <p class="mt-1 text-sm text-gray-500">
        To get started, create a new group or join an existing one.
      </p>
      <div class="mt-6 flex justify-center space-x-4">
        <button
          @click="showCreateModal = true"
          class="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Create Group
        </button>
        <button
          @click="showJoinModal = true"
          class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Join Group
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const showCreateModal = ref(false)
const showJoinModal = ref(false)
</script>