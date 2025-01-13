<template>
    <div class="container">
        <div class="row">
            <div class="col-14 col-lg-12">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2 class="my-4">
                        Tasks
                    </h2>
                    <div class="d-flex gap-2">
                        <button
                            class="btn btn-outline-primary"
                            @click="showCreateTag = true"
                        >
                            <i class="bi bi-tag me-2" />
                            Add Tag
                        </button>
                        <button
                            class="btn btn-outline-primary"
                            @click="showCreateRow = true"
                        >
                            <i class="bi bi-plus-lg me-2" />
                            Add Week
                        </button>
                        <button
                            class="btn btn-primary"
                            @click="showCreateTask = true"
                        >
                            <i class="bi bi-plus-lg me-2" />
                            Add Task
                        </button>
                    </div>
                </div>
            </div>

            <!-- Task Rows -->
            <div
                v-for="row in taskRows"
                :key="row.id"
                class="col-14 col-lg-11"
            >
                <TaskRow
                    :title="row.title"
                    :columns="getWeekColumns(row)"
                    :row-id="row.id"
                    @refresh="refresh"
                />
            </div>

            <div class="col-14 col-lg-3">
                <TaskSidebar class="mt-4 mt-lg-0">
                    <template
                        v-if="unassignedTasks.length > 0"
                        #unassigned
                    >
                        <TaskRowUnassigned
                            title="Unassigned Tasks"
                            :columns="[{ title: 'Tasks', tasks: unassignedTasks }]"
                        />
                    </template>
                </TaskSidebar>
            </div>
        </div>

        <CreateTagPopover
            v-if="showCreateTag"
            :group-id="group.id"
            @close="showCreateTag = false"
        />

        <CreateTaskPopover
            v-if="showCreateTask"
            :group-id="group.id"
            :group-members="group.members"
            :tags="tags"
            :task-rows="taskRows"
            @close="showCreateTask = false"
        />

        <CreateTaskRowPopover
            v-if="showCreateRow"
            :group-id="group.id"
            @close="showCreateRow = false"
        />
    </div>
</template>

<script setup lang="ts">
import type { Tag, TaskRow } from '@prisma/client'

interface Props {
    group: GroupWithMembers
}

const props = defineProps<Props>()

const showCreateTask = ref(false)
const showCreateRow = ref(false)
const showCreateTag = ref(false)

// Use Nuxt's auto-refreshing data fetching
const { data: tags } = await useFetch<Tag[]>(`/api/tags/get`, {
    query: { groupId: props.group.id },
    lazy: true,
    key: `tags-${props.group.id}`,
    default: () => [],
})

const { data: tasks } = await useFetch<TaskWithRelations[]>(`/api/tasks/get`, {
    query: { groupId: props.group.id },
    key: `tasks-${props.group.id}`,
    default: () => [],
})

const { data: taskRows, refresh } = await useFetch<(TaskRow & { tasks: TaskWithRelations[] })[]>(`/api/task-rows/get`, {
    query: { groupId: props.group.id },
    key: `task-rows-${props.group.id}`,
    default: () => [],
})

// Computed properties
const unassignedTasks = computed(() =>
    tasks.value?.filter(task => !task.dueDate && !task.taskRowId) ?? [],
)

// Week columns computation
function getWeekColumns (row: TaskRow & { tasks: TaskWithRelations[] }) {
    const days = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
    ]
    const weekStart = new Date(row.weekStart)

    return days.map((day, index) => {
        const columnDate = new Date(weekStart)
        columnDate.setDate(weekStart.getDate() + index)

        return {
            title: day,
            tasks: row.tasks.filter((task) => {
                if (task.taskRowId === row.id && task.dueDate) {
                    const taskDate = new Date(task.dueDate)
                    return taskDate.toDateString() === columnDate.toDateString()
                }
                return false
            }),
        }
    })
}
</script>
