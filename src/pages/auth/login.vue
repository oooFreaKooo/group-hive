<template>
  <div class="flex min-h-[calc(100vh-4rem)] flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Sign in to your account
      </h2>
      <p v-if="registered" class="mt-2 text-center text-sm text-green-600">
        Registration successful! Please sign in.
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <AuthForm
          mode="login"
          button-text="Sign in"
          @submit="handleLogin"
        />
        
        <SocialAuth />

        <div class="mt-6">
          <div class="relative">
            <div class="relative flex justify-center text-sm">
              <span class="px-2 text-gray-500">
                Don't have an account?
                <NuxtLink
                  to="/auth/register"
                  class="font-medium text-primary-600 hover:text-primary-500"
                >
                  Sign up
                </NuxtLink>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { handleLogin } = useAuthForm()
const registered = computed(() => route.query.registered === 'true')
</script>