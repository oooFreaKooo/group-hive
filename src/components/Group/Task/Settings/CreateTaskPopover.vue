<template>
    <AppPopover
        ref="popoverRef"
        title="Create Task"
        trigger-text="Add Task"
        overlay
        @close="handleClose"
        @open="handleOpen"
    >
        <template #trigger="{ open }">
            <button
                class="btn btn-light btn-sm rounded-pill"
                @click="open"
            >
                <i class="bi bi-plus-lg me-2" />
                Add Task
            </button>
        </template>

        <form
            class="needs-validation"
            @submit.prevent="handleSubmit"
        >
            <div class="row g-3 mb-3">
                <TaskPointsInput
                    v-model="form.pointValue"
                    :disabled="shouldDisableMainPoints"
                />
                <TaskAssigneeSelect
                    v-model="form.assignedToId"
                    :members="members"
                />
            </div>

            <TaskDateTimeInput
                v-model:date="form.dueDate"
                v-model:time="form.dueTime"
                :min-date="minDate"
                :max-date="maxDate"
            />

            <hr>

            <TaskTagsSection
                v-model="form.tagIds"
                :group-id="groupId"
                :tags="tags"
            />

            <hr>

            <TaskSubtasksList
                v-model="form.subtasks"
                @update:points="handleSubtaskPointsUpdate"
            />

            <hr>

            <!-- Error Alert -->
            <div
                v-if="error"
                class="alert alert-danger rounded-4 border-0 d-flex align-items-center"
                role="alert"
            >
                <i class="bi bi-exclamation-triangle-fill me-2" />
                {{ error }}
            </div>

            <!-- Action Buttons -->
            <div class="d-flex justify-content-center">
                <button
                    type="submit"
                    class="btn btn-primary btn-sm rounded-4 px-4 py-1"
                    :disabled="isSubmitting"
                >
                    <span
                        v-if="isSubmitting"
                        class="spinner-border spinner-border-sm me-2"
                        role="status"
                    />
                    {{ isSubmitting ? 'Creating...' : 'Create Task' }}
                </button>
            </div>
        </form>
    </AppPopover>
</template>

<script setup lang="ts">
import type { Tag } from '@prisma/client'

const props = defineProps<{
    groupId: string
    selectedDate?: Date
}>()

const error = ref('')
const isSubmitting = ref(false)
const emit = defineEmits(['task-created'])

// Add ref to AppPopover
const popoverRef = ref()

// Expose the open method
defineExpose({
    open: () => {
        popoverRef.value?.open()
    },
})

// Format initial date if provided
const formattedInitialDate = computed(() => {
    if (!props.selectedDate) { return '' }
    // Adjust for timezone by using the local date methods
    const date = new Date(props.selectedDate)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
})

const form = ref({
    description: '',
    pointValue: 1,
    assignedToId: '',
    dueDate: formattedInitialDate.value,
    dueTime: '',
    tagIds: [] as string[],
    subtasks: [] as { description: string, pointValue: number }[],
})

// Computed date limits (3 months range)
const minDate = computed(() => {
    const date = new Date()
    return date.toISOString().split('T')[0]
})

const maxDate = computed(() => {
    const date = new Date()
    date.setMonth(date.getMonth() + 3)
    return date.toISOString().split('T')[0]
})

// Fetch tags for this group
const { data: tags } = await useFetch<Tag[]>(() => `/api/group/${props.groupId}/tags`, {
    default: () => [],
})

// Fetch group members
const { data: members } = await useFetch(() => `/api/group/${props.groupId}/members`, {
    default: () => [],
})

// Add computed for whether main points should be disabled
const shouldDisableMainPoints = computed(() => form.value.subtasks.length > 0)

const handleSubtaskPointsUpdate = (total: number) => {
    if (shouldDisableMainPoints.value) {
        form.value.pointValue = total
    }
}

const handleSubmit = async () => {
    try {
        isSubmitting.value = true
        error.value = ''

        let dueDateTime = null
        if (form.value.dueDate) {
            // Create date in local timezone
            const [
                year, month, day,
            ] = form.value.dueDate.split('-').map(Number)
            dueDateTime = new Date(year, month - 1, day)

            if (form.value.dueTime) {
                const [ hours, minutes ] = form.value.dueTime.split(':').map(Number)
                dueDateTime.setHours(hours, minutes, 0)
            } else {
                // If no time is set, default to end of day (23:59:59)
                dueDateTime.setHours(22, 59, 59)
            }

            // Convert to UTC while preserving the local time
            const offset = dueDateTime.getTimezoneOffset()
            dueDateTime = new Date(dueDateTime.getTime() - (offset * 60 * 1000))
        }

        await $fetch(`/api/group/${props.groupId}/task/create`, {
            method: 'POST',
            body: {
                description: form.value.description,
                pointValue: form.value.pointValue,
                assignedToId: form.value.assignedToId || null,
                dueDate: dueDateTime ? dueDateTime.toISOString() : null,
                tagIds: form.value.tagIds,
                subtasks: form.value.subtasks,
            },
        })

        // Reset form
        form.value = {
            description: '',
            pointValue: 1,
            assignedToId: '',
            dueDate: '',
            dueTime: '',
            tagIds: [],
            subtasks: [],
        }

        navigateTo(`/dashboard/${props.groupId}/tasks`)
        emit('task-created')
    } catch (e: any) {
        error.value = e.message || 'Failed to create task'
    } finally {
        isSubmitting.value = false
    }
}

const handleClose = () => {
    // Reset form
    form.value = {
        description: '',
        pointValue: 1,
        assignedToId: '',
        dueDate: '',
        dueTime: '',
        tagIds: [],
        subtasks: [],
    }
}

const handleOpen = () => {
    // Set initial date if provided
    if (props.selectedDate) {
        form.value.dueDate = formattedInitialDate.value
    }
}
</script>

<style scoped lang="scss">
.hover-opacity-100:hover {
    opacity: 1 !important;
}
</style>
