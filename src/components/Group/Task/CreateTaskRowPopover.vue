<template>
    <div>
        <button
            class="btn btn-light btn-sm rounded-pill"
            @click="isOpen = true"
        >
            <i class="bi bi-plus-lg me-2" />
            Add Week
        </button>

        <AppPopover
            v-if="isOpen"
            title="Create Task Row"
            @close="isOpen = false"
        >
            <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                    <label
                        for="rowTitle"
                        class="form-label"
                    >Title*</label>
                    <input
                        id="rowTitle"
                        v-model="form.title"
                        type="text"
                        class="form-control"
                        required
                        placeholder="e.g., Sprint 1, Week 23, etc."
                    >
                </div>
                <div class="mb-3">
                    <label class="form-label">Week*</label>
                    <div class="d-flex gap-2">
                        <select
                            v-model="selectedWeek"
                            class="form-select"
                            required
                        >
                            <option value="">
                                Select a week
                            </option>
                            <option
                                v-for="week in availableWeeks"
                                :key="week.start.toISOString()"
                                :value="week"
                            >
                                {{ formatWeekOption(week) }}
                            </option>
                        </select>
                    </div>
                </div>
                <div
                    v-if="error"
                    class="alert alert-danger"
                    role="alert"
                >
                    {{ error }}
                </div>
                <div class="d-flex justify-content-end gap-2">
                    <button
                        type="button"
                        class="btn btn-secondary"
                        @click="isOpen = false"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="btn btn-primary"
                        :disabled="isSubmitting"
                    >
                        {{ isSubmitting ? 'Creating...' : 'Create Row' }}
                    </button>
                </div>
            </form>
        </AppPopover>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    groupId: {
        type: String,
        required: true,
    },
})

const emit = defineEmits<{
    (e: 'row-created'): void
}>()

const isOpen = ref(false)
const error = ref('')
const isSubmitting = ref(false)

const form = ref({
    title: '',
})

interface WeekOption {
    start: Date
    end: Date
}

const selectedWeek = ref<WeekOption | ''>('')

// Generate next 12 weeks as options
const availableWeeks = computed(() => {
    const weeks: WeekOption[] = []
    const today = new Date()

    for (let i = 0; i < 12; i++) {
        const weekStart = new Date(today)
        weekStart.setDate(weekStart.getDate() + (i * 7))
        // Set to Monday
        weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)
        weekStart.setHours(0, 0, 0, 0)

        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)
        weekEnd.setHours(23, 59, 59, 999)

        weeks.push({
            start: weekStart,
            end: weekEnd,
        })
    }

    return weeks
})

const formatWeekOption = (week: WeekOption) => {
    const startMonth = week.start.toLocaleString('default', { month: 'short' })
    const endMonth = week.end.toLocaleString('default', { month: 'short' })
    const startDay = week.start.getDate()
    const endDay = week.end.getDate()

    if (startMonth === endMonth) {
        return `${startMonth} ${startDay}-${endDay}`
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`
}

const handleSubmit = async () => {
    if (!selectedWeek.value) {
        error.value = 'Please select a week'
        return
    }

    try {
        isSubmitting.value = true
        error.value = ''
        await $fetch(`/api/group/${props.groupId}/taskRow`, {
            method: 'POST',
            body: {
                ...form.value,
                weekStart: selectedWeek.value.start,
                weekEnd: selectedWeek.value.end,
                groupId: props.groupId,
            },
        })

        emit('row-created')
        isOpen.value = false
        form.value.title = ''
        selectedWeek.value = ''
    } catch (e: any) {
        error.value = e.message || 'Failed to create task row'
    } finally {
        isSubmitting.value = false
    }
}
</script>
