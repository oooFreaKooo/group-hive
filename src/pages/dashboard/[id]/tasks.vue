<template>
    <div
        v-if="status === 'pending'"
        class="loading-overlay"
    >
        <div class="loading-content">
            <div class="spinner" />
            <p class="loading-text">
                Loading tasks...
            </p>
        </div>
    </div>

    <div class="tasks-page">
        <div class="container">
            <div
                v-if="error"
                class="alert alert-danger mb-4"
                role="alert"
            >
                {{ error }}
                <button
                    class="btn btn-link p-0 ms-2"
                    @click="error = null"
                >
                    Dismiss
                </button>
            </div>

            <div
                v-if="data && status === 'success'"
                class="row"
            >
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
                        @task-updated="refreshTasks"
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
                                @task-updated="refreshTasks"
                                @task-moved="handleTaskMoved"
                            />
                        </template>
                    </TaskSidebar>
                </div>
            </div>

            <CreateTagPopover
                v-if="showCreateTag && data?.id"
                :group-id="Number(data.id)"
                @close="showCreateTag = false"
                @tag-created="handleTagCreated"
            />

            <CreateTaskPopover
                v-if="showCreateTask && data?.id"
                :group-id="Number(data.id)"
                :group-members="data.members"
                :tags="tags"
                :task-rows="taskRows"
                @task-created="handleTaskCreated"
                @close="showCreateTask = false"
            />

            <CreateTaskRowPopover
                v-if="showCreateRow && data?.id"
                :group-id="Number(data.id)"
                @row-created="handleRowCreated"
                @close="showCreateRow = false"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Prisma, TaskRow } from '@prisma/client'
import { storeToRefs } from 'pinia'

definePageMeta({
    layout: 'group',
})

const route = useRoute()

// UI state
const showCreateTask = ref(false)
const showCreateRow = ref(false)
const showCreateTag = ref(false)
const error = ref<string | null>(null)

// Store initialization
const taskStore = useTaskStore()
const taskRowStore = useTaskRowStore()
const tagStore = useTagStore()

// Destructure store refs for better reactivity
const { tags } = storeToRefs(tagStore)
const { unassignedTasks } = storeToRefs(taskStore)
const { taskRows } = storeToRefs(taskRowStore)

// Fetch group data
const { data, status } = await useLazyFetch<Prisma.GroupGetPayload<{
    select: {
        id: true
        name: true
        members: {
            include: {
                profile: true
            }
        }
        TaskRow: {
            include: {
                tasks: {
                    include: {
                        assignee: {
                            include: {
                                profile: true
                            }
                        }
                        tags: true
                    }
                }
            }
        }
        Task: {
            include: {
                assignee: {
                    include: {
                        profile: true
                    }
                }
                tags: true
            }
        }
        Tag: true
    }
}> | null>(`/api/group/:${route.params.id}`, {
    key: 'group',
})

// Initialize data
watch(() => data.value, async (newData) => {
    if (newData?.id) {
        try {
            error.value = null
            await Promise.all([
                tagStore.fetchTags(Number(newData.id)),
                taskStore.fetchTasks(Number(newData.id)),
                taskRowStore.fetchTaskRows(Number(newData.id)),
            ])
        } catch (e) {
            error.value = 'Failed to load tasks. Please try refreshing the page.'
            console.error('TasksSection - Failed to initialize:', e)
        }
    }
}, { immediate: true })

// Event handlers
const refreshTasks = async () => {
    if (!data.value?.id) { return }
    try {
        error.value = null
        await Promise.all([
            taskStore.fetchTasks(Number(data.value.id)),
            taskRowStore.fetchTaskRows(Number(data.value.id)),
        ])
    } catch (e) {
        error.value = 'Failed to refresh tasks. Please try again.'
        console.error('TasksSection - Failed to refresh tasks:', e)
    }
}

const handleTaskCreated = () => refreshTasks()
const handleRowCreated = () => {
    if (data.value?.id) {
        taskRowStore.fetchTaskRows(Number(data.value.id))
    }
}
const handleTagCreated = () => {
    if (data.value?.id) {
        tagStore.fetchTags(Number(data.value.id))
    }
}

interface TaskMovedPayload {
    task: TaskWithRelations
    columnIndex: number
    rowId?: number
    onComplete?: () => void
}

const handleTaskMoved = async (payload: TaskMovedPayload) => {
    if (!data.value?.id) { return }
    try {
        error.value = null
        const { task, columnIndex, rowId: targetRowId, onComplete } = payload

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

        await taskRowStore.fetchTaskRows(data.value.id)
        onComplete?.()
    } catch (e) {
        error.value = 'Failed to move task. Please try again.'
        console.error('TasksSection - Error:', e)
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

// Week columns computation with memoization
const getWeekColumns = computed(() => {
    const days = [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
    ]

    return (row: { weekStart: Date | string, id: number, tasks: TaskWithRelations[] }) => {
        const weekStart = new Date(row.weekStart)

        return days.map((day, index) => ({
            title: day,
            tasks: row.tasks.filter((task: TaskWithRelations) => {
                if (!task.taskRowId || !task.dueDate) { return false }
                if (task.taskRowId !== row.id) { return false }

                const taskDate = new Date(task.dueDate)
                const columnDate = new Date(weekStart)
                columnDate.setDate(weekStart.getDate() + index)

                return taskDate.toDateString() === columnDate.toDateString()
            }),
        }))
    }
})
</script>

<style scoped lang="scss">
.loading-overlay {
    position: fixed;
    inset: 0;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    animation: fadeIn 0.3s ease;
}

.spinner {
    width: 48px;
    height: 48px;
    border: 3px solid rgba(var(--bs-primary-rgb), 0.1);
    border-top: 3px solid var(--bs-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.loading-text {
    font-size: 1.1rem;
    color: var(--bs-gray-600);
    margin: 0;
    font-weight: 500;
}

.tasks-page {
    min-height: calc(100vh - var(--header-height, 60px));
    display: flex;
    flex-direction: column;
    background: linear-gradient(
        135deg,
        rgba(var(--bs-primary-rgb), 0.03) 0%,
        rgba(var(--bs-light-rgb), 0.5) 100%
    );
    padding: 2rem 0;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
