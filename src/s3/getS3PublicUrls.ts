import { S3_PUBLIC_URL } from '@/common/Constants'
import { ProjectImgUrl } from '@/common/Project'
import { ALL_CACHE_SIZES, CacheSize } from './CacheSize'

export const S3_CONTENT_TYPE = 'image/jpeg'

export function getS3PublicUrls(projectSlug: string): ProjectImgUrl {
    return {
        original: `${S3_PUBLIC_URL}/${getS3FileNameWithExt(projectSlug, CacheSize.ORIGINAL)}`,
        small: `${S3_PUBLIC_URL}/${getS3FileNameWithExt(projectSlug, CacheSize.SMALL)}`,
        medium: `${S3_PUBLIC_URL}/${getS3FileNameWithExt(projectSlug, CacheSize.MEDIUM)}`,
    }
}

export function getS3FileNameWithExt(projectSlug: string, size: CacheSize): string {
    switch (size) {
        case CacheSize.ORIGINAL: return `${projectSlug}.jpg`
        case CacheSize.SMALL: return `${projectSlug}-${CacheSize.SMALL}.jpg`
        case CacheSize.MEDIUM: return `${projectSlug}-${CacheSize.MEDIUM}.jpg`
    }
}

export function getS3FileNamesWithExt(projectSlug: string): Array<string> {
    return ALL_CACHE_SIZES.map((size) => getS3FileNameWithExt(projectSlug, size))
}
