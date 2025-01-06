import type { Group as PrismaGroup, GroupUser as PrismaGroupUser } from '@prisma/client'

interface GroupUser extends PrismaGroupUser {
    profile: {
        id: string
        displayName: string | null
        avatarUrl: string | null
    }
}

export interface Group extends Omit<PrismaGroup, 'createdAt' | 'updatedAt'> {
    createdAt: string
    updatedAt: string
    members: GroupUser[]
    owner: {
        id: string
        displayName: string | null
        avatarUrl: string | null
    }
}

interface CreateGroupData {
    name: string
    description?: string
    city?: string
    postalCode?: string
}

interface UpdateGroupData extends CreateGroupData {
    id: number
}

export const useGroup = () => {
    const user = useSupabaseUser()
    const groups = ref<Group[]>([])
    const currentGroup = ref<Group | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchGroups = async () => {
        if (!user.value?.id) { return }

        loading.value = true
        error.value = null

        try {
            const data = await $fetch<Group[]>('/api/group/get', {
                params: { profileId: user.value.id },
            })
            groups.value = data
        } catch (err: any) {
            console.error('Error fetching groups:', err)
            error.value = err.message || 'Failed to fetch groups'
        } finally {
            loading.value = false
        }
    }

    const fetchGroup = async (id: number) => {
        if (!user.value?.id) { return }

        loading.value = true
        error.value = null

        try {
            const data = await $fetch<Group>('/api/group/get', {
                params: { id, profileId: user.value.id },
            })
            currentGroup.value = data
            return data
        } catch (err: any) {
            console.error('Error fetching group:', err)
            error.value = err.message || 'Failed to fetch group'
            return null
        } finally {
            loading.value = false
        }
    }

    const createGroup = async (groupData: CreateGroupData) => {
        if (!user.value?.id) { return }

        loading.value = true
        error.value = null

        try {
            const data = await $fetch<Group>('/api/group/create', {
                method: 'POST',
                body: {
                    ...groupData,
                    ownerId: user.value.id,
                },
            })
            await fetchGroups()
            return data
        } catch (err: any) {
            console.error('Error creating group:', err)
            error.value = err.message || 'Failed to create group'
            return null
        } finally {
            loading.value = false
        }
    }

    const updateGroup = async (groupData: UpdateGroupData) => {
        if (!user.value?.id) { return }

        loading.value = true
        error.value = null

        try {
            const data = await $fetch<Group>('/api/group/update', {
                method: 'PUT',
                body: {
                    ...groupData,
                    profileId: user.value.id,
                },
            })
            if (currentGroup.value?.id === groupData.id) {
                currentGroup.value = data
            }
            await fetchGroups()
            return data
        } catch (err: any) {
            console.error('Error updating group:', err)
            error.value = err.message || 'Failed to update group'
            return null
        } finally {
            loading.value = false
        }
    }

    const deleteGroup = async (id: number) => {
        if (!user.value?.id) { return }

        loading.value = true
        error.value = null

        try {
            await $fetch('/api/group/delete', {
                method: 'DELETE',
                body: {
                    id,
                    profileId: user.value.id,
                },
            })
            if (currentGroup.value?.id === id) {
                currentGroup.value = null
            }
            await fetchGroups()
            return true
        } catch (err: any) {
            console.error('Error deleting group:', err)
            error.value = err.message || 'Failed to delete group'
            return false
        } finally {
            loading.value = false
        }
    }

    const joinGroup = async (invitationCode: string) => {
        if (!user.value?.id) { return }

        loading.value = true
        error.value = null

        try {
            const data = await $fetch<GroupUser>('/api/group/join', {
                method: 'POST',
                body: {
                    invitationCode,
                    profileId: user.value.id,
                },
            })
            await fetchGroups()
            return data
        } catch (err: any) {
            console.error('Error joining group:', err)
            error.value = err.message || 'Failed to join group'
            return null
        } finally {
            loading.value = false
        }
    }

    // Check if the current user is an admin of the group
    const isAdmin = (group: Group) => {
        if (!user.value?.id || !group) { return false }
        const member = group.members.find(m => m.profileId === user.value?.id)
        return member?.role === 'ADMIN'
    }

    // Check if the current user is the owner of the group
    const isOwner = (group: Group) => {
        if (!user.value?.id || !group) { return false }
        return group.ownerId === user.value.id
    }

    return {
        groups,
        currentGroup,
        loading,
        error,
        fetchGroups,
        fetchGroup,
        createGroup,
        updateGroup,
        deleteGroup,
        joinGroup,
        isAdmin,
        isOwner,
    }
}
