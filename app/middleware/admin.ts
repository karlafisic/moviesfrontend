export default defineNuxtRouteMiddleware(() => {
    const authStore = useAuthStore()

    if (!authStore.isLoggedIn) {
        return navigateTo('/auth')
    }

    if (!authStore.user?.is_admin) {
        return navigateTo('/')
    }
})