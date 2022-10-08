import { HydrationKey, loadStateFromDom } from '../../utils/hydration'
import type { Projects } from '@/common/Project'
import { useAppContext } from '@/web/AppContext'

export async function loadProjects(): Promise<Projects> {
    if (DEFINE.IS_SSR) {
        const ssrContext = useAppContext()
        return ssrContext?.projects ?? {}
    }

    if (DEFINE.IS_DEV) {
        const { default: axios } = await import('axios')
        const res = await axios.get<Projects>('/api/projects')
        return res.data
    }

    return loadStateFromDom(HydrationKey.Projects) ?? {}
}
