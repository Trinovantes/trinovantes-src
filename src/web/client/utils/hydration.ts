import devalue from '@nuxt/devalue'
import type { BlogPosts } from '../../../api/services/fetchBlogPosts.ts'
import type { Projects } from '../../../common/Project.ts'

export type HydrationMap = {
    ['__BLOG_POSTS__']: BlogPosts
    ['__PROJECTS__']: Projects
}

export function saveStateToDom<K extends keyof HydrationMap>(key: K, state: HydrationMap[K]): string {
    return `window.${key} = ${devalue(state)}`
}

export function loadStateFromDom<K extends keyof HydrationMap>(key: K): HydrationMap[K] | undefined {
    if (__IS_SSR__) {
        return undefined
    }

    return window[key]
}
