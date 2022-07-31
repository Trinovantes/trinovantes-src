import { useSSRContext } from 'vue'
import type { Projects } from '@/common/Project'
import type { BlogPosts } from './client/pages/Blog/getBlogPosts'
import type { SSRContext } from '@vue/server-renderer'

export type AppContext = SSRContext & {
    _matchedComponents: Set<string>
    url: string
    blogPosts: BlogPosts
    projects: Projects
}

export function useAppContext(): AppContext | undefined {
    if (DEFINE.IS_SSR) {
        return useSSRContext()
    } else {
        return undefined
    }
}
