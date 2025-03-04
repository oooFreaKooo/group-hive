<template>
    <div class="col-md-6">
        <label
            for="taskPoints"
            class="form-label d-flex align-items-center gap-2 mb-2"
        >
            <i class="bi bi-star-fill text-warning" />
            <span class="fw-medium">Points</span>
            <small
                v-if="disabled"
                class="text-muted"
            >(from subtasks)</small>
        </label>
        <input
            id="taskPoints"
            v-model="modelValue"
            type="number"
            class="form-control form-control-sm rounded-4 border-2"
            min="0"
            max="100"
            :disabled="disabled"
            required
        >
    </div>
</template>

<script setup lang="ts">
defineProps<{
    disabled?: boolean
}>()

const modelValue = defineModel<number>()
</script>
