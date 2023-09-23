import { slugify } from '@/common/utils/slugify'
import { ComponentOptions } from 'vue'

export type BlogPostSourceFile = {
    TITLE?: string
    SLUG?: string
    CREATED_AT?: number // ms since epoc
    UPDATED_AT?: number // ms since epoc

    default: ComponentOptions
}

export type BlogPost = {
    title: string
    slug: string
    createdAt: number // ms since epoc
    updatedAt?: number // ms since epoc
    dir: string
}

export type BlogPosts = Array<BlogPost>

export async function fetchBlogPosts(): Promise<BlogPosts> {
    // This function must be processed by webpack since we are using a webpack-specific directive "require.context"
    // Regex must be part of the call expression for static analysis
    const blogPostMatches = require.context('@/web/client/pages/Blog', true, /.\/([\w-]+)\/BlogPost.vue/)
    const blogEntries = blogPostMatches
        .keys()
        .filter((path) => !path.includes('template'))
        .map((path) => /.\/([\w-]+)\/BlogPost.vue/.exec(path)?.[1])

    const posts: BlogPosts = []
    for (const entry of blogEntries) {
        if (!entry) {
            continue
        }

        const blogPostSrc = await import(`@/web/client/pages/Blog/${entry}/BlogPost.vue`) as BlogPostSourceFile

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
