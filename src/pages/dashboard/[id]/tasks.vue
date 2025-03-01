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
                        <CreateTaskPopover
                            :group-id="route.params.id as string"
                            @task-created="refresh"
                        />
                    </div>
                </div>
            </div>
            <div class="task-content bg-white p-4">
                <div
                    v-if="error"
                    class="alert alert-danger mb-4"
                    role="alert"
                >
                    Failed to load tasks
                    <button
                        class="btn btn-link p-0 ms-2"
                        @click="() => refresh()"
                    >
                        Retry
                    </button>
                </div>
                <TaskCalendar
                    :tasks="tasks"
                    @task-moved="handleTaskMoved"
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

// Fetch tasks directly with proper typing
const { data: tasksData } = await useFetch<SerializedTask[]>(`/api/group/${route.params.id}/task`)
const tasks = ref<SerializedTask[]>(tasksData.value || [])

// Refresh function
const refresh = async () => {
    try {
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
