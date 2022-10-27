<script lang="ts" setup>
import { useLiveMeta } from '../../utils/useLiveMeta'
import BlogList from '../Blog/BlogPageList.vue'

const title = '404: Page Not Found'
useLiveMeta({
    title,
})
</script>

<template>
    <article class="container padding content">
        <h1>
            {{ title }}
        </h1>

        <section class="flex-vgap">
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
