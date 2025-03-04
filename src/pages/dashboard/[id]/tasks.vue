<template>
    <AppSection :padding="4">
        <div class="task-container d-flex flex-column rounded-5 shadow-lg border mt-4">
            <div class="p-3 bg-dark rounded-top-5">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <span class="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 me-3">
                            <i class="bi bi-list-task me-2" />
                            Tasks
                        </span>
                        <h1 class="h5 text-light mb-0 fw-semibold">
                            Task Calendar
                        </h1>
                    </div>
                    <div class="d-flex gap-3 align-items-center">
                        <CreateTaskPopover
                            :group-id="route.params.id as string"
                        />
                    </div>
                </div>
            </div>
            <div class="task-content bg-white p-4 rounded-bottom-5">
                <div
                    v-if="error"
                    class="alert alert-danger rounded-4 border-0 d-flex align-items-center mb-4"
                    role="alert"
                >
                    <i class="bi bi-exclamation-triangle-fill text-danger me-2" />
                    Failed to load tasks
                    <button
                        class="btn btn-link text-danger p-0 ms-2 fw-medium"
                        @click="() => refresh()"
                    >
                        Retry
                    </button>
                </div>

                <TaskCalendar
                    :tasks="tasks"
                    :group-id="route.params.id as string"
                    @task-moved="handleTaskMoved"
                    @task-deleted="refresh()"
                    @task-edited="refresh()"
                />
            </div>
        </div>
    </AppSection>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'group',
})

const route = useRoute()
const error = ref(false)

const { data: tasksData } = await useFetch<SerializedTask[]>(`/api/group/${route.params.id}/task`)
const tasks = ref<SerializedTask[]>(tasksData.value || [])

// Refresh function
const refresh = async () => {
    try {
        error.value = false
        const { data } = await useFetch<SerializedTask[]>(`/api/group/${route.params.id}/task`)
        tasks.value = data.value || []
    } catch (e) {
        console.error('Error refreshing tasks:', e)
        error.value = true
    }
}

// Initial load
await refresh()

interface TaskMovedPayload {
    task: SerializedTask
    date: Date
    onComplete?: () => void
}

const handleTaskMoved = async (payload: TaskMovedPayload) => {
    try {
        const { task, date, onComplete } = payload

        await $fetch(`/api/group/${route.params.id}/task/${task.id}`, {
            method: 'PUT',
            body: {
                dueDate: date.toISOString(),
            },
        })

        refresh()
        onComplete?.()
    } catch (e) {
        console.error('Error moving task:', e)
        error.value = true
    }
}
</script>

<style scoped lang="scss">
.task-container {
    min-height: 75vh;
    overflow: hidden;
    position: relative;
    border-color: var(--bs-gray-200) !important;
    transition: all 0.3s ease;
}

.task-content {
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
    background: linear-gradient(to bottom, var(--bs-white), var(--bs-gray-100));

    &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: var(--bs-gray-300);
        border-radius: 4px;
        border: 2px solid transparent;
        background-clip: padding-box;

        &:hover {
            background: var(--bs-gray-400);
            border: 2px solid transparent;
            background-clip: padding-box;
        }
    }
}

@supports (scrollbar-color: auto) {
    .task-content {
        scrollbar-color: var(--bs-gray-300) transparent;
        scrollbar-width: thin;
    }
}

.spinner {
    width: 48px;
    height: 48px;
    border: 3px solid var(--bs-primary-subtle);
    border-top: 3px solid var(--bs-primary);
    border-radius: 50%;
    animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.loading-text {
    font-size: 1.1rem;
    color: var(--bs-gray-700);
    margin: 0;
    font-weight: 500;
    letter-spacing: -0.01em;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (prefers-reduced-motion: reduce) {
    .task-container,
    .loading-content,
    .spinner {
        transition: none;
        animation: none;
    }
}
</style>
