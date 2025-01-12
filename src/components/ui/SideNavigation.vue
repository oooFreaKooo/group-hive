<template>
    <div class="d-none d-md-flex side-nav vh-100 position-fixed start-0 top-0 flex-column justify-content-between">
        <!-- Logo Section -->
        <div class="logo-section mb-2">
            <NuxtLink
                to="/"
                class="text-decoration-none"
            >
                <NuxtImg
                    src="/WG_SVG.svg"
                    width="32"
                    height="32"
                    alt="Logo"
                    class="img-fluid logo-icon"
                />
                <h1 class="logo-title h6 mb-0 ms-3">
                    <span class="d-block">Weekly</span>
                    <span class="d-block">Goals</span>
                </h1>
            </NuxtLink>
        </div>

        <!-- Navigation Section -->
        <nav class="py-3 flex-grow-1">
            <button
                v-for="item in navigationItems"
                :key="item.label"
                class="nav-item d-flex align-items-center text-decoration-none w-100 bg-transparent border-0 px-3 mb-3"
                :class="{ active: currentComponent === item.component }"
                @click="$emit('navigate', item.component)"
            >
                <AppIcon
                    :name="item.icon"
                    size="md"
                    color="black"
                    class="nav-icon flex-shrink-0"
                />
                <span class="nav-label ms-3">{{ item.label }}</span>
            </button>
        </nav>

        <!-- Footer Section -->
        <footer class="navigation">
            <button
                v-for="item in footerItems"
                :key="item.label"
                class="nav-item d-flex align-items-center text-decoration-none w-100 bg-transparent border-0 px-3 mb-3"
                :class="{ active: currentComponent === item.component }"
                @click="$emit('navigate', item.component)"
            >
                <AppIcon
                    :name="item.icon"
                    size="md"
                    color="black"
                    class="nav-icon flex-shrink-0"
                />
                <span class="nav-label ms-3">{{ item.label }}</span>
            </button>
            <button
                v-for="item in profileItems"
                :key="item.name"
                :class="{ active: currentComponent === item.component }"
                class="nav-item d-flex align-items-center text-decoration-none w-100 bg-transparent border-0 px-3 mb-2"
                @click="$emit('navigate', item.component)"
            >
                <NuxtImg
                    :src="item.avatar"
                    width="32"
                    height="32"
                    alt="Avatar"
                    class="nav-icon flex-shrink-0 rounded-circle"
                />
                <div class="d-flex flex-column align-items-start">
                    <span class="nav-label ms-3 fw-bold">{{ item.name }}</span>
                    <span class="nav-label ms-3 small">{{ item.email }}</span>
                </div>
            </button>
        </footer>
    </div>
</template>

<script setup lang="ts">
interface NavigationItem {
    label: string
    component: string
    icon: string
}

interface FooterItem {
    label: string
    component: string
    icon: string
}

interface ProfileItem {
    name: string
    email: string
    component: string
    avatar: string
}

const props = defineProps<{
    navigationItems: NavigationItem[]
    footerItems: FooterItem[]
    profileItems: ProfileItem[]
    activeComponent: string
}>()

const currentComponent = computed(() => props.activeComponent)

defineEmits<{
    navigate: [component: string]
}>()
</script>

<style scoped lang="scss">
.side-nav {
    width: 64px;
    background: white;
    border-right: 1px solid var(--bs-gray-200);
    transition: width 0.3s ease;
    overflow: hidden;
    z-index: 1030;

    &:hover {
        width: 240px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }

    .logo-section {
        height: 72px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid var(--bs-gray-200);

        a {
            height: 100%;
            display: flex;
            align-items: center;
            padding: 0 1rem;
        }

        .logo-title {
            opacity: 0;
            transition: opacity 0.2s ease;
            white-space: nowrap;

            span:first-child {
                color: var(--bs-gray-900);
            }
            span:last-child {
                color: var(--bs-gray-600);
            }
        }
    }

    &:hover .logo-title {
        opacity: 1;
    }

    .nav-item {
        cursor: pointer;
        color: var(--bs-gray-600);
        transition: all 0.2s ease;
        white-space: nowrap;
        height: 40px;

        &:hover, &.active {
            color: var(--bs-gray-900);
            background-color: var(--bs-gray-100);
        }

        .nav-icon {
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .nav-label {
            opacity: 0;
            transition: opacity 0.2s ease;
        }
    }

    &:hover .nav-label {
        opacity: 1;
    }

    .footer {
        font-size: 0.75rem;
        white-space: nowrap;
        padding: 1rem;

        .footer-title {
            font-size: 0.875rem;
        }

        .footer-content {
            font-size: 0.75rem;
        }

        .copyright {
            font-size: 0.625rem;
        }
    }
}
</style>
