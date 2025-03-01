<template>
    <div
        class="task-row shadow-sm bg-light overflow-hidden"
        role="region"
        :aria-label="title"
    >
        <div
            v-if="error"
            class="alert alert-danger mb-0 rounded-0 border-0"
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

        <div
            class="p-3 bg-light border-bottom d-flex justify-content-between align-items-center cursor-pointer"
            role="button"
            :aria-expanded="isExpanded"
            :aria-controls="'row-content-' + rowId"
            @click="toggleExpanded"
        >
            <h5 class="mb-0 d-flex align-items-center fw-semibold">
                <i
                    class="bi me-2"
                    :class="isExpanded ? 'bi-chevron-down' : 'bi-chevron-right'"
                    aria-hidden="true"
                />
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
            </h5>
            <div class="d-flex align-items-center gap-2">
                <span class="badge bg-primary rounded-pill">
                    {{ totalTasks }} tasks
                </span>
                <button
                    class="btn btn-link text-muted p-0"
                    aria-label="More options"
                    @click.stop
                >
                    <i
                        class="bi bi-three-dots"
                        aria-hidden="true"
                    />
                </button>
            </div>
        </div>

        <Transition
            name="accordion"
            @enter="onEnter"
            @leave="onLeave"
        >
            <div
                v-show="isExpanded"
                :id="'row-content-' + rowId"
                class="row g-0 w-100 position-relative p-3"
            >
                <div
                    v-for="(column, index) in columns"
                    :key="index"
                    :class="columnClasses"
                >
                    <div
                        class="h-100 w-100 px-2"
                        :class="getColumnStyle(index)"
                    >
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h6 class="mb-0 text-muted small fw-semibold">
                                {{ column.title }}
                            </h6>
                        </div>
                        <div class="position-relative">
                            <draggable
                                class="list-group task-list rounded-3 bg-light"
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
        </Transition>
    </div>
</template>

<script setup lang="ts">
import type { Task } from '@prisma/client'
import { VueDraggableNext as draggable } from 'vue-draggable-next'

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
        type: String,
        required: true,
    },
    isExpanded: {
        type: Boolean,
        required: false,
        default: true,
    },
})

const emit = defineEmits<{
    (e: 'update:expanded', value: boolean): void
    (e: 'task-moved', payload: {
        task: TaskWithRelations
        columnIndex: number
        rowId?: string
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
    'col-2 col-xl-2 col-lg-3 col-md-3 col-sm-3': true,
    'is-dragging': isDragging.value,
}))

const totalTasks = computed(() =>
    props.columns.reduce((sum, column) => sum + column.tasks.length, 0),
)

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

// Methods
function toggleExpanded () {
    emit('update:expanded', !props.isExpanded)
}

function onEnter (el: Element) {
    const height = el.scrollHeight
    const animation = el.animate([
        { height: '0', opacity: 0, overflow: 'hidden' },
        { height: `${height}px`, opacity: 1, overflow: 'hidden' },
    ], {
        duration: 300,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    })

    animation.onfinish = () => {
        (el as HTMLElement).style.height = ''
        ;(el as HTMLElement).style.overflow = ''
    }
}

function onLeave (el: Element) {
    const height = el.scrollHeight
    const _animation = el.animate([
        { height: `${height}px`, opacity: 1, overflow: 'hidden' },
        { height: '0', opacity: 0, overflow: 'hidden' },
    ], {
        duration: 300,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    })
}
</script>

<style scoped lang="scss">
.task-list {
    min-height: 75px;
    transition: background-color 0.3s ease, border-color 0.3s ease;
    background-color: var(--bs-gray-100);

    &:empty {
        background-color: var(--bs-light);
        border: 2px dashed var(--bs-dark-subtle);
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
    .ghost {
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

.cursor-pointer {
    cursor: pointer;
    user-select: none;

    &:hover {
        background-color: var(--bs-gray-100);
    }
}

.bi-chevron-right,
.bi-chevron-down {
    transition: transform 0.3s ease;
}

.bi-chevron-down {
    transform: rotate(0deg);
}

.bi-chevron-right {
    transform: rotate(-90deg);
}

@media (prefers-reduced-motion: reduce) {
    .bi-chevron-right,
    .bi-chevron-down {
        transition: none;
    }
}
</style>
