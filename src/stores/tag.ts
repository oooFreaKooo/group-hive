import { defineStore } from 'pinia'
import type { Tag } from '@prisma/client'

interface TagState {
    tags: Tag[]
}

export const useTagStore = defineStore('tag', {
    state: (): TagState => ({
        tags: [],
    }),

    actions: {
        async fetchTags (groupId: number) {
            try {
                const response = await $fetch<Tag[]>(`/api/tags/get?groupId=${groupId}`)
                this.tags = response
            } catch (error) {
                console.error('TagStore - Failed to fetch tags:', error)
                throw error
            }
        },
    },
})
