import type { BlogPosts } from '../../../../api/services/fetchBlogPosts.ts'
import type { AppContext } from '../../../AppContext.ts'
import { loadStateFromDom } from '../../utils/hydration.ts'

export async function loadBlogPosts(ssrContext?: AppContext): Promise<BlogPosts> {
    if (__IS_SSR__) {
        return ssrContext?.blogPosts ?? []
    }

    if (__IS_DEV__) {
        const res = await fetch('/api/blog-posts')
        return await res.json() as BlogPosts
    }

    return loadStateFromDom('__BLOG_POSTS__') ?? []
}
