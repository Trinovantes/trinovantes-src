<script lang="ts" setup>
import { useMeta } from 'vue-meta'
import { getProfilePicture } from '@/web/client/utils/ResponsiveImage'
import { createPageHeadOptions, TwitterCard } from '@/web/client/utils/createPageHeadOptions'
import BlogPageList from './BlogPageList.vue'

const title = 'Blog'
const desc = "I sometimes write about interesting stuff I've encountered in life"
useMeta(createPageHeadOptions({
    title,
    desc,
    image: getProfilePicture().src,
    imageSize: TwitterCard.Summary,
}))
</script>

<template>
    <article class="container text-container">
        <h1>
            {{ title }}
        </h1>

        <section>
            <BlogPageList />
        </section>
    </article>
</template>
