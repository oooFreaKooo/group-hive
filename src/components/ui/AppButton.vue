<template>
    <button
        :class="[
            'app-button',
            `app-button--${variant}`,
            `app-button--${size}`,
            `app-button--width-${width}`,
            `d-flex align-items-center justify-content-${justify}`,
            {
                'app-button--active': active,
                'app-button--block': block,
                'app-button--icon-only': iconOnly,
                'app-button--loading': loading,
                'app-button--disabled': disabled,
                [`app-button--${shape}`]: shape,
            },
            className,
        ]"
        :disabled="disabled || loading"
        v-bind="$attrs"
        @click="$emit('click', $event)"
    >
        <!-- Leading Icon -->
        <AppIcon
            v-if="icon && !iconRight"
            :name="icon"
            :color="iconColor"
            :class="[
                'app-button__icon',
                { 'me-2': !iconOnly && hasDefaultSlot },
            ]"
        />

        <!-- Loading Spinner -->
        <div
            v-if="loading"
            class="spinner-border spinner-border-sm app-button__spinner"
            role="status"
        >
            <span class="visually-hidden">Loading...</span>
        </div>

        <!-- Content -->
        <span
            v-if="!iconOnly"
            :class="{ 'opacity-0': loading }"
        >
            <slot />
        </span>

        <!-- Trailing Icon -->
        <AppIcon
            v-if="icon && iconRight"
            :name="icon"
            :color="iconColor"
            :class="[
                'app-button__icon',
                { 'ms-2': !iconOnly && hasDefaultSlot },
            ]"
        />
    </button>
</template>

<script setup lang="ts">
const slots = useSlots()
const hasDefaultSlot = computed(() => !!slots.default)

const props = withDefaults(defineProps<{
    // Style variants
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
    size?: 'sm' | 'md' | 'lg'
    shape?: 'rounded' | 'pill' | 'square'
    className?: string
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
    width?: 'auto' | 'full' | 'content'

    // Icon options
    icon?: string
    iconRight?: boolean
    iconOnly?: boolean
    iconColor?: Color

    // States
    active?: boolean
    disabled?: boolean
    loading?: boolean
    block?: boolean
}>(), {
    variant: 'primary',
    size: 'md',
    shape: 'rounded',
    className: '',
    iconColor: undefined,
    justify: 'center',
    width: 'auto',
})

// Computed icon color based on variant and state
const iconColor = computed((): Color => {
    if (props.iconColor) { return props.iconColor }

    // If active, use white for variants that have white text in active state
    if (props.active) { return 'light' }

    // For each variant, match text color
    switch (props.variant) {
        case 'primary':
            return 'light'
        case 'secondary':
            return 'dark'
        case 'outline':
            return props.active ? 'light' : 'dark'
        case 'ghost':
            return props.active ? 'light' : 'dark'
        case 'link':
            return 'primary'
        default:
            return 'dark'
    }
})

defineEmits<{
    (e: 'click', event: MouseEvent): void
}>()
</script>

<style scoped>
.app-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    border: none;
    transition: all 0.2s ease-in-out;
    position: relative;
    text-decoration: none;
    cursor: pointer;
}

/* Width Variants */
.app-button--width-auto {
    width: auto;
}

.app-button--width-full {
    width: 100%;
}

.app-button--width-content {
    width: fit-content;
}

/* Size Variants */
.app-button--sm {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
}

.app-button--md {
    padding: 0.875rem 1.25rem;
    font-size: 1rem;
}

.app-button--lg {
    padding: 1rem 1.5rem;
    font-size: 1.125rem;
}

/* Shape Variants */
.app-button--rounded {
    border-radius: 12px;
}

.app-button--pill {
    border-radius: 9999px;
}

.app-button--square {
    border-radius: 4px;
}

/* Style Variants */
.app-button--primary {
    background-color: var(--bs-primary);
    color: white;
}

.app-button--primary:hover:not(:disabled) {
    background-color: var(--bs-primary-dark, var(--bs-primary));
    box-shadow: 0 4px 12px rgba(var(--bs-primary-rgb), 0.15);
}

.app-button--secondary {
    background-color: var(--bs-gray-200);
    color: var(--bs-gray-700);
}

.app-button--secondary:hover:not(:disabled) {
    background-color: var(--bs-gray-300);
}

.app-button--outline {
    background-color: transparent;
    border: 2px solid var(--bs-gray-200) !important;
    color: var(--bs-gray-700);
}

.app-button--outline:hover:not(:disabled) {
    border-color: var(--bs-primary) !important;
    color: var(--bs-primary);
}

.app-button--ghost {
    background-color: transparent;
    color: var(--bs-gray-700);
}

.app-button--ghost:hover:not(:disabled) {
    background-color: var(--bs-primary-bg-subtle);
    color: var(--bs-primary);
}

.app-button--link {
    background-color: transparent;
    color: var(--bs-primary);
    padding-left: 0;
    padding-right: 0;
}

.app-button--link:hover:not(:disabled) {
    color: var(--bs-primary-dark, var(--bs-primary));
    text-decoration: underline;
}

/* States */
.app-button--active {
    background-color: var(--bs-primary) !important;
    color: white !important;
    box-shadow: 0 4px 12px rgba(var(--bs-primary-rgb), 0.15);
}

.app-button--disabled,
.app-button:disabled {
    opacity: 0.65;
    cursor: not-allowed;
}

.app-button--block {
    display: flex;
    width: 100%;
}

.app-button--loading {
    cursor: wait;
}

.app-button--icon-only {
    padding: 0.5rem;
    aspect-ratio: 1;
}

/* Icon Styles */
.app-button__icon {
    flex-shrink: 0;
}

.app-button__spinner {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}

/* Hover Effects */
.app-button:hover:not(:disabled) {
    transform: translateY(-1px);
}

.app-button:active:not(:disabled) {
    transform: translateY(0);
}
</style>
