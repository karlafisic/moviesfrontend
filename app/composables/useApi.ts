import { useAuthStore } from '~/stores/auth'
export const useApi = () => {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()

    const apiFetch = (url: string, options: any = {}) => {
        return $fetch(`${config.public.apiBase}${url}`, {
            ...options,
            headers: {
                'Authorization': `Bearer ${authStore.token}`,
                'Content-Type': 'application/json',
                ...options.headers,
            }
        })
    }

    return { apiFetch }
}