import { defineStore } from 'pinia'
import type { TaskRow } from '@prisma/client'

interface TaskRowState {
    taskRows: (TaskRow & { tasks: TaskWithRelations[] })[]
    isLoading: boolean
    error: string | null
}

export const useTaskRowStore = defineStore('taskRow', {
    state: (): TaskRowState => ({
        taskRows: [],
        isLoading: false,
        error: null,
    }),

    actions: {
        async fetchTaskRows (groupId: number) {
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

                const response = await $fetch<(TaskRow & { tasks: TaskWithRelations[] })[]>(
                    `/api/task-rows/get?groupId=${groupId}`,
                {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                },
                )

                if (!Array.isArray(response)) {
                    throw new TypeError('Invalid response format from server')
                }

                this.taskRows = response
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to fetch task rows'
                this.error = errorMessage
                console.error('TaskRowStore - Failed to fetch task rows:', error)
                throw new Error(errorMessage)
            } finally {
                this.isLoading = false
            }
        },
    },
})
