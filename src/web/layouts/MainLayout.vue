<script lang="ts" setup>
import MainLayoutHeader from './MainLayoutHeader.vue'
import MainLayoutFooter from './MainLayoutFooter.vue'
</script>

<template>
    <MainLayoutHeader />

    <main class="full-height">
        <router-view />
    </main>

    <MainLayoutFooter />
</template>
