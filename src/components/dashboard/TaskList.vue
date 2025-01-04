<template>
  <div class="rounded-lg bg-white p-6 shadow">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-medium text-gray-900">Tasks</h2>
      <div class="flex space-x-2">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="currentFilter = filter.value"
          :class="[
            currentFilter === filter.value
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-500 hover:text-gray-700',
            'rounded-md px-3 py-1.5 text-sm font-medium'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>
    
    <div class="mt-6 flow-root">
      <ul role="list" class="-my-5 divide-y divide-gray-200">
        <li v-for="task in filteredTasks" :key="task.id" class="py-4">
          <div class="flex items-center space-x-4">
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-gray-900">{{ task.title }}</p>
              <p class="truncate text-sm text-gray-500">Due {{ formatDate(task.due_date) }}</p>
            </div>
            <div>
              <button
                v-if="!task.completed"
                @click="completeTask(task.id)"
                class="inline-flex items-center rounded-md bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700"
              >
                Complete
              </button>
              <span
                v-else
                class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800"
              >
                Completed
              </span>
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
  { label: 'Pending', value: 'pending' }
]

// Mock data - replace with actual data from Supabase
const tasks = ref([
  {
    id: 1,
    title: 'Clean the kitchen',
    due_date: new Date(),
    completed: false
  }
])

const filteredTasks = computed(() => {
  // Implement filtering logic based on currentFilter
  return tasks.value
})

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const completeTask = async (taskId: number) => {
  // Implement task completion logic
}
</script>