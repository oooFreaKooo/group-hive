<template>
    <div class="my-3 p-2 card bg-dark-subtle">
        <label class="form-label">Create New Tag</label>
        <input
            v-model="form.title"
            type="text"
            class="form-control mb-2"
            placeholder="Tag title"
        >
        <div class="d-flex gap-2 align-items-center">
            <small class="form-label mb-0 me-2">Color:</small>
            <div class="d-flex gap-2 align-items-center flex-grow-1">
                <input
                    v-model="form.color"
                    type="color"
                    class="form-control form-control-color border border-3 border-light rounded-pill"
                    title="Choose tag color"
                >
            </div>
            <button
                type="button"
                class="btn btn-outline-dark btn-sm"
                @click="emit('cancel')"
            >
                Cancel
            </button>
            <button
                type="button"
                class="btn btn-success btn-sm"
                :disabled="!form.title || isCreating"
                @click="handleCreate"
            >
                <span v-if="isCreating">
                    <i class="bi bi-arrow-clockwise" />
                </span>
                <span v-else>
                    Create
                </span>
            </button>
        </div>
    </div>

    <div
        v-if="error"
        class="alert alert-danger mt-2"
        role="alert"
    >
        {{ error }}
    </div>
</template>

<script setup lang="ts">
import type { Tag } from '@prisma/client'

const props = defineProps<{
    groupId: string
}>()

const emit = defineEmits<{
    (e: 'tag-created', tag: Tag): void
    (e: 'cancel'): void
}>()

const form = ref({
    title: '',
    color: '#FF6B6B',
})

const error = ref('')
const isCreating = ref(false)

const handleCreate = async () => {
    try {
        isCreating.value = true
        error.value = ''

        const response = await $fetch<Tag>(`/api/group/${props.groupId}/tags/create`, {
            method: 'POST',
            body: form.value,
        })

        // Convert date strings to Date objects
        const newTag: Tag = {
            ...response,
            createdAt: new Date(response.createdAt),
            updatedAt: new Date(response.updatedAt),
        }

        emit('tag-created', newTag)

        // Reset form
        form.value.title = ''
    } catch (e: any) {
        error.value = e.message || 'Failed to create tag'
    } finally {
        isCreating.value = false
    }
}
</script>

<style scoped lang="scss">
.color-preview {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    border: 1px solid var(--bs-border-color);
}

.color-option {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid var(--bs-border-color);

    &:hover {
        transform: scale(1.1);
    }
}

// Style the color input
input[type="color"] {
    width: 40px;
    padding: 0;
    border: none;
    background: none;

    &::-webkit-color-swatch-wrapper {
        padding: 0;
    }

    &::-webkit-color-swatch {
        border: 1px solid var(--bs-border-color);
        border-radius: 4px;
    }

    &::-moz-color-swatch {
        border: 1px solid var(--bs-border-color);
        border-radius: 4px;
    }
}

.form-control-color {
    width: 24px;
    height: 24px;
    border-radius: 4px;
}
</style>
