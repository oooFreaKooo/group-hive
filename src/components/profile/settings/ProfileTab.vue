<template>
    <div>
        <!-- Avatar and Display Name Section -->
        <div class="row mb-5">
            <div class="col-14 d-flex justify-content-center">
                <div class="bee-container border-bottom">
                    <Bee :avatar="previewAvatar || '/default-avatar.png'" />
                    <HexagonSimple
                        class="edit-btn position-absolute"
                        icon="pencil"
                        @click="showAvatarSection = !showAvatarSection"
                    />
                </div>
            </div>
        </div>

        <!-- Avatar Selection Section -->
        <div
            v-if="showAvatarSection"
            class="card bg-light border-0 mb-5"
        >
            <div class="card-body">
                <h3 class="h5 mb-4">
                    Choose Avatar
                </h3>

                <div class="mb-4">
                    <label class="form-label">Custom Seed</label>
                    <div class="input-group">
                        <input
                            v-model="customSeed"
                            type="text"
                            class="form-control"
                            placeholder="Enter seed for unique avatar..."
                            @keyup.enter="handleCustomSeed"
                        >
                        <button
                            class="btn btn-outline-primary"
                            @click="handleCustomSeed"
                        >
                            Generate
                        </button>
                    </div>
                </div>

                <div class="bg-white rounded p-3">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h4 class="h6 mb-0">
                            Random Avatars
                        </h4>
                        <button
                            class="btn btn-sm btn-outline-primary d-flex align-items-center gap-2"
                            @click="regenerateSeeds"
                        >
                            <AppIcon
                                name="shuffle"
                                size="sm"
                            />
                            Shuffle
                        </button>
                    </div>
                    <div class="row g-3">
                        <div
                            v-for="seed in seeds"
                            :key="seed"
                            class="col-6 col-sm-4 col-md-3"
                        >
                            <button
                                class="avatar-option position-relative w-100 p-0 overflow-hidden rounded-3"
                                :class="{ selected: selectedSeed === seed }"
                                @click="selectGeneratedAvatar(seed)"
                            >
                                <div class="bee-container bee-container-small">
                                    <Bee :avatar="`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${seed}`" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Location Section -->
        <div class="row g-4">
            <div class="col-14">
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
            </div>
            <div class="col-md-7">
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
            <div class="col-md-7">
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
import Bee from '~/components/ui/hexagon/Bee.vue'

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

const showAvatarSection = ref(false)
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

const selectedSeed = ref('')
const customSeed = ref('')
const seeds = ref<string[]>([])

// Generate a random string for seed
const generateRandomSeed = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
}

// Initialize or regenerate 8 random seeds
const regenerateSeeds = () => {
    seeds.value = Array.from({ length: 8 }, () => generateRandomSeed())
}

// Initialize seeds on component mount
onMounted(() => {
    regenerateSeeds()
})

const selectGeneratedAvatar = (seed: string) => {
    selectedSeed.value = seed
    previewAvatar.value = `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${seed}`
}

// Handle custom seed input
const handleCustomSeed = () => {
    if (customSeed.value.trim()) {
        selectGeneratedAvatar(customSeed.value.trim())
    }
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

.avatar-option {
    aspect-ratio: 1;
    border: 2px solid transparent;
    transition: all 0.2s ease;
    overflow: hidden;
}

.avatar-option:hover {
    transform: scale(1.05);
}

.avatar-option.selected {
    border-color: var(--bs-primary);
    box-shadow: 0 0 0 4px var(--bs-primary-bg-subtle);
}

.form-group {
    margin-bottom: 1rem;
}

.form-label {
    font-weight: 500;
    margin-bottom: 0.5rem;
}
</style>
