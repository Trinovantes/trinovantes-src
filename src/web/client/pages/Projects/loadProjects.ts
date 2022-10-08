import { HydrationKey, loadStateFromDom } from '../../utils/hydration'
import type { Projects } from '@/common/Project'
import type { AppContext } from '@/web/AppContext'

export async function loadProjects(ssrContext?: AppContext): Promise<Projects> {
    if (DEFINE.IS_SSR) {
        return ssrContext?.projects ?? {}
    }

    if (DEFINE.IS_DEV) {
        const { default: axios } = await import('axios')
        const res = await axios.get<Projects>('/api/projects')
        return res.data
    }

    return loadStateFromDom(HydrationKey.Projects) ?? {}
}
