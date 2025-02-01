import { defineStore } from 'pinia'
import type { Tag } from '@prisma/client'
import type { SupabaseClient } from '@supabase/supabase-js'

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
                const { $supabase } = useNuxtApp()
                const { data: { session } } = await ($supabase as SupabaseClient).auth.getSession()
                if (!session) {
                    throw new Error('No auth session')
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
