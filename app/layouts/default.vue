<template>
    <div class="min-h-screen bg-gray-950 text-white flex">
        <Sidebar @expanded-change="onExpandedChange" />
        <main
            :class="sidebarExpanded ? 'ml-56' : 'ml-16'"
            class="flex-1 transition-all duration-300 p-8"
        >
            <slot />
        </main>
    </div>
</template>

<script setup lang="ts">
const sidebarExpanded = ref(false)

const onExpandedChange = (val: boolean) => {
    sidebarExpanded.value = val
}
</script>