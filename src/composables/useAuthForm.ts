import { z } from 'zod'
import { ref } from 'vue'
import type { Database } from '~/types/database.types'

const authSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

export function useAuthForm () {
    const error = ref('')
    const loading = ref(false)
    const client = useSupabaseClient<Database>()

    const validateForm = (email: string, password: string) => {
        try {
            authSchema.parse({ email, password })
            return true
        } catch (err) {
            if (err instanceof z.ZodError) {
                error.value = err.errors[0].message
            }
            return false
        }
    }

    const handleLogin = async (email: string, password: string) => {
        if (!validateForm(email, password)) { return }

        loading.value = true
        error.value = ''

        try {
            const { error: authError, data } = await client.auth.signInWithPassword({
                email,
                password,
            })

            if (authError) { throw authError }

            if (data?.user) {
                await navigateTo('/dashboard', { replace: true })
            }
        } catch (err: any) {
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    const handleRegister = async (email: string, password: string) => {
        if (!validateForm(email, password)) { return }

        loading.value = true
        error.value = ''

        try {
            const { error: authError, data } = await client.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/confirm`,
                },
            })

            if (authError) { throw authError }

            // Check if user already exists
            if (data.user && !data.user.identities?.length) {
                error.value = 'This email is already registered. Please login instead.'
                return
            }

            await navigateTo('/auth/login?registered=true')
        } catch (err: any) {
            error.value = err.message
        } finally {
            loading.value = false
        }
    }

    return {
        error,
        loading,
        handleLogin,
        handleRegister,
    }
}
