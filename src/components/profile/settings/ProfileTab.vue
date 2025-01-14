<template>
    <div>
        <!-- Avatar and Display Name Section -->
        <div class="row mb-5">
            <div class="col-7 d-flex justify-content-center">
                <div class="bee-container border-bottom">
                    <Bee3D :avatar="previewAvatar || '/default-avatar.png'" />
                    <AvatarMenu
                        class="edit-btn position-absolute"
                        @select="handleAvatarSelect"
                    />
                </div>
            </div>
            <div class="col-7">
                <div class="form-group">
                    <label class="form-label">Display Name</label>
                    <input
                        v-model="form.displayName"
                        type="text"
                        class="form-control form-control-lg"
                        placeholder="Enter your display name"
                    >
                    <div class="form-text">
                        This is how other users will see you
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">City</label>
                    <input
                        v-model="form.city"
                        type="text"
                        class="form-control"
                        placeholder="Enter your city"
                    >
                </div>
                <div class="form-group">
                    <label class="form-label">Postal Code</label>
                    <input
                        v-model="form.postalCode"
                        type="text"
                        class="form-control"
                        placeholder="Enter your postal code"
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Profile } from '@prisma/client'

const props = defineProps<{
    profile: Profile
    modelValue: {
        displayName: string
        city: string
        postalCode: string
        avatarUrl: string
    }
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: { displayName: string, city: string, postalCode: string, avatarUrl: string }): void
    (e: 'error', value: string): void
}>()

const previewAvatar = computed({
    get: () => props.modelValue.avatarUrl || props.profile.avatarUrl || '',
    set: (value) => {
        emit('update:modelValue', {
            ...props.modelValue,
            avatarUrl: value,
        })
    },
})

const form = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
})

const handleAvatarSelect = (avatarUrl: string) => {
    previewAvatar.value = avatarUrl
}
</script>

<style scoped>
.edit-btn {
    bottom: -17px;
    right: 45%;
}

.bee-container {
    position: relative;
    width: 300px;
    height: 300px;
}

.bee-container-small {
    width: 200px;
    height: 200px;
    transform: scale(0.5);
    transform-origin: top left;
}

.form-group {
    margin-bottom: 1rem;
}

.form-label {
    font-weight: 500;
    margin-bottom: 0.5rem;
}

.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  transform: scaleX(0);
}
</style>
