import type { Projects } from '../../../../common/Project.ts'
import type { AppContext } from '../../../AppContext.ts'
import { loadStateFromDom } from '../../utils/hydration.ts'

export async function loadProjects(ssrContext?: AppContext): Promise<Projects> {
    if (__IS_SSR__) {
        return ssrContext?.projects ?? {}
    }

    if (__IS_DEV__) {
        const res = await fetch('/api/projects')
        return await res.json() as Projects
    }

    return loadStateFromDom('__PROJECTS__') ?? {}
}
