import { readFileSync } from 'fs'
import { renderToString } from '@vue/server-renderer'
import { SpaServer } from 'puppeteer-prerender-plugin'
import { renderMetaToString } from 'vue-meta/ssr'
import { VueSsrAssetRenderer } from 'vue-ssr-assets-plugin'
import { fetchProjects } from '@/api/services/fetchProjects'
import { getBlogPosts } from './client/pages/Blog/getBlogPosts'
import { HydrationKey, saveStateToDom } from './client/utils/hydration'
import { createVueApp } from './createVueApp'
import type { AppContext } from './AppContext'
import type express from 'express'

function createAsyncHandler(handler: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>): express.RequestHandler {
    return (req, res, next) => {
        handler(req, res, next).catch(next)
    }
}

const assetRenderer = new VueSsrAssetRenderer(DEFINE.MANIFEST_FILE)
const htmlTemplate = readFileSync(DEFINE.HTML_TEMPLATE).toString('utf-8')

const server = new SpaServer({
    entryFilePath: DEFINE.ENTRY_FILE,
    publicDir: DEFINE.PUBLIC_DIR,
    publicPath: DEFINE.PUBLIC_PATH,

    handlers: {
        '*': createAsyncHandler(async(req, res) => {
            const url = req.originalUrl
            const appContext: AppContext = {
                _matchedComponents: new Set(),
                url,
                blogPosts: await getBlogPosts(),
                projects: await fetchProjects(),
            }

            const { app, router } = await createVueApp(appContext)
            if (router.currentRoute.value.fullPath !== url) {
                res.redirect(router.currentRoute.value.fullPath)
                return
            }

            const appHtml = await renderToString(app, appContext)
            await renderMetaToString(app, appContext)
            const { header, footer } = assetRenderer.renderAssets(appContext._matchedComponents)
            const head = `
                <script>
                    ${saveStateToDom(HydrationKey.BlogPosts, appContext.blogPosts)};
                    ${saveStateToDom(HydrationKey.Projects, appContext.projects)};
                </script>

                ${header}
                ${appContext.teleports?.head ?? ''}
            `

            res.setHeader('Content-Type', 'text/html')
            res.status(200)

            let html = htmlTemplate
            html = html.replace('<html', `<html ${appContext.teleports?.htmlAttrs ?? ''}`)
            html = html.replace('</head>', `${head}</head>`)
            html = html.replace('<body', `<body ${appContext.teleports?.bodyAttrs ?? ''}`)
            html = html.replace('</body>', `${appContext.teleports?.body ?? ''}${footer}</body>`)
            html = html.replace('<div id="app"></div>', `<div id="app">${appHtml}</div>`)
            res.send(html)
        }),
    },
})

export default server
