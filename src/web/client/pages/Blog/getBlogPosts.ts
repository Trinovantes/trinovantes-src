import { slugify } from '@/common/utils/slugify'
import type { ComponentOptions } from 'vue'

// These are blog post locations on disk; has no relation to their final slug
export const blogEntries = [
    '2022-fastest-nodejs-fizzbuzz',
    '2021-google-blocklist',
    '2021-vue3-ssr-critical-resources',
    '2021-vuex4-generator',
    '2015-if-x',
    '2015-ray-tracer',
    '2014-os',
]

export type BlogPostSourceFile = {
    TITLE?: string
    SLUG?: string
    CREATED_AT?: number
    UPDATED_AT?: number

    default: ComponentOptions
}

export type BlogPost = {
    title: string
    slug: string
    createdAt: number
    updatedAt?: number
    dir: string
}

export type BlogPosts = Array<BlogPost>

export async function getBlogPosts(): Promise<BlogPosts> {
    const posts: BlogPosts = []

    for (const entry of blogEntries) {
        const blogPostSrc = await import(`./${entry}/BlogPost.vue`) as BlogPostSourceFile

        if (!blogPostSrc.TITLE) {
            throw new Error(`${blogPostSrc.default.__file} is missing TITLE export`)
        }

        if (typeof blogPostSrc.CREATED_AT !== 'number') {
            throw new Error(`${blogPostSrc.default.__file} is missing CREATED_AT export`)
        }

        posts.push({
            title: blogPostSrc.TITLE,
            slug: blogPostSrc.SLUG ?? slugify(blogPostSrc.TITLE),
            createdAt: blogPostSrc.CREATED_AT,
            updatedAt: blogPostSrc.UPDATED_AT,
            dir: entry,
        })
    }

    return posts.sort((postA, postB) => {
        return postB.createdAt - postA.createdAt
    })
}
