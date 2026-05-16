<template>
    <section class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-950">
        <div class="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-2xl border border-gray-800 lg:grid-cols-2 shadow-2xl min-h-[600px]">
            <aside class="relative hidden lg:block overflow-hidden min-h-[600px]">
                <img
                    src="/img/login-movie.jpg"
                    alt="Movies background"
                    class="absolute inset-0 h-full w-full object-cover"
                />
                <div class="absolute inset-0 bg-black/40" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div class="relative z-10 flex h-full flex-col justify-between p-10">
                    <div class="flex items-center gap-2">
                        <span class="text-2xl">🎬</span>
                        <span class="text-white font-bold text-lg">FilmPreporuka</span>
                    </div>
                    <div>
                        <h1 class="text-4xl font-bold text-white leading-tight">
                            Otkrij filmove <br /> koje ćeš voljeti
                        </h1>
                        <p class="mt-4 text-white/70 text-sm leading-6">
                            Personalizirane preporuke filmova temeljene na tvojim ocjenama i ukusu.
                        </p>
                    </div>
                </div>
            </aside>

            <!-- Desna strana - forma -->
            <div class="flex items-center justify-center bg-gray-900 px-8 py-12">
                <div class="w-full max-w-sm">
                    
                    <!-- Naslov -->
                    <div class="mb-8">
                        <h2 class="text-3xl font-bold text-white">
                            {{ isLogin ? 'Dobrodošao nazad' : 'Stvori račun' }}
                        </h2>
                        <p class="mt-2 text-gray-400 text-sm">
                            {{ isLogin ? 'Prijavi se u svoj račun' : 'Registriraj se besplatno' }}
                        </p>
                    </div>

                    <!-- Toggle login/register -->
                    <div class="mb-6 grid grid-cols-2 rounded-full border border-gray-700 bg-gray-800 p-1">
                        <button
                            type="button"
                            @click="setVariant('login')"
                            :class="isLogin ? 'bg-gray-700 border border-blue-700 text-white' : 'text-gray-400'"
                            class="rounded-full py-2 text-sm font-semibold transition-all duration-200"
                        >
                            Prijava
                        </button>
                        <button
                            type="button"
                            @click="setVariant('register')"
                            :class="!isLogin ? 'bg-gray-700 border border-blue-700 text-white' : 'text-gray-400'"
                            class="rounded-full py-2 text-sm font-semibold transition-all duration-200"
                        >
                            Registracija
                        </button>
                    </div>

                    <!-- Forma -->
                    <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
                        
                        <!-- Name - samo za register -->
                        <div v-if="!isLogin">
                            <label class="text-sm font-medium text-gray-300 mb-1 block">Ime</label>
                            <input
                                v-model="form.name"
                                type="text"
                                placeholder="Tvoje ime"
                                class="w-full rounded-lg bg-gray-800 border border-blue-700 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <p v-if="errors.name" class="mt-1 text-xs text-red-400">{{ errors.name }}</p>
                        </div>

                        <!-- Email -->
                        <div>
                            <label class="text-sm font-medium text-gray-300 mb-1 block">Email</label>
                            <input
                                v-model="form.email"
                                type="email"
                                placeholder="tvoj@email.com"
                                class="w-full rounded-lg bg-gray-800 border border-blue-700 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <p v-if="errors.email" class="mt-1 text-xs text-red-400">{{ errors.email }}</p>
                        </div>

                        <!-- Password -->
                        <div>
                            <label class="text-sm font-medium text-gray-300 mb-1 block">Lozinka</label>
                            <input
                                v-model="form.password"
                                type="password"
                                placeholder="••••••••"
                                class="w-full rounded-lg bg-gray-800 border border-blue-700 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                            />
                            <p v-if="errors.password" class="mt-1 text-xs text-red-400">{{ errors.password }}</p>
                        </div>

                        <!-- Error poruka -->
                        <p v-if="errorMessage" class="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {{ errorMessage }}
                        </p>

                        <!-- Submit -->
                        <button
                            type="submit"
                            :disabled="loading"
                            class="mt-2 w-full rounded-full bg-gray-900 border border-blue-700 hover:bg-gray-800 disabled:opacity-50 py-3 text-sm font-bold text-white transition-colors"
                        >
                            {{ loading ? 'Učitavanje...' : isLogin ? 'Prijava' : 'Registracija' }}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const transitionDirection = ref(1);
const props = defineProps<{
    variant: 'login' | 'register'
}>()

const emit = defineEmits<{
  switchVariant: [];
}>();
function setVariant(nextVariant: "login" | "register") {
  if (props.variant !== nextVariant) {
    transitionDirection.value = nextVariant === "register" ? 1 : -1;
    emit("switchVariant");
  }
}

const authStore = useAuthStore()
const router = useRouter()
const config = useRuntimeConfig()

const isLogin = computed(() => props.variant === 'login')

const form = reactive({
    name: '',
    email: '',
    password: '',
})

const errors = reactive({
    name: '',
    email: '',
    password: '',
})

const errorMessage = ref('')
const loading = ref(false)

// Resetiraj formu kad se mijenja variant
watch(() => props.variant, () => {
    form.name = ''
    form.email = ''
    form.password = ''
    errors.name = ''
    errors.email = ''
    errors.password = ''
    errorMessage.value = ''
})

const validate = () => {
    errors.name = ''
    errors.email = ''
    errors.password = ''

    if (!isLogin.value && !form.name) {
        errors.name = 'Ime je obavezno'
    }
    if (!form.email) {
        errors.email = 'Email je obavezan'
    }
    if (!form.password || form.password.length < 6) {
        errors.password = 'Lozinka mora imati najmanje 6 znakova'
    }

    return !errors.name && !errors.email && !errors.password
}

const handleSubmit = async () => {
    if (!validate()) return

    loading.value = true
    errorMessage.value = ''

    try {
        const endpoint = isLogin.value ? '/login' : '/register'
        const body = isLogin.value
            ? { email: form.email, password: form.password }
            : { name: form.name, email: form.email, password: form.password }

        const response = await $fetch<{ user: any, token: string }>(
            `${config.public.apiBase}${endpoint}`,
            { method: 'POST', body }
        )

        authStore.setAuth(response.user, response.token)
        router.push('/')
    } catch (err: any) {
        errorMessage.value = err?.data?.message || 'Došlo je do greške'
    } finally {
        loading.value = false
    }
}
</script>