import { S3Client, ListObjectsCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { JSDOM } from 'jsdom'
import { getRuntimeSecret, RuntimeSecret } from '../utils/RuntimeSecret'
import { Project } from '@/common/Project'
import { slugify } from '@/common/utils/slugify'
import { getRepoInfo } from './getRepoInfo'
import { isAfter, add } from 'date-fns'

const S3_BUCKET_NAME = 'stephenli'
const S3_PUBLIC_URL = 'https://cdn.stephenli.ca'

export class S3Cache {
    readonly #client: S3Client
    readonly #cached: Map<string, {
        publicUrl: string
        lastModified?: Date
    }>

    constructor() {
        const endpoint = getRuntimeSecret(RuntimeSecret.AWS_ENDPOINT_URL)
        const accessKeyId = getRuntimeSecret(RuntimeSecret.AWS_ACCESS_KEY_ID)
        const secretAccessKey = getRuntimeSecret(RuntimeSecret.AWS_SECRET_ACCESS_KEY)

        this.#client = new S3Client({
            region: 'auto',
            endpoint,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        })

        this.#cached = new Map()
    }

    async init() {
        const listObjectsCmd = new ListObjectsCommand({ Bucket: S3_BUCKET_NAME })
        const res = await this.#client.send(listObjectsCmd)

        for (const object of res.Contents ?? []) {
            const fileName = object.Key
            if (!fileName) {
                continue
            }

            const repoSlug = /([\w-]+)\.(\w+)$/.exec(fileName)?.[1]
            if (!repoSlug) {
                continue
            }

            this.#cached.set(repoSlug, {
                publicUrl: getS3PublicUrl(fileName),
                lastModified: object.LastModified,
            })
        }

        console.info('init', this.#cached)
    }

    async fetchOgImage(project: Project): Promise<string> {
        console.info('fetchOgImage', project.repoUrl)

        const { repo } = getRepoInfo(project.repoUrl)
        const repoSlug = slugify(repo)
        const cachedImage = this.#cached.get(repoSlug)
        const lastMonth = add(new Date(), { months: -1 })

        // Return cached image if it's less than 1 month old
        if (cachedImage?.lastModified && isAfter(cachedImage.lastModified, lastMonth)) {
            return cachedImage.publicUrl
        }

        // Return stale cached image if it's for a private repo since we can't fetch it anyways
        if (project.isPrivate && cachedImage?.publicUrl) {
            return cachedImage.publicUrl
        }

        const ogImage = await fetchOgImage(project)
        const res = await fetch(ogImage)
        if (!res.body) {
            throw new Error(`Failed to fetch ${ogImage}`)
        }

        const rawContentType = res.headers.get('Content-Type')
        const contentType = (rawContentType === 'image/jpeg') ? rawContentType : 'image/png'
        const extension = (rawContentType === 'image/jpeg') ? 'jpg' : 'png'
        const fileName = `${repoSlug}.${extension}`

        const rawData = await (await res.blob()).arrayBuffer()
        await this.#client.send(new PutObjectCommand({
            Key: fileName,
            Bucket: S3_BUCKET_NAME,
            Body: rawData as Buffer,
            ContentType: contentType,
        }))

        const publicUrl = getS3PublicUrl(fileName)
        this.#cached.set(repoSlug, {
            publicUrl,
            lastModified: new Date(),
        })

        return publicUrl
    }
}

function getS3PublicUrl(fileName: string) {
    return `${S3_PUBLIC_URL}/${fileName}`
}

async function fetchOgImage(project: Project): Promise<string> {
    if (project.isPrivate) {
        throw new Error(`${project.repoUrl} is private`)
    }

    const res = await fetch(project.repoUrl)
    const html = await res.text()
    const jsdom = new JSDOM(html)

    const ogImageTag = jsdom.window.document.querySelector('meta[property="og:image"]')
    if (!ogImageTag) {
        throw new Error(`Failed to get og:image for repo:${project.repoUrl}`)
    }

    const ogImageUrl = ogImageTag.getAttribute('content')
    if (!ogImageUrl) {
        throw new Error(`Failed to get og:image for repo:${project.repoUrl}`)
    }

    return ogImageUrl
}
