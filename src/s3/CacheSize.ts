export const ALL_CACHE_SIZES = [
    0,
    320,
    640,
] as const

export type CacheSize = typeof ALL_CACHE_SIZES[number]
