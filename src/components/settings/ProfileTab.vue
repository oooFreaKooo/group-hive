<template>
    <div class="profile-tab">
        <!-- Avatar and Background Section -->
        <div class="row mb-4">
            <div class="col-14 col-md-10 col-lg-8 mx-auto">
                <div class="bee-container border-bottom mb-4">
                    <NuxtImg
                        :src="previewBg || 'https://picsum.photos/300'"
                        class="bee-avatar rounded-4"
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
        </div>

        <!-- Form Section -->
        <div class="row">
            <div class="col-14 col-md-10 col-lg-8 mx-auto">
                <div class="form-group mb-4">
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

                <div class="row g-3">
                    <div class="col-14 col-sm-7">
                        <div class="form-group">
                            <label class="form-label">City</label>
                            <input
                                v-model="form.city"
                                type="text"
                                class="form-control"
                                placeholder="Enter your city"
                            >
                        </div>
                    </div>
                    <div class="col-14 col-sm-7">
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
        </div>
    </div>
</template>

<script setup lang="ts">
import AvatarMenu from './AvatarMenu.vue'
import BackgroundMenu from './BackgroundMenu.vue'

const props = defineProps<{
    modelValue: {
        displayName: string
        city: string
        postalCode: string
        avatarUrl: string
        bgUrl: string
    }
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: typeof props.modelValue): void
    (e: 'error', value: string): void
}>()

const previewAvatar = computed({
    get: () => props.modelValue.avatarUrl || '',
    set: (value) => {
        emit('update:modelValue', {
            ...props.modelValue,
            avatarUrl: value,
        })
    },
})

const previewBg = computed({
    get: () => props.modelValue.bgUrl || '',
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
.profile-tab {
    max-width: 100%;
    margin: 0 auto;
}

.bee-container {
    position: relative;
    width: 100%;
    max-width: 300px;
    aspect-ratio: 1;
    margin: 0 auto;
}

.bee-avatar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.edit-avatar-btn {
    bottom: -17px;
    right: calc(50% - 50px);
}

.edit-background-btn {
    bottom: -17px;
    right: calc(50% + 10px);
}

.form-group {
    margin-bottom: 1rem;
}

.form-label {
    font-weight: 500;
    margin-bottom: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 576px) {
    .bee-container {
        max-width: 250px;
    }

    .form-control-lg {
        font-size: 1rem;
        padding: 0.5rem 0.75rem;
    }
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
