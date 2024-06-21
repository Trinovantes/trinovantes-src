export type ResponsiveLoaderAsset = {
    src: string
}

export function getProfilePicture(): string {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return (require('@/web/client/assets/img/profile.jpg?size=400') as ResponsiveLoaderAsset).src
}

export function getIconSvgRaw(icon: string): string {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(`@/web/client/assets/img/icons/${icon}.svg`) as string
}
