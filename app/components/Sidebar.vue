<template>
    <aside
        @mouseenter="expanded = true"
        @mouseleave="expanded = false"
        :class="expanded ? 'w-56' : 'w-16'"
        class="fixed top-0 left-0 h-screen bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col z-50"
    >
        <!-- Logo -->
        <div class="flex items-center h-16 px-4 border-b border-gray-800">
            <span class="text-2xl">🎬</span>
            <span v-if="expanded" class="ml-3 font-bold text-white whitespace-nowrap">FilmPreporuka</span>
        </div>

        <!-- Navigacija -->
        <nav class="flex flex-col gap-1 p-2 flex-1">
            <NuxtLink
                to="/"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                active-class="bg-gray-800 text-white"
            >
                <Icon name="mdi:home" class="text-xl shrink-0" />
                <span v-if="expanded" class="whitespace-nowrap">Početna</span>
            </NuxtLink>

            <NuxtLink
                to="/movies"
                class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                active-class="bg-gray-800 text-white"
            >
                <Icon name="mdi:movie-open" class="text-xl shrink-0" />
                <span v-if="expanded" class="whitespace-nowrap">Filmovi</span>
            </NuxtLink>

            <template v-if="authStore.isLoggedIn">
                <NuxtLink
                    to="/profile"
                    class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    active-class="bg-gray-800 text-white"
                >
                    <Icon name="mdi:account" class="text-xl shrink-0" />
                    <span v-if="expanded" class="whitespace-nowrap">{{ authStore.user?.name }}</span>
                </NuxtLink>
            </template>
            <template v-if="authStore.user?.is_admin">
                <NuxtLink
                    to="/admin/movies"
                    class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    active-class="bg-gray-800 text-white"
                >
                    <Icon name="mdi:movie-edit" class="text-xl shrink-0" />
                    <span v-if="expanded" class="whitespace-nowrap">Manage Movies</span>
                </NuxtLink>
                <NuxtLink
                    to="/admin/genres"
                    class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                    active-class="bg-gray-800 text-white"
                >
                    <Icon name="mdi:tag-multiple" class="text-xl shrink-0" />
                    <span v-if="expanded" class="whitespace-nowrap">Manage Genres</span>
                </NuxtLink>
            </template>
        </nav>

        <!-- Dno - login/logout -->
        <div class="p-2 border-t border-gray-800">
            <template v-if="authStore.isLoggedIn">
                <button
                    @click="handleLogout"
                    class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-red-900 hover:text-white transition-colors"
                >
                    <Icon name="mdi:logout" class="text-xl shrink-0" />
                    <span v-if="expanded" class="whitespace-nowrap">Odjava</span>
                </button>
            </template>
            <template v-else>
                <NuxtLink
                    to="/auth"
                    class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                    <Icon name="mdi:login" class="text-xl shrink-0" />
                    <span v-if="expanded" class="whitespace-nowrap">Prijava</span>
                </NuxtLink>
                <NuxtLink
                    to="/auth"
                    class="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-blue-900 hover:text-white transition-colors"
                >
                    <Icon name="mdi:account-plus" class="text-xl shrink-0" />
                    <span v-if="expanded" class="whitespace-nowrap">Registracija</span>
                </NuxtLink>
            </template>
        </div>
    </aside>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const expanded = ref(false)
const emit = defineEmits<{
    expandedChange: [value: boolean]
}>()

watch(expanded, (val) => {
    emit('expandedChange', val)
})
const handleLogout = async () => {
    const { apiFetch } = useApi()
    await apiFetch('/logout', { method: 'POST' })
    authStore.logout()
    router.push('/auth')
}
</script>