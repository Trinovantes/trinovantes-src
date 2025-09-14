import { createAsyncHandler } from '../common/node/createAsyncHandler.ts'
import { fetchBlogPosts } from './services/fetchBlogPosts.ts'
import { fetchProjects } from './services/fetchProjects.ts'
import express from 'express'

const PORT = 3000
const app = express()

app.get('/api/projects', createAsyncHandler(async (req, res) => {
    const projects = await fetchProjects()
    res.json(projects)
}))

app.get('/api/blog-posts', createAsyncHandler(async (req, res) => {
    const blogPosts = await fetchBlogPosts()
    res.json(blogPosts)
}))

app.listen(PORT, () => {
    console.info('Server Ready', PORT)
})
