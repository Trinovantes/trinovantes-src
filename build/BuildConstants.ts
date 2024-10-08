import path from 'node:path'
import { fetchBlogPosts } from '../src/api/services/fetchBlogPosts'
import { getGitHash } from './BuildSecret'

// Assume we are running webpack from the project root (../)
const rootDir = path.resolve()

export const isDev = (process.env.NODE_ENV === 'development')
export const gitHash = getGitHash(rootDir)
export const manifestFile = 'ssr-manifest.json'
export const entryFile = 'app.html'
export const publicPath = '/public/'
export const rawDirRegexp = /\/raw\//

export const distDir = path.resolve(rootDir, 'dist')
export const distApiDir = path.resolve(distDir, 'api')
export const distReadmeDir = path.resolve(distDir, 'readme')

export const distWebDir = path.resolve(distDir, 'web')
export const distWebPublicDir = path.resolve(distWebDir, 'public')
export const distWebEntryFile = path.resolve(distWebDir, entryFile)

export const distSsgDir = path.resolve(distDir, 'ssg')
export const distSsgManifest = path.resolve(distSsgDir, manifestFile)
export const distSsgTemplate = path.resolve(distSsgDir, 'index.html')

export const srcDir = path.resolve(rootDir, 'src')
export const srcApiDir = path.resolve(srcDir, 'api')
export const srcReadmeDir = path.resolve(srcDir, 'readme')
export const srcWebDir = path.resolve(srcDir, 'web')
export const srcWebTemplate = path.resolve(srcDir, 'web', 'index.html')
export const srcWebStaticDir = path.resolve(srcDir, 'web', 'static')

export const buildConstants = {
    '__VUE_OPTIONS_API__': JSON.stringify(false),
    '__VUE_PROD_DEVTOOLS__': JSON.stringify(false),
    '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': JSON.stringify(false),

    'DEFINE.IS_DEV': JSON.stringify(isDev),
    'DEFINE.IS_SSR': "(typeof window === 'undefined')",
    'DEFINE.GIT_HASH': JSON.stringify(gitHash),

    'DEFINE.SSG_PUBLIC_PATH': JSON.stringify(publicPath),
    'DEFINE.SSG_PUBLIC_DIR': JSON.stringify(distWebPublicDir),
    'DEFINE.SSG_ENTRY_FILE': JSON.stringify(distWebEntryFile),
    'DEFINE.SSG_HTML_TEMPLATE': JSON.stringify(distSsgTemplate),
    'DEFINE.SSG_MANIFEST_FILE': JSON.stringify(distSsgManifest),
}

export const prerenderRoutes: Promise<Array<string>> = (async() => {
    const blogPostRoutes = (await fetchBlogPosts()).map((blogPost) => `/${blogPost.slug}`)

    return [
        ...blogPostRoutes,
        '/about',
        '/blog',
        '/projects',
        '/',
    ]
})()
