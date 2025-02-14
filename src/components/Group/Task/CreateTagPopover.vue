<template>
    <div>
        <button
            class="btn btn-light btn-sm rounded-pill"
            @click="isOpen = true"
        >
            <i class="bi bi-tag me-2" />
            Add Tag
        </button>

        <AppPopover
            v-if="isOpen"
            title="Create New Tag"
            @close="isOpen = false"
        >
            <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                    <label
                        for="tagTitle"
                        class="form-label"
                    >Title*</label>
                    <input
                        id="tagTitle"
                        v-model="form.title"
                        type="text"
                        class="form-control"
                        required
                    >
                </div>
                <div class="mb-3">
                    <label
                        for="tagColor"
                        class="form-label"
                    >Color*</label>
                    <div class="d-flex gap-2">
                        <div
                            v-for="color in predefinedColors"
                            :key="color"
                            class="color-option"
                            :class="{ active: form.color === color }"
                            :style="{ backgroundColor: color }"
                            @click="form.color = color"
                        />
                    </div>
                </div>
                <div
                    v-if="error"
                    class="alert alert-danger"
                    role="alert"
                >
                    {{ error }}
                </div>
                <div class="d-flex justify-content-end gap-2">
                    <button
                        type="button"
                        class="btn btn-secondary"
                        @click="isOpen = false"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="btn btn-primary"
                        :disabled="isSubmitting"
                    >
                        {{ isSubmitting ? 'Creating...' : 'Create Tag' }}
                    </button>
                </div>
            </form>
        </AppPopover>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    groupId: {
        type: String,
        required: true,
    },
})

const emit = defineEmits<{
    (e: 'tag-created'): void
}>()

const isOpen = ref(false)
const error = ref('')
const isSubmitting = ref(false)

const predefinedColors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEEAD', // Yellow
    '#D4A5A5', // Pink
    '#9B59B6', // Purple
    '#3498DB', // Light Blue
]

const form = ref({
    title: '',
    color: predefinedColors[0],
})

const handleSubmit = async () => {
    try {
        isSubmitting.value = true
        error.value = ''

        await $fetch(`/api/group/${props.groupId}/tags`, {
            method: 'POST',
            body: form.value,
        })

        emit('tag-created')
        isOpen.value = false
        form.value.title = ''
        form.value.color = predefinedColors[0]
    } catch (e: any) {
        error.value = e.message || 'Failed to create tag'
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style scoped lang="scss">
.color-option {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid transparent;

    &:hover {
        transform: scale(1.1);
    }

    &.active {
        border-color: var(--bs-primary);
        transform: scale(1.1);
    }
}
</style>
