import devalue from '@nuxt/devalue'

export enum HydrationKey {
    BlogPosts = '__BLOG_POSTS__',
    Projects = '__PROJECTS__',
}

export function saveStateToDom<S>(key: string, state: S): string {
    return `window.${key} = ${devalue(state)}`
}

export function loadStateFromDom<S>(key: HydrationKey): S | undefined {
    return window[key] as S | undefined
}
