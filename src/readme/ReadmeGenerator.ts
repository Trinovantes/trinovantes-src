import assert from 'node:assert'
import { CLIENT_SRC_WEB_URL } from '../common/Constants.ts'
import { formatDate } from '../common/utils/formatDate.ts'
import { formatUrl } from '../common/utils/formatUrl.ts'
import { slugify } from '../common/utils/slugify.ts'
import { fetchBlogPosts } from '../api/services/fetchBlogPosts.ts'
import { fetchProjects } from '../api/services/fetchProjects.ts'
import type { Project } from '../common/Project.ts'
import type { CacheSize } from '../s3/CacheSize.ts'
import { getRepoUrl } from '../common/utils/getRepoUrl.ts'

const IMG_WIDTH: CacheSize = 320
const TABLE_ICON_SIZE = 48
const INLINE_ICON_SIZE = 16

export class ReadmeGenerator {
    private _output = ''

    private addLn(line: string, prefixLinebreak = true): void {
        if (prefixLinebreak) {
            this._output += '\n'
        }

        this._output += `${line.trim()}\n`
    }

    private addTag(tag: string, attrs: string, generateContent: () => void) {
        this.addLn(`<${tag}${attrs ? ` ${attrs}` : ''}>`)
        generateContent()
        this.addLn(`</${tag}>`)
    }

    async generate(): Promise<string> {
        this._output = ''
        await this.generateBlog()
        await this.generateProjects()
        return this._output
    }

    private async generateBlog(): Promise<void> {
        const blogPosts = await fetchBlogPosts()

        this.addLn('# Blog')

        for (const blogPost of blogPosts) {
            const postUrl = `https://www.stephenli.ca/${slugify(blogPost.title)}`
            const linkTag = `<a href="${postUrl}" title="${blogPost.title}" target="_blank">${blogPost.title}</a>`
            this.addLn(`* \`${formatDate(blogPost.createdAt)}\` ${linkTag}`, false)
        }

        this.addLn('')
    }

    private async generateProjects(): Promise<void> {
        const projects = await fetchProjects()

        this.addLn('# Node Projects')
        this.generateProjectsTable(projects['Node Projects'])

        this.addLn('# Apps')
        this.generateProjectsTableWithPreview(projects['Apps'])

        this.addLn('# UserScripts')
        this.generateProjectsTableWithPreview(projects['Userscripts'])
    }

    private generateProjectsTable(projects: Array<Project> = []): void {
        this.addTag('table', '', () => {
            for (const project of projects) {
                this.addTag('tr', '', () => {
                    this.addTag('td', `valign="middle" width="${IMG_WIDTH - (TABLE_ICON_SIZE * 2)}px"`, () => {
                        this.addLn(`<code>${project.name}</code>`)
                    })

                    this.addTag('td', `valign="middle" width="${TABLE_ICON_SIZE}px"`, () => {
                        if (project.url) {
                            if (project.url.includes('npmjs.com/package')) {
                                this.addLn(`<a href="${project.url}" title="${formatUrl(project.url)}" target="_blank"><img src="${CLIENT_SRC_WEB_URL}/assets/img/icons/npm.svg" width="${TABLE_ICON_SIZE}" height="${TABLE_ICON_SIZE}"></a>`)
                            } else {
                                this.addLn(`<a href="${project.url}" title="${formatUrl(project.url)}" target="_blank"><img src="${CLIENT_SRC_WEB_URL}/assets/img/icons/open.svg" width="${TABLE_ICON_SIZE}" height="${TABLE_ICON_SIZE}"></a>`)
                            }
                        }
                    })

                    this.addTag('td', `valign="middle" width="${TABLE_ICON_SIZE}px"`, () => {
                        if (!project.isPrivate) {
                            this.addLn(`<a href="${getRepoUrl(project.slug)}" title="${formatUrl(getRepoUrl(project.slug))}" target="_blank"><img src="${CLIENT_SRC_WEB_URL}/assets/img/icons/github.svg" width="${TABLE_ICON_SIZE}" height="${TABLE_ICON_SIZE}"></a>`)
                        }
                    })

                    this.addTag('td', 'valign="middle"', () => {
                        if (project.desc) {
                            this.addLn(project.desc)
                        }
                    })
                })
            }
        })
    }

    private generateProjectsTableWithPreview(projects: Array<Project> = []): void {
        this.addTag('table', '', () => {
            const time = new Date().getTime()

            for (const project of projects) {
                this.addTag('tr', '', () => {
                    this.addTag('td', `width="${IMG_WIDTH}px" valign="middle"`, () => {
                        const imgUrl = project.img
                        assert(imgUrl)

                        let previewUrl = ''
                        if (project.url) {
                            previewUrl = project.url
                        } else if (!project.isPrivate) {
                            previewUrl = getRepoUrl(project.slug)
                        }

                        if (previewUrl) {
                            this.addLn(`<a href="${previewUrl}" title="${formatUrl(previewUrl)}" target="_blank"><img src="${imgUrl.small}?t=${time}" width="${IMG_WIDTH}"></a>`)
                        } else {
                            this.addLn(`<img src="${imgUrl.small}?t=${time}" width="${IMG_WIDTH}">`)
                        }
                    })

                    this.addTag('td', 'valign="top"', () => {
                        const projectLabelTag = project.url
                            ? `<a href="${project.url}" title="${formatUrl(project.url)}" target="_blank">${project.name}</a>`
                            : project.name
                        const projectRepoTag = (!project.isPrivate)
                            ? `<a href="${getRepoUrl(project.slug)}" title="${formatUrl(getRepoUrl(project.slug))}" target="_blank"><img src="${CLIENT_SRC_WEB_URL}/assets/img/icons/github.svg" width="${INLINE_ICON_SIZE}" height="${INLINE_ICON_SIZE}"></a>`
                            : ''

                        this.addLn(`## ${projectLabelTag} ${projectRepoTag}`)

                        if (project.desc) {
                            this.addLn(project.desc)
                        }
                        if (project.tech.length > 0) {
                            this.addLn(project.tech.map((tech) => `<code>${tech}</code>`).join(' '))
                        }
                    })
                })
            }
        })
    }
}
