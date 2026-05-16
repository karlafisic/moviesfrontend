<template>
    <div v-if="pending" class="flex justify-center py-20">
        <Icon name="mdi:loading" class="text-4xl text-blue-500 animate-spin" />
    </div>

    <div v-else-if="error" class="text-red-400 text-center py-20">
        Failed to load movie.
    </div>

    <div v-else-if="movie" class="max-w-5xl mx-auto">
        <!-- Back button -->
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
            <Icon name="mdi:arrow-left" class="group-hover:-translate-x-1 transition-transform" />
            Back to movies
        </NuxtLink>

        <!-- Hero sekcija -->
        <div class="relative w-full rounded-xl overflow-hidden mb-10 min-h-[350px]">
            <img
                v-if="movie.poster_url"
                :src="movie.poster_url"
                :alt="movie.title"
                class="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-20"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-gray-950/40" />

            <div class="relative z-10 flex flex-col md:flex-row gap-8 p-8">
                <!-- Poster -->
                <div class="shrink-0 mx-auto md:mx-0 w-48 md:w-56 rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
                    <img
                        v-if="movie.poster_url"
                        :src="movie.poster_url"
                        :alt="movie.title"
                        class="w-full h-full object-cover"
                    />
                    <div v-else class="w-full aspect-[2/3] bg-gray-800 flex items-center justify-center">
                        <Icon name="mdi:movie-open" class="text-6xl text-gray-600" />
                    </div>
                </div>

                <!-- Info -->
                <div class="flex flex-col justify-end py-4">
                    <div class="flex flex-wrap gap-2 mb-4">
                        <span
                            v-for="genre in movie.genres"
                            :key="genre.id"
                            class="text-xs bg-blue-900/60 text-blue-300 border border-blue-800 px-3 py-1 rounded-full"
                        >
                            {{ genre.name }}
                        </span>
                    </div>

                    <h1 class="text-3xl md:text-4xl font-bold text-white mb-3">{{ movie.title }}</h1>

                    <div class="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-4">
                        <span class="flex items-center gap-1">
                            <Icon name="mdi:calendar" />
                            {{ movie.release_year }}
                        </span>
                        <span v-if="movie.duration" class="flex items-center gap-1">
                            <Icon name="mdi:clock-outline" />
                            {{ movie.duration }} min
                        </span>
                        <span class="flex items-center gap-1">
                            <Icon name="mdi:comment-outline" />
                            {{ movie.comments?.length ?? 0 }} comments
                        </span>
                    </div>

                    <!-- Prosječni rating -->
                    <div class="flex items-center gap-3 mb-6">
                        <div class="flex items-center gap-1">
                            <template v-for="star in 5" :key="star">
                                <Icon
                                    :name="star <= Math.round(avgRating) ? 'mdi:star' : 'mdi:star-outline'"
                                    class="text-xl"
                                    :class="star <= Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-600'"
                                />
                            </template>
                        </div>
                        <span class="text-white font-semibold">
                            {{ avgRating > 0 ? avgRating.toFixed(1) : 'No ratings' }}
                        </span>
                        <span class="text-gray-500 text-sm">
                            ({{ movie.ratings?.length ?? 0 }} {{ movie.ratings?.length === 1 ? 'rating' : 'ratings' }})
                        </span>
                    </div>

                    <p class="text-gray-300 leading-7 max-w-2xl">{{ movie.description }}</p>
                </div>
            </div>
        </div>

        <!-- Rate this movie -->
        <div v-if="authStore.isLoggedIn" class="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-10">
            <h3 class="text-white font-semibold mb-4">Rate this movie</h3>
            <div class="flex items-center gap-2">
                <template v-for="star in 5" :key="star">
                    <Icon
                        :name="star <= (hoverRating || userRating) ? 'mdi:star' : 'mdi:star-outline'"
                        class="text-3xl cursor-pointer transition-colors"
                        :class="star <= (hoverRating || userRating) ? 'text-yellow-400' : 'text-gray-600'"
                        @mouseenter="hoverRating = star"
                        @mouseleave="hoverRating = 0"
                        @click="submitRating(star)"
                    />
                </template>
                <span v-if="userRating" class="text-gray-400 text-sm ml-2">
                    Your rating: {{ userRating }}/5
                </span>
            </div>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-800 mb-10" />

        <!-- Comments sekcija -->
        <div>
            <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Icon name="mdi:comment-multiple-outline" class="text-blue-400" />
                Comments
                <span class="text-gray-500 font-normal text-sm">({{ movie.comments?.length ?? 0 }})</span>
            </h2>

            <!-- Forma za komentar - prijavljeni -->
            <div v-if="authStore.isLoggedIn" class="mb-6">
                <textarea
                    v-model="newComment"
                    placeholder="Write a comment..."
                    rows="3"
                    class="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-700 transition-colors resize-none"
                />
                <button
                    @click="submitComment"
                    :disabled="!newComment.trim() || commentLoading"
                    class="mt-2 px-6 py-2 bg-gray-900 border border-blue-700 hover:bg-gray-800 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                    {{ commentLoading ? 'Posting...' : 'Post Comment' }}
                </button>
            </div>

            <!-- Nije prijavljen -->
            <div v-else class="mb-6 text-center py-4 bg-gray-900 border border-gray-800 rounded-xl">
                <p class="text-gray-400 text-sm">
                    <NuxtLink to="/auth" class="text-blue-400 hover:text-blue-300">Sign in</NuxtLink>
                    to leave a comment
                </p>
            </div>

            <!-- Prazno stanje -->
            <div v-if="!movie.comments || movie.comments.length === 0" class="text-center py-12 text-gray-500 bg-gray-900 rounded-xl border border-gray-800">
                <Icon name="mdi:comment-off-outline" class="text-4xl mb-2" />
                <p>No comments yet. Be the first to comment!</p>
            </div>

            <!-- Lista komentara -->
            <div v-else class="flex flex-col gap-4">
                <div
                    v-for="comment in movie.comments"
                    :key="comment.id"
                    class="bg-gray-900 border border-gray-800 rounded-xl p-5"
                >
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-sm font-bold text-blue-300">
                                {{ comment.user?.name?.charAt(0).toUpperCase() }}
                            </div>
                            <div>
                                <p class="text-white text-sm font-semibold">{{ comment.user?.name }}</p>
                                <p class="text-gray-500 text-xs">{{ formatDate(comment.created_at) }}</p>
                            </div>
                        </div>
                        <button
                            v-if="authStore.user?.id === comment.user_id"
                            @click="deleteComment(comment.id)"
                            class="text-gray-600 hover:text-red-400 transition-colors"
                        >
                            <Icon name="mdi:trash-can-outline" />
                        </button>
                    </div>
                    <p class="text-gray-300 text-sm leading-6">{{ comment.content }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import type { Movie } from '~/types/index'

const route = useRoute()
const config = useRuntimeConfig()
const authStore = useAuthStore()

const { data: movie, pending, error, refresh } = await useFetch<Movie>(
    `${config.public.apiBase}/movies/${route.params.id}`
)

const avgRating = computed(() => {
    if (!movie.value?.ratings || movie.value.ratings.length === 0) return 0
    const sum = movie.value.ratings.reduce((acc, r) => acc + r.rating, 0)
    return sum / movie.value.ratings.length
})

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

// Rating
const hoverRating = ref(0)
const userRating = computed(() => {
    if (!authStore.user || !movie.value?.ratings) return 0
    const existing = movie.value.ratings.find(r => r.user_id === authStore.user?.id)
    return existing?.rating ?? 0
})

const submitRating = async (star: number) => {
    try {
        await $fetch(`${config.public.apiBase}/ratings`, {
            method: 'POST',
            body: { movie_id: movie.value?.id, rating: star },
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        await refresh()
    } catch (err) {
        console.error(err)
    }
}

// Komentari
const newComment = ref('')
const commentLoading = ref(false)

const submitComment = async () => {
    if (!newComment.value.trim()) return
    commentLoading.value = true
    try {
        await $fetch(`${config.public.apiBase}/comments`, {
            method: 'POST',
            body: { movie_id: movie.value?.id, content: newComment.value },
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        newComment.value = ''
        await refresh()
    } catch (err) {
        console.error(err)
    } finally {
        commentLoading.value = false
    }
}

const deleteComment = async (commentId: number) => {
    try {
        await $fetch(`${config.public.apiBase}/comments/${commentId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        await refresh()
    } catch (err) {
        console.error(err)
    }
}
</script>