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
                const supabase = useSupabaseClient()
                const { data: { session }, error: sessionError } = await supabase.auth.getSession()
                if (sessionError) {
                    throw new Error(`Auth session error: ${sessionError.message}`)
                }
                if (!session) {
                    throw new Error('No active session found')
                }

                const response = await $fetch<Tag[]>(
                    `/api/tags/get?groupId=${groupId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${session.access_token}`,
                        },
                    },
                )
                this.tags = response
            } catch (error) {
                console.error('TagStore - Failed to fetch tags:', error)
                throw error
            }
        },
    },
})
