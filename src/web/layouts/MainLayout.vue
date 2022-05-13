<script lang="ts" setup>
import MainLayoutFooter from './MainLayoutFooter.vue'
import MainLayoutHeader from './MainLayoutHeader.vue'
</script>

<template>
    <MainLayoutHeader />

    <main class="full-height-container">
        <router-view />
    </main>

    <MainLayoutFooter />
</template>
