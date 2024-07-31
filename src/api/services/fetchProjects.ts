import { Octokit } from '@octokit/rest'
import { getRuntimeSecret, RuntimeSecret } from '@/common/node/RuntimeSecret'
import { Project, ProjectCategory, Projects, projects } from '@/common/Project'
import { getS3PublicUrls } from '@/s3/getS3PublicUrls'

// SSG needs to call fetchProjects for every page so we cache the results once
let hydratedProjects: Projects | null = null

export async function fetchProjects(): Promise<Projects> {
    if (!hydratedProjects) {
        hydratedProjects = await hydrateProjects()
    }

    return hydratedProjects
}

async function hydrateProjects(): Promise<Projects> {
    const hydratedProjects: Projects = {}
    const githubToken = getRuntimeSecret(RuntimeSecret.GITHUB_PAT)
    const octokit = new Octokit({ auth: githubToken })

    for (const [category, categoryProjects] of Object.entries(projects)) {
        const projects = new Array<Project>()

        for (const project of categoryProjects) {
            const repoResponse = await octokit.rest.repos.get({
                owner: 'Trinovantes',
                repo: project.slug,
            })

            projects.push({
                ...project,
                desc: project.desc ?? repoResponse.data.description ?? undefined,
                url: project.url ?? repoResponse.data.homepage ?? undefined,
                img: getS3PublicUrls(project.slug.toLowerCase()),
            })
        }

        hydratedProjects[category as ProjectCategory] = projects
    }

    return hydratedProjects
}
