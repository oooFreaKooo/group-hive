export default defineNuxtRouteMiddleware(async (to) => {
    const user = useSupabaseUser()
    const { checkProfile } = useProfile()

    if (!user.value) {
        return navigateTo('/auth/login')
    }

    try {
        const hasProfile = await checkProfile(user.value.id)

        // If no profile and not on confirm page, redirect to confirm
        if (!hasProfile && to.path !== '/auth/confirm') {
            return navigateTo('/auth/confirm')
        }

        // If on confirm page but has profile, redirect to dashboard
        if (hasProfile && to.path === '/auth/confirm') {
            return navigateTo('/dashboard')
        }
    } catch (error) {
        console.error('Error checking profile:', error)
        return navigateTo('/auth/login')
    }
})
