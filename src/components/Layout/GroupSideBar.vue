<template>
    <div>
        <!-- Desktop Sidebar - Only visible on md and larger screens -->
        <div
            class="d-none d-md-flex flex-column side-nav rounded-end-5 bg-dark bg-gradient shadow"
            :class="{ collapsed: isCollapsed }"
        >
            <SidebarCollapsible
                :is-collapsed="isCollapsed"
                @update:is-collapsed="isCollapsed = $event"
            />

            <!-- Main Navigation Section -->
            <div class="d-flex flex-column flex-grow-1">
                <SidebarNavigation />
            </div>

            <!-- Footer Section -->
            <div class="mt-auto pb-2 d-flex flex-column align-items-center">
                <SidebarThemeToggle />
                <SidebarProfileButton />
            </div>
        </div>

        <!-- Mobile Sidebar -->
        <MobileSidebar />
    </div>
</template>

<script setup lang="ts">
// Add collapse functionality
const isCollapsed = useCookie('sidebar-collapsed', { default: () => false })
</script>

<style scoped lang="scss">
.side-nav {
    height: 75vh;
    width: 56px;
    z-index: 1020;
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    transition: transform 0.3s ease;

    &.collapsed {
        transform: translate(-100%, -50%);
    }
}
</style>
