import { S3Client, ListObjectsCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import axios from 'axios'
import { JSDOM } from 'jsdom'
import { getRuntimeSecret, RuntimeSecret } from '../utils/RuntimeSecret'
import type { Project } from '@/common/Project'
import { slugify } from '@/common/utils/slugify'
import { getRepoInfo } from './getRepoInfo'

const BUCKET_NAME = 'stephenli'
const PUBLIC_URL = 'https://cdn.stephenli.ca'

export class S3Cache {
    readonly #client: S3Client
    readonly #cached: Map<string, string>

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
        const listObjectsCmd = new ListObjectsCommand({ Bucket: BUCKET_NAME })
        const res = await this.#client.send(listObjectsCmd)

        for (const object of res.Contents ?? []) {
            const fileName = object.Key
            if (!fileName) {
                continue
            }

            const matches = /([\w-]+)\.(\w+)$/.exec(fileName)
            if (!matches) {
                continue
            }

            const repoSlug = matches[1]
            const cachedImage = getPublicUrl(fileName)
            this.#cached.set(repoSlug, cachedImage)
        }

        console.info(this.#cached)
    }

    async fetchOgImage(project: Project): Promise<string> {
        console.info('fetchOgImage', project.repoUrl)

        const { repo } = getRepoInfo(project.repoUrl)
        const repoSlug = slugify(repo)

        const cachedImage = this.#cached.get(repoSlug)
        if (cachedImage) {
            return cachedImage
        }

        const ogImage = await scrapeOgImage(project)
        return await this.#syncToCache(repoSlug, ogImage)
    }

    async #syncToCache(repoSlug: string, imageUrl: string): Promise<string> {
        const res = await axios.get<Buffer>(imageUrl, { responseType: 'arraybuffer' })
        const rawContentType = res.headers['Content-Type']
        const contentType = (rawContentType === 'image/jpeg') ? rawContentType : 'image/png'
        const extension = (rawContentType === 'image/jpeg') ? 'jpg' : 'png'
        const fileName = `${repoSlug}.${extension}`

        const putObjectCmd = new PutObjectCommand({
            Key: fileName,
            Bucket: BUCKET_NAME,
            Body: res.data,
            ContentType: contentType,
        })
        await this.#client.send(putObjectCmd)

        const publicUrl = getPublicUrl(fileName)
        this.#cached.set(repoSlug, publicUrl)

        return publicUrl
    }
}

function getPublicUrl(fileName: string): string {
    return `${PUBLIC_URL}/${fileName}`
}

async function scrapeOgImage(project: Project): Promise<string> {
    if (project.isPrivate) {
        throw new Error(`${project.repoUrl} is private`)
    }

    const res = await axios.get<string>(project.repoUrl)
    const jsdom = new JSDOM(res.data)

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
