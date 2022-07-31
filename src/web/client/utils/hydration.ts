import devalue from '@nuxt/devalue'
import type { Projects } from '@/common/Project'
import type { BlogPosts } from '../pages/Blog/getBlogPosts'

export enum HydrationKey {
    BlogPosts = '__BLOG_POSTS__',
    Projects = '__PROJECTS__',
}

export interface HydrationMap {
    [HydrationKey.BlogPosts]: BlogPosts
    [HydrationKey.Projects]: Projects
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
