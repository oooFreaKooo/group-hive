<template>
    <div class="d-flex flex-wrap gap-1 mb-1">
        <span
            class="badge rounded-pill border border-dark"
            :style="{ backgroundColor: tag.color }"
        >
            <span :style="{ color: getContrastColor(tag.color) }">
                {{ tag.title }}
            </span>
        </span>
    </div>
</template>

<script setup lang="ts">
interface Tag {
    id: string
    title: string
    color: string
}

defineProps<{
    tag: Tag
}>()

// Function to determine if a color is light or dark
function getContrastColor (hexColor: string): string {
    // Remove the hash if it exists
    const color = hexColor.replace('#', '')

    // Convert hex to RGB
    const r = Number.parseInt(color.slice(0, 2), 16)
    const g = Number.parseInt(color.slice(2, 4), 16)
    const b = Number.parseInt(color.slice(4, 6), 16)

    // Calculate relative luminance using sRGB
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    // Return white for dark colors, black for light colors
    return luminance > 0.5 ? '#000000' : '#ffffff'
}
</script>
