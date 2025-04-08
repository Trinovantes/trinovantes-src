import { createMemoryHistory, createRouter, createWebHistory, Router } from 'vue-router'
import { getRoutes } from './routes'
import type { AppContext } from '@/web/AppContext'

// ----------------------------------------------------------------------------
// Router
// ----------------------------------------------------------------------------

export async function createVueRouter(appContext?: AppContext): Promise<Router> {
    const routes = await getRoutes(appContext)
    const router = createRouter({
        history: appContext !== undefined
            ? createMemoryHistory()
            : createWebHistory(),

        routes,
    })

    if (appContext?.url) {
        await router.push(appContext.url)
    }

    return router
}
