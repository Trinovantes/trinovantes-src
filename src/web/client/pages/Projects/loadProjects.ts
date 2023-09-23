import { loadStateFromDom, HydrationKey } from '@/web/client/utils/hydration'
import { Projects } from '@/common/Project'
import { AppContext } from '@/web/AppContext'

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
