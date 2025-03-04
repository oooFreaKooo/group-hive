<template>
    <div>
        <!-- Desktop Sidebar - Only visible on md and larger screens -->
        <div
            class="d-none d-md-flex flex-column side-nav bg-dark shadow"
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
    --nav-height: 100vh;
    --nav-width: 74px;
    --nav-bg: var(--bs-dark);
    --nav-color: var(--bs-gray-400);
    --nav-active-color: var(--bs-primary);
    --nav-transition: 0.2s ease;

    height: var(--nav-height);
    width: var(--nav-width);
    background: var(--nav-bg);
    backdrop-filter: blur(8px);
    z-index: 1020;
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    transition: all var(--nav-transition);
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.08);

    &.collapsed {
        transform: translate(-100%, -50%);
    }
}
</style>
