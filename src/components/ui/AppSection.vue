<template>
    <section
        :class="[
            'position-relative',
            center ? 'd-flex align-items-center justify-content-center' : '',
            `py-${padding}`,
        ]"
        :style="`height: ${height}vh;`"
    >
        <!-- Background image -->
        <div
            v-if="backgroundImage && !backgroundVideo"
            class="position-absolute top-0 start-0 w-100 h-100"
        >
            <NuxtImg
                :src="backgroundImage"
                class="position-absolute w-100 h-100 object-fit-cover"
                :class="backgroundPosition ? `object-position-${backgroundPosition}` : ''"
                loading="lazy"
                format="webp"
                :style="`z-index: 0; filter: blur(${backgroundBlur}px);`"
            />
        </div>

        <!-- Background video -->
        <div
            v-if="backgroundVideo"
            class="position-absolute top-0 start-0 w-100 h-100 overflow-hidden"
        >
            <video
                class="position-absolute w-100 h-100 object-fit-cover"
                :src="backgroundVideo"
                autoplay
                muted
                loop
                playsinline
                style="z-index: 0;"
            />
        </div>

        <!-- Background color -->
        <div
            class="position-absolute top-0 start-0 w-100 h-100"
            :style="`
                background-color: ${backgroundColor ? `var(--bs-${backgroundColor})` : 'transparent'};
                opacity: ${backgroundOpacity};
                z-index: 1;
            `"
        />

        <div
            :class="[fluid ? 'container-fluid' : 'container', `py-md-${padding}`]"
            class="position-relative z-2"
        >
            <div
                class="row"
                :class="center && fluid ? 'justify-content-center' : ''"
            >
                <div
                    class="col-14 col-lg-14 col-md-14 col-sm-14 col-xs-11 h-100"
                    :class="fullWidth ? 'w-100' : ''"
                >
                    <slot />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
interface Props {
    backgroundColor?: Color
    backgroundImage?: string
    backgroundVideo?: string
    backgroundOpacity?: string // Value between 0 and 1
    backgroundBlur?: string // Value between 0 and 100
    backgroundPosition?: 'top' | 'center' | 'bottom' // Control image position
    fluid?: boolean // Allow full-width container
    padding?: 0 | 1 | 2 | 3 | 4 | 5 // Bootstrap padding utilities
    height?: string // Minimum viewport height
    fullWidth?: boolean // Allow full-width container
    center?: boolean // Center the content
}

withDefaults(defineProps<Props>(), {
    padding: 0,
    backgroundOpacity: '1',
    fluid: false,
    backgroundBlur: '0',
    center: false,
    fullWidth: false,
})
</script>

<style scoped lang="scss">
.object-position {
    &-top {
        object-position: top;
    }
    &-center {
        object-position: center;
    }
    &-bottom {
        object-position: bottom;
    }
}
</style>
