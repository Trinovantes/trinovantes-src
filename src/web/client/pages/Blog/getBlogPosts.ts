import { slugify } from '@/common/utils/slugify'
import type { ComponentOptions } from 'vue'

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
    // This function must be preprocessed by webpack since we are using a webpack-specific directive "require.context"
    const blogPostMatches = require.context('./', true, /.\/([\w-]+)\/BlogPost.vue/)
    const blogEntries = blogPostMatches.keys()
        .filter((path) => !path.startsWith('./template'))
        .map((path) => path.replace('/BlogPost.vue', ''))
        .map((path) => path.replace('./', ''))

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
