<template>
    <div class="mt-4">
        <div class="d-flex align-items-center gap-4 mb-4">
            <div class="position-relative">
                <NuxtImg
                    :src="previewAvatar || '/default-avatar.png'"
                    class="rounded-circle"
                    style="width: 96px; height: 96px; object-fit: cover;"
                />

                <button
                    class="position-absolute bottom-0 end-0 p-0 border-0 bg-transparent"
                    @click="showAvatarModal = true"
                >
                    <AppIcon
                        class="rounded-circle shadow-sm"
                        color="black"
                        name="pencil"
                        btn
                    />
                </button>
            </div>
            <div class="flex-grow-1">
                <label class="form-label">Display Name</label>
                <input
                    v-model="form.displayName"
                    type="text"
                    class="form-control"
                    placeholder="Enter your display name"
                >
            </div>
        </div>

        <div class="row g-3">
            <div class="col-md-6">
                <label class="form-label">City</label>
                <input
                    v-model="form.city"
                    type="text"
                    class="form-control"
                    placeholder="Enter your city"
                >
            </div>
            <div class="col-md-6">
                <label class="form-label">Postal Code</label>
                <input
                    v-model="form.postalCode"
                    type="text"
                    class="form-control"
                    placeholder="Enter your postal code"
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
        displayName: string
        city: string
        postalCode: string
        avatarUrl: string
    }
}>()

const { profile } = useProfile()

const emit = defineEmits<{
    (e: 'update:modelValue', value: { displayName: string, city: string, postalCode: string, avatarUrl: string }): void
    (e: 'error', value: string): void
}>()

const showAvatarModal = ref(false)
const previewAvatar = computed(() => props.modelValue.avatarUrl || profile.value?.avatarUrl || '')

const form = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
})

// Initialize form with profile data when component mounts
onMounted(() => {
    if (profile.value) {
        emit('update:modelValue', {
            displayName: profile.value.displayName || '',
            city: profile.value.city || '',
            postalCode: profile.value.postalCode || '',
            avatarUrl: profile.value.avatarUrl || '',
        })
    }
})
</script>
