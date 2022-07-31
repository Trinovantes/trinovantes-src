import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import { srcWebDir } from '../webpack.common'
import { slugify } from '@/common/utils/slugify'
import { blogEntries } from '@/web/client/pages/Blog/getBlogPosts'

// ----------------------------------------------------------------------------
// Routes
// ----------------------------------------------------------------------------

export const prerenderRoutes: Promise<Array<string>> = (async() => {
    const blogDir = path.resolve(srcWebDir, 'client/pages/Blog')
    const postSlugs: Array<string> = []

    for (const entry of blogEntries) {
        const blogPostVueFile = path.resolve(blogDir, entry, 'BlogPost.vue')
        if (!existsSync(blogPostVueFile)) {
            throw new Error(`${blogPostVueFile} does not exist`)
        }

        const blogPostContentsBuffer = await fs.readFile(blogPostVueFile)
        const blogPostContents = blogPostContentsBuffer.toString()

        const matches = /^export const TITLE = '(.+)'$/m.exec(blogPostContents)
        if (!matches) {
            throw new Error(`Failed to find TITLE in ${blogPostVueFile}`)
        }

        const title = matches[1]
        const slug = slugify(title)
        postSlugs.push(slug)
    }

    return [
        ...postSlugs.map((slug) => `/${slug}`),
        '/about',
        '/blog',
        '/projects',
        '/',
    ]
})()
