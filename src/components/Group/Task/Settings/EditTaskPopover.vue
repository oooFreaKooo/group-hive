<template>
    <AppPopover
        title="Edit Task"
        overlay
        @close="$emit('close')"
    >
        <template #trigger="{ open }">
            <button
                class="btn btn-link text-secondary p-0"
                @click="open"
            >
                <i class="bi bi-pencil-fill opacity-75 hover-opacity-100" />
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
            <div class="d-flex justify-content-end gap-2">
                <button
                    type="button"
                    class="btn btn-light btn-sm rounded-4"
                    @click="$emit('close')"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    class="btn btn-primary btn-sm rounded-4"
                    :disabled="isSubmitting"
                >
                    <span
                        v-if="isSubmitting"
                        class="spinner-border spinner-border-sm me-2"
                        role="status"
                    />
                    {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
                </button>
            </div>
        </form>
    </AppPopover>
</template>

<script setup lang="ts">
import type { Tag, Task } from '@prisma/client'
import { useDateTime } from '@/composables/useDateTime'

interface TaskWithRelations extends Task {
    tags: {
        tagId: string
        tag: {
            id: string
            title: string
            color: string
        }
    }[]
    subtasks?: Task[]
}

const props = defineProps<{
    task: TaskWithRelations
    groupId: string
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'edited'): void
}>()

const error = ref('')
const isSubmitting = ref(false)

// Use the datetime composable
const { getDateLimits, createUTCDate, parseUTCDate } = useDateTime()

// Initialize form with task data
const { date: initialDate, time: initialTime } = parseUTCDate(props.task.dueDate)

const form = ref({
    description: props.task.description || '',
    pointValue: props.task.pointValue || 0,
    assignedToId: props.task.assignedToId || '',
    dueDate: initialDate,
    dueTime: initialTime,
    tagIds: props.task.tags.map(tag => tag.tagId),
    subtasks: props.task.subtasks?.map(subtask => ({
        description: subtask.description || '',
        pointValue: subtask.pointValue,
    })) || [],
})

// Get date limits from composable
const { minDate, maxDate } = getDateLimits()

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

        const dueDateTime = createUTCDate(form.value.dueDate, form.value.dueTime)

        await $fetch(`/api/group/${props.groupId}/task/${props.task.id}`, {
            method: 'PUT',
            body: {
                description: form.value.description,
                pointValue: form.value.pointValue,
                assignedToId: form.value.assignedToId || null,
                dueDate: dueDateTime,
                tagIds: form.value.tagIds,
                subtasks: form.value.subtasks,
            },
        })

        emit('edited')
        emit('close')
    } catch (e: any) {
        error.value = e.message || 'Failed to save changes'
    } finally {
        isSubmitting.value = false
    }
}
</script>
