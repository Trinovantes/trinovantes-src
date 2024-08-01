<script lang="ts" setup>
import MainLayoutFooter from './MainLayoutFooter.vue'
import MainLayoutHeader from './MainLayoutHeader.vue'
</script>

<template>
    <main>
        <MainLayoutHeader />
        <router-view />
        <MainLayoutFooter />
    </main>
</template>

<style lang="scss">
main{
    min-height: 100dvh;
    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 100%;
}
</style>
