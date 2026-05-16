<template>
    <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="flex items-center gap-4 mb-10">
            <div class="w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center text-2xl font-bold text-blue-300">
                {{ authStore.user?.name?.charAt(0).toUpperCase() }}
            </div>
            <div>
                <h1 class="text-3xl font-bold text-white">{{ authStore.user?.name }}</h1>
                <p class="text-gray-400 text-sm">{{ authStore.user?.email }}</p>
            </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 gap-4 mb-10">
            <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
                <p class="text-3xl font-bold text-white">{{ ratings?.length ?? 0 }}</p>
                <p class="text-gray-400 text-sm mt-1">Movies Rated</p>
            </div>
            <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
                <p class="text-3xl font-bold text-white">{{ comments?.length ?? 0 }}</p>
                <p class="text-gray-400 text-sm mt-1">Comments Posted</p>
            </div>
        </div>

        <!-- Ratings sekcija -->
        <div class="mb-10">
            <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Icon name="mdi:star" class="text-yellow-400" />
                My Ratings
            </h2>

            <div v-if="ratingsLoading" class="flex justify-center py-10">
                <Icon name="mdi:loading" class="text-4xl text-blue-500 animate-spin" />
            </div>

            <div v-else-if="!ratings || ratings.length === 0" class="text-center py-10 bg-gray-900 border border-gray-800 rounded-xl text-gray-500">
                <Icon name="mdi:star-off" class="text-4xl mb-2" />
                <p>You haven't rated any movies yet.</p>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <NuxtLink
                    v-for="rating in ratings"
                    :key="rating.id"
                    :to="`/movies/${rating.movie_id}`"
                    class="bg-gray-900 border border-gray-800 hover:border-blue-700 rounded-xl p-4 flex items-center gap-4 transition-colors"
                >
                    <img
                        v-if="rating.movie?.poster_url"
                        :src="rating.movie.poster_url"
                        :alt="rating.movie?.title"
                        class="w-12 h-16 object-cover rounded-lg shrink-0"
                    />
                    <div v-else class="w-12 h-16 bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                        <Icon name="mdi:movie-open" class="text-gray-600" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="text-white font-semibold text-sm truncate">{{ rating.movie?.title }}</p>
                        <p class="text-gray-500 text-xs">{{ rating.movie?.release_year }}</p>
                        <div class="flex items-center gap-0.5 mt-1">
                            <template v-for="star in 5" :key="star">
                                <Icon
                                    :name="star <= rating.rating ? 'mdi:star' : 'mdi:star-outline'"
                                    class="text-sm"
                                    :class="star <= rating.rating ? 'text-yellow-400' : 'text-gray-600'"
                                />
                            </template>
                        </div>
                    </div>
                </NuxtLink>
            </div>
        </div>

        <!-- Comments sekcija -->
        <div>
            <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Icon name="mdi:comment-multiple-outline" class="text-blue-400" />
                My Comments
            </h2>

            <div v-if="commentsLoading" class="flex justify-center py-10">
                <Icon name="mdi:loading" class="text-4xl text-blue-500 animate-spin" />
            </div>

            <div v-else-if="!comments || comments.length === 0" class="text-center py-10 bg-gray-900 border border-gray-800 rounded-xl text-gray-500">
                <Icon name="mdi:comment-off-outline" class="text-4xl mb-2" />
                <p>You haven't commented yet.</p>
            </div>

            <div v-else class="flex flex-col gap-4">
                <NuxtLink
                    v-for="comment in comments"
                    :key="comment.id"
                    :to="`/movies/${comment.movie_id}`"
                    class="bg-gray-900 border border-gray-800 hover:border-blue-700 rounded-xl p-5 transition-colors"
                >
                    <div class="flex items-center justify-between mb-2">
                        <p class="text-blue-400 text-sm font-semibold">{{ comment.movie?.title }}</p>
                        <p class="text-gray-500 text-xs">{{ formatDate(comment.created_at) }}</p>
                    </div>
                    <p class="text-gray-300 text-sm leading-6">{{ comment.content }}</p>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import type { Rating, Comment } from '~/types/index'

definePageMeta({
    middleware: 'auth'
})

const authStore = useAuthStore()
const config = useRuntimeConfig()

const headers = computed(() => ({
    Authorization: `Bearer ${authStore.token}`
}))

const { data: ratings, pending: ratingsLoading } = await useFetch<Rating[]>(
    `${config.public.apiBase}/me/ratings`,
    { headers }
)

const { data: comments, pending: commentsLoading } = await useFetch<Comment[]>(
    `${config.public.apiBase}/me/comments`,
    { headers }
)

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}
</script>