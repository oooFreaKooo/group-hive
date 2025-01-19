<template>
    <div
        ref="menuRef"
    >
        <HexagonSimple
            icon="image"
            is-menu
            @click="toggleMenu"
        />

        <Transition name="fade">
            <div
                v-if="isOpen"
                class="bg-grid"
            >
                <!-- Random Images Grid -->
                <div
                    v-for="(image, index) in images"
                    :key="index"
                    class="bg-item"
                    @click="selectBackground(image)"
                >
                    <div class="bg-preview">
                        <NuxtImg
                            :src="generateImageUrl(image)"
                            class="preview-img"
                            loading="lazy"
                        />
                    </div>
                </div>

                <!-- Refresh Button -->
                <div class="bg-item refresh">
                    <div
                        class="bg-preview"
                        @click.stop="regenerateImages"
                    >
                        <div class="refresh-content">
                            <i class="bi bi-arrow-clockwise" />
                        </div>
                    </div>
                </div>

                <!-- Image Options -->
                <div class="options-section">
                    <div class="form-check form-switch mb-2">
                        <input
                            id="grayscaleSwitch"
                            v-model="options.grayscale"
                            class="form-check-input"
                            type="checkbox"
                            role="switch"
                            @change="applyOptions"
                        >
                        <label
                            class="form-check-label"
                            for="grayscaleSwitch"
                        >Grayscale</label>
                    </div>
                    <div class="form-check form-switch mb-2">
                        <input
                            id="blurSwitch"
                            v-model="options.blur"
                            class="form-check-input"
                            type="checkbox"
                            role="switch"
                            @change="applyOptions"
                        >
                        <label
                            class="form-check-label"
                            for="blurSwitch"
                        >Blur</label>
                    </div>
                    <div
                        v-if="options.blur"
                        class="blur-range mb-2"
                    >
                        <input
                            v-model="options.blurAmount"
                            type="range"
                            class="form-range"
                            min="1"
                            max="10"
                            @input="applyOptions"
                        >
                    </div>
                </div>

                <!-- Custom Seed Input -->
                <div class="custom-seed-section">
                    <div class="input-group">
                        <input
                            v-model="customSeed"
                            type="text"
                            class="form-control form-control-sm"
                            placeholder="Enter image ID or seed..."
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
const images = ref<number[]>([])
const customSeed = ref('')
const options = ref({
    grayscale: false,
    blur: false,
    blurAmount: 5,
})

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

// Generate random image IDs (Picsum has images from 1 to 1000)
const generateRandomImageId = () => {
    return Math.floor(Math.random() * 1000) + 1
}

// Initialize or regenerate background options
const regenerateImages = () => {
    images.value = Array.from({ length: 8 }, () => generateRandomImageId())
}

// Generate the complete image URL with options
const generateImageUrl = (imageId: number) => {
    let url = `https://picsum.photos/id/${imageId}/300/200`
    const params = []

    if (options.value.grayscale) {
        params.push('grayscale')
    }
    if (options.value.blur) {
        params.push(`blur=${options.value.blurAmount}`)
    }

    if (params.length > 0) {
        url += '?' + params.join('&')
    }

    return url
}

const selectBackground = (imageId: number) => {
    const url = generateImageUrl(imageId)
    emit('select', url)
}

// Handle custom seed/ID input
const handleCustomSeed = () => {
    if (customSeed.value.trim()) {
        const input = customSeed.value.trim()
        let url

        // Check if input is numeric (treat as ID) or string (treat as seed)
        if (/^\d+$/.test(input)) {
            url = generateImageUrl(Number.parseInt(input))
        } else {
            url = `https://picsum.photos/seed/${input}/300/200`
        }

        emit('select', url)
        customSeed.value = ''
    }
}

// Apply options to all current images
const applyOptions = () => {
    // Force a re-render of the images
    const currentImages = [...images.value]
    images.value = []
    nextTick(() => {
        images.value = currentImages
    })
}

// Initialize images on component mount
onMounted(() => {
    regenerateImages()
})
</script>

<style scoped lang="scss">
.bg-grid {
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

.bg-item {
    position: relative;
    cursor: pointer;
}

.bg-preview {
    width: 100px;
    height: 70px;
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
    .bg-preview {
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

.options-section {
    grid-column: 1 / -1;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--bs-gray-200);
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
