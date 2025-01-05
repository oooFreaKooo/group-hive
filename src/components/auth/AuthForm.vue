<template>
    <form @submit.prevent="onSubmit">
        <div class="mb-3">
            <label
                for="email"
                class="form-label"
            >
                Email address
            </label>
            <input
                id="email"
                v-model="email"
                type="email"
                required
                class="form-control"
            >
        </div>

        <div class="mb-3">
            <label
                for="password"
                class="form-label"
            >
                Password
            </label>
            <input
                id="password"
                v-model="password"
                type="password"
                required
                class="form-control"
            >
        </div>

        <div
            v-if="error"
            class="alert alert-danger"
        >
            <p class="mb-0">
                {{ error }}
            </p>
        </div>

        <button
            type="submit"
            :disabled="loading"
            class="btn btn-primary w-100"
        >
            {{ loading ? 'Loading...' : buttonText }}
        </button>
    </form>
</template>

<script setup lang="ts">
defineProps<{
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
