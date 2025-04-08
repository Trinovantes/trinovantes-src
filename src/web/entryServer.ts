import { readFileSync } from 'node:fs'
import { renderToString } from '@vue/server-renderer'
import { SpaServer } from 'puppeteer-prerender-plugin'
import { renderSSRHead } from '@unhead/ssr'
import { VueSsrAssetRenderer } from 'vue-ssr-assets-plugin'
import { fetchProjects } from '@/api/services/fetchProjects'
import { saveStateToDom } from './client/utils/hydration'
import { createVueApp } from './createVueApp'
import { AppContext } from './AppContext'
import { RequestHandler, Request, Response, NextFunction } from 'express'
import { fetchBlogPosts } from '@/api/services/fetchBlogPosts'
import { createHead } from '@unhead/vue/server'

const assetRenderer = new VueSsrAssetRenderer(DEFINE.SSG_MANIFEST_FILE)
const htmlTemplate = readFileSync(DEFINE.SSG_HTML_TEMPLATE).toString('utf-8')

function createAsyncHandler(handler: (req: Request, res: Response, next: NextFunction) => Promise<void>): RequestHandler {
    return (req, res, next) => {
        handler(req, res, next).catch((err: unknown) => {
            next(err)
        })
    }
}

const server = new SpaServer({
    entryFilePath: DEFINE.SSG_ENTRY_FILE,
    publicDir: DEFINE.SSG_PUBLIC_DIR,
    publicPath: DEFINE.SSG_PUBLIC_PATH,

    handlers: {
        '*': createAsyncHandler(async(req, res) => {
            const url = req.originalUrl
            const appContext: AppContext = {
                _matchedComponents: new Set(),
                url,
                blogPosts: await fetchBlogPosts(),
                projects: await fetchProjects(),
            }

            const head = createHead({ disableDefaults: true })
            const { app, router } = await createVueApp(head, appContext)
            if (router.currentRoute.value.fullPath !== url) {
                res.redirect(router.currentRoute.value.fullPath)
                return
            }

            const appHtml = await renderToString(app, appContext)
            const payload = await renderSSRHead(head)
            const { header, footer } = assetRenderer.renderAssets(appContext._matchedComponents)
            const headerText = `
                <script>
                    ${saveStateToDom('__BLOG_POSTS__', appContext.blogPosts)};
                    ${saveStateToDom('__PROJECTS__', appContext.projects)};
                </script>

                ${header}
                ${payload.headTags}
                ${appContext.teleports?.head ?? ''}
            `

            res.setHeader('Content-Type', 'text/html')
            res.status(200)

            let html = htmlTemplate
            html = html.replace('<html', `<html ${appContext.teleports?.htmlAttrs ?? ''}`)
            html = html.replace('</head>', `${headerText}</head>`)
            html = html.replace('<body', `<body ${appContext.teleports?.bodyAttrs ?? ''}`)
            html = html.replace('</body>', `${appContext.teleports?.body ?? ''}${footer}${payload.bodyTags}</body>`)
            html = html.replace('<div id="app"></div>', `<div id="app">${appHtml}</div>`)
            res.send(html)
        }),
    },
})

export default server
