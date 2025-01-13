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
                            @change="handleChange($event)"
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
}

defineProps<Props>()

const handleChange = async (event: any) => {
    if (!event.added) { return }

    const task = event.added.element as TaskWithRelations

    try {
        // Update task to be unassigned
        await $fetch(`/api/tasks/${task.id}/update`, {
            method: 'PUT',
            body: {
                dueDate: null,
                taskRowId: null,
            },
        })
    } catch (error) {
        console.error('TaskRowUnassigned - Error:', error)
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
