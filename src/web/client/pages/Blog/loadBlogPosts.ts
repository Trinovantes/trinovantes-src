import { loadStateFromDom, HydrationKey } from '../../utils/hydration'
import type { AppContext } from '@/web/AppContext'
import { getBlogPosts, type BlogPosts } from './getBlogPosts'

export async function loadBlogPosts(ssrContext?: AppContext): Promise<BlogPosts> {
    if (DEFINE.IS_SSR) {
        return ssrContext?.blogPosts ?? []
    }

    if (DEFINE.IS_DEV) {
        return await getBlogPosts()
    }

    return loadStateFromDom(HydrationKey.BlogPosts) ?? []
}
