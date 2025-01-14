<template>
    <div>
        <!-- Avatar and Display Name Section -->
        <div class="row mb-5">
            <div class="col-7 d-flex justify-content-center">
                <div class="bee-container border-bottom">
                    <NuxtImg
                        :src="previewBg || 'https://picsum.photos/300'"
                        class="bee-avatar  rounded-4"
                    />
                    <Bee3D
                        class="bee-avatar rounded-4"
                        :avatar="previewAvatar || '/default-avatar.png'"
                    />

                    <AvatarMenu
                        ref="avatarMenuRef"
                        class="edit-avatar-btn position-absolute"
                        @select="handleAvatarSelect"
                        @open="handleAvatarMenuOpen"
                    />
                    <BackgroundMenu
                        ref="bgMenuRef"
                        class="edit-background-btn position-absolute"
                        @select="handleBgSelect"
                        @open="handleBgMenuOpen"
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
import AvatarMenu from './AvatarMenu.vue'
import BackgroundMenu from './BackgroundMenu.vue'

const props = defineProps<{
    profile: Profile
    modelValue: {
        displayName: string
        city: string
        postalCode: string
        avatarUrl: string
        bgUrl: string
    }
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: { displayName: string, city: string, postalCode: string, avatarUrl: string, bgUrl: string }): void
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

const previewBg = computed({
    get: () => props.modelValue.bgUrl || props.profile.bgUrl || '',
    set: (value) => {
        emit('update:modelValue', {
            ...props.modelValue,
            bgUrl: value,
        })
    },
})

const form = computed({
    get: () => props.modelValue,
    set: value => emit('update:modelValue', value),
})

const avatarMenuRef = ref<typeof AvatarMenu | null>(null)
const bgMenuRef = ref<typeof BackgroundMenu | null>(null)

const handleAvatarSelect = (avatarUrl: string) => {
    previewAvatar.value = avatarUrl
}

const handleBgSelect = (bgUrl: string) => {
    previewBg.value = bgUrl
}

const handleAvatarMenuOpen = () => {
    if (bgMenuRef.value?.isOpen) {
        bgMenuRef.value.isOpen = false
    }
}

const handleBgMenuOpen = () => {
    if (avatarMenuRef.value?.isOpen) {
        avatarMenuRef.value.isOpen = false
    }
}
</script>

<style scoped>
.edit-avatar-btn {
    bottom: -17px;
    right: 35%;
}

.edit-background-btn {
    bottom: -17px;
    right: 55%;
}

.bee-container {
    position: relative;
    width: 300px;
    height: 300px;
}

.bee-avatar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
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
