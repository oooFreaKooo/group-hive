<template>
    <div class="border shadow-sm mb-3 rounded p-2">
        <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="d-flex gap-2">
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
                <div
                    v-else
                    class="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                    style="width: 25px; height: 25px;"
                    title="Unassigned"
                >
                    <i class="bi bi-person text-white small" />
                </div>
            </span>
            <button
                class="btn btn-link text-muted p-0"
                @click="showDetails = true"
            >
                <i class="bi bi-three-dots" />
            </button>
        </div>

        <div class="d-flex flex-wrap gap-1 mb-2">
            <span
                v-for="tagItem in task.tags"
                :key="tagItem.tagId"
                class="badge"
                :style="{ backgroundColor: tagItem.tag.color }"
            >
                {{ tagItem.tag.title }}
            </span>
        </div>

        <div class="d-flex justify-content-between align-items-center text-muted small text-nowrap">
            <span>
                <i class="bi bi-star-fill me-1 text-warning" />
                {{ task.pointValue }}
            </span>
            <span>
                <i class="bi bi-chat-dots me-1" />
                {{ task.comments?.length || 0 }}
            </span>
        </div>

        <TaskDetailsPopover
            v-if="showDetails"
            :task="task"
            @close="showDetails = false"
            @comment-added="$emit('commentAdded')"
        />
    </div>
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

defineProps<Props>()
defineEmits<{
    (e: 'commentAdded'): void
}>()

const showDetails = ref(false)
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
</style>
