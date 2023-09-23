import express from 'express'
import { createErrorHandler } from './utils/createErrorHandler'
import { createAsyncHandler } from './utils/createAsyncHandler'
import { generate404 } from './utils/generate404'
import { fetchProjects } from './services/fetchProjects'
import { fetchBlogPosts } from './services/fetchBlogPosts'

export function createApiApp() {
    const app = express()

    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))

    app.use('/api/projects', createAsyncHandler(async(req, res) => {
        const projects = await fetchProjects()
        res.json(projects)
    }))

    app.use('/api/blog-posts', createAsyncHandler(async(req, res) => {
        const projects = await fetchBlogPosts()
        res.json(projects)
    }))

    app.use('/api', generate404())
    app.use('/api', createErrorHandler(true))
    app.use(generate404())
    app.use(createErrorHandler(false))

    return app
}
