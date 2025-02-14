<template>
    <AppSection :padding="4">
        <div class="task-container d-flex flex-column rounded-5 shadow mt-4">
            <div class="p-3 bg-gradient bg-dark rounded-top-5">
                <div class="d-flex justify-content-between align-items-center">
                    <span class="fw-semibold text-light">
                        <i class="bi bi-list-task mx-2" />
                        Tasks
                    </span>
                    <div class="d-flex gap-2">
                        <button
                            class="btn btn-light btn-sm rounded-pill"
                            :title="areAllRowsExpanded ? 'Collapse all weeks' : 'Expand all weeks'"
                            @click="toggleAllRows"
                        >
                            <i
                                class="bi me-2"
                                :class="areAllRowsExpanded ? 'bi-chevron-up' : 'bi-chevron-down'"
                            />
                            {{ areAllRowsExpanded ? 'Collapse All' : 'Expand All' }}
                        </button>
                        <CreateTagPopover
                            :group-id="route.params.id[0]"
                            @tag-created="refresh"
                        />
                        <CreateTaskRowPopover
                            :group-id="route.params.id[0]"
                            @row-created="refresh"
                        />
                        <CreateTaskPopover
                            v-if="taskRows"
                            :group-id="route.params.id[0]"
                            :task-rows="taskRows"
                            @task-created="refresh"
                        />
                    </div>
                </div>
            </div>

            <div class="task-content bg-light p-4">
                <div
                    v-if="status === 'error'"
                    class="alert alert-danger mb-4"
                    role="alert"
                >
                    Failed to load tasks
                    <button
                        class="btn btn-link p-0 ms-2"
                        @click="refresh()"
                    >
                        Retry
                    </button>
                </div>

                <div class="row g-3">
                    <div
                        v-for="row in taskRows"
                        :key="row.id"
                        class="col-14 col-lg-14"
                    >
                        <TaskRow
                            :title="row.title"
                            :columns="getWeekColumns(row)"
                            :row-id="row.id"
                            :is-expanded="expandedRows[row.id]"
                            @update:expanded="(value) => handleRowExpanded(row.id, value)"
                            @task-moved="handleTaskMoved"
                        />
                    </div>
                </div>
            </div>
        </div>
    </AppSection>
</template>

<script setup lang="ts">
import type { Task, TaskRow } from '@prisma/client'

definePageMeta({
    layout: 'group',
})

const route = useRoute()

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

interface TaskRowWithTasks extends TaskRow {
    tasks: TaskWithRelations[]
}

const { data: taskRows, status, refresh } = await useLazyFetch<TaskRowWithTasks[]>(() => `/api/group/${route.params.id[0]}/taskRow`, {
    key: 'taskRows',
})

interface TaskMovedPayload {
    task: TaskWithRelations
    columnIndex: number
    rowId?: string
    onComplete?: () => void
}

const handleTaskMoved = async (payload: TaskMovedPayload) => {
    if (!taskRows.value) { return }
    try {
        const { task, columnIndex, rowId: targetRowId, onComplete } = payload

        if (!targetRowId) {
            await $fetch(`/api/group/${route.params.id[0]}/task/${task.id}`, {
                method: 'PUT',
                body: {
                    dueDate: null,
                    taskRowId: null,
                },
            })
        } else {
            const targetRow = taskRows.value.find(row => row.id === targetRowId)
            if (!targetRow) { return }

            const dueDate = calculateDueDate(targetRow.weekStart, columnIndex)
            await $fetch(`/api/group/${route.params.id[0]}/task/${task.id}`, {
                method: 'PUT',
                body: {
                    dueDate: dueDate.toISOString(),
                    taskRowId: targetRow.id,
                },
            })
        }

        refresh()
        onComplete?.()
    } catch (e) {
        console.error('Error moving task:', e)
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

    return (row: TaskRowWithTasks) => {
        const weekStart = new Date(row.weekStart)

        return days.map((day, index) => ({
            title: day,
            tasks: row.tasks?.filter((task) => {
                if (!task.taskRowId || !task.dueDate) { return false }
                if (task.taskRowId !== row.id) { return false }

                const taskDate = new Date(task.dueDate)
                const columnDate = new Date(weekStart)
                columnDate.setDate(weekStart.getDate() + index)

                return taskDate.toDateString() === columnDate.toDateString()
            }) || [],
        }))
    }
})

const expandedRows = ref<Record<string, boolean>>({})
const areAllRowsExpanded = ref(false)

function handleRowExpanded (rowId: string, value: boolean) {
    expandedRows.value[rowId] = value
}

function toggleAllRows () {
    areAllRowsExpanded.value = !areAllRowsExpanded.value
    taskRows.value?.forEach((row) => {
        expandedRows.value[row.id] = areAllRowsExpanded.value
    })
}

// Initialize expanded state when rows are loaded
watch(taskRows, (newRows) => {
    if (!newRows?.length) { return }
    newRows.forEach((row) => {
        if (expandedRows.value[row.id] === undefined) {
            expandedRows.value[row.id] = true
        }
    })
}, { immediate: true })
</script>

<style scoped lang="scss">
.task-container {
    min-height: 75vh;
    overflow: hidden;
    position: relative;
}

.task-content {
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;

    &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: var(--bs-gray-300);
        border-radius: 3px;

        &:hover {
            background: var(--bs-gray-400);
        }
    }
}

@supports (scrollbar-color: auto) {
    .task-content {
        scrollbar-color: var(--bs-gray-300) transparent;
        scrollbar-width: thin;
    }
}

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

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
