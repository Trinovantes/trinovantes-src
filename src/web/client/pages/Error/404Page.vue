<script lang="ts" setup>
import { useSeoMeta } from '@unhead/vue'
import BlogList from '../Blog/BlogPageList.vue'

const title = '404: Page Not Found'
useSeoMeta({ title })
</script>

<template>
    <article class="container text-container full">
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
