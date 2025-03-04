<template>
    <div
        class="collapse-tab d-flex align-items-center justify-content-center"
        role="button"
        :title="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        @click="toggleCollapse"
    >
        <AppIcon
            :name="isCollapsed ? 'chevron-right' : 'chevron-left'"
            size="sm"
            color="light"
        />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    isCollapsed: boolean
}>()

const emit = defineEmits<{
    (e: 'update:isCollapsed', value: boolean): void
}>()

const toggleCollapse = () => {
    emit('update:isCollapsed', !props.isCollapsed)
}
</script>

<style scoped lang="scss">
.collapse-tab {
    position: absolute;
    right: -28px;
    top: 50%;
    transform: translateY(-50%);
    background: var(--bs-dark);
    width: 28px;
    height: 56px;
    border: 1px solid var(--bs-gray-800);
    border-left: none;
    border-radius: 0 0.75rem 0.75rem 0;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.08);
    z-index: 1;

    &:hover {
        background: var(--bs-primary);

        i {
            opacity: 1;
            transform: scale(1.1);
        }
    }

    i {
        opacity: 0.8;
        transition: all 0.2s ease;
    }
}

@media (prefers-reduced-motion: reduce) {
    .collapse-tab {
        transition: none !important;

        i {
            transition: none !important;
        }
    }
}

@include media-breakpoint-down(md) {
    .collapse-tab {
        width: 14px;
        height: 84px;
    }
}
</style>
