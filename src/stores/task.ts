import { defineStore } from 'pinia'

interface TaskState {
    tasks: TaskWithRelations[]
}

interface UpdateTaskPayload {
    dueDate: string | null
    taskRowId: number | null
}

export const useTaskStore = defineStore('task', {
    state: (): TaskState => ({
        tasks: [],
    }),

    getters: {
        unassignedTasks: state =>
            state.tasks.filter(task => !task.dueDate && !task.taskRowId),
    },

    actions: {
        async fetchTasks (groupId: number) {
            try {
                const response = await $fetch<TaskWithRelations[]>(`/api/tasks/get?groupId=${groupId}`)
                this.tasks = response
            } catch (error) {
                console.error('TaskStore - Failed to fetch tasks:', error)
                throw error
            }
        },

        async updateTask (taskId: number, payload: UpdateTaskPayload) {
            try {
                await $fetch(`/api/tasks/${taskId}/update`, {
                    method: 'PUT',
                    body: payload,
                })
            } catch (error) {
                console.error('TaskStore - Failed to update task:', error)
                throw error
            }
        },
    },
})
