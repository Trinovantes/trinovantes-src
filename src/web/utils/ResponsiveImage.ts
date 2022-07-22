export interface ResponsiveImage {
    src: string
    width: number
    height: number

    srcSet?: string
    placeholder?: string
}

export function getProfilePicture(): ResponsiveImage {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('@/web/assets/img/profile.jpg?size=400') as ResponsiveImage
}

export function getIconSvgRaw(icon: string): string {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(`@/web/assets/img/icons/${icon}.svg`) as string
}
