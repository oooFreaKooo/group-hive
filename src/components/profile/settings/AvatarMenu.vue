<template>
    <div
        ref="menuRef"
    >
        <HexagonSimple
            icon="emoji-smile"
            is-menu
            @click="isOpen = !isOpen"
        />

        <Transition name="fade">
            <div
                v-if="isOpen"
                class="avatar-grid"
            >
                <div
                    v-for="seed in seeds"
                    :key="seed"
                    class="hex-item"
                    @click="selectAvatar(seed)"
                >
                    <div class="hex">
                        <div class="hex-content">
                            <NuxtImg
                                :src="`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${seed}`"
                                class="avatar-preview"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
                <div class="hex-item refresh">
                    <div
                        class="hex"
                        @click.stop="regenerateAvatars"
                    >
                        <div class="hex-content">
                            <i class="bi bi-dice-5" />
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
}>()

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
    background: rgba(255, 255, 255, 0.281);
    backdrop-filter: blur(1px);
    border-radius: 1rem;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    min-width: max-content;
}

.hex {
    display:flex;
    position: relative;
    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
    cursor: pointer;
    width: 80px;
    height: 70px;
    transform: rotate(180deg);
    transition: all 150ms ease-in-out;
    &:hover {
        transform: rotate(180deg) scale(0.95);
    }
}

.hex .hex-content {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 50%;
    left: 50%;
    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
    transform: translate(-50%, -50%) rotate(-180deg);
    color: white;
    z-index: 99;
    font-size: 11px;
    display: flex;
    align-items: center;
    justify-content: center;

    .avatar-preview {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    .bi {
        font-size: 1.5rem;
        color: var(--bs-dark);
    }
}

.refresh {
    .hex {
        background: var(--bs-light);

        &:hover {
            background: var(--bs-gray-200);
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
