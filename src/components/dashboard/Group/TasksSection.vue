<template>
    <div class="container">
        <main class="row">
            <div class="col-14 col-lg-12">
                <TaskHeader />
            </div>
            <div class="col-14 col-lg-12">
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
                                    <i class="fas fa-ellipsis-h" />
                                </button>
                            </div>
                            <div class="card-body p-2">
                                <draggable
                                    class="list-group task-list"
                                    :list="column.tasks"
                                    v-bind="dragOptions"
                                    @change="handleChange"
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
            <div class="col-14 col-lg-2">
                <TaskSidebar class="mt-4 mt-lg-0" />
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { VueDraggableNext as draggable } from 'vue-draggable-next'

const columns = ref<Column[]>([
    {
        title: 'Monday',
        tasks: [
            {
                id: 1,
                tag: { text: 'Copywriting', type: 'copyright' },
                title: 'Konsep hero title yang menarik',
                dueDate: '2021-11-24T20:00:00',
                points: 3,
                comments: 3,
                attachments: 7,
            },
            {
                id: 2,
                tag: { text: 'UI Design', type: 'design' },
                title: 'Icon di section our services',
                dueDate: '2021-11-24T20:00:00',
                points: 2,
                comments: 2,
                attachments: 5,
            },
        ],
    },
    {
        title: 'Tuesday',
        tasks: [
            {
                id: 3,
                tag: { text: 'UI Design', type: 'design' },
                title: 'Replace lorem ipsum text in the final designs',
                dueDate: '2021-11-24T20:00:00',
                points: 2,
                comments: 5,
                attachments: 5,
            },
        ],
    },
    {
        title: 'Wednesday',
        tasks: [
            {
                id: 4,
                tag: { text: 'Copywriting', type: 'copyright' },
                title: 'Check the company we copied doesn\'t think we copied them.',
                dueDate: '2021-11-24T20:00:00',
                points: 2,
                comments: 4,
                attachments: 0,
            },
        ],
    },
    {
        title: 'Thursday',
        tasks: [
            {
                id: 5,
                tag: { text: 'Illustration', type: 'illustration' },
                title: 'Send Advert illustrations over to production company.',
                dueDate: '2021-11-24T20:00:00',
                points: 2,
                comments: 12,
                attachments: 5,
            },
        ],
    },
    {
        title: 'Friday',
        tasks: [
            {
                id: 6,
                tag: { text: 'Copywriting', type: 'copyright' },
                title: 'Konsep hero title yang menarik',
                dueDate: '2021-11-24T20:00:00',
                points: 2,
                comments: 3,
                attachments: 7,
            },
        ],
    },
    {
        title: 'Saturday',
        tasks: [
            {
                id: 7,
                tag: { text: 'Copywriting', type: 'copyright' },
                title: 'Konsep hero title yang menarik',
                dueDate: '2021-11-24T20:00:00',
                points: 2,
                comments: 3,
                attachments: 7,
            },
        ],
    },
    {
        title: 'Sunday',
        tasks: [
            {
                id: 8,
                tag: { text: 'Copywriting', type: 'copyright' },
                title: 'Konsep hero title yang menarik',
                dueDate: '2021-11-24T20:00:00',
                points: 2,
                comments: 3,
                attachments: 7,
            },
        ],
    },
])

const dragOptions = computed(() => ({
    animation: 200,
    group: 'tasks',
    disabled: false,
    ghostClass: 'task-ghost',
}))

const handleChange = (event: any) => {
    console.log('Task moved:', event)
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
