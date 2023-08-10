import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import { slugify } from '../../src/common/utils/slugify'
import { srcWebDir } from '../webpack.common'

// ----------------------------------------------------------------------------
// Routes
// ----------------------------------------------------------------------------

export const prerenderRoutes: Promise<Array<string>> = (async() => {
    const blogDir = path.resolve(srcWebDir, 'client/pages/Blog')
    const blogDirItems = await fs.readdir(blogDir, { withFileTypes: true })
    const blogPostRoutes: Array<string> = []

    for (const subDir of blogDirItems) {
        if (!subDir.isDirectory()) {
            continue
        }
        if (subDir.name === 'template') {
            continue
        }

        const blogPostVueFile = path.resolve(blogDir, subDir.name, 'BlogPost.vue')
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
        blogPostRoutes.push(`/${slug}`)
    }

    return [
        ...blogPostRoutes,
        '/about',
        '/blog',
        '/projects',
        '/',
    ]
})()
