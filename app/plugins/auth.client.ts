import { useAuthStore } from '~/stores/auth'

export default defineNuxtPlugin(async () => {
    const authStore = useAuthStore()
    const config = useRuntimeConfig()

    authStore.loadFromStorage()

    if (authStore.token) {
        try {
            const user = await $fetch<any>(`${config.public.apiBase}/me`, {
                headers: {
                    Authorization: `Bearer ${authStore.token}`
                }
            })
            authStore.user = user
        } catch {
            // Token je istekao ili nije valjan
            authStore.logout()
        }
    }
})