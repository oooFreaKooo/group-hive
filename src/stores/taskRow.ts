import { defineStore } from 'pinia'
import type { TaskRow } from '@prisma/client'

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
                const response = await $fetch<(TaskRow & { tasks: TaskWithRelations[] })[]>(
                    `/api/task-rows/get?groupId=${groupId}`,
                )
                this.taskRows = response
            } catch (error) {
                console.error('TaskRowStore - Failed to fetch task rows:', error)
                throw error
            }
        },
    },
})
