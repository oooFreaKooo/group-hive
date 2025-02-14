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
                <span
                    v-if="columns[0].tasks.length > 0"
                    class="badge bg-secondary ms-2 task-count"
                    role="status"
                    aria-live="polite"
                >
                    {{ columns[0].tasks.length }}
                </span>
                <div
                    v-if="isLoading"
                    class="ms-2 sync-indicator"
                    role="status"
                    aria-label="Syncing changes"
                >
                    <div class="spinner-border spinner-border-sm text-warning opacity-50" />
                    <span class="visually-hidden">Syncing changes...</span>
                </div>
            </h3>
        </div>
        <div class="row g-2 w-100">
            <div
                v-for="(column, index) in columns"
                :key="index"
                :class="columnClasses"
            >
                <div
                    class="card h-100 shadow-sm"
                    :class="getColumnStyle(index)"
                >
                    <div class="card-body p-2 position-relative">
                        <draggable
                            class="list-group task-list"
                            :list="column.tasks"
                            group="tasks"
                            :animation="200"
                            ghost-class="task-ghost"
                            :data-column-index="index"
                            :aria-label="'Unassigned tasks column'"
                            role="list"
                            @change="(e) => handleChange(e, index)"
                            @start="handleDragStart"
                            @end="handleDragEnd"
                            @enter="() => handleDragEnter(index)"
                        >
                            <template #header>
                                <div
                                    v-if="column.tasks.length === 0"
                                    class="empty-column-message"
                                    role="status"
                                >
                                    <i
                                        class="bi bi-inbox text-muted"
                                        aria-hidden="true"
                                    />
                                    <p>No unassigned tasks</p>
                                </div>
                            </template>
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

interface Props {
    title: string
    columns: TaskColumn[]
    rowId?: number
}

defineProps<Props>()
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

// Cleanup on unmount
onBeforeUnmount(() => {
    isDragging.value = false
    error.value = null
    isLoading.value = false
    dragSourceColumn.value = null
    dragTargetColumn.value = null
})

// Computed
const columnClasses = computed(() => ({
    'is-dragging': isDragging.value,
}))

const getColumnStyle = (_index: number) => ({
    'is-source': dragSourceColumn.value === _index,
    'is-target': dragTargetColumn.value === _index,
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

interface DragChangeEvent {
    added?: {
        element: TaskWithRelations
        newIndex: number
    }
    removed?: {
        element: TaskWithRelations
        oldIndex: number
    }
}

const handleChange = async (event: DragChangeEvent, _columnIndex: number) => {
    const added = event.added
    if (!added) { return }

    try {
        error.value = null
        isLoading.value = true

        await new Promise<void>((resolve) => {
            emit('task-moved', {
                task: added.element,
                columnIndex: 0,
                rowId: undefined,
                onComplete: resolve,
            })
        })
    } catch (err: unknown) {
        error.value = 'Failed to move task. Please try again.'
        console.error('TaskRowUnassigned - Failed to handle drag:', err)
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
    position: relative;

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

.empty-column-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    opacity: 0.5;
    pointer-events: none;
    transition: opacity 0.2s ease;

    i {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        display: block;
    }

    p {
        margin: 0;
        font-size: 0.875rem;
        color: var(--bs-gray-600);
    }
}

.task-ghost {
    opacity: 0.35;
    background-color: var(--bs-light);
    border: 2px dashed var(--bs-warning);
    transform: rotate(-1deg) scale(0.98);
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

.card {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid var(--bs-border-color);

    &.is-source {
        background-color: var(--bs-light);
        border-color: var(--bs-warning);
        transform: scale(0.98);
        box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }

    &.is-target {
        border-color: var(--bs-success);
        background-color: var(--bs-success-bg-subtle);
        transform: scale(1.02);
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }

    &.is-loading {
        opacity: 0.8;
        pointer-events: none;
    }

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
        border: 2px dashed var(--bs-warning);
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
    .loading-indicator {
        transition: none;
        animation: none;
        transform: none;
        backdrop-filter: none;
    }

    .task-ghost,
    .card.is-source,
    .card.is-target,
    .card:hover:not(.is-loading) {
        transform: none;
    }
}
</style>
