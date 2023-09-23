import { useSSRContext } from 'vue'
import { Projects } from '@/common/Project'
import { SSRContext } from '@vue/server-renderer'
import { BlogPosts } from '@/api/services/fetchBlogPosts'

type VueSsrAssetsPluginContext = {
    _matchedComponents: Set<string>
}

export type AppContext = SSRContext & VueSsrAssetsPluginContext & {
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
