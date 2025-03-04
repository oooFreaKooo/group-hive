<template>
    <Teleport to="body">
        <div
            v-if="modelValue"
            class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style="background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(2px); z-index: 1050;"
            @click="$emit('update:modelValue', false)"
        >
            <div
                class="bg-white rounded-4 shadow-lg"
                style="width: 90%; max-width: 400px;"
                @click.stop
            >
                <!-- Header -->
                <div class="p-3 border-bottom">
                    <h6 class="mb-0 d-flex align-items-center gap-2">
                        <i
                            :class="[icon, { 'text-danger': type === 'danger', 'text-warning': type === 'warning' }]"
                        />
                        {{ title }}
                    </h6>
                </div>

                <!-- Body -->
                <div class="p-3">
                    <p class="small mb-3">
                        {{ message }}
                    </p>

                    <div class="d-flex gap-2 justify-content-end">
                        <button
                            type="button"
                            class="btn btn-sm btn-light rounded-3"
                            @click="$emit('update:modelValue', false)"
                        >
                            {{ cancelText }}
                        </button>
                        <button
                            type="button"
                            class="btn btn-sm rounded-3"
                            :class="{ 'btn-danger': type === 'danger', 'btn-warning': type === 'warning' }"
                            :disabled="loading"
                            @click="$emit('confirm')"
                        >
                            <span
                                v-if="loading"
                                class="d-flex align-items-center gap-2"
                            >
                                <div class="spinner-border spinner-border-sm" />
                                {{ loadingText }}
                            </span>
                            <span v-else>{{ confirmText }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    modelValue: boolean
    title: string
    message: string
    type?: 'danger' | 'warning'
    icon?: string
    confirmText?: string
    cancelText?: string
    loadingText?: string
    loading?: boolean
}>(), {
    type: 'danger',
    icon: 'bi bi-exclamation-triangle-fill',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    loadingText: 'Loading...',
    loading: false,
})

defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'confirm'): void
}>()
</script>

<style scoped>
.position-fixed {
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@media (prefers-reduced-motion: reduce) {
    .position-fixed {
        animation: none;
    }
}
</style>
