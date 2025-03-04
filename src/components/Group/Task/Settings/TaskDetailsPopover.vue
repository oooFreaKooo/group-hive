<template>
    <AppPopover
        title="Task Details"
        overlay
        @close="$emit('close')"
    >
        <div
            v-if="taskPending === 'pending' || profilePending === 'pending' || commentsPending === 'pending'"
            class="d-flex justify-content-center align-items-center py-5"
        >
            <div class="spinner-border text-primary opacity-75" />
        </div>
        <template v-else-if="task">
            <!-- Task Header Section -->
            <div class="mb-4">
                <div class="d-flex justify-content-between align-items-start gap-3">
                    <div class="flex-grow-1">
                        <div class="text-muted small mb-1 fw-medium">
                            Due in:
                        </div>
                        <div
                            class="mb-3 fs-5 fw-semibold"
                            :class="formatTimeUntilDue().includes('-') ? 'text-danger' : 'text-success'"
                        >
                            {{ formatTimeUntilDue().includes('-') ? 'Overdue' : formatTimeUntilDue() }}
                        </div>
                        <div class="text-muted small mb-2 fw-medium">
                            Description
                        </div>
                        <div
                            v-if="isEditing"
                            class="mb-3"
                        >
                            <textarea
                                v-model="editForm.description"
                                class="form-control rounded-4 border-2"
                                rows="3"
                                placeholder="Task description"
                                required
                            />
                        </div>
                        <p
                            v-else
                            class="text-dark fs-6 mb-3 lh-base"
                        >
                            {{ task.description }}
                        </p>
                        <div
                            v-if="task.tags.length || isEditing"
                            class="mb-3"
                        >
                            <div class="text-muted small mb-2 fw-medium">
                                Tags
                            </div>
                            <div
                                v-if="isEditing"
                                class="mb-2"
                            >
                                <select
                                    v-model="selectedTagId"
                                    class="form-select rounded-4 border-2 mb-2"
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
                            <div
                                v-else
                                class="d-flex flex-wrap gap-2"
                            >
                                <TagBadge
                                    :tags="task.tags"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="d-flex gap-2">
                        <button
                            v-if="!isEditing"
                            class="btn btn-link text-secondary p-0 opacity-75 hover-opacity-100"
                            @click="startEditing"
                        >
                            <i class="bi bi-pencil-fill fs-5" />
                        </button>
                        <button
                            class="btn btn-link text-danger p-0 opacity-75 hover-opacity-100"
                            @click="showDeleteConfirm = true"
                        >
                            <i class="bi bi-trash-fill fs-5" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Task Meta Info -->
            <div class="p-4 bg-light rounded-4 border mb-4">
                <div class="row g-4">
                    <div class="col-12">
                        <div class="text-muted small mb-2 fw-medium">
                            Assigned To
                        </div>
                        <div v-if="isEditing">
                            <select
                                v-model="editForm.assignedToId"
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
                        <div
                            v-else
                            class="d-flex gap-2 align-items-center"
                        >
                            <div
                                v-if="assignedProfile"
                                class="member-avatar flex-shrink-0"
                                :title="assignedProfile.displayName || ''"
                            >
                                <img
                                    v-if="assignedProfile.avatarUrl"
                                    :src="assignedProfile.avatarUrl"
                                    :alt="assignedProfile.displayName || ''"
                                    class="rounded-circle border border-2 border-dark"
                                    width="32"
                                    height="32"
                                >
                                <div
                                    v-else
                                    class="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white border border-2 border-dark"
                                    style="width: 32px; height: 32px;"
                                >
                                    {{ assignedProfile.displayName?.[0] || '' }}
                                </div>
                            </div>
                            <span class="text-dark fw-medium">{{ assignedProfile?.displayName || 'Unassigned' }}</span>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="text-muted small mb-2 fw-medium">
                            Point Value
                        </div>
                        <div
                            v-if="isEditing"
                            class="mb-2"
                        >
                            <input
                                v-model.number="editForm.pointValue"
                                type="number"
                                class="form-control rounded-4 border-2"
                                min="0"
                                max="100"
                                required
                            >
                        </div>
                        <div
                            v-else
                            class="d-flex align-items-center"
                        >
                            <i class="bi bi-star-fill text-warning me-2 fs-5" />
                            <span class="fw-semibold fs-5">{{ task.pointValue }} points</span>
                        </div>
                    </div>
                </div>
            </div>

            <div
                v-if="isEditing"
                class="alert alert-primary rounded-4 border-0 mb-4"
            >
                <div class="d-flex flex-column gap-3">
                    <div class="flex-grow-1">
                        <h6 class="alert-heading mb-1 d-flex align-items-center gap-2">
                            <i class="bi bi-pencil-square" />
                            Editing Task
                        </h6>
                        <p class="mb-0 small">
                            Make your changes and click Save to update the task.
                        </p>
                    </div>
                    <div class="d-flex gap-2">
                        <button
                            type="button"
                            class="btn btn-light rounded-4 px-4"
                            @click="cancelEditing"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            class="btn btn-primary rounded-4 px-4"
                            :disabled="isSubmitting"
                            @click="saveChanges"
                        >
                            <span
                                v-if="isSubmitting"
                                class="d-flex align-items-center gap-2"
                            >
                                <div class="spinner-border spinner-border-sm" />
                                Saving...
                            </span>
                            <span v-else>Save Changes</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Comments Section -->
            <div
                v-if="!isEditing"
                class="comments-section"
            >
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="fw-bold mb-0 d-flex align-items-center gap-2">
                        <i class="bi bi-chat-square-text text-primary" />
                        Comments
                    </h6>
                    <span class="badge bg-secondary-subtle text-secondary rounded-pill px-3">{{ comments?.length || 0 }} comments</span>
                </div>
                <div
                    v-if="comments?.length"
                    class="comments-list mb-3 px-2"
                >
                    <div
                        v-for="comment in comments"
                        :key="comment.id"
                        class="comment-item mb-3 pb-3 border-bottom"
                    >
                        <div class="d-flex gap-3">
                            <div
                                class="member-avatar flex-shrink-0"
                                :title="comment.author.displayName || ''"
                            >
                                <img
                                    v-if="comment.author.avatarUrl"
                                    :src="comment.author.avatarUrl"
                                    :alt="comment.author.displayName || ''"
                                    class="rounded-circle border border-2 border-dark"
                                    width="32"
                                    height="32"
                                >
                                <div
                                    v-else
                                    class="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white border border-2 border-dark"
                                    style="width: 32px; height: 32px; font-size: 0.875rem"
                                >
                                    {{ comment.author.displayName?.[0] || '' }}
                                </div>
                            </div>
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <span class="fw-medium">{{ comment.author.displayName }}</span>
                                    <span class="text-muted small">{{ formatDate(comment.createdAt) }}</span>
                                </div>
                                <p class="mb-0 text-dark">
                                    {{ comment.content }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    v-else
                    class="text-center text-muted py-4 mb-3 bg-light rounded-4"
                >
                    <i class="bi bi-chat-square-text fs-4 mb-2 d-block opacity-75" />
                    <p class="mb-0 small">
                        No comments yet. Be the first to comment!
                    </p>
                </div>

                <form
                    class="mt-4"
                    @submit.prevent="addComment"
                >
                    <div class="input-group">
                        <input
                            v-model="newComment"
                            type="text"
                            class="form-control rounded-start-4 border-2"
                            placeholder="Write a comment..."
                            required
                        >
                        <button
                            type="submit"
                            class="btn btn-primary rounded-end-4 px-4"
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

    <!-- Delete Confirmation Popover -->
    <AppPopover
        v-if="showDeleteConfirm"
        title="Delete Task"
        overlay
        @close="showDeleteConfirm = false"
    >
        <div class="alert alert-danger rounded-4 border-0 mb-4">
            <h4 class="alert-heading h6 mb-2 d-flex align-items-center gap-2">
                <i class="bi bi-exclamation-triangle-fill text-danger" />
                Warning: This action cannot be undone
            </h4>
            <p class="small mb-0">
                Are you sure you want to delete this task? All associated comments and data will be permanently removed.
            </p>
        </div>

        <div class="d-flex gap-3 justify-content-end">
            <button
                type="button"
                class="btn btn-light rounded-4 px-4"
                @click="showDeleteConfirm = false"
            >
                Cancel
            </button>
            <button
                type="button"
                class="btn btn-danger rounded-4 px-4"
                :disabled="isDeleting"
                @click="deleteTask"
            >
                <span
                    v-if="isDeleting"
                    class="d-flex align-items-center gap-2"
                >
                    <div class="spinner-border spinner-border-sm" />
                    Deleting...
                </span>
                <span v-else>Delete Task</span>
            </button>
        </div>
    </AppPopover>
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
    description: '',
    pointValue: 0,
    assignedToId: '',
    tagIds: [] as string[],
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
        emit('deleted')
        emit('close')
    } catch (error) {
        console.error('Failed to delete task:', error)
    } finally {
        isDeleting.value = false
        showDeleteConfirm.value = false
    }
}

const startEditing = () => {
    if (!task.value) { return }

    isEditing.value = true
    editForm.value = {
        description: task.value.description || '',
        pointValue: task.value.pointValue || 0,
        assignedToId: task.value.assignedToId || '',
        tagIds: task.value.tags.map(tag => tag.tagId) || [],
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
                description: editForm.value.description,
                pointValue: editForm.value.pointValue,
                assignedToId: editForm.value.assignedToId,
                tagIds: editForm.value.tagIds,
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
    max-height: 300px;
    overflow-y: auto;
    scrollbar-width: thin;
    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
    }
    &::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 3px;
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
