import { ref } from 'vue'
import type { Database } from '~/types/database.types'

export interface GroupForm {
    name: string
    description?: string
}

interface GroupMember {
    id: string
    name: string
    avatar_url: string | null
    points: number
}

interface GroupData {
    name: string
    members: GroupMember[]
}

export interface GroupMemberWithGroup {
    role: string
    group: {
        id: string
        name: string
    }
}

export function useGroup () {
    const currentGroup = ref<GroupData | null>(null)
    const loading = ref(false)
    const error = ref('')
    const router = useRouter()
    const client = useSupabaseClient<Database>()
    const user = useSupabaseUser()

    const fetchCurrentGroup = async () => {
        if (!user.value?.id) { return }

        try {
            const { data: membership } = await client
                .from('group_members')
                .select('group_id')
                .eq('user_id', user.value.id)
                .single()

            if (membership) {
                const { data: group } = await client
                    .from('groups')
                    .select(`
                        *,
                        members:group_members(
                            points,
                            user:users!inner(
                                id,
                                raw_user_meta_data,
                                email
                            )
                        )
                    `)
                    .eq('id', membership.group_id)
                    .single()

                if (group) {
                    currentGroup.value = {
                        name: group.name,
                        members: group.members?.map((m: any) => ({
                            id: m.user.id,
                            name: m.user.raw_user_meta_data.name || m.user.email?.split('@')[0] || 'Unknown',
                            avatar_url: m.user.raw_user_meta_data.avatar_url || '/default-avatar.png',
                            points: m.points,
                        })) || [],
                    }
                }
            }
        } catch (err) {
            console.error('Error fetching group:', err)
        }
    }

    const createGroup = async (form: GroupForm) => {
        loading.value = true
        error.value = ''

        try {
            // Create a new group
            const { data: group, error: groupError } = await client
                .from('groups')
                .insert({
                    name: form.name,
                    description: form.description,
                    created_by: user.value?.id,
                    invite_code: generateInviteCode(),
                })
                .select()
                .single()

            if (groupError) { throw groupError }

            // Add the creator as a member
            const { error: memberError } = await client
                .from('group_members')
                .insert({
                    group_id: group.id,
                    user_id: user.value?.id,
                    role: 'admin',
                    points: 0,
                })

            if (memberError) { throw memberError }

            currentGroup.value = {
                name: group.name,
                members: [
                    {
                        id: user.value?.id || '',
                        name: user.value?.user_metadata?.name || user.value?.email?.split('@')[0] || 'Unknown',
                        avatar_url: user.value?.user_metadata?.avatar_url || '/default-avatar.png',
                        points: 0,
                    },
                ],
            }
            await router.push('/dashboard')
        } catch (err: any) {
            console.error('Error:', err)
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    const joinGroup = async (inviteCode: string) => {
        loading.value = true
        error.value = ''

        try {
            // Find the group by invite code
            const { data: group, error: groupError } = await client
                .from('groups')
                .select()
                .eq('invite_code', inviteCode)
                .single()

            if (groupError) { throw groupError }

            // Add the user as a member
            const { error: memberError } = await client
                .from('group_members')
                .insert({
                    group_id: group.id,
                    user_id: user.value?.id,
                    role: 'member',
                    points: 0,
                })

            if (memberError) { throw memberError }

            currentGroup.value = {
                name: group.name,
                members: [
                    {
                        id: user.value?.id || '',
                        name: user.value?.user_metadata?.name || user.value?.email?.split('@')[0] || 'Unknown',
                        avatar_url: user.value?.user_metadata?.avatar_url || '/default-avatar.png',
                        points: 0,
                    },
                ],
            }
            await router.push('/dashboard')
        } catch (err: any) {
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    return {
        currentGroup,
        loading,
        error,
        fetchCurrentGroup,
        createGroup,
        joinGroup,
    }
}

function generateInviteCode () {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
