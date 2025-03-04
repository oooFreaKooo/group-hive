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
                <!-- Points -->
                <div class="col-md-6">
                    <label
                        for="taskPoints"
                        class="form-label d-flex align-items-center gap-2 mb-2"
                    >
                        <i class="bi bi-star-fill text-warning" />
                        <span class="fw-medium">Points</span>
                        <small
                            v-if="shouldDisableMainPoints"
                            class="text-muted"
                        >(from subtasks)</small>
                    </label>
                    <input
                        id="taskPoints"
                        v-model.number="form.pointValue"
                        type="number"
                        class="form-control form-control-sm rounded-4 border-2"
                        min="0"
                        max="100"
                        :disabled="shouldDisableMainPoints"
                        required
                    >
                </div>

                <!-- Assignee -->
                <div class="col-md-6">
                    <label class="form-label d-flex align-items-center gap-2 mb-2">
                        <i class="bi bi-person-fill text-primary" />
                        <span class="fw-medium">Assignee</span>
                    </label>
                    <select
                        v-model="form.assignedToId"
                        class="form-select form-select-sm rounded-4 border-2"
                    >
                        <option value="">
                            Unassigned
                        </option>
                        <option
                            v-for="member in members"
                            :key="member.id"
                            :value="member.id"
                        >
                            {{ member.displayName }}
                        </option>
                    </select>
                </div>

                <!-- Due Date -->
                <div class="col-md-6">
                    <label class="form-label d-flex align-items-center gap-2 mb-2">
                        <i class="bi bi-calendar-event text-primary" />
                        <span class="fw-medium">Due Date</span>
                    </label>
                    <input
                        v-model="form.dueDate"
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
                        v-model="form.dueTime"
                        type="time"
                        class="form-control form-control-sm rounded-4 border-2"
                        :disabled="!form.dueDate"
                    >
                </div>
            </div>

            <hr>

            <!-- Tags Section -->
            <div class="mb-3">
                <label class="form-label d-flex align-items-center gap-2 mb-2">
                    <i class="bi bi-tags-fill text-primary" />
                    <span class="fw-medium">Tags</span>
                </label>

                <!-- Tag Selection -->
                <div
                    v-if="!showCreateTag"
                    class="d-flex gap-2 align-items-start"
                >
                    <select
                        v-model="selectedTagId"
                        class="form-select form-select-sm rounded-4 border-2"
                        :disabled="!availableTags.length"
                    >
                        <option value="">
                            {{ availableTags.length ? 'Select a tag' : 'No tags available' }}
                        </option>
                        <option
                            v-for="tag in availableTags"
                            :key="tag.id"
                            :value="tag.id"
                        >
                            {{ tag.title }}
                        </option>
                    </select>

                    <button
                        v-if="!showCreateTag"
                        type="button"
                        class="btn border-0 btn-sm text-dark"
                        @click="showCreateTag = true"
                    >
                        <i class="bi bi-gear" />
                    </button>
                </div>

                <!-- Selected Tags -->

                <TagBadge
                    :tags="form.tagIds.map(id => ({
                        tagId: id,
                        tag: {
                            id,
                            title: getTagTitle(id),
                            color: getTagColor(id),
                        },
                    }))"
                    :show-close-button="true"
                    class="mt-2"
                    @remove="removeTag"
                />

                <!-- Create Tag Form -->
                <CreateTagForm
                    v-if="showCreateTag"
                    :group-id="groupId"
                    :existing-tags="tags"
                    @tag-created="handleTagCreated"
                    @tag-deleted="handleTagDeleted"
                    @cancel="showCreateTag = false"
                />
            </div>

            <hr>

            <!-- Subtasks Section -->
            <div class="mb-2">
                <label class="form-label d-flex align-items-center gap-2 mb-2">
                    <i class="bi bi-list-check text-primary" />
                    <span class="fw-medium">Subtasks</span>
                </label>

                <!-- Subtasks List -->
                <div class="mb-2">
                    <div
                        v-for="(subtask, index) in form.subtasks"
                        :key="index"
                        class="d-flex gap-2 align-items-center mb-2"
                    >
                        <input
                            v-model="subtask.description"
                            type="text"
                            class="form-control form-control-sm rounded-4 border-2"
                            placeholder="Subtask description"
                            @input="updateSubtaskPoints"
                        >
                        <div
                            class="input-group input-group-sm"
                            style="width: 120px;"
                        >
                            <span class="input-group-text border-2 rounded-start-4">
                                <i class="bi bi-star-fill text-warning" />
                            </span>
                            <input
                                v-model.number="subtask.pointValue"
                                type="number"
                                class="form-control form-control-sm border-2 rounded-end-4"
                                min="0"
                                max="100"
                                @input="updateSubtaskPoints"
                            >
                        </div>
                        <button
                            type="button"
                            class="btn btn-sm text-primary p-1 border-0"
                            @click="removeSubtask(index)"
                        >
                            <i class="bi bi-trash" />
                        </button>
                    </div>
                </div>

                <!-- Add Subtask Button -->
                <button
                    type="button"
                    class="btn btn-outline-primary btn-sm rounded-4"
                    @click="addSubtask"
                >
                    + Add Subtask
                </button>
            </div>

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

// Add computed for total subtask points
const totalSubtaskPoints = computed(() => {
    return form.value.subtasks.reduce((total, subtask) => total + (subtask.pointValue || 0), 0)
})

// Add computed for whether main points should be disabled
const shouldDisableMainPoints = computed(() => form.value.subtasks.length > 0)

// Watch totalSubtaskPoints to update main pointValue
watch(totalSubtaskPoints, (newTotal) => {
    if (shouldDisableMainPoints.value) {
        form.value.pointValue = newTotal
    }
})

const selectedTagId = ref('')

// Fetch tags for this group
const { data: tags } = await useFetch<Tag[]>(() => `/api/group/${props.groupId}/tags`, {
    default: () => [],
})

// Fetch group members
const { data: members } = await useFetch(() => `/api/group/${props.groupId}/members`, {
    default: () => [],
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

const availableTags = computed(() =>
    tags.value?.filter(tag => !form.value.tagIds.includes(tag.id)) || [],
)

const getTagColor = (tagId: string) => {
    return tags.value?.find(t => t.id === tagId)?.color || '#000000'
}

const getTagTitle = (tagId: string) => {
    return tags.value?.find(t => t.id === tagId)?.title || 'Unknown'
}

const showCreateTag = ref(false)

const handleTagCreated = (newTag: Tag) => {
    if (tags.value) {
        tags.value.push(newTag)
    }
    showCreateTag.value = false
}

const handleTagDeleted = (tagId: string) => {
    if (tags.value) {
        tags.value = tags.value.filter(t => t.id !== tagId)
        // Also remove the tag from the form if it was selected
        form.value.tagIds = form.value.tagIds.filter(id => id !== tagId)
    }
}

const addSubtask = () => {
    form.value.subtasks.push({ description: '', pointValue: 1 })
}

const removeSubtask = (index: number) => {
    form.value.subtasks.splice(index, 1)
}

const updateSubtaskPoints = () => {
    // Implementation of updateSubtaskPoints function
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

const removeTag = (tagId: string) => {
    form.value.tagIds = form.value.tagIds.filter(id => id !== tagId)
}

// Add watch for selectedTagId
watch(selectedTagId, (newValue) => {
    if (!newValue) { return }
    if (!form.value.tagIds.includes(newValue)) {
        form.value.tagIds.push(newValue)
    }
    selectedTagId.value = ''
})

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
