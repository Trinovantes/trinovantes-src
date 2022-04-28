<script lang="ts" setup>
import { APP_NAME } from '@/common/Constants'
</script>

<template>
    <footer>
        &copy; {{ APP_NAME }}
    </footer>
</template>

<style lang="scss" scoped>
footer{
    background: $dark;
    color: $text-on-dark;
    padding: $padding * 2;

    font-size: 1rem;
    line-height: $footer-line-height;
    text-align: center;
}
</style>
