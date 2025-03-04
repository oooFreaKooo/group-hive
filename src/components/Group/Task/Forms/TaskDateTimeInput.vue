<template>
    <div class="row g-3">
        <!-- Due Date -->
        <div class="col-md-6">
            <label class="form-label d-flex align-items-center gap-2 mb-2">
                <i class="bi bi-calendar-event text-primary" />
                <span class="fw-medium">Due Date</span>
            </label>
            <input
                v-model="dateModel"
                type="date"
                class="form-control form-control-sm rounded-4 border-2"
                :min="minDate"
                :max="maxDate"
            >
        </div>

        <!-- Due Time -->
        <div class="col-md-6">
            <label class="form-label d-flex align-items-center gap-2 mb-2">
                <i class="bi bi-clock text-primary" />
                <span class="fw-medium">Due Time</span>
            </label>
            <input
                v-model="timeModel"
                type="time"
                class="form-control form-control-sm rounded-4 border-2"
                :disabled="!dateModel"
            >
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    minDate?: string
    maxDate?: string
}>()

const dateModel = defineModel<string>('date')
const timeModel = defineModel<string>('time')
</script>
