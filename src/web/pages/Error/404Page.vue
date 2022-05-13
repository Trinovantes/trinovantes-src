<script lang="ts" setup>
import { useMeta } from 'vue-meta'
import BlogList from '../../components/BlogList/BlogList.vue'
import { getProfilePicture } from '@/web/utils/ResponsiveImage'
import { createPageHeadOptions, TwitterCard } from '@/web/utils/createPageHeadOptions'

const title = '404: Page Not Found'
useMeta(createPageHeadOptions({
    title,
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
            <h2>
                Pages
            </h2>
            <ul>
                <li>
                    <router-link to="/">Home</router-link>
                </li>
                <li>
                    <router-link to="/about">About</router-link>
                </li>
                <li>
                    <router-link to="/blog">Blog</router-link>
                </li>
                <li>
                    <router-link to="/projects">Projects</router-link>
                </li>
            </ul>

            <h2>
                Blog
            </h2>
            <BlogList />
        </section>
    </article>
</template>
