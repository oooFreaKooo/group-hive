<template>
    <div>
        <!-- Dark overlay backdrop -->
        <div
            v-if="overlay"
            class="popover-overlay"
            @click="$emit('close')"
        />

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
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string
    overlay?: boolean
}>()

defineEmits<{
    (e: 'close'): void
}>()
</script>

<style scoped lang="scss">
.popover-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    z-index: 1040;
    animation: fadeIn 0.2s ease;
}

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

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
</style>
