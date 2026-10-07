import path from 'node:path'
import { fetchBlogPosts } from '../src/api/services/fetchBlogPosts.ts'
import { getGitHash } from './BuildSecret.ts'

// Assume we are running webpack from the project root (../)
const rootDir = path.resolve()

export const isDev = (process.env.NODE_ENV === 'development')
export const gitHash = getGitHash(rootDir)
export const manifestFile = 'ssr-manifest.json'
export const entryFile = 'app.html'
export const publicPath = '/assets/'
export const rawDirRegexp = /\/raw\//

export const distDir = path.join(rootDir, 'dist')
export const distApiDir = path.join(distDir, 'api')
export const distReadmeDir = path.join(distDir, 'readme')

export const distWebDir = path.join(distDir, 'web')
export const distWebPublicDir = path.join(distWebDir, publicPath)
export const distWebEntryFile = path.join(distWebDir, entryFile)

export const distSsgDir = path.join(distDir, 'ssg')
export const distSsgManifest = path.join(distSsgDir, manifestFile)
export const distSsgTemplate = path.join(distSsgDir, 'index.html')

export const srcDir = path.join(rootDir, 'src')
export const srcApiDir = path.join(srcDir, 'api')
export const srcReadmeDir = path.join(srcDir, 'readme')
export const srcWebDir = path.join(srcDir, 'web')
export const srcWebTemplate = path.join(srcDir, 'web', 'index.html')
export const srcWebStaticDir = path.join(srcDir, 'web', 'static')

export const buildConstants = {
    __VUE_OPTIONS_API__: JSON.stringify(false),
    __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),

    __IS_DEV__: JSON.stringify(isDev),
    __IS_SSR__: "(typeof window === 'undefined')",
    __GIT_HASH__: JSON.stringify(gitHash),

    __SSG_PUBLIC_PATH__: JSON.stringify(publicPath),
    __SSG_PUBLIC_DIR__: JSON.stringify(distWebPublicDir),
    __SSG_ENTRY_FILE__: JSON.stringify(distWebEntryFile),
    __SSG_HTML_TEMPLATE__: JSON.stringify(distSsgTemplate),
    __SSG_MANIFEST_FILE__: JSON.stringify(distSsgManifest),
}

export const prerenderRoutes: Promise<Array<string>> = (async () => {
    const blogPostRoutes = (await fetchBlogPosts()).map((blogPost) => `/${blogPost.slug}`)

    return [
        ...blogPostRoutes,
        '/about',
        '/blog',
        '/projects',
        '/',
    ]
})()
