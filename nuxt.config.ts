export default defineNuxtConfig({
    modules: [
        '@nuxtjs/supabase',
        '@pinia/nuxt',
        'nuxt-bootstrap-icons',
        'vite-svg-loader',
        '@nuxt/eslint',
        '@vueuse/nuxt',
        '@nuxt/image',
        'usebootstrap',
        '@nuxtjs/google-fonts',
    ],

    components: {
        dirs: [
            {
                path: '~/components',
                global: true,
                pathPrefix: false,
            },
        ],
    },
    devtools: { enabled: false },

    app: {
        pageTransition: { name: 'page', mode: 'out-in' },
        head: {
            title: 'GroupHive App',
            meta: [
                { charset: 'utf-8' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
                { name: 'description', content: 'Collaborative task management for flatmates' },
            ],
        },
    },
    css: [ 'usebootstrap/scss/usebootstrap', '~/assets/css/main.scss' ],
    srcDir: 'src/',

    compatibilityDate: '2025-01-04',

    vite: {
        optimizeDeps: {
            include: [
                'yup', '@headlessui/vue', 'vue-draggable-next', 'three',
            ],
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@import "@/assets/css/_grid.scss";',
                },
            },
        },
    },

    googleFonts: {
        families: {
            Inter: [
                400, 500, 600, 700,
            ],
        },
    },

    supabase: {
        redirectOptions: {
            login: '/auth/login',
            callback: '/auth/confirm',
            exclude: [
                '/', '/auth/register', '/auth/confirm',
            ],
            cookieRedirect: true,
        },
        cookieOptions: {
            maxAge: 60 * 60 * 8,
            sameSite: 'lax',
            secure: true,
        },
    },

    usebootstrap: {
        scss: true,
        image: true,
        fonts: false,
        sitemap: false,
        robots: false,
        shiki: false,
        leaflet: false,
        mdc: false,
        tiptap: false,
        pwa: false,
        aos: false,
        echarts: false,
    },
})
