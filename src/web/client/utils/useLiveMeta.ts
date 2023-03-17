import { computed, ComputedRef, unref } from 'vue'
import { useMeta } from 'vue-meta'
import { APP_NAME } from '@/common/Constants'
import { getProfilePicture } from './ResponsiveLoaderAsset'

export const enum TwitterCard {
    Summary = 'summary',
    Large = 'summary_large_image',
}

export type LiveMetaOptions = {
    title: ComputedRef<string> | string
    desc?: ComputedRef<string | undefined> | string
    image?: ComputedRef<string | undefined> | string
    imageSize?: ComputedRef<TwitterCard | undefined> | TwitterCard
}

export type LiveMeta = {
    title: string
    og: {
        title: string
        description?: string
        image?: string
    }
    twitter: {
        title: string
        description?: string
        image?: string
        card?: TwitterCard
    }
}

export function useLiveMeta(options: LiveMetaOptions): LiveMetaOptions {
    useMeta(computed(() => {
        const title = unref(options.title) === APP_NAME
            ? APP_NAME
            : `${unref(options.title)} | ${APP_NAME}`

        const headOptions: LiveMeta = {
            title,
            og: {
                title: title.replace(/"/g, '&quot;'),
            },
            twitter: {
                title: title.replace(/"/g, '&quot;'),
            },
        }

        const description = unref(options.desc)?.replace(/"/g, '&quot;')
        if (description) {
            headOptions.og.description = description
            headOptions.twitter.description = description
        }

        const image = unref(options.image) ?? getProfilePicture()
        const imageSize = unref(options.imageSize) ?? TwitterCard.Large
        headOptions.og.image = image
        headOptions.twitter.image = image
        headOptions.twitter.card = imageSize

        return headOptions
    }))

    return options
}
