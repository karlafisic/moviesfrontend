<template>
    <div class="max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold text-white mb-10">Manage Genres</h1>

        <!-- Forma za dodavanje -->
        <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
            <h2 class="text-white font-semibold mb-4">Add Genre</h2>
            <div class="flex gap-3">
                <input
                    v-model="newGenre"
                    type="text"
                    placeholder="Genre name"
                    class="flex-1 rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-700 transition-colors"
                />
                <button
                    @click="submitGenre"
                    :disabled="!newGenre.trim() || genreLoading"
                    class="px-6 py-2 bg-gray-900 border border-blue-700 hover:bg-gray-800 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                    {{ genreLoading ? 'Saving...' : 'Add' }}
                </button>
            </div>
        </div>

        <!-- Lista žanrova -->
        <div class="flex flex-col gap-3">
            <div
                v-for="genre in genres"
                :key="genre.id"
                class="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 flex items-center justify-between"
            >
                <span class="text-white font-medium">{{ genre.name }}</span>
                <button
                    @click="deleteGenre(genre.id)"
                    class="text-gray-600 hover:text-red-400 transition-colors"
                >
                    <Icon name="mdi:trash-can-outline" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import type { Genre } from '~/types/index'

definePageMeta({
    middleware: 'admin'
})

const authStore = useAuthStore()
const config = useRuntimeConfig()

const headers = computed(() => ({
    Authorization: `Bearer ${authStore.token}`
}))

const { data: genres, refresh } = await useFetch<Genre[]>(
    `${config.public.apiBase}/genres`,
    { headers }
)

const newGenre = ref('')
const genreLoading = ref(false)

const submitGenre = async () => {
    genreLoading.value = true
    try {
        await $fetch(`${config.public.apiBase}/genres`, {
            method: 'POST',
            body: { name: newGenre.value },
            headers: headers.value
        })
        newGenre.value = ''
        await refresh()
    } catch (err) {
        console.error(err)
    } finally {
        genreLoading.value = false
    }
}

const deleteGenre = async (id: number) => {
    if (!confirm('Are you sure?')) return
    try {
        await $fetch(`${config.public.apiBase}/genres/${id}`, {
            method: 'DELETE',
            headers: headers.value
        })
        await refresh()
    } catch (err) {
        console.error(err)
    }
}
</script>