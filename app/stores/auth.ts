import { defineStore } from 'pinia'

interface User {
    id: number
    name: string
    email: string
    is_admin: boolean
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        token: null as string | null,
    }),

    getters: {
        isLoggedIn: (state) => !!state.token,
    },

    actions: {
        setAuth(user: User, token: string) {
            this.user = user
            this.token = token
            localStorage.setItem('token', token)
        },

        logout() {
            this.user = null
            this.token = null
            localStorage.removeItem('token')
        },

        loadFromStorage() {
            const token = localStorage.getItem('token')
            if (token) {
                this.token = token
            }
        }
    }
})