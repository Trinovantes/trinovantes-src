import { getRuntimeSecret, RuntimeSecret } from '@/common/node/RuntimeSecret'
import { S3_BUCKET_NAME } from '@/common/Constants'
import { projects } from '@/common/Project'
import { S3Client, ListObjectsCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { add, isBefore } from 'date-fns'
import { getS3FileNamesWithExt, getS3FileNameWithExt, S3_CONTENT_TYPE } from './getS3PublicUrls'
import { JSDOM } from 'jsdom'
import sharp from 'sharp'
import { ALL_CACHE_SIZES, CacheSize } from './CacheSize'
import { getRepoUrl } from '@/common/utils/getRepoUrl'

export class ImageCache {
    readonly #s3Client: S3Client
    readonly #remoteFiles = new Set<string>()
    readonly #lastModified = new Map<string, Date>()

    constructor() {
        const endpoint = getRuntimeSecret(RuntimeSecret.AWS_ENDPOINT_URL)
        const accessKeyId = getRuntimeSecret(RuntimeSecret.AWS_ACCESS_KEY_ID)
        const secretAccessKey = getRuntimeSecret(RuntimeSecret.AWS_SECRET_ACCESS_KEY)

        this.#s3Client = new S3Client({
            region: 'auto',
            endpoint,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        })
    }

    async init() {
        const listObjectsCmd = new ListObjectsCommand({ Bucket: S3_BUCKET_NAME })
        const listRes = await this.#s3Client.send(listObjectsCmd)

        for (const s3Obj of listRes.Contents ?? []) {
            if (!s3Obj.LastModified) {
                continue
            }

            const fileNameAndExt = s3Obj.Key
            if (!fileNameAndExt) {
                continue
            }

            const matches = /^(?<projectSlug>[\w-]+)(?<!-\d+)\.(?<extension>\w+)$/.exec(fileNameAndExt)
            const projectSlug = matches?.groups?.projectSlug
            if (!projectSlug) {
                continue
            }

            this.#lastModified.set(projectSlug, s3Obj.LastModified)
        }

        for (const s3Obj of listRes.Contents ?? []) {
            const fileNameAndExt = s3Obj.Key
            if (!fileNameAndExt) {
                continue
            }

            this.#remoteFiles.add(fileNameAndExt)
        }
    }

    get projectsToUpdate(): Array<string> {
        const lastMonth = add(new Date(), { months: -1 })
        const allProjectSlugs = Object.values(projects).flatMap((categoryProjects) => categoryProjects.map((project) => project.slug))

        return allProjectSlugs.filter((projectSlug) => {
            // Check if image exists or is stale
            const lastModified = this.#lastModified.get(projectSlug)
            if (!lastModified || isBefore(lastModified, lastMonth)) {
                return true
            }

            // Check if expected thumbnails exists
            const expectedFiles = getS3FileNamesWithExt(projectSlug)
            for (const file of expectedFiles) {
                if (!this.#remoteFiles.has(file)) {
                    return true
                }
            }

            return false
        })
    }

    async updateProjects() {
        for (const projectSlug of this.projectsToUpdate) {
            console.info('Updating', projectSlug)
            const origData = await this.fetchOgImage(projectSlug)

            for (const size of ALL_CACHE_SIZES) {
                const fileName = getS3FileNameWithExt(projectSlug, size)
                const imgData = size === CacheSize.ORIGINAL
                    ? await sharp(origData).jpeg().toBuffer()
                    : await sharp(origData).jpeg().resize(size).toBuffer()

                console.info('Uploading', fileName)
                await this.#s3Client.send(new PutObjectCommand({
                    Key: fileName,
                    Bucket: S3_BUCKET_NAME,
                    Body: imgData,
                    ContentType: S3_CONTENT_TYPE,
                }))
            }
        }
    }

    async fetchOgImage(projectSlug: string): Promise<ArrayBuffer | Uint8Array> {
        const repoUrl = getRepoUrl(projectSlug)
        const githubRes = await fetch(repoUrl)
        const isPrivateRepo = githubRes.status === 404

        if (isPrivateRepo) {
            // If private repo, then assume original size is manually uploaded to s3
            const fileName = getS3FileNameWithExt(projectSlug, CacheSize.ORIGINAL)
            const getObjCmd = new GetObjectCommand({
                Bucket: S3_BUCKET_NAME,
                Key: fileName,
            })

            const getRes = await this.#s3Client.send(getObjCmd)
            const imageData = getRes.Body
            if (!imageData) {
                throw new Error(`Failed to get ${fileName} from s3`)
            }

            return await imageData.transformToByteArray()
        } else {
            // If public repo, then parse the html of the repo page for open graph meta
            const html = await githubRes.text()
            const jsdom = new JSDOM(html)

            const ogImageTag = jsdom.window.document.querySelector('meta[property="og:image"]')
            if (!ogImageTag) {
                throw new Error(`Failed to get og:image for repo:${projectSlug}`)
            }

            const ogImageUrl = ogImageTag.getAttribute('content')
            if (!ogImageUrl) {
                throw new Error(`Failed to get og:image for repo:${projectSlug}`)
            }

            const imgRes = await fetch(ogImageUrl)
            const rawData = await imgRes.blob()
            return await rawData.arrayBuffer()
        }
    }
}
