import { HydrationMap } from '@/web/utils/hydration'

declare global {
    const DEFINE: {
        IS_DEV: boolean
        IS_SSR: boolean
        GIT_HASH: string

        // ssg specific
        PUBLIC_DIR: string
        PUBLIC_PATH: string
        ENTRY_FILE: string
        MANIFEST_FILE: string
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Window extends HydrationMap {}
}

export {}
