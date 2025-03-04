<template>
    <div class="d-flex flex-wrap gap-1">
        <span
            v-for="tag in tags"
            :key="tag.tagId"
            class="badge rounded-pill border-2 border-dark tag-badge"
            :style="{
                backgroundColor: tag.tag.color,
                boxShadow: `0 2px 4px ${tag.tag.color}40`,
            }"
        >
            <span
                :style="{
                    color: getContrastColor(tag.tag.color),
                    textShadow: `0 0.5px 1px ${tag.tag.color}90`,
                }"
                class="text-truncate"
            >
                {{ tag.tag.title }}
            </span>

            <i
                v-if="showCloseButton"
                class="cursor-pointer bi bi-x ms-1"
                :style="{ color: getContrastColor(tag.tag.color) }"
                @click="$emit('remove', tag.tagId)"
            />
        </span>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    tags: TaskTag[]
    showCloseButton?: boolean
}>()

defineEmits<{
    (e: 'remove', tagId: string): void
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

<style scoped lang="scss">
.tag-badge {
    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    font-size: 0.7rem;
    padding: 0.15rem 0.5rem;
    font-weight: 600;
    letter-spacing: 0.2px;
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    display: inline-flex;
    align-items: center;
}

.cursor-pointer {
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.8em;
    display: inline-flex;
    align-items: center;

    &:hover {
        transform: scale(1.2);
        opacity: 0.8;
    }
}

@media (prefers-reduced-motion: reduce) {
    .tag-badge,
    .cursor-pointer {
        transition: none;
        transform: none !important;
    }
}
</style>
