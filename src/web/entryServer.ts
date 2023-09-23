import { readFileSync } from 'node:fs'
import { renderToString } from '@vue/server-renderer'
import { SpaServer } from 'puppeteer-prerender-plugin'
import { renderMetaToString } from 'vue-meta/ssr'
import { VueSsrAssetRenderer } from 'vue-ssr-assets-plugin'
import { fetchProjects } from '@/api/services/fetchProjects'
import { HydrationKey, saveStateToDom } from './client/utils/hydration'
import { createVueApp } from './createVueApp'
import { AppContext } from './AppContext'
import { createAsyncHandler } from '@/api/utils/createAsyncHandler'
import { fetchBlogPosts } from '@/api/services/fetchBlogPosts'

const assetRenderer = new VueSsrAssetRenderer(DEFINE.SSG_MANIFEST_FILE)
const htmlTemplate = readFileSync(DEFINE.SSG_HTML_TEMPLATE).toString('utf-8')

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
