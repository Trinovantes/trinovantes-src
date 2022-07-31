// Must be imported first so it can extend the dayjs global
// eslint-disable-next-line import/order
import '@/common/utils/setupDayjs'

import { createSSRApp } from 'vue'
import { createMetaManager } from 'vue-meta'
import AppLoader from './client/AppLoader.vue'
import ClientOnly from './client/components/ClientOnly.vue'
import CodeBlock from './client/components/CodeBlock.vue'
import SimpleImage from './client/components/SimpleImage.vue'
import SimpleTable from './client/components/SimpleTable.vue'
import TextHeading from './client/components/TextHeading.vue'
import BlogPost from './client/pages/Blog/BlogPost.vue'
import { createAppRouter } from './client/router'
import type { AppContext } from './AppContext'
import type { Router } from 'vue-router'

interface VueApp {
    app: ReturnType<typeof createSSRApp>
    router: Router
}

export async function createVueApp(ssrContext?: AppContext): Promise<VueApp> {
    console.info('Release', DEFINE.GIT_HASH)

    // Vue
    const app = createSSRApp(AppLoader)
    app.component('ClientOnly', ClientOnly)
    app.component('CodeBlock', CodeBlock)
    app.component('SimpleImage', SimpleImage)
    app.component('SimpleTable', SimpleTable)
    app.component('TextHeading', TextHeading)
    app.component('BlogPost', BlogPost)

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
