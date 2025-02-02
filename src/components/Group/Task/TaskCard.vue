<template>
    <button
        class="border shadow-sm rounded p-2"
        @click="showDetails = true"
    >
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

        <TaskDetailsPopover
            v-if="showDetails"
            :task="task"
            @close="showDetails = false"
            @comment-added="$emit('commentAdded')"
        />
    </button>
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
