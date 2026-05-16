<template>
    <div>
        <!-- Hero -->
        <div class="mb-10">
            <h1 class="text-4xl font-bold text-white">Discover Movies</h1>
            <p class="mt-2 text-gray-400">Find your next favourite film</p>
        </div>

        <!-- Search -->
        <div class="mb-8">
            <input
                v-model="search"
                type="text"
                placeholder="Search movies..."
                class="w-full max-w-md rounded-lg bg-gray-900 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-700 transition-colors"
            />
        </div>

        <!-- Loading -->
        <div v-if="pending" class="flex justify-center py-20">
            <Icon name="mdi:loading" class="text-4xl text-blue-500 animate-spin" />
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-red-400 text-center py-20">
            Failed to load movies.
        </div>

        <!-- Movies grid -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <MovieCard
                v-for="movie in filteredMovies"
                :key="movie.id"
                :movie="movie"
            />
        </div>

        <!-- Empty -->
        <div v-if="!pending && filteredMovies.length === 0" class="text-center py-20 text-gray-500">
            No movies found.
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Movie } from '~/types'
const config = useRuntimeConfig()
const search = ref('')

const { data: movies, pending, error } = await useFetch<Movie[]>(
  'http://127.0.0.1:8000/api/movies',
  {
    params: {
        search
    },
    watch: [search]
  }
)
const filteredMovies = computed(() => movies.value ?? [])
</script>