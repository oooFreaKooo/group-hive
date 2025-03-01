<template>
    <div>
        <button
            class="btn btn-light btn-sm rounded-pill"
            @click="isOpen = true"
        >
            <i class="bi bi-plus-lg me-2" />
            Add Task
        </button>

        <AppPopover
            v-if="isOpen"
            title="Create Task"
            overlay
            @close="isOpen = false"
        >
            <form
                class="needs-validation"
                @submit.prevent="handleSubmit"
            >
                <!-- Description -->
                <div class="mb-4">
                    <label
                        for="taskDescription"
                        class="form-label fw-medium"
                    >Description</label>
                    <textarea
                        id="taskDescription"
                        v-model="form.description"
                        class="form-control form-control-lg shadow-sm"
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
                            class="form-label fw-medium d-flex align-items-center gap-2"
                        >
                            <i class="bi bi-star-fill text-warning" />
                            Points
                        </label>
                        <input
                            id="taskPoints"
                            v-model.number="form.pointValue"
                            type="number"
                            class="form-control shadow-sm"
                            min="0"
                            max="100"
                            required
                        >
                    </div>

                    <!-- Assignee -->
                    <div class="col-md-6">
                        <label class="form-label fw-medium d-flex align-items-center gap-2">
                            <i class="bi bi-person-fill text-dark" />
                            Assignee
                        </label>
                        <select
                            v-model="form.assignedToId"
                            class="form-select shadow-sm"
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
                        <label class="form-label fw-medium d-flex align-items-center gap-2">
                            <i class="bi bi-calendar-event text-dark" />
                            Due Date
                        </label>
                        <input
                            v-model="form.dueDate"
                            type="date"
                            class="form-control shadow-sm"
                            :min="minDate"
                            :max="maxDate"
                        >
                    </div>

                    <!-- Due Time -->
                    <div class="col-md-6">
                        <label class="form-label fw-medium d-flex align-items-center gap-2">
                            <i class="bi bi-clock text-dark" />
                            Due Time
                        </label>
                        <input
                            v-model="form.dueTime"
                            type="time"
                            class="form-control shadow-sm"
                            :disabled="!form.dueDate"
                        >
                    </div>
                </div>

                <!-- Tags Section -->
                <div class="mb-4">
                    <label class="form-label fw-medium d-flex align-items-center gap-2">
                        <i class="bi bi-tags-fill text-primary" />
                        Tags
                    </label>

                    <!-- Selected Tags -->
                    <div class="mb-3 d-flex gap-2 flex-wrap">
                        <span
                            v-for="tagId in form.tagIds"
                            :key="tagId"
                            class="badge d-flex align-items-center"
                            :style="{ backgroundColor: getTagColor(tagId) }"
                        >
                            {{ getTagTitle(tagId) }}
                            <button
                                type="button"
                                class="btn text-light p-0 ms-2 opacity-75 hover-opacity-100"
                                @click="removeTag(tagId)"
                            >
                                <i class="bi bi-x" />
                            </button>
                        </span>
                    </div>

                    <!-- Tag Selection -->
                    <div class="d-flex gap-2 align-items-start">
                        <select
                            v-model="selectedTagId"
                            class="form-select shadow-sm"
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
                            class="btn btn-outline-secondary"
                            @click="showCreateTag = true"
                        >
                            <i class="bi bi-plus-lg" />
                        </button>
                    </div>

                    <!-- Create Tag Form -->
                    <CreateTagForm
                        v-if="showCreateTag"
                        :group-id="groupId"
                        @tag-created="handleTagCreated"
                        @cancel="showCreateTag = false"
                    />
                </div>

                <!-- Error Alert -->
                <div
                    v-if="error"
                    class="alert alert-danger"
                    role="alert"
                >
                    {{ error }}
                </div>

                <!-- Action Buttons -->
                <div class="d-flex justify-content-end gap-2 mt-4">
                    <button
                        type="button"
                        class="btn btn-outline-secondary px-4"
                        @click="isOpen = false"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="btn btn-primary px-4"
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

const emit = defineEmits<{
    (e: 'task-created'): void
}>()

const isOpen = ref(false)
const error = ref('')
const isSubmitting = ref(false)

const form = ref({
    description: '',
    pointValue: 1,
    assignedToId: '',
    dueDate: '',
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
                dueDateTime.setHours(23, 59, 59)
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

        emit('task-created')
        isOpen.value = false
        // Reset form
        form.value = {
            description: '',
            pointValue: 1,
            assignedToId: '',
            dueDate: '',
            dueTime: '',
            tagIds: [],
        }
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
