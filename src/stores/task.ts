import { defineStore } from 'pinia'

interface TaskState {
    tasks: TaskWithRelations[]
    isLoading: boolean
    error: string | null
}

interface UpdateTaskPayload {
    dueDate: string | null
    taskRowId: number | null
}

export const useTaskStore = defineStore('task', {
    state: (): TaskState => ({
        tasks: [],
        isLoading: false,
        error: null,
    }),

    getters: {
        unassignedTasks: state =>
            state.tasks.filter(task => !task.dueDate && !task.taskRowId),
    },

    actions: {
        async fetchTasks (groupId: number) {
            this.isLoading = true
            this.error = null

            try {
                const supabase = useSupabaseClient()
                const { data: { session }, error: sessionError } = await supabase.auth.getSession()

                if (sessionError) {
                    throw new Error(`Authentication error: ${sessionError.message}`)
                }

                if (!session) {
                    throw new Error('No active session found. Please log in again.')
                }

                const response = await $fetch<TaskWithRelations[]>(
                    `/api/tasks/get?groupId=${groupId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${session.access_token}`,
                        },
                    },
                )

                if (!Array.isArray(response)) {
                    throw new TypeError('Invalid response format from server')
                }

                this.tasks = response
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tasks'
                this.error = errorMessage
                console.error('TaskStore - Failed to fetch tasks:', error)
                throw new Error(errorMessage)
            } finally {
                this.isLoading = false
            }
        },

        async updateTask (taskId: number, payload: UpdateTaskPayload) {
            this.isLoading = true
            this.error = null

            try {
                const supabase = useSupabaseClient()
                const { data: { session }, error: sessionError } = await supabase.auth.getSession()

                if (sessionError) {
                    throw new Error(`Authentication error: ${sessionError.message}`)
                }

                if (!session) {
                    throw new Error('No active session found. Please log in again.')
                }

                await $fetch(`/api/tasks/${taskId}/update`, {
                    method: 'PUT',
                    body: payload,
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                })
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to update task'
                this.error = errorMessage
                console.error('TaskStore - Failed to update task:', error)
                throw new Error(errorMessage)
            } finally {
                this.isLoading = false
            }
        },
    },
})
