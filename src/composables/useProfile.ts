export const useProfile = () => {
    const user = useSupabaseUser()
    const profile = useState<{
        displayName: string | null
        avatarUrl: string | null
        role: 'USER' | 'ADMIN'
        city: string | null
        postalCode: string | null
    } | null>('profile', () => null)

    const checkProfile = async (userId: string) => {
        try {
            const data = await $fetch<{ exists: boolean }>('/api/profile/exists', {
                params: { userId },
            })
            return data?.exists ?? false
        } catch (error) {
            console.error('Error checking profile:', error)
            return false
        }
    }

    const getProfile = async (userId: string) => {
        try {
            const data = await $fetch('/api/profile/get', {
                params: { userId },
            })
            return data
        } catch (error) {
            console.error('Error getting profile:', error)
            return null
        }
    }

    const refreshProfile = async () => {
        if (user.value?.id) {
            profile.value = await getProfile(user.value.id)
        }
    }

    return {
        profile,
        checkProfile,
        getProfile,
        refreshProfile,
    }
}
