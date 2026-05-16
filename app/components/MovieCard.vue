<template>
    <NuxtLink :to="`/movies/${movie.id}`" class="group block">
        <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20">
            <!-- Poster -->
            <div class="relative aspect-[2/3] overflow-hidden">
                <img
                    v-if="movie.poster_url"
                    :src="movie.poster_url"
                    :alt="movie.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div v-else class="w-full h-full bg-gray-800 flex items-center justify-center">
                    <Icon name="mdi:movie-open" class="text-5xl text-gray-600" />
                </div>

                <!-- Genres overlay -->
                <div class="absolute top-2 left-2 flex flex-wrap gap-1">
                    <span
                        v-for="genre in movie.genres?.slice(0, 2)"
                        :key="genre.id"
                        class="text-xs bg-blue-900/80 text-blue-200 px-2 py-0.5 rounded-full backdrop-blur-sm"
                    >
                        {{ genre.name }}
                    </span>
                </div>
            </div>

            <!-- Info -->
            <div class="p-4">
                <h3 class="text-white font-semibold text-sm truncate group-hover:text-blue-400 transition-colors">
                    {{ movie.title }}
                </h3>

                <div class="mt-1 flex items-center justify-between">
                    <span class="text-gray-500 text-xs">{{ movie.release_year }}</span>
                    <span v-if="movie.duration" class="text-gray-500 text-xs">{{ movie.duration }} min</span>
                </div>

                <!-- Star rating -->
                <div class="mt-2 flex items-center gap-1">
                    <template v-for="star in 5" :key="star">
                        <Icon
                            :name="star <= Math.round(avgRating) ? 'mdi:star' : 'mdi:star-outline'"
                            class="text-sm"
                            :class="star <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-600'"
                        />
                    </template>
                    <span class="text-xs text-gray-500 ml-1">
                        {{ avgRating > 0 ? avgRating.toFixed(1) : 'No ratings' }}
                    </span>
                </div>
            </div>
        </div>
    </NuxtLink>
</template>

<script setup lang="ts">
import type { Movie } from '~/types/index'

const props = defineProps<{
    movie: Movie
}>()

const avgRating = computed(() => {
    if (!props.movie.ratings || props.movie.ratings.length === 0) return 0
    const sum = props.movie.ratings.reduce((acc, r) => acc + r.rating, 0)
    return sum / props.movie.ratings.length
})
</script>