import { ref } from 'vue'
import type { Database } from '~/types/database.types'

export interface GroupForm {
  name: string
  description?: string
}

interface GroupMember {
  id: string
  name: string
  avatar_url: string
  points: number
}

interface GroupData {
  name: string
  members: GroupMember[]
}

export function useGroup() {
  const currentGroup = ref<GroupData | null>(null)
  const loading = ref(false)
  const error = ref('')
  const router = useRouter()
  
  const fetchCurrentGroup = async () => {
    const client = useSupabaseClient<Database>()
    try {
      const { data: membership } = await client
        .from('group_members')
        .select('group_id')
        .single()

      if (membership) {
        const { data: group } = await client
          .from('groups')
          .select(`
            *,
            members:group_members(
              points,
              user:profiles(*)
            )
          `)
          .eq('id', membership.group_id)
          .single()

        if (group) {
          currentGroup.value = {
            name: group.name,
            members: group.members?.map((m: { user: { id: string; name: string; avatar_url: string | null }; points: number }) => ({
              id: m.user.id,
              name: m.user.name,
              avatar_url: m.user.avatar_url || '/default-avatar.png',
              points: m.points
            })) || []
          } as GroupData
        }
      }
    } catch (err) {
      console.error('Error fetching group:', err)
    }
  }

  const createGroup = async (form: GroupForm) => {
    const client = useSupabaseClient<Database>()
    const user = useSupabaseUser()
    loading.value = true
    error.value = ''

    try {
      // Create a new group
      const { data: group, error: groupError } = await client
        .from('groups')
        .insert({
          name: form.name,
          description: form.description,
          created_by: user.value?.id
        })
        .select()
        .single()

      if (groupError) throw groupError

      // Add the creator as a member
      const { error: memberError } = await client
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: user.value?.id,
          role: 'admin'
        })

      if (memberError) throw memberError

      currentGroup.value = {
        name: group.name,
        members: []
      } as GroupData
      await router.push('/dashboard')
    } catch (err: any) {
      console.error('Error:', err)
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const joinGroup = async (inviteCode: string) => {
    const client = useSupabaseClient<Database>()
    const user = useSupabaseUser()
    loading.value = true
    error.value = ''

    try {
      // Find the group by invite code
      const { data: group, error: groupError } = await client
        .from('groups')
        .select()
        .eq('invite_code', inviteCode)
        .single()

      if (groupError) throw groupError

      // Add the user as a member
      const { error: memberError } = await client
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: user.value?.id,
          role: 'member'
        })

      if (memberError) throw memberError

      currentGroup.value = {
        name: group.name,
        members: []
      } as GroupData
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
    joinGroup
  }
}