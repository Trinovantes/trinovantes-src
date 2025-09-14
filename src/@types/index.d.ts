import { HydrationMap } from '../web/client/utils/hydration.ts'

declare global {
    const __IS_DEV__: boolean
    const __IS_SSR__: boolean
    const __GIT_HASH__: string

    // ssg specific
    const __SSG_PUBLIC_PATH__: string
    const __SSG_PUBLIC_DIR__: string
    const __SSG_ENTRY_FILE__: string
    const __SSG_HTML_TEMPLATE__: string
    const __SSG_MANIFEST_FILE__: string

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/consistent-type-definitions
    interface Window extends HydrationMap {}
}

export {}
