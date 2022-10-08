import { loadStateFromDom, HydrationKey } from '../../utils/hydration'
import { useAppContext } from '@/web/AppContext'
import type { BlogPosts } from '@/web/client/pages/Blog/getBlogPosts'

export async function loadBlogPosts(): Promise<BlogPosts> {
    if (DEFINE.IS_SSR) {
        const ssrContext = useAppContext()
        return ssrContext?.blogPosts ?? []
    }

    if (DEFINE.IS_DEV) {
        const { getBlogPosts } = await import('@/web/client/pages/Blog/getBlogPosts')
        return await getBlogPosts()
    }

    return loadStateFromDom(HydrationKey.BlogPosts) ?? []
}
