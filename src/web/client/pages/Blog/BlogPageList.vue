<script lang="ts" setup>
import { formatDate } from '@/common/utils/formatDate'
import { loadBlogPosts } from './loadBlogPosts'
import { useAppContext } from '@/web/AppContext'

const appContext = useAppContext()
const blogPosts = await loadBlogPosts(appContext)
</script>

<template>
    <ul class="blog-posts dates">
        <li
            v-for="blogPost of blogPosts"
            :key="blogPost.slug"
        >
            <time :datetime="formatDate(blogPost.createdAt)">
                {{ formatDate(blogPost.createdAt) }}
            </time>

            <router-link :to="`${blogPost.slug}`">
                {{ blogPost.title }}
            </router-link>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
ul.blog-posts{
    list-style: none;
    padding: 0;

    li{
        line-height: 2;
    }

    &.dates{
        li{
            display: grid;
            grid-template-columns: auto 1fr;
            gap: $padding;

            time{
                font-family: 'Courier New', Courier, monospace;
                white-space: nowrap;
            }
        }
    }
}
</style>
