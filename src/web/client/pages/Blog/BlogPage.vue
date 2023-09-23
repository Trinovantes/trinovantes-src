<script lang="ts" setup>
import { useLiveMeta } from '@/web/client/utils/useLiveMeta'
import BlogPageList from './BlogPageList.vue'

const title = 'Blog'
const desc = "I sometimes write about interesting stuff I've encountered in life"
useLiveMeta({
    title,
    desc,
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
