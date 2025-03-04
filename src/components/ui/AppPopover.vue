<template>
    <div>
        <!-- Trigger Button -->
        <slot
            name="trigger"
            v-bind="triggerSlotProps"
        >
            <button
                class="btn btn-light btn-sm rounded-pill"
                @click="open"
            >
                <i class="bi bi-plus-lg me-2" />
                {{ triggerText }}
            </button>
        </slot>

        <Teleport to="body">
            <Transition>
                <div
                    v-if="isOpen"
                    class="popover-wrapper"
                >
                    <!-- Dark overlay backdrop -->
                    <div
                        v-if="overlay"
                        class="popover-overlay"
                        @click="close"
                    />

                    <div
                        class="custom-popover shadow-lg card rounded-5"
                        @click.stop
                    >
                        <!-- Header -->
                        <div class="p-2 px-3 bg-dark rounded-top-5">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center">
                                    <span class="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 me-3">
                                        <i class="bi bi-list-task me-2" />
                                        {{ title }}
                                    </span>
                                </div>
                                <div class="d-flex gap-3 align-items-center">
                                    <button
                                        class="bg-light rounded-circle p-2 btn-close"
                                        @click="close"
                                    />
                                </div>
                            </div>
                        </div>

                        <!-- Body -->
                        <div class="container popover-body p-3">
                            <slot />
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue'

const _props = withDefaults(defineProps<{
    title: string
    triggerText?: string
    overlay?: boolean
}>(), {
    triggerText: '',
    overlay: false,
})

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'open'): void
}>()

const isOpen = ref(false)

const close = () => {
    isOpen.value = false
    emit('close')
}

const open = () => {
    isOpen.value = true
    emit('open')
}

// Expose methods to parent components
defineExpose({
    close,
    open,
})

// Define slot props type
type TriggerSlotProps = {
    open: () => void
    close: () => void
    isOpen: ComputedRef<boolean>
}

// Provide slot props
const triggerSlotProps = {
    open,
    close,
    isOpen: computed(() => isOpen.value),
} satisfies TriggerSlotProps
</script>

<style scoped lang="scss">
.popover-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1040;
}

.popover-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
}

.custom-popover {
    position: relative;
    width: 90%;
    max-width: 500px;
    z-index: 1050;
    background: white;
    border: none;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08) !important;
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
    .v-enter-active,
    .v-leave-active {
        transition: none;
    }
}
</style>
