import { z } from 'zod'
import { ref } from 'vue'

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export function useAuthForm() {
  const error = ref('')
  const loading = ref(false)
  const client = useSupabaseClient()
  const router = useRouter()

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
    if (!validateForm(email, password)) return

    loading.value = true
    error.value = ''

    try {
      const { error: authError } = await client.auth.signInWithPassword({
        email,
        password
      })

      if (authError) throw authError

      await router.push('/dashboard')
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const handleRegister = async (email: string, password: string) => {
    if (!validateForm(email, password)) return

    loading.value = true
    error.value = ''

    try {
      const { error: authError } = await client.auth.signUp({
        email,
        password
      })

      if (authError) throw authError

      await router.push('/auth/login?registered=true')
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
    handleRegister
  }
}