<template>
    <div class="task-row mb-4">
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
                class="col-2 col-xl-2 col-lg-3 col-md-3 col-sm-3"
            >
                <div class="card h-100 shadow-sm">
                    <div class="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">
                            {{ column.title }}
                        </h5>
                        <button class="btn btn-link text-muted p-0">
                            <i class="bi bi-three-dots" />
                        </button>
                    </div>
                    <div class="card-body p-2">
                        <draggable
                            class="list-group task-list"
                            :list="column.tasks"
                            group="tasks"
                            :animation="200"
                            ghost-class="task-ghost"
                            @change="(e) => handleChange(e, index, column.title)"
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
    (e: 'task-moved', payload: { task: TaskWithRelations, columnIndex: number, rowId?: number }): void
}>()

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

const handleChange = (event: DragEvent, columnIndex: number, columnTitle: string) => {
    if (!event.added) { return }

    if (columnTitle === 'Tasks') {
        emit('task-moved', {
            task: event.added.element,
            columnIndex: 0,
            rowId: undefined,
        })
    } else {
        emit('task-moved', {
            task: event.added.element,
            columnIndex,
            rowId: props.rowId,
        })
    }
}
</script>

<style scoped lang="scss">
.task-list {
    min-height: 100px;
}

.task-ghost {
    opacity: 0.35;
    background-color: var(--bs-light);
    border: 1px dashed var(--bs-primary);
}

.flip-list-move {
    transition: transform 0.5s ease;
}

.no-move {
    transition: transform 0s;
}

.task-enter-active,
.task-leave-active {
    transition: all 0.3s ease;
}

.task-enter-from,
.task-leave-to {
    opacity: 0;
    transform: translateY(30px);
}
</style>
