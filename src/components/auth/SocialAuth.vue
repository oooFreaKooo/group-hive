<template>
  <div class="mt-6">
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300" />
      </div>
      <div class="relative flex justify-center text-sm">
        <span class="bg-white px-2 text-gray-500">Or continue with</span>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-2 gap-3">
      <button
        @click="signInWithGoogle"
        :disabled="loading"
        class="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-2"
      >
        <img src="https://www.google.com/favicon.ico" alt="Google" class="h-5 w-5" />
        <span>Google</span>
      </button>

      <button
        @click="signInWithFacebook"
        :disabled="loading"
        class="flex w-full items-center justify-center gap-3 rounded-md bg-[#1877F2] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0C63D4] focus-visible:ring-2"
      >
        <img src="https://www.facebook.com/favicon.ico" alt="Facebook" class="h-5 w-5" />
        <span>Facebook</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const client = useSupabaseClient()
const loading = ref(false)
const error = ref('')

const handleSocialLogin = async (provider: 'google' | 'facebook') => {
  loading.value = true
  error.value = ''
  
  try {
    const { error: authError } = await client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/confirm`
      }
    })
    
    if (authError) throw authError
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const signInWithGoogle = () => handleSocialLogin('google')
const signInWithFacebook = () => handleSocialLogin('facebook')
</script>