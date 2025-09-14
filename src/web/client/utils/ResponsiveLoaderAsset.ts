export type ResponsiveLoaderAsset = {
    src: string
}

export function getProfilePicture(): string {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return (require('@img/profile.jpg?size=400') as ResponsiveLoaderAsset).src
}

export function getIconSvgRaw(icon: string): string {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require(`@img/icons/${icon}.svg`) as string
}
