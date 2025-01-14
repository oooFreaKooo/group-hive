<template>
    <div :class="['hex-menu-item-container', rotated && 'rotated', alignment]">
        <svg
            viewBox="0 0 800 800"
            :class="[
                'hex-menu-item',
                empty && 'empty',
                active && 'active',
                rotated && 'rotated',
                ...svgClasses,
            ]"
            :style="{
                '--item-color': color,
                '--hover-color': hoverColor,
                '--active-color': activeColor,
                '--text-color': textColor,
            }"
        >
            <NuxtLink :to="link">
                <g
                    v-if="rotated"
                    transform="matrix(-6.92 0 0 -6.92 400.24 400.24)"
                >
                    <polygon
                        :class="['h-hex', 'hex', ...hexagonClasses]"
                        points="-19.9,34.5 -39.8,0 -19.9,-34.5 19.9,-34.5 39.8,0 19.9,34.5 "
                    />
                </g>
                <g
                    v-else
                    transform="matrix(0 6.92 -6.92 0 400.17 400.33)"
                >
                    <polygon
                        :class="['h-hex', 'hex', ...hexagonClasses]"
                        points="-19.9,34.5 -39.8,0 -19.9,-34.5 19.9,-34.5 39.8,0 19.9,34.5 "
                    />
                </g>
                <foreignObject
                    class="hex-fo"
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                >
                    <span :class="['item-label', ...textClasses, alignment]">{{ label }}</span>
                </foreignObject>
            </NuxtLink>
        </svg>
    </div>
</template>

<script setup lang="ts">
defineProps({
    link: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    empty: {
        type: Boolean,
        required: false,
        default: false,
    },
    active: {
        type: Boolean,
        required: false,
        default: false,
    },
    rotated: {
        type: Boolean,
        required: false,
        default: false,
    },
    color: {
        type: String,
        required: false,
        default: '#6c6',
    },
    activeColor: {
        type: String,
        required: false,
        default: '#69c',
    },
    hoverColor: {
        type: String,
        required: false,
        default: '#69c',
    },
    textColor: {
        type: String,
        required: false,
        default: '#fff',
    },
    svgClasses: {
        type: Array,
        required: false,
        default: () => [],
    },
    hexagonClasses: {
        type: Array,
        required: false,
        default: () => [],
    },
    textClasses: {
        type: Array,
        required: false,
        default: () => [],
    },
    alignment: {
        type: String as PropType<'horizontal' | 'vertical'>,
        required: false,
        default: 'horizontal',
    },
})
</script>

<style lang="scss" scoped>
.hex-menu-item-container {
    --baseMargin: -38px;
    --baseBottomMargin: -100px;
    display: inline-block;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    width: calc(200px * var(--scale));
    height: calc(200px * var(--scale));
    margin-left: calc(var(--baseMargin) * var(--scale));
    margin-right: calc(var(--baseMargin) * var(--scale));
    z-index: 1;
    pointer-events: none;

    &.vertical {
        &.rotated {
        --baseMargin: -46px;

            &:nth-child(2n) {
                top: calc(61px * var(--scale));
            }

            &:nth-child(2n-1) {
                top: calc(124px * var(--scale));
            }
        }
    }

    &:hover {
        z-index: 2;

        .hex-menu-item:not(.empty) {
            .hex {
                fill: var(--hover-color);
            }
        }
    }

    &.rotated {
        --baseMargin: -46px;
        &:nth-child(2n-1) {
            top: calc(61px * var(--scale));
        }
        &:nth-child(2n) {
            top: calc(124px * var(--scale));
        }
    }

    .hex-menu-item {
        width: 100%;
        height: 100%;
        pointer-events: none;

        &.active,
        &.empty {
        cursor: default;
        }
        &.empty {
            .hex {
            fill: transparent;
            pointer-events: none;
            }
        }

        &.active {
            .hex {
                fill: var(--active-color);
            }
        }

        .item-label {
            font-family: sans-serif;
            white-space: nowrap;
            font-size: 4.5em;
            font-weight: 600;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
            color: var(--text-color);
            letter-spacing: 1px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            &.vertical {
                transform: translate(-50%, -50%) rotate(-90deg);
            }
        }

        .hex {
            fill: var(--item-color);
            z-index: -1;
            backface-visibility: hidden;
            transition: fill 500ms ease, -webkit-transform 1s ease-in-out;
            pointer-events: auto;
        }
    }
}
</style>
