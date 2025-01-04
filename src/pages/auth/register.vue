<template>
  <div class="flex min-h-[calc(100vh-4rem)] flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
        Create your account
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <AuthForm
          mode="register"
          button-text="Sign up"
          @submit="handleRegister"
        />
        
        <SocialAuth />

        <div class="mt-6">
          <div class="relative">
            <div class="relative flex justify-center text-sm">
              <span class="px-2 text-gray-500">
                Already have an account?
                <NuxtLink
                  to="/auth/login"
                  class="font-medium text-primary-600 hover:text-primary-500"
                >
                  Sign in
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
const { handleRegister } = useAuthForm()
</script>