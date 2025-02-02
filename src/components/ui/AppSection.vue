<template>
    <section
        :class="[
            'position-relative bg-image',
            center ? 'd-flex align-items-center justify-content-center' : '',
            `py-${padding}`,
            `m-0 m-lg-${margin}`,
        ]"
        :style="`height: ${height}vh;`"
    >
        <!-- Background image -->
        <Transition name="fade">
            <div
                v-if="backgroundImage && !backgroundVideo"
                :key="backgroundImage"
                class="position-absolute top-0 start-0 w-100 h-100 overflow-hidden"
            >
                <div class="position-absolute top-0 start-0 w-100 h-100">
                    <NuxtImg
                        :src="backgroundImage"
                        class="position-absolute w-100 h-100 object-fit-cover"
                        :class="backgroundPosition ? `object-position-${backgroundPosition}` : ''"
                        loading="lazy"
                        format="webp"
                        :style="`z-index: 0; transform: scale(1.1); filter: blur(${backgroundBlur}px);`"
                    />
                </div>
            </div>
        </Transition>

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
                class="row  d-flex align-items-center justify-content-center"
                :class="center && fluid ? 'justify-content-center' : ''"
            >
                <div
                    class="col-12"
                    :class="[
                        `col-lg-${colLg}`,
                        `col-md-${colMd}`,
                        `col-sm-${colSm}`,
                        `col-xs-${colXs}`,
                        fullWidth ? 'w-100' : '',
                    ]"
                >
                    <slot />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
type ColumnWidth = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14'

interface Props {
    backgroundColor?: Color
    backgroundImage?: string
    backgroundVideo?: string
    backgroundOpacity?: string // Value between 0 and 1
    backgroundBlur?: string // Value between 0 and 100
    backgroundPosition?: 'top' | 'center' | 'bottom' // Control image position
    fluid?: boolean // Allow full-width container
    padding?: 0 | 1 | 2 | 3 | 4 | 5 // Bootstrap padding utilities
    margin?: 0 | 1 | 2 | 3 | 4 | 5 // Bootstrap margin utilities
    height?: string // Minimum viewport height
    fullWidth?: boolean // Allow full-width container
    center?: boolean // Center the content
    colLg?: ColumnWidth
    colMd?: ColumnWidth
    colSm?: ColumnWidth
    colXs?: ColumnWidth
}

withDefaults(defineProps<Props>(), {
    padding: 0,
    margin: 0,
    backgroundOpacity: '1',
    fluid: false,
    backgroundBlur: '0',
    center: false,
    fullWidth: false,
    colLg: '13',
    colMd: '13',
    colSm: '14',
    colXs: '14',
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

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease-in-out;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
}
</style>
