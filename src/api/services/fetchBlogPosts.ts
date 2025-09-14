import { slugify } from '../../common/utils/slugify.ts'
import fs from 'node:fs/promises'
import path from 'node:path'

const BLOG_POSTS_ROOT_DIR = path.resolve(process.cwd(), 'src/web/client/pages/Blog')

export type BlogPost = {
    title: string
    slug: string
    createdAt: number // ms since epoc
    updatedAt?: number // ms since epoc
    dir: string
}

export type BlogPosts = Array<BlogPost>

export async function fetchBlogPosts(): Promise<BlogPosts> {
    const posts: BlogPosts = []
    const blogEntries = await fs.readdir(BLOG_POSTS_ROOT_DIR, { withFileTypes: true })

    for (const entry of blogEntries) {
        if (!entry.isDirectory()) {
            continue
        }
        if (!/\d{4}-.+/.test(entry.name)) {
            continue
        }

        const filePath = path.join(BLOG_POSTS_ROOT_DIR, entry.name, 'BlogPost.vue')
        const fileContents = (await fs.readFile(filePath)).toString()

        const title = /^(export )?const TITLE = ['"](?<title>.+)['"]$/m.exec(fileContents)?.groups?.title
        const createdAt = /^(export )?const CREATED_AT = new Date\('(?<createdAt>\d{4}-\d{2}-\d{2})'\).getTime\(\)$/m.exec(fileContents)?.groups?.createdAt
        const updatedAt = /^(export )?const UPDATED_AT = new Date\('(?<updatedAt>\d{4}-\d{2}-\d{2})'\).getTime\(\)$/m.exec(fileContents)?.groups?.updatedAt

        if (!title) {
            throw new Error(`${filePath} is missing TITLE export`)
        }
        if (!createdAt) {
            throw new Error(`${filePath} is missing CREATED_AT export`)
        }

        posts.push({
            title: title,
            slug: slugify(title),
            createdAt: new Date(createdAt).getTime(),
            updatedAt: updatedAt ? new Date(updatedAt).getTime() : undefined,
            dir: entry.name,
        })
    }

    return posts.toSorted((postA, postB) => postB.createdAt - postA.createdAt)
}
