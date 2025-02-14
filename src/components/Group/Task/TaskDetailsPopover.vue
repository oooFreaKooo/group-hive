<template>
    <AppPopover
        title="Task Details"
        @close="$emit('close')"
    >
        <div
            v-if="isLoading"
            class="text-center py-4"
        >
            <div class="spinner-border text-primary" />
        </div>

        <template v-else-if="task">
            <p class="mb-3 text-muted">
                {{ task.description }}
            </p>

            <div class="d-flex flex-wrap gap-1 mb-3">
                <span
                    v-for="taskTag in task.tags"
                    :key="taskTag.tagId"
                    class="badge"
                    :style="{ backgroundColor: taskTag.tag.color }"
                >
                    {{ taskTag.tag.title }}
                </span>
            </div>

            <div class="mb-3">
                <div class="d-flex gap-2 align-items-center mb-2">
                    <div
                        v-if="assignedProfile"
                        class="member-avatar"
                        :title="assignedProfile.displayName || ''"
                    >
                        <img
                            v-if="assignedProfile.avatarUrl"
                            :src="assignedProfile.avatarUrl"
                            :alt="assignedProfile.displayName || ''"
                            class="rounded-circle"
                            width="25"
                            height="25"
                        >
                        <div
                            v-else
                            class="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
                            style="width: 25px; height: 25px;"
                        >
                            {{ assignedProfile.displayName?.[0] || '' }}
                        </div>
                    </div>
                    <span class="text-muted">{{ assignedProfile?.displayName || 'Unassigned' }}</span>
                </div>
                <div class="text-muted small">
                    <i class="bi bi-star-fill me-1 text-warning" />
                    {{ task.pointValue }} points
                </div>
            </div>

            <!-- Comments Section -->
            <div class="comments-section">
                <h5 class="mb-3">
                    Comments
                </h5>
                <div
                    v-if="comments?.length"
                    class="comments-list mb-3"
                >
                    <div
                        v-for="comment in comments"
                        :key="comment.id"
                        class="comment-item mb-2"
                    >
                        <div class="d-flex gap-2 align-items-start">
                            <div
                                class="member-avatar"
                                :title="comment.author.displayName || ''"
                            >
                                <img
                                    v-if="comment.author.avatarUrl"
                                    :src="comment.author.avatarUrl"
                                    :alt="comment.author.displayName || ''"
                                    class="rounded-circle"
                                    width="20"
                                    height="20"
                                >
                                <div
                                    v-else
                                    class="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
                                    style="width: 20px; height: 20px; font-size: 0.75rem"
                                >
                                    {{ comment.author.displayName?.[0] || '' }}
                                </div>
                            </div>
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between">
                                    <span class="fw-bold small">{{ comment.author.displayName }}</span>
                                    <span class="text-muted small">{{ formatDate(comment.createdAt) }}</span>
                                </div>
                                <p class="mb-0 small">
                                    {{ comment.content }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <form @submit.prevent="addComment">
                    <div class="input-group">
                        <input
                            v-model="newComment"
                            type="text"
                            class="form-control"
                            placeholder="Add a comment..."
                            required
                        >
                        <button
                            type="submit"
                            class="btn btn-primary"
                            :disabled="isSubmitting"
                        >
                            <i
                                v-if="isSubmitting"
                                class="spinner-border spinner-border-sm"
                            />
                            <i
                                v-else
                                class="bi bi-send"
                            />
                        </button>
                    </div>
                </form>
            </div>
        </template>
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

defineEmits<{
    (e: 'close'): void
}>()

const isLoading = ref(true)
const newComment = ref('')
const isSubmitting = ref(false)

// Fetch task details
const { data: task } = await useFetch<TaskWithRelations>(`/api/group/${props.groupId}/task/${props.taskId}`)

// Fetch assigned profile if there is one
const { data: assignedProfile } = task.value?.assignedToId
    ? await useFetch<Profile>(`/api/profiles/${task.value.assignedToId}`)
    : { data: ref(null) }

// Fetch comments
const { data: comments, refresh: refreshComments } = await useFetch<CommentWithAuthor[]>(`/api/group/${props.groupId}/task/${props.taskId}/comments`)

const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
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

// Set loading state after initial data fetch
watch([
    task, assignedProfile, comments,
], ([newTask]) => {
    if (newTask) {
        isLoading.value = false
    }
})
</script>

<style scoped lang="scss">
.member-avatar {
    img {
        object-fit: cover;
    }
}

.badge {
    padding: 0.35rem 0.65rem;
    font-size: 0.75rem;
    font-weight: normal;
    color: white;
}

.comments-list {
    max-height: 300px;
    overflow-y: auto;
}
</style>
