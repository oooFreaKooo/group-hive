<template>
    <TransitionRoot
        appear
        :show="modelValue"
        as="template"
    >
        <Dialog
            as="div"
            class="modal-wrapper"
            @close="$emit('update:modelValue', false)"
        >
            <TransitionChild
                as="template"
                enter="fade"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="fade"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="modal-backdrop" />
            </TransitionChild>

            <div class="modal d-block">
                <div class="modal-dialog modal-dialog-centered">
                    <TransitionChild
                        as="template"
                        enter="fade"
                        enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100"
                        leave="fade"
                        leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95"
                    >
                        <DialogPanel class="modal-content">
                            <div class="modal-header">
                                <DialogTitle
                                    as="h5"
                                    class="modal-title"
                                >
                                    Choose Avatar
                                </DialogTitle>
                                <button
                                    class="btn-close"
                                    aria-label="Close"
                                    @click="$emit('update:modelValue', false)"
                                />
                            </div>

                            <div class="modal-body">
                                <div>
                                    <label class="form-label">Generate Avatar</label>
                                    <div class="row g-2">
                                        <div
                                            v-for="seed in ['1', '2', '3', '4', '5', '6', '7', '8']"
                                            :key="seed"
                                            class="col-3"
                                        >
                                            <button
                                                class="position-relative w-100 p-0 border overflow-hidden rounded"
                                                :class="{ 'border-primary': selectedSeed === seed }"
                                                style="aspect-ratio: 1;"
                                                @click="selectGeneratedAvatar(seed)"
                                            >
                                                <NuxtImg
                                                    :src="`https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${seed}`"
                                                    class="w-100 h-100"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div class="modal-footer px-0 pb-0">
                                    <button
                                        class="btn btn-secondary"
                                        @click="$emit('update:modelValue', false)"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        class="btn btn-primary"
                                        @click="confirmAvatarSelection"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
} from '@headlessui/vue'

const props = defineProps<{
    modelValue: boolean
    previewAvatar: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'update:previewAvatar', value: string): void
    (e: 'error', value: string): void
}>()

const user = useSupabaseUser()
const { profile, refreshProfile } = useProfile()
const selectedSeed = ref('')
const loading = ref(false)

const selectGeneratedAvatar = (seed: string) => {
    selectedSeed.value = seed
    emit('update:previewAvatar', `https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${seed}`)
}

const confirmAvatarSelection = async () => {
    if (!user.value?.id) { return }

    try {
        loading.value = true

        const avatarUrl = selectedSeed.value
            ? `https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=${selectedSeed.value}`
            : props.previewAvatar

        // Update profile with new avatar URL
        await $fetch('/api/profile/update', {
            method: 'PUT',
            body: {
                id: user.value.id,
                avatarUrl,
                // Preserve existing profile data
                displayName: profile.value?.displayName,
                city: profile.value?.city,
                postalCode: profile.value?.postalCode,
            },
        })

        // Refresh the profile data to get the latest changes
        await refreshProfile()

        // Update the preview in parent component
        emit('update:previewAvatar', avatarUrl)
        emit('update:modelValue', false)
    } catch (err: any) {
        emit('error', err.message || 'Failed to update avatar')
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.modal-wrapper {
  position: relative;
  z-index: 1050;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
