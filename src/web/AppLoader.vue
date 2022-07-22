<script lang="ts" setup>
import App from './App.vue'
</script>

<template>
    <suspense>
        <template #default>
            <App />
        </template>
    </suspense>
</template>
