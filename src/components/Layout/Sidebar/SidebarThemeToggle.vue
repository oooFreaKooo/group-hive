<template>
    <div class="d-flex flex-column align-items-center my-2">
        <div
            class="theme-switch d-flex justify-content-center bg-light"
            :class="{ dark: isDarkMode }"
            @click="toggleTheme"
        >
            <div class="switch-handle">
                <AppIcon
                    name="sun-fill"
                    size="sm"
                    class="icon-sun rounded-circle"
                    color="dark"
                    :class="{ active: !isDarkMode }"
                />
                <AppIcon
                    name="moon-fill"
                    size="sm"
                    class="icon-moon rounded-circle"
                    color="dark"
                    :class="{ active: isDarkMode }"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getPreferredTheme, setStoredTheme, setTheme } from '@/utils/theme'

const isDarkMode = ref(false)
const currentTheme = ref(getPreferredTheme())

onMounted(() => {
    isDarkMode.value = currentTheme.value === 'dark'
    setTheme(currentTheme.value)
})

const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark'
    setStoredTheme(currentTheme.value)
    setTheme(currentTheme.value)
    isDarkMode.value = !isDarkMode.value
}
</script>

<style scoped lang="scss">
// Theme switch specific styles
.theme-switch {
    border-radius: 20px;
    width: 32px;
    height: 56px;
    position: relative;
    cursor: pointer;
    padding: 2px;
}

.switch-handle {
    width: 24px;
    height: 24px;
    background: rgba(var(--bs-light-rgb), 1);
    border-radius: 50%;
    position: absolute;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-switch.dark .switch-handle {
    transform: translateY(28px) rotate(360deg);
}

.icon-sun,
.icon-moon {
    position: absolute;
    opacity: 0;
    transition: opacity 0.3s ease;

    &.active {
        opacity: 1;
    }
}
</style>
