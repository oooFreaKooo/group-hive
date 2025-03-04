<template>
    <AppPopover
        title="Task Details"
        overlay
        @close="$emit('close')"
    >
        <template #trigger="{ open }">
            <i
                title="Edit"
                class="bi bi-three-dots-vertical btn p-0 border-0 text-muted"
                @click="open"
            />
        </template>

        <div
            v-if="taskPending === 'pending' || profilePending === 'pending' || commentsPending === 'pending'"
            class="d-flex justify-content-center align-items-center py-3"
        >
            <div class="spinner-border text-primary opacity-75" />
        </div>
        <template v-else-if="task">
            <!-- Task Header & Actions -->
            <div class="d-flex justify-content-between align-items-start gap-2 mb-3">
                <div class="d-flex align-items-center gap-3">
                    <div>
                        <div
                            class="badge"
                            :class="formatTimeUntilDue().includes('-') ? 'text-bg-danger' : 'text-bg-success'"
                        >
                            {{ formatTimeUntilDue().includes('-') ? 'Overdue' : formatTimeUntilDue() }}
                        </div>
                    </div>
                    <div class="vr opacity-25" />
                    <div class="d-flex align-items-center gap-2">
                        <i class="bi bi-star-fill text-warning" />
                        <span class="fw-medium">{{ task.pointValue }} points</span>
                    </div>
                </div>
                <div class="d-flex gap-2">
                    <button
                        v-if="!isEditing"
                        class="btn btn-link text-secondary p-0 opacity-75 hover-opacity-100"
                        @click="startEditing"
                    >
                        <i class="bi bi-pencil-fill" />
                    </button>
                    <button
                        class="btn btn-link text-danger p-0 opacity-75 hover-opacity-100"
                        @click="showDeleteConfirm = true"
                    >
                        <i class="bi bi-trash-fill" />
                    </button>
                </div>
            </div>

            <!-- Task Meta Info -->
            <div class="d-flex flex-wrap gap-3 mb-3 p-2 bg-light rounded-3">
                <!-- Assigned To -->
                <div class="d-flex align-items-center gap-2">
                    <div v-if="isEditing">
                        <select
                            v-model="editForm.assignedToId"
                            class="form-select form-select-sm rounded-3"
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
                    <div
                        v-else
                        class="d-flex gap-2 align-items-center"
                    >
                        <div
                            v-if="assignedProfile"
                            class="member-avatar"
                            :title="assignedProfile.displayName || ''"
                        >
                            <img
                                v-if="assignedProfile.avatarUrl"
                                :src="assignedProfile.avatarUrl"
                                :alt="assignedProfile.displayName || ''"
                                class="rounded-circle border"
                                width="24"
                                height="24"
                            >
                            <div
                                v-else
                                class="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white border"
                                style="width: 24px; height: 24px; font-size: 0.75rem"
                            >
                                {{ assignedProfile.displayName?.[0] || '' }}
                            </div>
                        </div>
                        <span class="small">{{ assignedProfile?.displayName || 'Unassigned' }}</span>
                    </div>
                </div>

                <!-- Tags -->
                <div
                    v-if="task.tags.length || isEditing"
                    class="d-flex align-items-center gap-2"
                >
                    <div
                        v-if="isEditing"
                        class="d-flex gap-2 align-items-center"
                    >
                        <select
                            v-model="selectedTagId"
                            class="form-select form-select-sm rounded-3"
                            style="width: 120px"
                            :disabled="!availableTags.length"
                        >
                            <option value="">
                                {{ availableTags.length ? 'Add tag' : 'No tags' }}
                            </option>
                            <option
                                v-for="tag in availableTags"
                                :key="tag.id"
                                :value="tag.id"
                            >
                                {{ tag.title }}
                            </option>
                        </select>
                        <TagBadge
                            :tags="editForm.tagIds.map(id => ({
                                tagId: id,
                                tag: {
                                    id,
                                    title: getTagTitle(id),
                                    color: getTagColor(id),
                                },
                            }))"
                            :show-close-button="true"
                            @remove="removeTag"
                        />
                    </div>
                    <TagBadge
                        v-else
                        :tags="task.tags"
                    />
                </div>
            </div>

            <!-- Subtasks Section -->
            <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div class="d-flex align-items-center gap-2">
                        <i class="bi bi-list-check text-primary small" />
                        <span class="small fw-medium">Subtasks</span>
                    </div>
                    <div v-if="!isEditing && task.subtasks?.length">
                        <span class="badge text-bg-success-subtle text-success rounded-pill small">
                            {{ completedSubtasks }}/{{ task.subtasks.length }}
                        </span>
                    </div>
                </div>

                <div v-if="isEditing">
                    <div class="mb-2">
                        <div
                            v-for="(subtask, index) in editForm.subtasks"
                            :key="index"
                            class="d-flex gap-2 align-items-center mb-2"
                        >
                            <input
                                v-model="subtask.description"
                                type="text"
                                class="form-control form-control-sm rounded-3"
                                placeholder="Subtask description"
                            >
                            <div
                                class="input-group input-group-sm"
                                style="width: 100px;"
                            >
                                <span class="input-group-text"><i class="bi bi-star-fill text-warning small" /></span>
                                <input
                                    v-model.number="subtask.pointValue"
                                    type="number"
                                    class="form-control"
                                    min="0"
                                    max="100"
                                >
                            </div>
                            <button
                                type="button"
                                class="btn btn-sm btn-outline-danger rounded-circle p-1"
                                @click="removeSubtask(index)"
                            >
                                <i class="bi bi-x-lg small" />
                            </button>
                        </div>
                    </div>
                    <button
                        type="button"
                        class="btn btn-outline-primary btn-sm rounded-3"
                        @click="addSubtask"
                    >
                        <i class="bi bi-plus-lg me-1" /> Add
                    </button>
                </div>
                <div v-else>
                    <div
                        v-if="task.subtasks?.length"
                        class="list-group list-group-flush small"
                    >
                        <div
                            v-for="subtask in task.subtasks"
                            :key="subtask.id"
                            class="list-group-item d-flex justify-content-between align-items-center px-0 py-1"
                        >
                            <div class="d-flex align-items-center gap-2">
                                <div class="form-check mb-0">
                                    <input
                                        :id="subtask.id"
                                        v-model="subtask.completed"
                                        type="checkbox"
                                        class="form-check-input"
                                        @change="toggleSubtask(subtask)"
                                    >
                                    <label
                                        :for="subtask.id"
                                        class="form-check-label"
                                        :class="{ 'text-decoration-line-through': subtask.completed }"
                                    >
                                        {{ subtask.description }}
                                    </label>
                                </div>
                            </div>
                            <span class="badge text-bg-warning-subtle text-warning">

                                {{ subtask.pointValue }}
                                <i class="bi bi-star-fill text-warning small ms-2" />
                            </span>
                        </div>
                    </div>
                    <div
                        v-else
                        class="text-center text-muted py-2 bg-light rounded-3"
                    >
                        <small>No subtasks</small>
                    </div>
                </div>
            </div>

            <!-- Save/Cancel Buttons when Editing -->
            <div
                v-if="isEditing"
                class="alert alert-primary rounded-3 py-2 px-3 mb-3 d-flex gap-2 justify-content-end"
            >
                <button
                    type="button"
                    class="btn btn-sm btn-light rounded-3"
                    @click="cancelEditing"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    class="btn btn-sm btn-primary rounded-3"
                    :disabled="isSubmitting"
                    @click="saveChanges"
                >
                    <span
                        v-if="isSubmitting"
                        class="d-flex align-items-center gap-2"
                    >
                        <div class="spinner-border spinner-border-sm" />
                        Saving
                    </span>
                    <span v-else>Save</span>
                </button>
            </div>

            <!-- Comments Section -->
            <div v-if="!isEditing">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div class="d-flex align-items-center gap-2">
                        <i class="bi bi-chat-square-text text-primary small" />
                        <span class="small fw-medium">Comments</span>
                    </div>
                    <span class="badge text-bg-secondary-subtle text-secondary rounded-pill">{{ comments?.length || 0 }}</span>
                </div>

                <div class="comments-list mb-2 px-1">
                    <div
                        v-if="comments?.length"
                        class="comments-wrapper"
                    >
                        <div
                            v-for="comment in comments"
                            :key="comment.id"
                            class="comment-item mb-2 pb-2 border-bottom"
                        >
                            <div class="d-flex gap-2">
                                <div
                                    class="member-avatar flex-shrink-0"
                                    :title="comment.author.displayName || ''"
                                >
                                    <img
                                        v-if="comment.author.avatarUrl"
                                        :src="comment.author.avatarUrl"
                                        :alt="comment.author.displayName || ''"
                                        class="rounded-circle border"
                                        width="24"
                                        height="24"
                                    >
                                    <div
                                        v-else
                                        class="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white border"
                                        style="width: 24px; height: 24px; font-size: 0.75rem"
                                    >
                                        {{ comment.author.displayName?.[0] || '' }}
                                    </div>
                                </div>
                                <div class="flex-grow-1">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="small fw-medium">{{ comment.author.displayName }}</span>
                                        <span
                                            class="text-muted"
                                            style="font-size: 0.75rem"
                                        >{{ formatDate(comment.createdAt) }}</span>
                                    </div>
                                    <p class="mb-0 small">
                                        {{ comment.content }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        v-else
                        class="text-center text-muted py-2 bg-light rounded-3"
                    >
                        <small>No comments yet</small>
                    </div>
                </div>

                <form
                    class="mt-2"
                    @submit.prevent="addComment"
                >
                    <div class="input-group input-group-sm">
                        <input
                            v-model="newComment"
                            type="text"
                            class="form-control rounded-start-3"
                            placeholder="Write a comment..."
                            required
                        >
                        <button
                            type="submit"
                            class="btn btn-primary rounded-end-3"
                            :disabled="isSubmitting"
                        >
                            <i
                                v-if="isSubmitting"
                                class="spinner-border spinner-border-sm"
                            />
                            <i
                                v-else
                                class="bi bi-send-fill"
                            />
                        </button>
                    </div>
                </form>
            </div>
        </template>
    </AppPopover>

    <!-- Delete Confirmation -->
    <ConfirmationPopover
        v-model="showDeleteConfirm"
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        :loading="isDeleting"
        loading-text="Deleting..."
        confirm-text="Delete"
        @confirm="deleteTask"
    />
</template>

<script setup lang="ts">
import type { Task, Comment, Profile } from '@prisma/client'

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

interface CommentWithAuthor extends Comment {
    author: Profile
}

interface Tag {
    id: string
    title: string
    color: string
}

interface Member {
    id: string
    displayName: string
}

const props = defineProps({
    taskId: {
        type: String,
        required: true,
    },
    groupId: {
        type: String,
        required: true,
    },
})

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'deleted'): void
    (e: 'edited'): void
}>()

const newComment = ref('')
const isSubmitting = ref(false)
const showDeleteConfirm = ref(false)
const isDeleting = ref(false)
const isEditing = ref(false)
const editForm = ref({
    pointValue: 0,
    assignedToId: '',
    tagIds: [] as string[],
    subtasks: [] as { description: string, pointValue: number }[],
})
const selectedTagId = ref('')

// Fetch task details
const { data: task, status: taskPending, refresh: refreshTask } = await useFetch<TaskWithRelations>(`/api/group/${props.groupId}/task/${props.taskId}`)

// Fetch assigned profile if there is one
const { data: assignedProfile, status: profilePending } = task.value?.assignedToId
    ? await useFetch<Profile>(`/api/profile/${task.value.assignedToId}`)
    : { data: ref(null), status: ref(false) }

// Fetch comments
const { data: comments, refresh: refreshComments, status: commentsPending } = await useFetch<CommentWithAuthor[]>(`/api/group/${props.groupId}/task/${props.taskId}/comments`)

// Fetch members
const { data: members } = await useLazyFetch<Member[]>(`/api/group/${props.groupId}/members`, {
    default: () => [],
})

// Fetch available tags
const { data: availableTags } = await useLazyFetch<Tag[]>(`/api/group/${props.groupId}/tags`, {
    default: () => [],
})

const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

const formatTimeUntilDue = () => {
    if (!task.value?.dueDate) { return 'No due date' }
    const dueDate = new Date(task.value.dueDate)
    const now = new Date()
    const diffTime = dueDate.getTime() - now.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60))

    if (diffDays > 0) {
        return `${diffDays}d ${diffHours}h ${diffMinutes}m`
    } else if (diffHours > 0) {
        return `${diffHours}h ${diffMinutes}m`
    } else {
        return `${diffMinutes}m`
    }
}

const addComment = async () => {
    try {
        isSubmitting.value = true
        await $fetch(`/api/group/${props.groupId}/task/${props.taskId}/comments`, {
            method: 'POST',
            body: {
                content: newComment.value,
            },
        })
        newComment.value = ''
        refreshComments()
    } catch (error) {
        console.error('Failed to add comment:', error)
    } finally {
        isSubmitting.value = false
    }
}

const deleteTask = async () => {
    try {
        isDeleting.value = true
        await $fetch(`/api/group/${props.groupId}/task/${props.taskId}`, {
            method: 'DELETE',
        })
        showDeleteConfirm.value = false
        emit('deleted')
        emit('close')
    } catch (error) {
        console.error('Failed to delete task:', error)
    } finally {
        isDeleting.value = false
    }
}

const startEditing = () => {
    if (!task.value) { return }

    isEditing.value = true
    editForm.value = {
        pointValue: task.value.pointValue || 0,
        assignedToId: task.value.assignedToId || '',
        tagIds: task.value.tags.map(tag => tag.tagId) || [],
        subtasks: task.value.subtasks?.map(subtask => ({
            description: subtask.description || '',
            pointValue: subtask.pointValue,
        })) || [],
    }
    selectedTagId.value = task.value.tags.length ? task.value.tags[0].tagId : ''
}

const cancelEditing = () => {
    isEditing.value = false
}

const saveChanges = async () => {
    try {
        isSubmitting.value = true
        await $fetch(`/api/group/${props.groupId}/task/${props.taskId}`, {
            method: 'PUT',
            body: {
                pointValue: editForm.value.pointValue,
                assignedToId: editForm.value.assignedToId,
                tagIds: editForm.value.tagIds,
                subtasks: editForm.value.subtasks,
            },
        })
        isEditing.value = false
        refreshComments()
        refreshTask()
        emit('edited')
    } catch (error) {
        console.error('Failed to save changes:', error)
    } finally {
        isSubmitting.value = false
    }
}

const removeTag = (tagId: string) => {
    editForm.value.tagIds = editForm.value.tagIds.filter(id => id !== tagId)
}

const getTagColor = (tagId: string) => {
    const tag = availableTags.value?.find(tag => tag.id === tagId)
    return tag ? tag.color : '#ccc'
}

const getTagTitle = (tagId: string) => {
    const tag = availableTags.value?.find(tag => tag.id === tagId)
    return tag ? tag.title : 'Untitled'
}

const addSubtask = () => {
    editForm.value.subtasks.push({ description: '', pointValue: 1 })
}

const removeSubtask = (index: number) => {
    editForm.value.subtasks.splice(index, 1)
}

const toggleSubtask = async (subtask: Task) => {
    try {
        await $fetch(`/api/group/${props.groupId}/task/${subtask.id}`, {
            method: 'PUT',
            body: {
                completed: !subtask.completed,
            },
        })
        refreshTask()
    } catch (error) {
        console.error('Failed to toggle subtask:', error)
    }
}

const completedSubtasks = computed(() => {
    return task.value?.subtasks?.filter(subtask => subtask.completed).length || 0
})

// Watch for tag selection
watch(selectedTagId, (newValue) => {
    if (!newValue) { return }
    if (!editForm.value.tagIds.includes(newValue)) {
        editForm.value.tagIds.push(newValue)
    }
    selectedTagId.value = ''
})
</script>

<style scoped lang="scss">
.member-avatar {
    img, div {
        object-fit: cover;
    }
}

.comments-list {
    max-height: 200px;
    overflow-y: auto;
    scrollbar-width: thin;
    &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 2px;
    }
    &::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 2px;
        &:hover {
            background: #bbb;
        }
    }
}

.hover-opacity-100 {
    transition: opacity 0.2s ease;
    &:hover {
        opacity: 1 !important;
    }
}
</style>
