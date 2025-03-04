<template>
    <div class="my-2 p-2 card border border-primary">
        <label class="form-label fw-medium mb-2">Create New Tag</label>
        <input
            v-model="form.title"
            type="text"
            class="form-control form-control-sm mb-2 rounded-4"
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
                class="btn btn-outline-dark btn-sm rounded-4"
                @click="emit('cancel')"
            >
                Cancel
            </button>
            <button
                type="button"
                class="btn btn-success btn-sm rounded-4"
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

        <template v-if="props.existingTags?.length">
            <hr>
            <div>
                <label class="form-label fw-medium mb-2">Delete Tag</label>
                <div class="d-flex gap-2">
                    <select
                        v-model="selectedTagId"
                        class="form-select form-select-sm rounded-4 border-2"
                    >
                        <option value="">
                            Select a tag to delete
                        </option>
                        <option
                            v-for="tag in props.existingTags"
                            :key="tag.id"
                            :value="tag.id"
                        >
                            {{ tag.title }}
                        </option>
                    </select>
                    <button
                        type="button"
                        class="btn btn-danger btn-sm"
                        :disabled="!selectedTagId || isDeleting"
                        @click="handleDelete(selectedTagId)"
                    >
                        <i
                            class="bi"
                            :class="isDeleting ? 'bi-hourglass-split' : 'bi-trash'"
                        />
                    </button>
                </div>
            </div>
        </template>
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
    existingTags?: Tag[]
}>()

const emit = defineEmits<{
    (e: 'tag-created', tag: Tag): void
    (e: 'cancel'): void
    (e: 'tag-deleted', tagId: string): void
}>()

const form = ref({
    title: '',
    color: '#FF6B6B',
})

const selectedTagId = ref('')
const error = ref('')
const isCreating = ref(false)
const isDeleting = ref(false)

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

const handleDelete = async (tagId: string) => {
    try {
        isDeleting.value = true
        error.value = ''

        await $fetch(`/api/group/${props.groupId}/tags/delete`, {
            method: 'DELETE',
            body: {
                tagId,
            },
        })

        emit('tag-deleted', tagId)
    } catch (e: any) {
        error.value = e.message || 'Failed to delete tag'
    } finally {
        isDeleting.value = false
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
