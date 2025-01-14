<template>
    <div class="task-row mb-4">
        <div
            v-if="error"
            class="alert alert-danger mb-3"
            role="alert"
        >
            {{ error }}
            <button
                class="btn btn-link p-0 ms-2"
                @click="error = null"
            >
                Dismiss
            </button>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="mb-0">
                {{ title }}
            </h3>
            <button class="btn btn-link text-muted p-0">
                <i class="bi bi-three-dots" />
            </button>
        </div>

        <div class="row g-2 w-100">
            <div
                v-for="(column, index) in columns"
                :key="index"
                :class="columnClasses"
            >
                <div
                    class="card h-100 shadow-sm"
                    :class="{ 'border-primary': isDragging }"
                >
                    <div class="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">
                            {{ column.title }}
                        </h5>
                        <button class="btn btn-link text-muted p-0">
                            <i class="bi bi-three-dots" />
                        </button>
                    </div>
                    <div class="card-body p-2 position-relative">
                        <div
                            v-if="loadingColumns.has(index)"
                            class="column-loading"
                        >
                            <div class="spinner-border spinner-border-sm text-primary" />
                        </div>
                        <draggable
                            class="list-group task-list"
                            :list="column.tasks"
                            group="tasks"
                            :animation="200"
                            ghost-class="task-ghost"
                            @change="(e) => handleChange(e, index, column.title)"
                            @start="isDragging = true"
                            @end="isDragging = false"
                        >
                            <TransitionGroup
                                name="task"
                                type="transition"
                            >
                                <TaskCard
                                    v-for="task in column.tasks"
                                    :key="task.id"
                                    :task="task"
                                />
                            </TransitionGroup>
                        </draggable>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { VueDraggableNext as draggable } from 'vue-draggable-next'

interface TaskColumn {
    title: string
    tasks: TaskWithRelations[]
}

interface Props {
    title: string
    columns: TaskColumn[]
    rowId?: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'task-updated'): void
    (e: 'task-moved', payload: {
        task: TaskWithRelations
        columnIndex: number
        rowId?: number
        onComplete?: () => void
    }): void
}>()

// State
const isDragging = ref(false)
const error = ref<string | null>(null)
const loadingColumns = ref<Set<number>>(new Set())

// Computed
const columnClasses = computed(() => ({
    'col-2 col-xl-2 col-lg-3 col-md-3 col-sm-3': true,
    'is-dragging': isDragging.value,
}))

interface DragEvent {
    added?: {
        element: TaskWithRelations
        newIndex: number
    }
    removed?: {
        element: TaskWithRelations
        oldIndex: number
    }
}

const handleChange = async (event: DragEvent, columnIndex: number, columnTitle: string) => {
    const added = event.added
    if (!added) { return }

    try {
        error.value = null
        loadingColumns.value.add(columnIndex)

        await new Promise<void>((resolve) => {
            emit('task-moved', {
                task: added.element,
                columnIndex: columnTitle === 'Tasks' ? 0 : columnIndex,
                rowId: columnTitle === 'Tasks' ? undefined : props.rowId,
                onComplete: resolve,
            })
        })
    } catch (e) {
        error.value = 'Failed to move task. Please try again.'
        console.error('TaskRow - Failed to handle drag:', e)
    } finally {
        // Add a small delay before removing loading state to ensure smooth transition
        setTimeout(() => {
            loadingColumns.value.delete(columnIndex)
        }, 500)
    }
}
</script>

<style scoped lang="scss">
.task-list {
    min-height: 100px;
    transition: background-color 0.3s ease;

    &:empty {
        background-color: var(--bs-light);
        border-radius: 0.375rem;
        border: 2px dashed var(--bs-gray-300);
    }
}

.task-ghost {
    opacity: 0.35;
    background-color: var(--bs-light);
    border: 1px dashed var(--bs-primary);
}

.column-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    backdrop-filter: blur(2px);
    border-radius: 0.375rem;
}

.flip-list-move {
    transition: transform 0.5s ease;
}

.no-move {
    transition: transform 0s;
}

.task-enter-active,
.task-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.task-enter-from,
.task-leave-to {
    opacity: 0;
    transform: translateY(30px);
}

.is-dragging {
    .card {
        border: 1px dashed var(--bs-primary);
        background-color: var(--bs-light);
    }
}

@media (prefers-reduced-motion: reduce) {
    .task-enter-active,
    .task-leave-active,
    .flip-list-move,
    .task-list,
    .column-loading {
        transition: none;
        backdrop-filter: none;
    }
}
</style>
