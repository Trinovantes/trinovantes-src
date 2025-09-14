import type { AppContext } from '../../AppContext.ts'
import { loadBlogPosts } from '../pages/Blog/loadBlogPosts.ts'
import type { RouteRecordRaw } from 'vue-router'

const ERROR_404_ROUTE_NAME = 'Error404'

export async function getRoutes(ssrContext?: AppContext): Promise<Array<RouteRecordRaw>> {
    const blogPosts = await loadBlogPosts(ssrContext)
    const blogPostRoutes: Array<RouteRecordRaw> = blogPosts.map((post) => ({
        path: post.slug,
        component: () => import(`@pages/Blog/${post.dir}/BlogPost.vue`),
    }))

    const routes: Array<RouteRecordRaw> = [
        {
            path: '/',
            component: () => import('@layouts/MainLayout.vue'),
            children: [
                {
                    path: '',
                    component: () => import('@pages/Home/HomePage.vue'),
                },
                {
                    path: 'about',
                    component: () => import('@pages/About/AboutPage.vue'),
                },
                {
                    path: 'blog',
                    component: () => import('@pages/Blog/BlogPage.vue'),
                },
                {
                    path: 'projects',
                    component: () => import('@pages/Projects/ProjectsPage.vue'),
                },
                ...blogPostRoutes,
                {
                    name: ERROR_404_ROUTE_NAME,
                    path: '404',
                    component: () => import('@pages/Error/404Page.vue'),
                },
            ],
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: {
                name: ERROR_404_ROUTE_NAME,
            },
        },
    ]

    return routes
}
