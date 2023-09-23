import assert from 'assert'
import { CLIENT_SRC_WEB_URL, IMG_WIDTH } from '@/common/Constants'
import { formatDate } from '@/common/utils/formatDate'
import { formatUrl } from '@/common/utils/formatUrl'
import { slugify } from '@/common/utils/slugify'
import { fetchBlogPosts } from '@/api/services/fetchBlogPosts'
import { fetchProjects } from '@/api/services/fetchProjects'

export class ReadmeGenerator {
    private _output = ''
    private _stack = 0

    private addLn(line: string, prefixLinebreak = true): void {
        if (prefixLinebreak) {
            this._output += '\n'
        }

        this._output += `${line.trim()}\n`
    }

    private startTag(tag: string, attrs?: string): void {
        this.addLn(`<${tag}${attrs ? ` ${attrs}` : ''}>`)
        this._stack += 1
    }

    private endTag(tag: string): void {
        this._stack -= 1
        this.addLn(`</${tag}>`)
    }

    async generate(): Promise<string> {
        this._output = ''
        this._stack = 0

        await this.generateBlog()
        await this.generateProjects()

        assert(this._stack === 0)
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

        for (const [category, categoryProjects] of Object.entries(projects)) {
            this.addLn(`# ${category}`)

            this.startTag('table')

            for (const project of categoryProjects) {
                this.startTag('tr')

                {
                    const imgUrl = project.img
                    assert(imgUrl)

                    let previewUrl = ''
                    let previewTooltip = ''

                    if (project.url) {
                        previewUrl = project.url
                        previewTooltip = project.url
                    } else if (project.repoUrl && !project.isPrivate) {
                        previewUrl = project.repoUrl
                        previewTooltip = project.repoUrl
                    } else {
                        previewUrl = imgUrl
                        previewTooltip = imgUrl
                    }

                    this.addLn(`
                        <td width="${IMG_WIDTH}px" valign="middle">
                            <a href="${previewUrl}" title="${previewTooltip}" target="_blank">
                                <img src="${imgUrl}" width="${IMG_WIDTH}">
                            </a>
                        </td>
                    `)
                }

                {
                    this.startTag('td', 'valign="middle"')

                    const projectLabelTag = project.url
                        ? `<a href="${project.url}" title="${formatUrl(project.url)}" target="_blank">${project.name}</a>`
                        : project.name
                    const projectRepoTag = (project.repoUrl && !project.isPrivate)
                        ? ` <a href="${project.repoUrl}" title="${project.repoUrl}" target="_blank"><img src="${CLIENT_SRC_WEB_URL}/assets/img/icons/github.svg" width="16" height="16"></a>`
                        : ''

                    this.addLn(`## ${projectLabelTag}${projectRepoTag}`)

                    if (project.desc) {
                        this.addLn(`${project.desc}`)
                    }
                    if (project.tech.length > 0) {
                        this.addLn(project.tech.map((tech) => `<code>${tech}</code>`).join(' '))
                    }

                    this.endTag('td')
                }

                this.endTag('tr')
            }

            this.endTag('table')
        }
    }
}
