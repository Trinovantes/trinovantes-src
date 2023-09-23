import { Octokit } from '@octokit/rest'
import { getRuntimeSecret, RuntimeSecret } from '@/api/utils/RuntimeSecret'
import { Project, ProjectCategory, Projects, projects } from '@/common/Project'
import { S3Cache } from './S3Cache'
import { getRepoInfo } from './getRepoInfo'

let hydratedProjects: Projects | null = null

export async function fetchProjects(): Promise<Projects> {
    if (!hydratedProjects) {
        hydratedProjects = await hydrateProjects(projects)
    }

    return hydratedProjects
}

async function hydrateProjects(projects: Projects): Promise<Projects> {
    const githubToken = getRuntimeSecret(RuntimeSecret.GITHUB_PAT)
    const octokit = new Octokit({ auth: githubToken })

    const s3Cache = new S3Cache()
    await s3Cache.init()

    const hydratedProjects: Projects = {}

    for (const [category, categoryProjects] of Object.entries(projects)) {
        const projects = new Array<Project>()

        for (const project of categoryProjects) {
            const repoInfo = getRepoInfo(project.repoUrl)
            const repoResponse = await octokit.rest.repos.get(repoInfo)
            const ogImage = await s3Cache.fetchOgImage(project)

            projects.push({
                ...project,
                desc: project.desc ?? repoResponse.data.description ?? undefined,
                url: project.url ?? repoResponse.data.homepage ?? undefined,
                img: ogImage ?? undefined,
            })
        }

        hydratedProjects[category as ProjectCategory] = projects
    }

    return hydratedProjects
}
