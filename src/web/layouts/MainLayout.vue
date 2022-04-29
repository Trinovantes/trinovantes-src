<script lang="ts" setup>
import MainLayoutFooter from './MainLayoutFooter.vue'
import MainLayoutHeader from './MainLayoutHeader.vue'
</script>

<template>
    <MainLayoutHeader />

    <main class="full-height">
        <router-view />
    </main>

    <MainLayoutFooter />
</template>
