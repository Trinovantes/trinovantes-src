import { createSSRApp } from 'vue'
import { createMetaManager } from 'vue-meta'
import AppLoader from './client/AppLoader.vue'
import CodeBlock from './client/components/CodeBlock.vue'
import SimpleImage from './client/components/SimpleImage.vue'
import SimpleTable from './client/components/SimpleTable.vue'
import TextHeading from './client/components/TextHeading.vue'
import BlogPost from './client/pages/Blog/BlogPost.vue'
import { createVueRouter } from './client/router/createVueRouter'
import { AppContext } from './AppContext'
import { Router } from 'vue-router'

type VueApp = {
    app: ReturnType<typeof createSSRApp>
    router: Router
}

export async function createVueApp(ssrContext?: AppContext): Promise<VueApp> {
    // Vue
    const app = createSSRApp(AppLoader)
    app.component('CodeBlock', CodeBlock)
    app.component('SimpleImage', SimpleImage)
    app.component('SimpleTable', SimpleTable)
    app.component('TextHeading', TextHeading)
    app.component('BlogPost', BlogPost)

    // Vue Router
    const router = await createVueRouter(ssrContext)
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
