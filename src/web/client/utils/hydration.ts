import devalue from '@nuxt/devalue'
import { Projects } from '@/common/Project'
import { BlogPosts } from '@/api/services/fetchBlogPosts'

export type HydrationMap = {
    ['__BLOG_POSTS__']: BlogPosts
    ['__PROJECTS__']: Projects
}

export function saveStateToDom<K extends keyof HydrationMap>(key: K, state: HydrationMap[K]): string {
    return `window.${key} = ${devalue(state)}`
}

export function loadStateFromDom<K extends keyof HydrationMap>(key: K): HydrationMap[K] | undefined {
    if (DEFINE.IS_SSR) {
        return undefined
    }

    return window[key]
}
