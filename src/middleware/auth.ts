export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  
  // Redirect authenticated users away from auth pages
  if (user.value && to.path.startsWith('/auth')) {
    return navigateTo('/dashboard')
  }
})