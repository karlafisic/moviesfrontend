<template>
    <div class="max-w-5xl mx-auto">
        <div class="flex items-center justify-between mb-10">
            <h1 class="text-3xl font-bold text-white">Manage Movies</h1>
            <button
                @click="showForm = !showForm"
                class="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-blue-700 hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-colors"
            >
                <Icon :name="showForm ? 'mdi:close' : 'mdi:plus'" />
                {{ showForm ? 'Cancel' : 'Add Movie' }}
            </button>
        </div>

        <!-- Forma za dodavanje -->
        <div v-if="showForm" class="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
            <h2 class="text-white font-semibold mb-6">Add New Movie</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="text-sm text-gray-400 mb-1 block">Title</label>
                    <input
                        v-model="form.title"
                        type="text"
                        placeholder="Movie title"
                        class="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-700 transition-colors"
                    />
                </div>
                <div>
                    <label class="text-sm text-gray-400 mb-1 block">Release Year</label>
                    <input
                        v-model="form.release_year"
                        type="number"
                        placeholder="2024"
                        class="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-700 transition-colors"
                    />
                </div>
                <div>
                    <label class="text-sm text-gray-400 mb-1 block">Duration (min)</label>
                    <input
                        v-model="form.duration"
                        type="number"
                        placeholder="120"
                        class="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-700 transition-colors"
                    />
                </div>
                <div>
                    <label class="text-sm text-gray-400 mb-1 block">Poster URL</label>
                    <input
                        v-model="form.poster_url"
                        type="text"
                        placeholder="https://..."
                        class="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-700 transition-colors"
                    />
                </div>
                <div class="md:col-span-2">
                    <label class="text-sm text-gray-400 mb-1 block">Description</label>
                    <textarea
                        v-model="form.description"
                        rows="3"
                        placeholder="Movie description..."
                        class="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-700 transition-colors resize-none"
                    />
                </div>
                <div class="md:col-span-2">
                    <label class="text-sm text-gray-400 mb-1 block">Genres</label>
                    <div class="flex flex-wrap gap-2 mb-2">
                        <span
                            v-for="genreId in form.genres"
                            :key="genreId"
                            class="flex items-center gap-1 text-xs bg-blue-900/40 text-blue-300 border border-blue-800 px-3 py-1 rounded-full"
                        >
                            {{ allGenres?.find(g => g.id === genreId)?.name }}
                            <button type="button" @click="removeGenreFromForm(genreId)">
                                <Icon name="mdi:close" class="text-xs" />
                            </button>
                        </span>
                    </div>
                    <select
                        v-model="selectedFormGenre"
                        @change="addGenreToForm"
                        class="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-white focus:outline-none focus:border-blue-700"
                    >
                        <option value="" disabled>Select genre</option>
                        <option
                            v-for="genre in availableFormGenres"
                            :key="genre.id"
                            :value="genre.id"
                        >
                            {{ genre.name }}
                        </option>
                    </select>
                </div>
            </div>

            <p v-if="formError" class="mt-3 text-sm text-red-400">{{ formError }}</p>

            <button
                @click="submitMovie"
                :disabled="formLoading"
                class="mt-4 px-6 py-2 bg-gray-900 border border-blue-700 hover:bg-gray-800 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
            >
                {{ formLoading ? 'Saving...' : 'Save Movie' }}
            </button>
        </div>

        <!-- Lista filmova -->
        <div v-if="pending" class="flex justify-center py-20">
            <Icon name="mdi:loading" class="text-4xl text-blue-500 animate-spin" />
        </div>

        <div v-else class="flex flex-col gap-3">
            <div
                v-for="movie in movies"
                :key="movie.id"
                class="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-4"
            >
                <img
                    v-if="movie.poster_url"
                    :src="movie.poster_url"
                    :alt="movie.title"
                    class="w-12 h-16 object-cover rounded-lg shrink-0"
                />
                <div v-else class="w-12 h-16 bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                    <Icon name="mdi:movie-open" class="text-gray-600" />
                </div>

                <div class="flex-1 min-w-0">
                    <p class="text-white font-semibold truncate">{{ movie.title }}</p>
                    <p class="text-gray-500 text-xs">{{ movie.release_year }} · {{ movie.duration }} min</p>
                    <div class="flex flex-wrap gap-1 mt-1">
                        <span
                            v-for="genre in movie.genres"
                            :key="genre.id"
                            class="text-xs bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded-full"
                        >
                            {{ genre.name }}
                            <button @click="detachGenre(movie.id, genre.id)" class="hover:text-red-400 transition-colors">
                                <Icon name="mdi:close" class="text-xs" />
                            </button>
                        </span>
                    </div>
                </div>

                <div class="flex items-center gap-2 shrink-0">
                    <!-- Dodaj žanr -->
                    <select
                        v-model="selectedGenres[movie.id]"
                        class="rounded-lg bg-gray-800 border border-gray-700 px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-700"
                    >
                        <option value="" disabled selected>Add genre</option>
                        <option
                            v-for="genre in availableGenres(movie)"
                            :key="genre.id"
                            :value="genre.id"
                        >
                            {{ genre.name }}
                        </option>
                    </select>
                    <button
                        @click="attachGenre(movie.id)"
                        :disabled="!selectedGenres[movie.id]"
                        class="p-2 text-gray-400 hover:text-blue-400 disabled:opacity-30 transition-colors"
                    >
                        <Icon name="mdi:plus" />
                    </button>

                    <button
                        @click="deleteMovie(movie.id)"
                        class="p-2 text-gray-600 hover:text-red-400 transition-colors"
                    >
                        <Icon name="mdi:trash-can-outline" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import type { Movie, Genre } from '~/types/index'

definePageMeta({
    middleware: 'admin'
})

const authStore = useAuthStore()
const config = useRuntimeConfig()

const headers = computed(() => ({
    Authorization: `Bearer ${authStore.token}`
}))

const { data: movies, pending, refresh } = await useFetch<Movie[]>(
    `${config.public.apiBase}/movies`,
    { headers }
)

const { data: allGenres } = await useFetch<Genre[]>(
    `${config.public.apiBase}/genres`,
    { headers }
)

const selectedGenres = reactive<Record<number, number | ''>>({})

const availableGenres = (movie: Movie) => {
    const movieGenreIds = movie.genres?.map(g => g.id) ?? []
    return allGenres.value?.filter(g => !movieGenreIds.includes(g.id)) ?? []
}

const attachGenre = async (movieId: number) => {
    const genreId = selectedGenres[movieId]
    if (!genreId) return

    try {
        await $fetch(`${config.public.apiBase}/movies/${movieId}/genres`, {
            method: 'POST',
            body: { genre_id: genreId },
            headers: headers.value
        })
        selectedGenres[movieId] = ''
        await refresh()
    } catch (err) {
        console.error(err)
    }
}
const detachGenre = async (movieId: number, genreId: number) => {
    try {
        await $fetch(`${config.public.apiBase}/movies/${movieId}/genres/${genreId}`, {
            method: 'DELETE',
            headers: headers.value
        })
        await refresh()
    } catch (err) {
        console.error(err)
    }
}

const showForm = ref(false)
const formLoading = ref(false)
const formError = ref('')

const form = reactive({
    title: '',
    description: '',
    release_year: '',
    duration: '',
    poster_url: '',
    genres: [] as number[] 
})
const selectedFormGenre = ref<number | ''>('')

const availableFormGenres = computed(() => {
    return allGenres.value?.filter(g => !form.genres.includes(g.id)) ?? []
})

const addGenreToForm = () => {
    if (selectedFormGenre.value && !form.genres.includes(selectedFormGenre.value as number)) {
        form.genres.push(selectedFormGenre.value as number)
        selectedFormGenre.value = ''
    }
}

const removeGenreFromForm = (genreId: number) => {
    form.genres = form.genres.filter(id => id !== genreId)
}

const submitMovie = async () => {
    if (!form.title || !form.description || !form.release_year) {
        formError.value = 'Title, description and release year are required'
        return
    }

    formLoading.value = true
    formError.value = ''

    try {
        const response = await $fetch<Movie>(`${config.public.apiBase}/movies`, {
            method: 'POST',
            body: {
                title: form.title,
                description: form.description,
                release_year: parseInt(form.release_year),
                duration: form.duration ? parseInt(form.duration) : null,
                poster_url: form.poster_url || null
            },
            headers: headers.value
        })

        // Dodaj žanrove
        for (const genreId of form.genres) {
            await $fetch(`${config.public.apiBase}/movies/${response.id}/genres`, {
                method: 'POST',
                body: { genre_id: genreId },
                headers: headers.value
            })
        }

        form.title = ''
        form.description = ''
        form.release_year = ''
        form.duration = ''
        form.poster_url = ''
        form.genres = []
        showForm.value = false
        await refresh()
    } catch (err: any) {
        formError.value = err?.data?.message || 'Failed to save movie'
    } finally {
        formLoading.value = false
    }
}

const deleteMovie = async (id: number) => {
    if (!confirm('Are you sure you want to delete this movie?')) return

    try {
        await $fetch(`${config.public.apiBase}/movies/${id}`, {
            method: 'DELETE',
            headers: headers.value
        })
        await refresh()
    } catch (err) {
        console.error(err)
    }
}
watch(movies, (newMovies) => {
    newMovies?.forEach(movie => {
        if (!(movie.id in selectedGenres)) {
            selectedGenres[movie.id] = ''
        }
    })
}, { immediate: true })
</script>