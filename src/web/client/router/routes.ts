import { loadBlogPosts } from '../pages/Blog/loadBlogPosts'
import { AppContext } from '@/web/AppContext'
import { RouteRecordRaw } from 'vue-router'

const ERROR_404_ROUTE_NAME = 'Error404'

export async function getRoutes(ssrContext?: AppContext): Promise<Array<RouteRecordRaw>> {
    const blogPosts = await loadBlogPosts(ssrContext)
    const blogPostRoutes: Array<RouteRecordRaw> = blogPosts.map((post) => ({
        path: post.slug,
        component: () => import(`@/web/client/pages/Blog/${post.dir}/BlogPost.vue`),
    }))

    const routes: Array<RouteRecordRaw> = [
        {
            path: '/',
            component: () => import('@/web/client/layouts/MainLayout.vue'),
            children: [
                {
                    path: '',
                    component: () => import('@/web/client/pages/Home/HomePage.vue'),
                },
                {
                    path: 'about',
                    component: () => import('@/web/client/pages/About/AboutPage.vue'),
                },
                {
                    path: 'blog',
                    component: () => import('@/web/client/pages/Blog/BlogPage.vue'),
                },
                {
                    path: 'projects',
                    component: () => import('@/web/client/pages/Projects/ProjectsPage.vue'),
                },
                ...blogPostRoutes,
                {
                    name: ERROR_404_ROUTE_NAME,
                    path: '404',
                    component: () => import('@/web/client/pages/Error/404Page.vue'),
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
