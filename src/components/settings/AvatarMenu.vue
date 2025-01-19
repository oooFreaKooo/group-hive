<template>
    <div
        ref="menuRef"
    >
        <HexagonSimple
            icon="emoji-smile"
            is-menu
            @click="toggleMenu"
        />

        <Transition name="fade">
            <div
                v-if="isOpen"
                class="avatar-grid"
            >
                <!-- Avatar Grid -->
                <div
                    v-for="seed in seeds"
                    :key="seed"
                    class="avatar-item"
                    @click="selectAvatar(seed)"
                >
                    <div class="avatar-preview">
                        <NuxtImg
                            :src="`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${seed}`"
                            class="preview-img"
                            loading="lazy"
                        />
                    </div>
                </div>

                <!-- Refresh Button -->
                <div class="avatar-item refresh">
                    <div
                        class="avatar-preview"
                        @click.stop="regenerateAvatars"
                    >
                        <div class="refresh-content">
                            <i class="bi bi-arrow-clockwise" />
                        </div>
                    </div>
                </div>

                <!-- Custom Seed Input -->
                <div class="custom-seed-section">
                    <div class="input-group">
                        <input
                            v-model="customSeed"
                            type="text"
                            class="form-control form-control-sm"
                            placeholder="Enter custom seed..."
                            @keyup.enter="handleCustomSeed"
                        >
                        <button
                            class="btn btn-primary btn-sm"
                            :disabled="!customSeed.trim()"
                            @click.stop="handleCustomSeed"
                        >
                            <i class="bi bi-magic" />
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script lang="ts" setup>
const menuRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const seeds = ref<string[]>([])
const customSeed = ref('')

const emit = defineEmits<{
    (e: 'select', value: string): void
    (e: 'open'): void
}>()

const toggleMenu = () => {
    isOpen.value = !isOpen.value
    if (isOpen.value) {
        emit('open')
    }
}

defineExpose({
    isOpen,
})

// Generate a random string for seed
const generateRandomSeed = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
}

// Initialize or regenerate avatar options
const regenerateAvatars = () => {
    seeds.value = Array.from({ length: 8 }, () => generateRandomSeed())
}

const selectAvatar = (seed: string) => {
    emit('select', `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${seed}`)
}

// Handle custom seed input
const handleCustomSeed = () => {
    if (customSeed.value.trim()) {
        selectAvatar(customSeed.value.trim())
        customSeed.value = ''
    }
}

// Initialize seeds on component mount
onMounted(() => {
    regenerateAvatars()
})
</script>

<style scoped lang="scss">
.avatar-grid {
    position: absolute;
    top: calc(100% + 1rem);
    left: 50%;
    transform: translateX(-50%);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 1rem;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    min-width: max-content;
    z-index: 1000;
}

.avatar-item {
    position: relative;
    cursor: pointer;
}

.avatar-preview {
    width: 100px;
    height: 100px;
    border-radius: 0.5rem;
    overflow: hidden;
    transition: all 150ms ease-in-out;

    &:hover {
        transform: scale(0.95);
    }

    .preview-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.refresh {
    .avatar-preview {
        background: var(--bs-light);
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
            background: var(--bs-gray-200);
        }

        .refresh-content {
            font-size: 1.5rem;
            color: var(--bs-dark);
        }
    }
}

.custom-seed-section {
    grid-column: 1 / -1;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--bs-gray-200);

    .input-group {
        .form-control {
            border-radius: 0.5rem 0 0 0.5rem;
            border: 1px solid var(--bs-gray-300);

            &:focus {
                border-color: var(--bs-primary);
                box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
            }
        }

        .btn {
            border-radius: 0 0.5rem 0.5rem 0;
            border: 1px solid var(--bs-primary);

            &:hover:not(:disabled) {
                background: var(--bs-primary-dark, #0056b3);
            }

            &:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        }
    }
}

// Transitions
.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-10px) translateX(-50%);
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    transform: translateY(0) translateX(-50%);
}
</style>
