// Must be imported first so it can extend the dayjs global
// eslint-disable-next-line import/order
import '@/common/utils/setupDayjs'

import { createSSRApp, useSSRContext } from 'vue'
import { createMetaManager } from 'vue-meta'
import type { Projects } from '@/common/Project'
import AppLoader from './AppLoader.vue'
import ClientOnly from './components/ClientOnly.vue'
import CodeBlock from './components/CodeBlock.vue'
import SimpleImage from './components/SimpleImage.vue'
import SimpleTable from './components/SimpleTable.vue'
import TextHeading from './components/TextHeading.vue'
import BlogPost from './pages/Blog/BlogPost.vue'
import { createAppRouter } from './router'
import type { BlogPosts } from './pages/Blog/getBlogPosts'
import type { SSRContext } from '@vue/server-renderer'
import type { Router } from 'vue-router'

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
    app.component('BlogPost', BlogPost)
    app.component('CodeBlock', CodeBlock)
    app.component('SimpleImage', SimpleImage)
    app.component('SimpleTable', SimpleTable)
    app.component('TextHeading', TextHeading)

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
