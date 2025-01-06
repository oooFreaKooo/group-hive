<template>
    <div class="mt-4">
        <div class="d-flex align-items-center gap-4">
            <div class="position-relative">
                <NuxtImg
                    :src="previewAvatar || user?.user_metadata?.avatar_url || '/default-avatar.png'"
                    class="rounded-circle"
                    style="width: 96px; height: 96px; object-fit: cover;"
                />

                <AppIcon
                    class="position-absolute bottom-0 end-0 rounded-circle shadow-sm"
                    color="black"
                    name="pencil"
                    btn
                    @click="showAvatarModal = true"
                />
            </div>
            <div>
                <label class="form-label">Display Name</label>
                <input
                    v-model="form.name"
                    type="text"
                    class="form-control"
                >
            </div>
        </div>

        <!-- Avatar Selection Modal -->
        <AvatarSelectionModal
            v-model="showAvatarModal"
            v-model:preview-avatar="previewAvatar"
            @error="$emit('error', $event)"
        />
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: {
        name: string
    }
}>()

const user = useSupabaseUser()

const emit = defineEmits<{
    (e: 'update:modelValue', value: { name: string }): void
    (e: 'error', value: string): void
}>()

const showAvatarModal = ref(false)
const previewAvatar = ref('')

const form = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
})
</script>
