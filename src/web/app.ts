// Must be imported first so it can extend the dayjs global
import '@/common/utils/setupDayjs'

import { createSSRApp, useSSRContext } from 'vue'
import { createAppRouter } from './router'
import AppLoader from './components/AppLoader.vue'
import ClientOnly from './components/Global/ClientOnly.vue'
import SimpleTable from './components/Global/SimpleTable.vue'
import SimpleImage from './components/Global/SimpleImage.vue'
import TextHeading from './components/Global/TextHeading.vue'
import BlogPost from './components/Global/BlogPost.vue'
import CodeBlock from './components/Global/CodeBlock.vue'
import { createMetaManager } from 'vue-meta'
import type { Router } from 'vue-router'
import type { Projects } from '@/common/Project'
import type { SSRContext } from '@vue/server-renderer'
import type { BlogPosts } from './pages/Blog/getBlogPosts'

interface CreatedApp {
    app: ReturnType<typeof createSSRApp>
    router: Router
}

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

export async function createApp(ssrContext?: AppContext): Promise<CreatedApp> {
    console.info('Release', DEFINE.GIT_HASH)

    // Vue
    const app = createSSRApp(AppLoader)
    app.component('ClientOnly', ClientOnly)
    app.component('SimpleImage', SimpleImage)
    app.component('BlogPost', BlogPost)
    app.component('SimpleTable', SimpleTable)
    app.component('TextHeading', TextHeading)
    app.component('CodeBlock', CodeBlock)

    // Vue Router
    const router = await createAppRouter(ssrContext)
    app.use(router)
    await router.isReady()

    // Vue Meta
    const metaManager = createMetaManager(DEFINE.IS_SSR)
    app.use(metaManager)

    return {
        app,
        router,
    }
}
