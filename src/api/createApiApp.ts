import express from 'express'
import { createErrorHandler } from './utils/createErrorHandler'
import { generate404 } from './utils/generate404'
import { fetchProjects } from './services/fetchProjects'
import { fetchBlogPosts } from './services/fetchBlogPosts'

export async function createApiApp() {
    const app = express()

    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))

    console.info('fetchProjects')
    const projects = await fetchProjects()
    app.use('/api/projects', (req, res) => {
        res.json(projects)
    })

    console.info('fetchBlogPosts')
    const blogPosts = await fetchBlogPosts()
    app.use('/api/blog-posts', (req, res) => {
        res.json(blogPosts)
    })

    app.use('/api', generate404())
    app.use('/api', createErrorHandler(true))
    app.use(generate404())
    app.use(createErrorHandler(false))

    return app
}
