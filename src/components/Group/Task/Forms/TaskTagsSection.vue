<template>
    <div>
        <label class="form-label d-flex align-items-center gap-2 mb-2">
            <i class="bi bi-tags-fill text-primary" />
            <span class="fw-medium">Tags</span>
        </label>

        <!-- Tag Selection -->
        <div
            v-if="!showCreateTag"
            class="d-flex gap-2 align-items-start"
        >
            <select
                v-model="selectedTagId"
                class="form-select form-select-sm rounded-4 border-2"
                :disabled="!availableTags.length"
            >
                <option value="">
                    {{ availableTags.length ? 'Select a tag' : 'No tags available' }}
                </option>
                <option
                    v-for="tag in availableTags"
                    :key="tag.id"
                    :value="tag.id"
                >
                    {{ tag.title }}
                </option>
            </select>

            <button
                type="button"
                class="btn border-0 btn-sm text-dark"
                @click="showCreateTag = true"
            >
                <i class="bi bi-gear" />
            </button>
        </div>

        <!-- Selected Tags -->
        <TagBadge
            :tags="selectedTags"
            :show-close-button="true"
            class="mt-2"
            @remove="removeTag"
        />

        <!-- Create Tag Form -->
        <CreateTagForm
            v-if="showCreateTag"
            :group-id="groupId"
            :existing-tags="tags"
            @tag-created="handleTagCreated"
            @tag-deleted="handleTagDeleted"
            @cancel="showCreateTag = false"
        />
    </div>
</template>

<script setup lang="ts">
import type { Tag } from '@prisma/client'

interface TagWithDetails {
    tagId: string
    tag: {
        id: string
        title: string
        color: string
    }
}

const props = defineProps<{
    groupId: string
    tags: Tag[]
}>()

const modelValue = defineModel<string[]>()

const showCreateTag = ref(false)
const selectedTagId = ref('')

// Computed
const availableTags = computed(() =>
    props.tags?.filter(tag => !modelValue.value?.includes(tag.id)) || [],
)

const selectedTags = computed<TagWithDetails[]>(() =>
    (modelValue.value || []).map(id => ({
        tagId: id,
        tag: {
            id,
            title: props.tags?.find(t => t.id === id)?.title || 'Unknown',
            color: props.tags?.find(t => t.id === id)?.color || '#000000',
        },
    })),
)

// Methods
const removeTag = (tagId: string) => {
    modelValue.value = modelValue.value?.filter(id => id !== tagId)
}

const handleTagCreated = (_newTag: Tag) => {
    showCreateTag.value = false
}

const handleTagDeleted = (tagId: string) => {
    modelValue.value = modelValue.value?.filter(id => id !== tagId)
}

// Watch for tag selection
watch(selectedTagId, (newValue) => {
    if (!newValue) { return }
    if (!modelValue.value?.includes(newValue)) {
        modelValue.value = [ ...(modelValue.value || []), newValue ]
    }
    selectedTagId.value = ''
})
</script>
