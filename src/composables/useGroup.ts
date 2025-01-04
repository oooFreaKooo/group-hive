import { ref, computed } from 'vue'

export function useGroup() {
  const currentGroup = ref(null)
  const loading = ref(false)
  const error = ref('')
  
  const fetchCurrentGroup = async () => {
    const client = useSupabaseClient()
    loading.value = true
    error.value = ''
    
    try {
      const { data: membership, error: membershipError } = await client
        .from('group_members')
        .select('group_id')
        .single()
      
      if (membershipError) throw membershipError
      
      if (membership) {
        const { data: group, error: groupError } = await client
          .from('groups')
          .select(`
            *,
            members:group_members(
              user:profiles(*)
            )
          `)
          .eq('id', membership.group_id)
          .single()
        
        if (groupError) throw groupError
        currentGroup.value = group
      }
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
    fetchCurrentGroup
  }
}