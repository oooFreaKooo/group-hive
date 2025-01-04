<template>
  <button
    @click="showModal = true"
    class="inline-flex w-full items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
  >
    Create New Task
  </button>
</template>

<script setup lang="ts">
const showModal = ref(false)
</script>