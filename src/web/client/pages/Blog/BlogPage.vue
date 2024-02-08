<script lang="ts" setup>
import { useSeoMeta } from '@unhead/vue'
import BlogPageList from './BlogPageList.vue'

const title = 'Blog'
const description = "I sometimes write about interesting stuff I've encountered in life"
useSeoMeta({
    title,
    description,
})
</script>

<template>
    <article class="container text-container full">
        <h1>
            {{ title }}
        </h1>

        <section class="flex-vgap">
            <BlogPageList />
        </section>
    </article>
</template>
