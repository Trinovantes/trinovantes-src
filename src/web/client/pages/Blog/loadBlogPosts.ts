import { loadStateFromDom, HydrationKey } from '@/web/client/utils/hydration'
import { AppContext } from '@/web/AppContext'
import { BlogPosts } from '@/api/services/fetchBlogPosts'

export async function loadBlogPosts(ssrContext?: AppContext): Promise<BlogPosts> {
    if (DEFINE.IS_SSR) {
        return ssrContext?.blogPosts ?? []
    }

    if (DEFINE.IS_DEV) {
        const res = await fetch('/api/blog-posts')
        return await res.json() as BlogPosts
    }

    return loadStateFromDom(HydrationKey.BlogPosts) ?? []
}
