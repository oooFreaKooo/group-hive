import { defineStore } from 'pinia'
import type { TaskRow } from '@prisma/client'
import type { SupabaseClient } from '@supabase/supabase-js'

interface TaskRowState {
    taskRows: (TaskRow & { tasks: TaskWithRelations[] })[]
}

export const useTaskRowStore = defineStore('taskRow', {
    state: (): TaskRowState => ({
        taskRows: [],
    }),

    actions: {
        async fetchTaskRows (groupId: number) {
            try {
                const { $supabase } = useNuxtApp()
                const { data: { session } } = await ($supabase as SupabaseClient).auth.getSession()
                if (!session) {
                    throw new Error('No auth session')
                }

                const response = await $fetch<(TaskRow & { tasks: TaskWithRelations[] })[]>(
                    `/api/task-rows/get?groupId=${groupId}`,
                {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                },
                )
                this.taskRows = response
            } catch (error) {
                console.error('TaskRowStore - Failed to fetch task rows:', error)
                throw error
            }
        },
    },
})
