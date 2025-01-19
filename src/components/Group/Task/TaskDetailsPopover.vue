<template>
    <AppPopover
        title="Task Details"
        @close="$emit('close')"
    >
        <p class="mb-3 text-muted">
            {{ task.description }}
        </p>

        <div class="d-flex flex-wrap gap-1 mb-3">
            <span
                v-for="tagItem in task.tags"
                :key="tagItem.tagId"
                class="badge"
                :style="{ backgroundColor: tagItem.tag.color }"
            >
                {{ tagItem.tag.title }}
            </span>
        </div>

        <div class="mb-3">
            <div class="d-flex gap-2 align-items-center mb-2">
                <div
                    v-if="task.assignedTo"
                    class="member-avatar"
                    :title="task.assignedTo.profile.displayName || ''"
                >
                    <img
                        v-if="task.assignedTo.profile.avatarUrl"
                        :src="task.assignedTo.profile.avatarUrl"
                        :alt="task.assignedTo.profile.displayName || ''"
                        class="rounded-circle"
                        width="25"
                        height="25"
                    >
                    <div
                        v-else
                        class="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
                        style="width: 25px; height: 25px;"
                    >
                        {{ task.assignedTo.profile.displayName?.[0] || '' }}
                    </div>
                </div>
                <span class="text-muted">{{ task.assignedTo?.profile.displayName || 'Unassigned' }}</span>
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
                v-if="task.comments?.length"
                class="comments-list mb-3"
            >
                <div
                    v-for="comment in task.comments"
                    :key="comment.id"
                    class="comment-item mb-2"
                >
                    <div class="d-flex gap-2 align-items-start">
                        <div
                            class="member-avatar"
                            :title="comment.author.profile.displayName || ''"
                        >
                            <img
                                v-if="comment.author.profile.avatarUrl"
                                :src="comment.author.profile.avatarUrl"
                                :alt="comment.author.profile.displayName || ''"
                                class="rounded-circle"
                                width="20"
                                height="20"
                            >
                            <div
                                v-else
                                class="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
                                style="width: 20px; height: 20px; font-size: 0.75rem"
                            >
                                {{ comment.author.profile.displayName?.[0] || '' }}
                            </div>
                        </div>
                        <div class="flex-grow-1">
                            <div class="d-flex justify-content-between">
                                <span class="fw-bold small">{{ comment.author.profile.displayName }}</span>
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
    </AppPopover>
</template>

<script setup lang="ts">
import type { GroupUser, Profile, Task, TaskComment, TaskTag } from '@prisma/client'

interface TaskWithRelations extends Task {
    assignedTo: (GroupUser & {
        profile: Profile
    }) | null
    completedBy: (GroupUser & {
        profile: Profile
    }) | null
    tags: (TaskTag & {
        tag: {
            id: number
            title: string
            color: string
        }
    })[]
    comments: (TaskComment & {
        author: GroupUser & {
            profile: Profile
        }
    })[]
}

interface Props {
    task: TaskWithRelations
}

const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'commentAdded'): void
    (e: 'close'): void
}>()

const newComment = ref('')
const isSubmitting = ref(false)

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
        await $fetch(`/api/tasks/${props.task.id}/comments`, {
            method: 'POST',
            body: {
                content: newComment.value,
            },
        })
        newComment.value = ''
        emit('commentAdded')
    } catch (error) {
        console.error('Failed to add comment:', error)
    } finally {
        isSubmitting.value = false
    }
}
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
