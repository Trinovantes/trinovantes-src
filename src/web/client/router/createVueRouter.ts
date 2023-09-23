import { createMemoryHistory, createRouter, createWebHistory, Router } from 'vue-router'
import { getRoutes } from './routes'
import { AppContext } from '@/web/AppContext'

// ----------------------------------------------------------------------------
// Router
// ----------------------------------------------------------------------------

export async function createVueRouter(ssrContext?: AppContext): Promise<Router> {
    const routes = await getRoutes(ssrContext)
    const router = createRouter({
        history: ssrContext !== undefined
            ? createMemoryHistory()
            : createWebHistory(),

        routes,
    })

    if (ssrContext?.url) {
        await router.push(ssrContext.url)
    }

    return router
}
