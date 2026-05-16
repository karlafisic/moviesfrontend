<template>
    <AuthForm :variant="variant" @switchVariant="toggleVariant" />
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const variant = ref<'login' | 'register'>('login')

function toggleVariant() {
    variant.value = variant.value === 'login' ? 'register' : 'login'
}
</script>