<template>
    <div class="mt-4">
        <div class="mb-3">
            <label class="form-label">Email Address</label>
            <input
                v-model="form.email"
                type="email"
                class="form-control"
            >
        </div>

        <div>
            <button
                class="btn btn-outline-secondary"
                @click="showPasswordModal = true"
            >
                Change Password
            </button>
        </div>

        <ChangePasswordModal v-model="showPasswordModal" />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: {
        email: string
    }
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: { email: string }): void
}>()

const showPasswordModal = ref(false)

const form = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
})
</script>
