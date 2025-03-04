<template>
    <div>
        <div
            class="task-card w-100 rounded-4 text-start position-relative card shadow-sm p-2 my-1 border border-dark"
            :class="{ 'is-dragging': isDragging }"
        >
            <div class="d-flex justify-content-between align-items-center mb-2">
                <div
                    class="member-avatar"
                    :title="assignedProfile?.displayName || ''"
                >
                    <NuxtImg
                        :src="assignedProfile?.avatarUrl || '/images/default-avatar.png'"
                        :alt="assignedProfile?.displayName || ''"
                        class="rounded-circle"
                        width="25"
                        height="25"
                    />
                </div>

                <div class="d-flex gap-2">
                    <span>
                        <i class="bi bi-star-fill me-1 text-warning" />
                        {{ task.pointValue }}
                    </span>
                    <TaskDetailsPopover
                        :task-id="task.id"
                        :group-id="task.groupId"
                        @deleted="handleTaskDeleted"
                        @edited="handleTaskEdited"
                    />
                </div>
            </div>

            <TagBadge
                class="small"
                :tags="task.tags"
            />

            <!-- Subtasks Section -->
            <div
                v-if="task.subtasks?.length"
                class="mt-1 border-top"
            >
                <div class="d-flex align-items-center gap-2 small text-muted">
                    <i class="bi bi-list-check" />
                    <span>{{ completedSubtasks }} of {{ task.subtasks.length }} subtasks</span>
                    <div class="flex-grow-1">
                        <div
                            class="progress"
                            style="height: 2px;"
                        >
                            <div
                                class="progress-bar bg-success"
                                role="progressbar"
                                :style="{ width: `${(completedSubtasks / task.subtasks.length) * 100}%` }"
                                :aria-valuenow="(completedSubtasks / task.subtasks.length) * 100"
                                aria-valuemin="0"
                                aria-valuemax="100"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Task } from '@prisma/client'

interface TaskTag {
    tagId: string
    tag: {
        id: string
        title: string
        color: string
    }
}

interface TaskWithRelations extends Task {
    tags: TaskTag[]
    subtasks?: Task[]
}

interface Profile {
    id: string
    displayName: string
    avatarUrl: string | null
}

const props = defineProps({
    task: {
        type: Object as PropType<TaskWithRelations>,
        required: true,
    },
    viewMode: {
        type: String as PropType<'month' | 'week'>,
        default: 'month',
    },
})

const emit = defineEmits<{
    (e: 'deleted', taskId: string): void
    (e: 'edited'): void
}>()

// Fetch assigned profile if there is one
const { data: assignedProfile } = props.task.assignedToId
    ? await useFetch<Profile>(`/api/profile/${props.task.assignedToId}`)
    : { data: ref(null) }

const isDragging = ref(false)

const handleTaskDeleted = () => {
    emit('deleted', props.task.id)
}

const handleTaskEdited = () => {
    emit('edited')
}

const completedSubtasks = computed(() => {
    return props.task.subtasks?.filter(subtask => subtask.completed).length || 0
})
</script>

<style scoped lang="scss">
.task-card {
    cursor: move; /* fallback if grab cursor is unsupported */
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    background: white;
    border-width: 2px !important;

    &:hover {
        transform: translateY(-3px) rotate(0.5deg);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1) !important;
    }

    &:active {
        cursor: grabbing;
        cursor: -moz-grabbing;
        cursor: -webkit-grabbing;
        transform: translateY(0) rotate(0deg);
    }

    &.is-dragging {
        opacity: 0.8;
        transform: rotate(3deg) scale(1.02);
        box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15) !important;
        animation: floating 1.5s ease-in-out infinite alternate;
    }
}

.member-avatar {
    position: relative;

    img {
        object-fit: cover;
        border: 2.5px solid var(--bs-dark);
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12);
        transition: all 0.3s ease;

        &:hover {
            transform: scale(1.1) rotate(-5deg);
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
        }
    }
}

.bi {
    transition: all 0.2s ease;

    &:hover {
        transform: scale(1.2);
    }

    &.bi-three-dots-vertical:hover {
        color: var(--bs-primary) !important;
    }

    &.bi-star-fill {
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15));
    }
}

@keyframes floating {
    from {
        transform: rotate(2deg) translateY(-2px);
    }
    to {
        transform: rotate(4deg) translateY(2px);
    }
}

@media (prefers-reduced-motion: reduce) {
    .task-card,
    .member-avatar img,
    .bi {
        transition: none;
        animation: none;
        transform: none !important;
        box-shadow: none !important;
    }
}
</style>
