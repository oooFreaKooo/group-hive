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
                    @task-updated="taskStore.fetchTasks(props.group.id)"
                    @task-moved="handleTaskMoved"
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
                            :row-id="undefined"
                            @task-updated="taskStore.fetchTasks(props.group.id)"
                            @task-moved="handleTaskMoved"
                        />
                    </template>
                </TaskSidebar>
            </div>
        </div>

        <CreateTagPopover
            v-if="showCreateTag"
            :group-id="group.id"
            @close="showCreateTag = false"
            @tag-created="handleTagCreated"
        />

        <CreateTaskPopover
            v-if="showCreateTask"
            :group-id="group.id"
            :group-members="group.members"
            :tags="tags"
            :task-rows="taskRows"
            @task-created="handleTaskCreated"
            @close="showCreateTask = false"
        />

        <CreateTaskRowPopover
            v-if="showCreateRow"
            :group-id="group.id"
            @row-created="handleRowCreated"
            @close="showCreateRow = false"
        />
    </div>
</template>

<script setup lang="ts">
import type { TaskRow } from '@prisma/client'
import { storeToRefs } from 'pinia'

interface Props {
    group: GroupWithMembers
}

const props = defineProps<Props>()

// UI state
const showCreateTask = ref(false)
const showCreateRow = ref(false)
const showCreateTag = ref(false)

// Store initialization
const taskStore = useTaskStore()
const taskRowStore = useTaskRowStore()
const tagStore = useTagStore()

// Destructure store refs for better reactivity
const { tags } = storeToRefs(tagStore)
const { tasks, unassignedTasks } = storeToRefs(taskStore)
const { taskRows } = storeToRefs(taskRowStore)
const { isLoading } = storeToRefs(taskStore)

// Initialize data
onMounted(async () => {
    await Promise.all([
        tagStore.fetchTags(props.group.id),
        taskStore.fetchTasks(props.group.id),
        taskRowStore.fetchTaskRows(props.group.id),
    ])
})

// Event handlers
const handleTaskCreated = async () => {
    await Promise.all([
        taskStore.fetchTasks(props.group.id),
        taskRowStore.fetchTaskRows(props.group.id),
    ])
}

const handleRowCreated = () => taskRowStore.fetchTaskRows(props.group.id)
const handleTagCreated = () => tagStore.fetchTags(props.group.id)

const handleTaskMoved = async (payload: { task: TaskWithRelations, columnIndex: number, rowId?: number }) => {
    try {
        const { task, columnIndex, rowId: targetRowId } = payload

        if (!targetRowId) {
            await taskStore.updateTask(task.id, {
                dueDate: null,
                taskRowId: null,
            })
        } else {
            const targetRow = taskRows.value.find(row => row.id === targetRowId)
            if (!targetRow) { return }

            const dueDate = calculateDueDate(targetRow.weekStart, columnIndex)
            await taskStore.updateTask(task.id, {
                dueDate: dueDate.toISOString(),
                taskRowId: targetRow.id,
            })
        }

        await Promise.all([
            taskStore.fetchTasks(props.group.id),
            taskRowStore.fetchTaskRows(props.group.id),
        ])
    } catch (error) {
        console.error('TasksSection - Error:', error)
        throw error
    }
}

// Helper functions
function calculateDueDate (weekStart: Date | string, columnIndex: number): Date {
    const startDate = new Date(weekStart)
    const dueDate = new Date(startDate)
    dueDate.setDate(startDate.getDate() + columnIndex)
    dueDate.setHours(23, 59, 59, 999)
    return dueDate
}

// Week columns computation
const getWeekColumns = (row: TaskRow & { tasks: TaskWithRelations[] }) => {
    const days = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
    ]
    const weekStart = new Date(row.weekStart)

    return days.map((day, index) => ({
        title: day,
        tasks: row.tasks.filter((task) => {
            if (!task.taskRowId || !task.dueDate) { return false }
            if (task.taskRowId !== row.id) { return false }

            const taskDate = new Date(task.dueDate)
            const columnDate = new Date(weekStart)
            columnDate.setDate(weekStart.getDate() + index)

            return taskDate.toDateString() === columnDate.toDateString()
        }),
    }))
}
</script>
