import { defineStore } from 'pinia'
import type { Group, Profile, Message } from '@prisma/client'

interface GroupWithDetails extends Group {
    members: Profile[]
    messages: (Message & {
        author: Profile
        replyTo?: {
            author: Profile
        } | null
    })[]
}

export const useGroupStore = defineStore('group', () => {
    const currentGroup = ref<GroupWithDetails | null>(null)
    const loading = ref(false)

    async function fetchGroup (id: string) {
        if (currentGroup.value?.id === id) { return currentGroup.value }

        try {
            loading.value = true
            // Fetch group data
            const { data: groupData } = await useFetch<Group>(`/api/group/${id}`)
            if (!groupData.value) { return null }

            // Fetch members
            const { data: members } = await useFetch<Profile[]>(`/api/group/${id}/members`)

            // Fetch messages
            const { data: messages } = await useFetch<GroupWithDetails['messages']>(`/api/group/${id}/messages`)

            // Combine all data
            currentGroup.value = {
                ...groupData.value,
                members: members.value || [],
                messages: messages.value || [],
            }

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
