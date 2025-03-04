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
                    <EditTaskPopover
                        v-if="task"
                        :task="task"
                        :group-id="groupId"
                        @edited="handleEdited"
                        @close="handleEditClose"
                    />
                    <button
                        class="btn btn-link text-danger p-0"
                        @click="showDeleteConfirm = true"
                    >
                        <i class="bi bi-trash-fill opacity-75 hover-opacity-100" />
                    </button>
                </div>
            </div>

            <!-- Task Meta Info -->
            <div class="d-flex flex-wrap gap-3 mb-3 p-2 bg-light rounded-3">
                <!-- Assigned To -->
                <div class="d-flex align-items-center gap-2">
                    <div
                        v-if="assignedProfile"
                        class="member-avatar"
                        :title="assignedProfile.displayName || ''"
                    >
                        <NuxtImg
                            v-if="assignedProfile.avatarUrl"
                            :src="assignedProfile.avatarUrl"
                            :alt="assignedProfile.displayName || ''"
                            class="rounded-circle border"
                            width="24"
                            height="24"
                        />
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

                <!-- Tags -->
                <div
                    v-if="task.tags.length"
                    class="d-flex align-items-center gap-2"
                >
                    <TagBadge
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
                    <div v-if="task.subtasks?.length">
                        <span class="badge text-bg-success-subtle text-success rounded-pill small">
                            {{ completedSubtasks }}/{{ task.subtasks.length }}
                        </span>
                    </div>
                </div>

                <div>
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

            <!-- Comments Section -->
            <div>
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

// Fetch task details
const { data: task, status: taskPending, refresh: refreshTask } = await useFetch<TaskWithRelations>(`/api/group/${props.groupId}/task/${props.taskId}`)

// Fetch assigned profile if there is one
const { data: assignedProfile, status: profilePending } = task.value?.assignedToId
    ? await useFetch<Profile>(`/api/profile/${task.value.assignedToId}`)
    : { data: ref(null), status: ref(false) }

// Fetch comments
const { data: comments, refresh: refreshComments, status: commentsPending } = await useFetch<CommentWithAuthor[]>(`/api/group/${props.groupId}/task/${props.taskId}/comments`)

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

const handleEdited = () => {
    refreshTask()
    emit('edited')
}

const handleEditClose = () => {
    // Any cleanup if needed
}
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
