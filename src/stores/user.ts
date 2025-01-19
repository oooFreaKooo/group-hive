import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'
import type { Profile, Group } from '@prisma/client'
import { useStorage } from '@vueuse/core'

interface ExtendedProfile extends Profile {
    ownedGroups?: Group[]
}

export const useUserStore = defineStore('user', () => {
    const user = useStorage<User | null>('user', null)
    const profile = useStorage<ExtendedProfile | null>('profile', null)
    const loading = ref(false)
    const initialized = ref(false)

    const isAuthenticated = computed(() => !!user.value)
    const displayName = computed(() => profile.value?.displayName)
    const userEmail = computed(() => user.value?.email)
    const userAvatar = computed(() => profile.value?.avatarUrl)

    async function init () {
        if (initialized.value) { return }

        const supabaseUser = useSupabaseUser()
        if (supabaseUser.value && !user.value) {
            user.value = supabaseUser.value
            await fetchProfile()
        }
        initialized.value = true
    }

    function setUser (newUser: User | null) {
        user.value = newUser
    }

    async function fetchProfile () {
        if (profile.value) { return }

        try {
            loading.value = true
            const { data } = await useFetch('/api/profile/get')
            profile.value = data.value?.profile as ExtendedProfile | null
        } catch (error) {
            console.error('Error fetching profile:', error)
            profile.value = null
        } finally {
            loading.value = false
        }
    }

    async function updateProfile (profileData: Partial<ExtendedProfile>) {
        try {
            loading.value = true
            const response = await $fetch('/api/profile/update', {
                method: 'PUT',
                body: profileData,
            })
            if (response) {
                profile.value = { ...profile.value, ...profileData } as ExtendedProfile
            }
            return response
        } catch (error) {
            console.error('Error updating profile:', error)
            throw error
        } finally {
            loading.value = false
        }
    }

    function clearUser () {
        user.value = null
        profile.value = null
        initialized.value = false
    }

    // Initialize on store creation
    init()

    return {
        user,
        profile,
        loading,
        isAuthenticated,
        displayName,
        userEmail,
        userAvatar,
        setUser,
        fetchProfile,
        updateProfile,
        clearUser,
        init,
    }
})
