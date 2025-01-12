<template>
    <div class="d-flex justify-content-between align-items-center py-3">
        <h1 class="h3 mb-0">
            Tasks
        </h1>
        <div class="d-flex align-items-center">
            <div class="d-flex align-items-center me-3">
                <div
                    v-for="n in 3"
                    :key="n"
                    class="rounded-circle bg-primary"
                    style="width: 30px; height: 30px; margin-left: -8px;"
                />
            </div>
            <button
                class="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                style="width: 30px; height: 30px;"
                title="Add Participant"
            >
                <i class="bi bi-plus small" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
// Component logic will be added when we implement participant management
</script>
