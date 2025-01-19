<template>
    <button
        class="hexagon-button border-0 bg-transparent"
        :style="{
            '--icon-size': `${iconSize}px`,
        }"
        :data-menu="isMenu"
        type="button"
        @click="handleClick"
    >
        <div class="hexagon-wrapper">
            <i
                class=""
                :class="[
                    'bi bi-hexagon-fill hexagon-shape2 text-black z-1',
                    isMenu ? 'hexagon-hover' : '',
                ]"
            />
            <i
                class="bi bi-hexagon-fill hexagon-shape1 text-white z-2"
            />
            <div class="hexagon-content z-3">
                <i
                    v-if="icon"
                    :class="[
                        'hexagon-icon',
                        isMenu ? {
                            'bi-x-lg': isClicked,
                            [`bi-${icon}`]: !isClicked,
                        } : `bi-${icon}`,
                    ]"
                />
            </div>
        </div>
    </button>
</template>

<script lang="ts" setup>
const isClicked = ref(false)

const props = defineProps({
    icon: {
        type: String,
        default: undefined,
    },
    isMenu: {
        type: Boolean,
        default: false,
    },
    angle: {
        type: String,
        default: '0deg',
    },
    size: {
        type: String as PropType<Size>,
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

const emit = defineEmits(['click'])

function handleClick () {
    if (props.isMenu) {
        isClicked.value = !isClicked.value
    }
    emit('click')
}
</script>

<style scoped lang="scss">
.hexagon-button {
    padding: 0;

    transition: transform 0.3s ease;

    &.is-disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }

    &[data-menu="true"] {
        &:active .hexagon-icon {
            transform: rotate(180deg) scale(0.2);
        }
    }

    &:hover {
        .hexagon-icon {
            transform: rotate(20deg);
        }
    }
}

.hexagon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.6s ease;
    &:hover {
        .hexagon-hover {
            transform: scale(1.1);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
    }
}

.hexagon-shape1 {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease, transform 0.2s ease;
    font-size: 46px;

}

.hexagon-shape2 {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    transition: color 0.2s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: rotate(0deg) scale(1);
}

.hexagon-button[data-menu="true"] {
    .hexagon-icon {
        &.bi-x-lg {
            transform: rotate(180deg) scale(1);
        }
    }
}

// Size variants
.size-xs .hexagon-wrapper { width: 30px; height: 30px; }
.size-sm .hexagon-wrapper { width: 40px; height: 40px; }
.size-md .hexagon-wrapper { width: 50px; height: 50px; }
.size-lg .hexagon-wrapper { width: 60px; height: 60px; }
.size-xl .hexagon-wrapper { width: 70px; height: 70px; }
.size-xxl .hexagon-wrapper { width: 80px; height: 80px; }
</style>
