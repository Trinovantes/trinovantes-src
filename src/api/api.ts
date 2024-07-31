import { fetchBlogPosts } from './services/fetchBlogPosts'
import { fetchProjects } from './services/fetchProjects'

const PORT = 3000
const routes = new Map<string, (req: Request) => Response | Promise<Response>>()

routes.set('/api/projects', async() => {
    const projects = await fetchProjects()
    return new Response(JSON.stringify(projects))
})
routes.set('/api/blog-posts', async() => {
    const blogPosts = await fetchBlogPosts()
    return new Response(JSON.stringify(blogPosts))
})

Bun.serve({
    port: PORT,

    fetch: async(req) => {
        const url = new URL(req.url)
        console.info(req.method, url.href)

        const handler = routes.get(url.pathname)
        if (!handler) {
            return new Response(null, { status: 404 })
        }

        return await handler(req)
    },
})

console.info('Server Ready', PORT)
