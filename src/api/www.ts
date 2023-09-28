import http from 'node:http'
import { createApiApp } from './createApiApp'

async function main() {
    const app = await createApiApp()
    const server = http.createServer(app)
    const port = 3000

    console.info('Starting HTTP Web Server')
    server.listen(port, '0.0.0.0', () => {
        console.info(`Server Listening on Port ${port}`)
    })
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})
