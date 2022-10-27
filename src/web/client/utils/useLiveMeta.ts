import { merge } from 'lodash-es'
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

export function useLiveMeta(options: LiveMetaOptions): LiveMetaOptions {
    useMeta(computed(() => {
        const title = unref(options.title) === APP_NAME
            ? APP_NAME
            : `${unref(options.title)} | ${APP_NAME}`

        const headOptions = {
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
            merge(headOptions, {
                description,
                og: {
                    description,
                },
                twitter: {
                    description,
                },
            })
        }

        const image = unref(options.image) ?? getProfilePicture()
        merge(headOptions, {
            og: {
                image,
            },
            twitter: {
                card: options.imageSize ?? TwitterCard.Summary,
                image,
            },
        })

        return headOptions
    }))

    return options
}
