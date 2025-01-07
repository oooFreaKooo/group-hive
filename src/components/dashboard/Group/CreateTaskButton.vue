<template>
    <button
        class="btn btn-primary w-100"
        @click="showModal = true"
    >
        Create New Task
    </button>
</template>

<script setup lang="ts">
const showModal = ref(false)
</script>
