export type ResponsiveLoaderAsset = {
    src: string
}

export function getProfilePicture(): ResponsiveLoaderAsset {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('@/web/client/assets/img/profile.jpg?size=400') as ResponsiveLoaderAsset
}

export function getIconSvgRaw(icon: string): string {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(`@/web/client/assets/img/icons/${icon}.svg`) as string
}
