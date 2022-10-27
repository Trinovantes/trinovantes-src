<script lang="ts" setup>
import { useLiveMeta } from '../../utils/useLiveMeta'
import BlogPageList from './BlogPageList.vue'

const title = 'Blog'
const desc = "I sometimes write about interesting stuff I've encountered in life"
useLiveMeta({
    title,
    desc,
})
</script>

<template>
    <article class="container padding content">
        <h1>
            {{ title }}
        </h1>

        <section class="flex-vgap">
            <BlogPageList />
        </section>
    </article>
</template>
