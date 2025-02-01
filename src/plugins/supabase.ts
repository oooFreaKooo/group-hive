export default defineNuxtPlugin((_nuxtApp) => {
    const supabase = useSupabaseClient()

    return {
        provide: {
            $supabase: supabase,
        },
    }
})
