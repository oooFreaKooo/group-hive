<template>
    <div class="card p-4">
        <div class="d-flex justify-content-between align-items-center">
            <h2 class="h4 mb-0">
                Tasks
            </h2>
            <div class="btn-group">
                <button
                    v-for="filter in filters"
                    :key="filter.value"
                    :class="[
                        'btn',
                        currentFilter === filter.value
                            ? 'btn-primary'
                            : 'btn-outline-secondary',
                    ]"
                    @click="currentFilter = filter.value"
                >
                    {{ filter.label }}
                </button>
            </div>
        </div>

        <div class="mt-4">
            <ul class="list-unstyled">
                <li
                    v-for="task in filteredTasks"
                    :key="task.id"
                    class="py-3 border-bottom"
                >
                    <div class="d-flex align-items-center justify-content-between">
                        <div class="text-truncate me-3">
                            <p class="mb-0 fw-medium text-truncate">
                                {{ task.title }}
                            </p>
                            <p class="mb-0 small text-muted text-truncate">
                                Due {{ formatDate(task.due_date) }}
                            </p>
                        </div>
                        <div>
                            <!--                             <button
                                v-if="!task.completed"
                                class="btn btn-primary btn-sm"
                                @click="completeTask(task.id)"
                            >
                                Complete
                            </button>
                            <span
                                v-else
                                class="badge bg-success"
                            >
                                Completed
                            </span>
                            -->
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
const currentFilter = ref('all')
const filters = [
    { label: 'All', value: 'all' },
    { label: 'Mine', value: 'mine' },
    { label: 'Pending', value: 'pending' },
]

// Mock data - replace with actual data from Supabase
const tasks = ref([
    {
        id: 1,
        title: 'Clean the kitchen',
        due_date: new Date(),
        completed: false,
    },
])

const filteredTasks = computed(() => {
    // Implement filtering logic based on currentFilter
    return tasks.value
})

const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
    }).format(date)
}

/* const completeTask = async (taskId: number) => {
    // Implement task completion logic
} */
</script>
