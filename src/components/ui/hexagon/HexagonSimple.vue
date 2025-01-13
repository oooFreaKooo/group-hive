<template>
    <button
        class="hexagon-button"
        :style="{
            '--icon-size': `${iconSize}px`,
        }"
        type="button"
        @click="$emit('click')"
    >
        <div class="hexagon-wrapper">
            <i
                class="bi bi-hexagon-fill hexagon-shape2 text-black z-1"
            />
            <i
                class="bi bi-hexagon-fill hexagon-shape1 text-white z-2"
            />
            <div class="hexagon-content z-3">
                <i
                    :class="[
                        'hexagon-icon',
                        `bi bi-${icon}`,
                    ]"
                />
            </div>
        </div>
    </button>
</template>

<script lang="ts" setup>
defineProps({
    icon: {
        type: String,
        default: 'person',
    },
    angle: {
        type: String,
        default: '0deg',
    },
    size: {
        type: String as () => Size,
        default: 'lg',
    },
    iconSize: {
        type: Number,
        default: 20,
    },
    color: {
        type: String,
        default: 'var(--bs-white)',
    },
    hoverColor: {
        type: String,
        default: '',
    },
})

defineEmits(['click'])
</script>

<style scoped lang="scss">
.hexagon-button {
    padding: 0;
    transition: transform 0.2s ease;

    &.is-disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
}

.hexagon-wrapper {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.hexagon-shape1 {
    position: absolute;
    transition: color 0.2s ease;
    font-size: 46px;
}

.hexagon-shape2 {
    position: absolute;
    transition: color 0.2s ease;
    font-size: 48px;
}

.hexagon-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hexagon-icon {
    font-size: var(--icon-size);
}

// Size variants
.size-xs .hexagon-wrapper { width: 30px; height: 30px; }
.size-sm .hexagon-wrapper { width: 40px; height: 40px; }
.size-md .hexagon-wrapper { width: 50px; height: 50px; }
.size-lg .hexagon-wrapper { width: 60px; height: 60px; }
.size-xl .hexagon-wrapper { width: 70px; height: 70px; }
.size-xxl .hexagon-wrapper { width: 80px; height: 80px; }
</style>
