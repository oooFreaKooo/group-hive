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
    right: -24px;
    top: 50%;
    transform: translateY(-50%);
    background: var(--bs-primary);
    width: 24px;
    height: 64px;
    border: 1px solid var(--bs-light);
    border-radius: 0 16px 16px 0;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
    z-index: 1;  // Ensure tab stays above sidebar

    &:hover {
        background: var(--bs-dark);
    }
}

@include media-breakpoint-down(md) {
    .collapse-tab {
        width: 14px;
        height: 84px;
    }
}
</style>
