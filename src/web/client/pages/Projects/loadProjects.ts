import { HydrationKey, loadStateFromDom } from '../../utils/hydration'
import type { Projects } from '@/common/Project'
import type { AppContext } from '@/web/AppContext'

export async function loadProjects(ssrContext?: AppContext): Promise<Projects> {
    if (DEFINE.IS_SSR) {
        return ssrContext?.projects ?? {}
    }

    if (DEFINE.IS_DEV) {
        const res = await fetch('/api/projects')
        return await res.json() as Projects
    }

    return loadStateFromDom(HydrationKey.Projects) ?? {}
}
