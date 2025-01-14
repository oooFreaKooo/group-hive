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
                    @task-updated="fetchTasks"
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
                            @task-updated="fetchTasks"
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
import type { Tag, TaskRow } from '@prisma/client'

interface Props {
    group: GroupWithMembers
}

const props = defineProps<Props>()

const showCreateTask = ref(false)
const showCreateRow = ref(false)
const showCreateTag = ref(false)
const tags = ref<Tag[]>([])
const tasks = ref<TaskWithRelations[]>([])
const taskRows = ref<(TaskRow & { tasks: TaskWithRelations[] })[]>([])
const isLoading = ref(true)

const fetchTags = async () => {
    try {
        const response = await $fetch<Tag[]>(`/api/tags/get?groupId=${props.group.id}`)
        tags.value = response
    } catch (error) {
        console.error('Failed to fetch tags:', error)
    }
}
const fetchTasks = async () => {
    try {
        isLoading.value = true
        const response = await $fetch<TaskWithRelations[]>(`/api/tasks/get?groupId=${props.group.id}`)
        tasks.value = response
    } catch (error) {
        console.error('Failed to fetch tasks:', error)
    } finally {
        isLoading.value = false
    }
}
const fetchTaskRows = async () => {
    try {
        const response = await $fetch<(TaskRow & { tasks: TaskWithRelations[] })[]>(`/api/task-rows/get?groupId=${props.group.id}`)
        taskRows.value = response
    } catch (error) {
        console.error('Failed to fetch task rows:', error)
    }
}

const handleTaskCreated = () => {
    fetchTasks()
    fetchTaskRows()
}
const handleRowCreated = () => {
    fetchTaskRows()
}
const handleTagCreated = () => {
    fetchTags()
}
const handleTaskMoved = async (payload: { task: TaskWithRelations, columnIndex: number, rowId?: number }) => {
    try {
        const { task, columnIndex, rowId: targetRowId } = payload
        // If no row ID, this is an unassigned task
        if (!targetRowId) {
            await $fetch(`/api/tasks/${task.id}/update`, {
                method: 'PUT',
                body: {
                    dueDate: null,
                    taskRowId: null,
                },
            })
        } else {
            // Find the target row
            const targetRow = taskRows.value.find(row => row.id === targetRowId)
            if (!targetRow) { return }
            // Calculate the new due date based on the target column
            const weekStart = new Date(targetRow.weekStart)
            const dueDate = new Date(weekStart)
            dueDate.setDate(weekStart.getDate() + columnIndex)
            dueDate.setHours(23, 59, 59, 999)
            // Update the task
            await $fetch(`/api/tasks/${task.id}/update`, {
                method: 'PUT',
                body: {
                    dueDate: dueDate.toISOString(),
                    taskRowId: targetRow.id,
                },
            })
        }
        // Refresh data
        await Promise.all([
            fetchTasks(),
            fetchTaskRows(),
        ])
    } catch (error) {
        console.error('TasksSection - Error:', error)
        throw error
    }
}
// Initialize data
onMounted(() => {
    fetchTags()
    fetchTasks()
    fetchTaskRows()
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
