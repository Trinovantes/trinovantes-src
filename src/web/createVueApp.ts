import { createSSRApp } from 'vue'
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
import { createRouter } from 'vue-router'
import type { createHead } from '@unhead/vue/client'
import type { AppContext } from './AppContext'

type VueApp = {
    app: ReturnType<typeof createSSRApp>
    router: ReturnType<typeof createRouter>
}

export async function createVueApp(head: ReturnType<typeof createHead>, appContext?: AppContext): Promise<VueApp> {
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
    const router = await createVueRouter(appContext)
    app.use(router)
    await router.isReady()

    // Unhead
    app.use(head)

    return {
        app,
        router,
    }
}
