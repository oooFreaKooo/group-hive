<template>
    <div>
        <button
            class="btn btn-light btn-sm rounded-pill"
            @click="taskPopover.open()"
        >
            <i class="bi bi-plus-lg me-2" />
            Add Task
        </button>

        <AppPopover
            v-if="taskPopover.isOpen.value"
            title="Create Task"
            overlay
            @close="taskPopover.close()"
        >
            <form
                class="needs-validation"
                @submit.prevent="handleSubmit"
            >
                <!-- Description -->
                <div class="mb-4">
                    <label
                        for="taskDescription"
                        class="form-label d-flex align-items-center gap-2 mb-2"
                    >
                        <i class="bi bi-card-text text-primary" />
                        <span class="fw-medium">Description</span>
                    </label>
                    <textarea
                        id="taskDescription"
                        v-model="form.description"
                        class="form-control form-control-lg rounded-4 border-2"
                        rows="3"
                        placeholder="What needs to be done?"
                        required
                    />
                </div>

                <div class="row g-3 mb-4">
                    <!-- Points -->
                    <div class="col-md-6">
                        <label
                            for="taskPoints"
                            class="form-label d-flex align-items-center gap-2 mb-2"
                        >
                            <i class="bi bi-star-fill text-warning" />
                            <span class="fw-medium">Points</span>
                        </label>
                        <input
                            id="taskPoints"
                            v-model.number="form.pointValue"
                            type="number"
                            class="form-control rounded-4 border-2"
                            min="0"
                            max="100"
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
                            class="form-select rounded-4 border-2"
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
                            class="form-control rounded-4 border-2"
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
                            class="form-control rounded-4 border-2"
                            :disabled="!form.dueDate"
                        >
                    </div>
                </div>

                <!-- Tags Section -->
                <div class="mb-4">
                    <label class="form-label d-flex align-items-center gap-2 mb-3">
                        <i class="bi bi-tags-fill text-primary" />
                        <span class="fw-medium">Tags</span>
                    </label>

                    <!-- Selected Tags -->
                    <div class="mb-3 d-flex gap-2 flex-wrap">
                        <span
                            v-for="tagId in form.tagIds"
                            :key="tagId"
                            class="badge rounded-pill d-flex align-items-center px-3 py-2"
                            :style="{ backgroundColor: getTagColor(tagId) }"
                        >
                            {{ getTagTitle(tagId) }}
                            <button
                                type="button"
                                class="btn text-light p-0 ms-2 opacity-75 hover-opacity-100"
                                @click="removeTag(tagId)"
                            >
                                <i class="bi bi-x-lg" />
                            </button>
                        </span>
                    </div>

                    <!-- Tag Selection -->
                    <div
                        v-if="!showCreateTag"
                        class="d-flex gap-2 align-items-start"
                    >
                        <select
                            v-model="selectedTagId"
                            class="form-select rounded-4 border-2"
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
                            class="btn btn-outline-primary rounded-4 px-3"
                            @click="showCreateTag = true"
                        >
                            <i class="bi bi-pencil-fill" />
                        </button>
                    </div>

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
                <div class="d-flex justify-content-end gap-3 mt-4">
                    <button
                        type="button"
                        class="btn btn-outline-secondary rounded-4 px-4 py-2"
                        @click="taskPopover.close()"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="btn btn-primary rounded-4 px-4 py-2"
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
    </div>
</template>

<script setup lang="ts">
import type { Tag } from '@prisma/client'

const props = defineProps<{
    groupId: string
}>()

const taskPopover = useTaskPopover()

const error = ref('')
const isSubmitting = ref(false)

// Format initial date if provided
const formattedInitialDate = computed(() => {
    if (!taskPopover.selectedDate.value) { return '' }
    return taskPopover.selectedDate.value.toISOString().split('T')[0]
})

const form = ref({
    description: '',
    pointValue: 1,
    assignedToId: '',
    dueDate: formattedInitialDate.value,
    dueTime: '',
    tagIds: [] as string[],
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
        }

        taskPopover.close()
        navigateTo(`/dashboard/${props.groupId}/tasks`)
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
</script>

<style scoped lang="scss">
.hover-opacity-100:hover {
    opacity: 1 !important;
}
</style>
