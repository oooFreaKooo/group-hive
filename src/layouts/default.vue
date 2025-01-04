<template>
  <div>
    <header class="bg-white shadow-sm">
      <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-primary-600">
              GroupHive
            </NuxtLink>
          </div>
          <div class="ml-10 space-x-4">
            <template v-if="user">
              <NuxtLink
                to="/dashboard"
                class="text-sm font-medium text-gray-700 hover:text-primary-600"
              >
                Dashboard
              </NuxtLink>
              <button
                @click="handleLogout"
                class="text-sm font-medium text-gray-700 hover:text-primary-600"
              >
                Logout
              </button>
            </template>
            <template v-else>
              <NuxtLink
                to="/auth/login"
                class="text-sm font-medium text-gray-700 hover:text-primary-600"
              >
                Login
              </NuxtLink>
              <NuxtLink
                to="/auth/register"
                class="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
              >
                Sign up
              </NuxtLink>
            </template>
          </div>
        </div>
      </nav>
    </header>

    <main>
      <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const client = useSupabaseClient()
const router = useRouter()

const handleLogout = async () => {
  await client.auth.signOut()
  router.push('/auth/login')
}
</script>