import { HydrationMap } from '@/web/client/utils/hydration'

declare global {
    const DEFINE: Readonly<{
        IS_DEV: boolean
        IS_SSR: boolean
        GIT_HASH: string

        // ssg specific
        SSG_PUBLIC_PATH: string
        SSG_PUBLIC_DIR: string
        SSG_ENTRY_FILE: string
        SSG_HTML_TEMPLATE: string
        SSG_MANIFEST_FILE: string
    }>

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/consistent-type-definitions
    interface Window extends HydrationMap {}
}

export {}
