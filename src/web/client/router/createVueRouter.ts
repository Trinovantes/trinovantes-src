import { createMemoryHistory, createRouter, createWebHistory, type Router } from 'vue-router'
import { getRoutes } from './routes.ts'
import type { AppContext } from '../../AppContext.ts'

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
