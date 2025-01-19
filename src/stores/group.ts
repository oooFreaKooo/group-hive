import { defineStore } from 'pinia'
import type { Group, Profile, Message } from '@prisma/client'

interface GroupWithDetails extends Group {
    members: {
        profile: Profile
    }[]
    Message: (Message & {
        author: {
            profile: Profile
        }
        replyTo?: {
            author: {
                profile: Profile
            }
        } | null
    })[]
}

export const useGroupStore = defineStore('group', () => {
    const currentGroup = ref<GroupWithDetails | null>(null)
    const loading = ref(false)

    async function fetchGroup (id: string) {
        if (currentGroup.value?.id === Number(id)) { return currentGroup.value }

        try {
            loading.value = true
            const { data } = await useFetch<GroupWithDetails>(`/api/group/${id}`)
            currentGroup.value = data.value || null
            return currentGroup.value
        } catch (error) {
            console.error('Error fetching group:', error)
            currentGroup.value = null
            return null
        } finally {
            loading.value = false
        }
    }

    function clearGroup () {
        currentGroup.value = null
    }

    return {
        currentGroup,
        loading,
        fetchGroup,
        clearGroup,
    }
})
