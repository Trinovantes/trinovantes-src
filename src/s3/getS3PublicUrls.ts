import { S3_PUBLIC_URL } from '@/common/Constants'
import { ProjectImgUrl } from '@/common/Project'
import { ALL_CACHE_SIZES, CacheSize } from './CacheSize'

export const S3_CONTENT_TYPE = 'image/jpeg'

export function getS3PublicUrls(projectSlug: string): ProjectImgUrl {
    return {
        original: `${S3_PUBLIC_URL}/${getS3FileNameWithExt(projectSlug, 0)}`,
        small: `${S3_PUBLIC_URL}/${getS3FileNameWithExt(projectSlug, 320)}`,
        medium: `${S3_PUBLIC_URL}/${getS3FileNameWithExt(projectSlug, 640)}`,
    }
}

export function getS3FileNameWithExt(projectSlug: string, size: CacheSize): string {
    if (size <= 0) {
        return `${projectSlug}.jpg`
    }

    return `${projectSlug}-${size}.jpg`
}

export function getS3FileNamesWithExt(projectSlug: string): Array<string> {
    return ALL_CACHE_SIZES.map((size) => getS3FileNameWithExt(projectSlug, size))
}
