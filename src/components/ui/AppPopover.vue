<template>
    <div
        class="custom-popover shadow-lg card rounded-5"
        @click.stop
    >
        <div class="container popover-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h3 class="mb-0">
                    {{ title }}
                </h3>
                <button
                    class="btn-close"
                    @click="$emit('close')"
                />
            </div>
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string
}>()

defineEmits<{
    (e: 'close'): void
}>()
</script>

<style scoped lang="scss">
.custom-popover {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 6px;
    width: 90%;
    max-width: 500px;
    z-index: 1050;
    animation: fadeIn 0.2s ease;
}

.popover-body {
    background: var(--c-gray-800);
    border-radius: 0 0 6px 6px;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translate(-50%, -60%);
    }
    to {
        opacity: 1;
        transform: translate(-50%, -50%);
    }
}
</style>
