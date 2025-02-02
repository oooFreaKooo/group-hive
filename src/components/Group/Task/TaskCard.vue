<template>
    <div>
        <div
            class="task-card w-100 rounded-4  text-start position-relative card shadow-sm p-3 bg-light btn btn-dark my-1"

            :class="{ 'is-dragging': isDragging }"
            @click="showDetails = true"
        >
            <div class="d-flex flex-wrap gap-1 mb-2">
                <span
                    v-for="tagItem in task.tags"
                    :key="tagItem.tagId"
                    class="badge rounded-pill"
                    :style="{ backgroundColor: tagItem.tag.color }"
                >
                    {{ tagItem.tag.title }}
                </span>
            </div>

            <div class="d-flex justify-content-between align-items-center text-muted small">
                <div class="d-flex align-items-center gap-2">
                    <div
                        v-if="task.assignedTo"
                        class="member-avatar"
                        :title="task.assignedTo.profile.displayName || ''"
                    >
                        <NuxtImg
                            v-if="task.assignedTo.profile.avatarUrl"
                            :src="task.assignedTo.profile.avatarUrl"
                            :alt="task.assignedTo.profile.displayName || ''"
                            class="rounded-circle"
                            width="25"
                            height="25"
                        />
                    </div>
                    <div
                        v-else
                        class="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                        style="width: 25px; height: 25px;"
                        title="Unassigned"
                    >
                        <i class="bi bi-person text-white small" />
                    </div>
                </div>
                <div class="d-flex gap-2">
                    <span>
                        <i class="bi bi-star-fill me-1 text-warning" />
                        {{ task.pointValue }}
                    </span>
                    <span>
                        <i class="bi bi-chat-dots me-1" />
                        {{ task.comments?.length || 0 }}
                    </span>
                </div>
            </div>
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

defineProps({
    task: {
        type: Object as PropType<TaskWithRelations>,
        required: true,
    },
})
defineEmits<{
    (e: 'commentAdded'): void
}>()

const showDetails = ref(false)
const isDragging = ref(false)
</script>

<style scoped lang="scss">
.task-card {
    transition: all 0.2s ease-in-out;

    &:hover {
        transform: translateY(-1px);

    }

    &:active {
        transform: translateY(0);
    }

    &.is-dragging {
        opacity: 0.7;
        transform: rotate(2deg) scale(0.98);
    }
}

.member-avatar {
    img {
        object-fit: cover;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
}

@media (prefers-reduced-motion: reduce) {
    .task-card {
        transition: none;
        transform: none !important;
    }
}
</style>
