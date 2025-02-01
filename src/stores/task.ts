import { defineStore } from 'pinia'
import type { SupabaseClient } from '@supabase/supabase-js'

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
                const { $supabase } = useNuxtApp()
                const { data: { session } } = await ($supabase as SupabaseClient).auth.getSession()
                if (!session) {
                    throw new Error('No auth session')
                }

                const response = await $fetch<TaskWithRelations[]>(
                    `/api/tasks/get?groupId=${groupId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${session.access_token}`,
                        },
                    },
                )
                this.tasks = response
            } catch (error) {
                console.error('TaskStore - Failed to fetch tasks:', error)
                throw error
            }
        },

        async updateTask (taskId: number, payload: UpdateTaskPayload) {
            try {
                const { $supabase } = useNuxtApp()
                const { data: { session } } = await ($supabase as SupabaseClient).auth.getSession()
                if (!session) {
                    throw new Error('No auth session')
                }

                await $fetch(`/api/tasks/${taskId}/update`, {
                    method: 'PUT',
                    body: payload,
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                })
            } catch (error) {
                console.error('TaskStore - Failed to update task:', error)
                throw error
            }
        },
    },
})
