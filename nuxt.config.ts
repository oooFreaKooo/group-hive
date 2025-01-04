export default defineNuxtConfig({
  modules: [
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts'
  ],

  srcDir: 'src/',

  app: {
    head: {
      title: 'GroupHive App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Collaborative task management for flatmates' }
      ]
    }
  },

  supabase: {
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/confirm',
      exclude: ['/', '/auth/register'],
      cookieRedirect: true
    },
    cookieOptions: {
      maxAge: 60 * 60 * 8,
      sameSite: 'lax',
      secure: true
    }
  },

  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700]
    }
  },

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
  compatibilityDate: '2025-01-04'
})