export function getRepoInfo(repoUrl: string): { owner: string; repo: string } {
    const matches = /github\.com\/([\w-.]+)\/([\w-.]+)/.exec(repoUrl)
    if (!matches) {
        throw new Error(`Failed to match GitHub url ${repoUrl}`)
    }

    return {
        owner: matches[1],
        repo: matches[2],
    }
}
