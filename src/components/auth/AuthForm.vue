<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">
        Email address
      </label>
      <input
        id="email"
        v-model="email"
        type="email"
        required
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
      />
    </div>

    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">
        Password
      </label>
      <input
        id="password"
        v-model="password"
        type="password"
        required
        class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
      />
    </div>

    <div v-if="error" class="rounded-md bg-red-50 p-4">
      <p class="text-sm text-red-700">{{ error }}</p>
    </div>

    <button
      type="submit"
      :disabled="loading"
      class="w-full rounded-md bg-primary-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
    >
      {{ loading ? 'Loading...' : buttonText }}
    </button>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{
  mode: 'login' | 'register'
  buttonText: string
}>()

const emit = defineEmits<{
  submit: [email: string, password: string]
}>()

const email = ref('')
const password = ref('')
const { error, loading } = useAuthForm()

const onSubmit = () => {
  emit('submit', email.value, password.value)
}
</script>