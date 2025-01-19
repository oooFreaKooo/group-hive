<template>
    <div>
        <div :class="['hex-wrapper', rotated && 'rotated', alignment]">
            <div
                v-for="(row, r) in rows"
                :key="`hex-row-${r}`"
                :class="['hex-row', r % 2 === 1 && !rotated && 'shift']"
            >
                <HexMenuItem
                    v-for="(item, i) in row"
                    :key="`hex-item-${i}`"
                    :link="item.link"
                    :label="item.label"
                    :empty="item.empty"
                    :active="item.active"
                    :rotated="rotated"
                    :color="item.color || color"
                    :active-color="item.activeColor || activeColor"
                    :hover-color="item.hoverColor || hoverColor"
                    :text-color="item.textColor || textColor"
                    :svg-classes="item.svgClasses || svgClasses"
                    :hexagon-classes="item.hexagonClasses || hexagonClasses"
                    :text-classes="item.textClasses || textClasses"
                    :alignment="alignment"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

interface HexMenuItem {
    link: string
    label: string
    empty?: boolean
    active?: boolean
    color?: string
    activeColor?: string
    hoverColor?: string
    textColor?: string
    svgClasses?: string[]
    hexagonClasses?: string[]
    textClasses?: string[]
}

const props = defineProps({
    items: {
        type: Array as PropType<HexMenuItem[]>,
        required: true,
    },
    maxLength: {
        type: Number,
        required: false,
        default: 0,
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
        type: Array as PropType<string[]>,
        required: false,
        default: () => [],
    },
    hexagonClasses: {
        type: Array as PropType<string[]>,
        required: false,
        default: () => [],
    },
    textClasses: {
        type: Array as PropType<string[]>,
        required: false,
        default: () => [],
    },
    alignment: {
        type: String as PropType<'horizontal' | 'vertical'>,
        required: false,
        default: 'vertical',
    },
    scale: {
        type: Number,
        required: false,
        default: 0.75,
    },
})

const getRows = () => {
    const rows: HexMenuItem[][] = [[]]
    props.items.forEach((item, i) => {
        const rowIndex = rows.length - 1
        rows[rowIndex].push({
            ...item,
            ...(item.empty && { link: '', label: '' }),
        })
        let rotDiff = 0
        if (!props.rotated && rows.length % 2 === 0) {
            rotDiff = 1
        }
        if (
            props.maxLength >= 0 &&
            rows[rowIndex].length === props.maxLength - rotDiff &&
            i < props.items.length - 1
        ) {
            rows.push([])
        }
    })
    return rows
}
const rows = ref(getRows())
</script>

<style scoped lang="scss">
.hex-wrapper {
    display: inline-block;
    --scale: v-bind('scale');
    margin: 50px 0;

    &.vertical {
        transform: rotate(90deg) translate(50%, 100%);
        margin: 0 50px;
        &.rotated {
            margin: 0 25px;
            .hex-row {
                height: calc(125px * var(--scale));
                &:last-child {
                    margin-bottom: calc(61px * var(--scale));
                }
            }
        }
    }

    .hex-row {
        height: calc(108px * var(--scale));
        position: relative;
        &.shift {
            margin-left: calc(62px * var(--scale));
        }
        &:last-child {
            > * {
                margin-bottom: 0 !important;
            }
        }
    }
    &.rotated {
        margin: 25px 0;
        .hex-row {
            height: calc(125px * var(--scale));
            &:last-child {
                margin-bottom: calc(61px * var(--scale));
            }
        }
    }
}
</style>
