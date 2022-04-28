<script lang="ts" setup>
import { createPageHeadOptions, TwitterCard } from '@/web/utils/PageHeadOptions'
import { getProfilePicture } from '@/web/utils/ResponsiveLoader'
import { useMeta } from 'vue-meta'
import BlogList from '@/web/components/BlogList/BlogList.vue'

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
    <article class="container text-container full">
        <h1>
            {{ title }}
        </h1>

        <section>
            <BlogList />
        </section>
    </article>
</template>
