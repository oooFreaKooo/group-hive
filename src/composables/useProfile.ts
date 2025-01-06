export const useProfile = () => {
    const checkProfile = async (userId: string) => {
        try {
            const { data } = await useFetch<{ exists: boolean }>('/api/profile/exists', {
                params: { userId },
            })
            return data.value?.exists ?? false
        } catch (error) {
            console.error('Error checking profile:', error)
            return false
        }
    }

    const getProfile = async (userId: string) => {
        try {
            const { data } = await useFetch('/api/profile/get', {
                params: { userId },
            })
            return data.value
        } catch (error) {
            console.error('Error getting profile:', error)
            return null
        }
    }

    return {
        checkProfile,
        getProfile,
    }
}
