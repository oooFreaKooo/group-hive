<template>
    <div
        class="mb-4"
        role="region"
        :aria-label="title"
    >
        <div
            v-if="error"
            class="alert alert-danger mb-3"
            role="alert"
            aria-live="polite"
        >
            {{ error }}
            <button
                class="btn btn-link p-0 ms-2"
                aria-label="Dismiss error"
                @click="error = null"
            >
                Dismiss
            </button>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="mb-0 d-flex align-items-center">
                {{ title }}
                <div
                    v-if="isLoading"
                    class="ms-2 sync-indicator"
                    role="status"
                    aria-label="Syncing changes"
                >
                    <div class="spinner-border spinner-border-sm text-primary opacity-50" />
                    <span class="visually-hidden">Syncing changes...</span>
                </div>
            </h3>
            <button
                class="btn btn-link text-muted p-0"
                aria-label="More options"
            >
                <i
                    class="bi bi-three-dots"
                    aria-hidden="true"
                />
            </button>
        </div>

        <div class="row g-2 w-100 position-relative">
            <div
                v-if="status === 'pending'"
                class="loading-overlay"
                role="status"
                aria-label="Loading tasks"
            >
                <div class="spinner-border text-primary" />
                <span class="visually-hidden">Loading tasks...</span>
            </div>

            <div
                v-for="(column, index) in columns"
                :key="index"
                :class="columnClasses"
            >
                <div
                    class="border rounded h-100 w-100 shadow-sm"
                    :class="getColumnStyle(index)"
                >
                    <div class="p-2 bg-transparent border-0 d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">
                            {{ column.title }}
                        </h5>
                        <button
                            class="btn btn-link text-muted p-0"
                            aria-label="Column options"
                        >
                            <i
                                class="bi bi-three-dots"
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                    <div class="card-body p-2 position-relative">
                        <draggable
                            class="list-group task-list"
                            :list="column.tasks"
                            group="tasks"
                            :animation="200"
                            ghost-class="ghost"
                            :data-column-index="index"
                            :aria-label="`${column.title} tasks`"
                            role="list"
                            @change="(e) => handleChange(e, index, column.title)"
                            @start="handleDragStart"
                            @end="handleDragEnd"
                            @enter="() => handleDragEnter(index)"
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

const props = defineProps({
    title: {
        type: String,
        required: true,
    },
    columns: {
        type: Array as PropType<TaskColumn[]>,
        required: true,
    },
    rowId: {
        type: Number,
        required: false,
    },
    status: {
        type: String,
        required: false,
        default: 'pending',
    },
})

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
const isLoading = ref(false)
const dragSourceColumn = ref<number | null>(null)
const dragTargetColumn = ref<number | null>(null)

// Computed
const columnClasses = computed(() => ({
    'col-2 col-xl-2 col-lg-3 col-md-3 col-sm-3': true,
    'is-dragging': isDragging.value,
}))

const getColumnStyle = (index: number) => ({
    'is-source': dragSourceColumn.value === index,
    'is-target': dragTargetColumn.value === index,
    'is-loading': isLoading.value,
})

const handleDragStart = (e: any) => {
    isDragging.value = true
    dragSourceColumn.value = Number.parseInt(e.from.dataset.columnIndex)
}

const handleDragEnd = () => {
    isDragging.value = false
    dragSourceColumn.value = null
    dragTargetColumn.value = null
}

const handleDragEnter = (columnIndex: number) => {
    dragTargetColumn.value = columnIndex
}

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
        isLoading.value = true

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
            isLoading.value = false
        }, 500)
    }
}
</script>

<style scoped lang="scss">
.task-list {
    min-height: 75px;
    transition: background-color 0.3s ease, border-color 0.3s ease;

    &:empty {
        background-color: var(--bs-light);
        border: 2px dashed var(--bs-gray-300);
    }

    &:focus-within {
        border-color: var(--bs-primary);
        box-shadow: 0 0 0 0.25rem rgba(var(--bs-primary-rgb), 0.25);
    }
}

.task-count {
    font-size: 0.875rem;
    font-weight: normal;
    transition: all 0.2s ease;
}

.ghost {
    opacity: 0.35;
    background-color: var(--bs-secondary);
    transform: rotate(2deg) scale(0.98);
    transition: all 0.2s ease;
}

.sync-indicator {
    display: flex;
    align-items: center;
    animation: fadeIn 0.2s ease;

    .spinner-border {
        width: 1rem;
        height: 1rem;
        border-width: 0.15em;
    }
}

.task-list-inner {
    position: relative;
    z-index: 1;
}

.flip-list-move {
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.task-enter-active,
.task-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
}

.task-enter-from,
.task-leave-to {
    opacity: 0;
    transform: translateY(30px);
}

.is-dragging {
    .card {
        border: 2px dashed var(--bs-primary);
        background-color: var(--bs-light);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (prefers-reduced-motion: reduce) {
    .task-enter-active,
    .task-leave-active,
    .flip-list-move,
    .task-list,
    .column-loading,
    .card,
    .task-count,
    .empty-column-message,
    .loading-indicator,
    .card-header {
        transition: none;
        animation: none;
        transform: none;
        backdrop-filter: none;
    }

    .ghost,
    .card.is-source,
    .card.is-target,
    .card:hover:not(.is-loading) {
        transform: none;
    }
}

.loading-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(2px);
    border-radius: 0.5rem;
    z-index: 10;
}
</style>
