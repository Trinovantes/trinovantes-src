import { createMemoryHistory, createRouter, createWebHistory, Router } from 'vue-router'
import type { AppContext } from '../app'
import { getRoutes } from './routes'

// ----------------------------------------------------------------------------
// Router
// ----------------------------------------------------------------------------

export async function createAppRouter(ssrContext?: AppContext): Promise<Router> {
    const routes = await getRoutes()
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
