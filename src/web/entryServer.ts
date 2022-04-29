import { SpaServer } from 'puppeteer-prerender-plugin'
import express from 'express'
import { AppContext, createApp } from './app'
import { renderMetaToString } from 'vue-meta/ssr'
import { renderToString } from '@vue/server-renderer'
import { VueSsrAssetRenderer } from 'vue-ssr-assets-plugin'
import { fetchProjects } from '@/api/services/fetchProjects'
import { HydrationKey, saveStateToDom } from './utils/hydration'
import { getBlogPosts } from './pages/Blog/getBlogPosts'

function createAsyncHandler(handler: (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>): express.RequestHandler {
    return (req, res, next) => {
        handler(req, res, next).catch(next)
    }
}

const assetRenderer = new VueSsrAssetRenderer(DEFINE.MANIFEST_FILE)

const server = new SpaServer({
    entryFile: DEFINE.ENTRY_FILE,
    staticDir: DEFINE.PUBLIC_DIR,
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

            const { app, router } = await createApp(appContext)
            if (router.currentRoute.value.fullPath !== url) {
                res.redirect(router.currentRoute.value.fullPath)
                return
            }

            const appHtml = await renderToString(app, appContext)
            await renderMetaToString(app, appContext)
            const { header, footer } = assetRenderer.renderAssets(appContext._matchedComponents)

            res.setHeader('Content-Type', 'text/html')
            res.status(200)
            res.send(`
                <!DOCTYPE html ${appContext.teleports?.htmlAttrs ?? ''}>
                <html lang="en">
                <head ${appContext.teleports?.headAttrs ?? ''}>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <link rel="icon" type="image/png" href="/favicon.png">
                    <link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet">
                    <script>
                        ${saveStateToDom(HydrationKey.BlogPosts, appContext.blogPosts)};
                        ${saveStateToDom(HydrationKey.Projects, appContext.projects)};
                    </script>
                    ${header}
                    ${appContext.teleports?.head ?? ''}
                </head>
                <body ${appContext.teleports?.bodyAttrs ?? ''}>
                    <noscript><span class="noscript">This website requires JavaScript</span></noscript>
                    <div id="app">${appHtml}</div>
                    ${appContext.teleports?.body ?? ''}
                    ${footer}
                </body>
                </html>
            `)
        }),
    },
})

export default server
