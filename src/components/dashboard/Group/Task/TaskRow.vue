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
                            @change="handleChange($event, index)"
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

interface Props {
    title: string
    columns: TaskColumn[]
    rowId?: number
}

const props = defineProps<Props>()
const emit = defineEmits(['refresh'])

const handleChange = async (event: any, columnIndex: number) => {
    if (!event.added) { return }

    const task = event.added.element as TaskWithRelations
    const targetRowId = props.rowId

    try {
        if (!targetRowId) {
            // Move to unassigned
            await $fetch(`/api/tasks/${task.id}/update`, {
                method: 'PUT',
                body: {
                    dueDate: null,
                    taskRowId: null,
                },
            })
            emit('refresh')
        } else {
            // Calculate the new due date
            const weekStart = new Date(props.columns[0].tasks[0]?.dueDate ?? new Date())
            const dueDate = new Date(weekStart)
            dueDate.setDate(weekStart.getDate() + columnIndex)
            dueDate.setHours(23, 59, 59, 999)

            // Update task
            await $fetch(`/api/tasks/${task.id}/update`, {
                method: 'PUT',
                body: {
                    dueDate: dueDate.toISOString(),
                    taskRowId: targetRowId,
                },
            })
            emit('refresh')
        }
    } catch (error) {
        console.error('TaskRow - Error:', error)
        throw error
    }
}
</script>

<style scoped lang="scss">
.task-list {
    min-height: 100px;
}

.task-ghost {
    opacity: 0.35;
}

.flip-list-move {
    transition: transform 0.5s;
}

.no-move {
    transition: transform 0s;
}
</style>
