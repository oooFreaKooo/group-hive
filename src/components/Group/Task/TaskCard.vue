<template>
    <div>
        <div
            class="task-card w-100 rounded-4 text-start position-relative card shadow-sm p-3 bg-light btn btn-dark my-1"
            :class="{ 'is-dragging': isDragging }"
            @click="showDetails = true"
        >
            <div class="d-flex flex-wrap gap-1 mb-2">
                <span
                    v-for="taskTag in task.tags"
                    :key="taskTag.tagId"
                    class="badge rounded-pill"
                    :style="{ backgroundColor: taskTag.tag.color }"
                >
                    {{ taskTag.tag.title }}
                </span>
            </div>

            <p class="mb-2 text-dark">
                {{ task.description }}
            </p>

            <div class="d-flex justify-content-between align-items-center text-muted small">
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
                            class="rounded-circle"
                            width="25"
                            height="25"
                        />
                    </div>
                    <div
                        v-else
                        class="rounded-circle bg-dark d-flex align-items-center justify-content-center"
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
                </div>
            </div>
        </div>
        <TaskDetailsPopover
            v-if="showDetails"
            :task-id="task.id"
            :group-id="task.groupId"
            @close="showDetails = false"
        />
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
})

// Fetch assigned profile if there is one
const { data: assignedProfile } = props.task.assignedToId
    ? await useFetch<Profile>(`/api/profiles/${props.task.assignedToId}`)
    : { data: ref(null) }

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
        border: 2px solid var(--bs-dark);
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
