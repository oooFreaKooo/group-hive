<template>
    <div class="mb-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="mb-0">
                {{ title }}
            </h3>
        </div>
        <div class="row g-2 w-100">
            <div
                v-for="(column, index) in columns"
                :key="index"
                class="col-2 col-xl-2 col-lg-3 col-md-3 col-sm-3"
            >
                <div class="card h-100 shadow-sm">
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
                                @comment-added="$emit('task-updated')"
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
const emit = defineEmits<{
    (e: 'task-updated'): void
    (e: 'task-moved', payload: { task: TaskWithRelations, columnIndex: number, rowId?: number }): void
}>()

const handleChange = (event: any, columnIndex: number, columnTitle: string) => {
    console.log('TaskRow - handleChange:', {
        event,
        columnIndex,
        columnTitle,
        rowId: props.rowId,
    })
    if (event.added) {
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
