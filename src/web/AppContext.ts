import { useSSRContext } from 'vue'
import type { Projects } from '../common/Project.ts'
import type { SSRContext } from '@vue/server-renderer'
import type { BlogPosts } from '../api/services/fetchBlogPosts.ts'

type VueSsrAssetsPluginContext = {
    _matchedComponents: Set<string>
}

export type AppContext = SSRContext & VueSsrAssetsPluginContext & {
    url: string
    blogPosts: BlogPosts
    projects: Projects
}

export function useAppContext(): AppContext | undefined {
    if (__IS_SSR__) {
        return useSSRContext()
    } else {
        return undefined
    }
}
