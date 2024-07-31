import { createSSRApp } from 'vue'
import { createHead } from '@unhead/vue'
import AppLoader from './client/AppLoader.vue'
import CodeBlock from './client/components/CodeBlock.vue'
import MathBlock from './client/components/MathBlock.vue'
import MathInline from './client/components/MathInline.vue'
import SimpleImage from './client/components/SimpleImage.vue'
import SimpleTable from './client/components/SimpleTable.vue'
import SvgIcon from './client/components/SvgIcon.vue'
import TextHeading from './client/components/TextHeading.vue'
import BlogPost from './client/pages/Blog/BlogPost.vue'
import { createVueRouter } from './client/router/createVueRouter'
import { AppContext } from './AppContext'
import type { createRouter } from 'vue-router'

type VueApp = {
    app: ReturnType<typeof createSSRApp>
    router: ReturnType<typeof createRouter>
    head: ReturnType<typeof createHead>
}

export async function createVueApp(ssrContext?: AppContext): Promise<VueApp> {
    // Vue
    const app = createSSRApp(AppLoader)
    app.component('CodeBlock', CodeBlock)
    app.component('MathBlock', MathBlock)
    app.component('MathInline', MathInline)
    app.component('SimpleImage', SimpleImage)
    app.component('SimpleTable', SimpleTable)
    app.component('SvgIcon', SvgIcon)
    app.component('TextHeading', TextHeading)
    app.component('BlogPost', BlogPost)

    // Vue Router
    const router = await createVueRouter(ssrContext)
    app.use(router)
    await router.isReady()

    // Unhead
    const head = createHead()
    app.use(head)

    return {
        app,
        router,
        head,
    }
}
