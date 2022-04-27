import path from 'path'
import { merge } from 'webpack-merge'
import { srcWebDir, publicPath, manifestFilePath, distWebPublicDir, distWebDir, distSsgDir, commonNodeConfig, entryFilePath } from './webpack.common'
import { PuppeteerPrerenderPlugin } from 'puppeteer-prerender-plugin'
import { Configuration, DefinePlugin } from 'webpack'
import { prerenderRoutes } from './utils/routes'
import { VueSsrAssetsServerPlugin } from 'vue-ssr-assets-plugin'

// ----------------------------------------------------------------------------
// Server
// ----------------------------------------------------------------------------

export default (async(): Promise<Configuration> => merge(commonNodeConfig, {
    entry: {
        www: `${srcWebDir}/entryServer.ts`,
    },

    output: {
        path: distSsgDir,
    },

    plugins: [
        new DefinePlugin({
            'DEFINE.ENTRY_FILE': JSON.stringify(path.relative(distWebPublicDir, entryFilePath)),
            'DEFINE.PUBLIC_DIR': JSON.stringify(distWebPublicDir),
            'DEFINE.PUBLIC_PATH': JSON.stringify(publicPath),
            'DEFINE.MANIFEST_FILE': JSON.stringify(manifestFilePath),
        }),
        new VueSsrAssetsServerPlugin(),
        new PuppeteerPrerenderPlugin({
            enabled: true,
            enablePageJs: false,
            entryDir: distWebDir,
            entryFile: path.resolve(distSsgDir, 'www.js'),
            routes: [
                '/404',
                ...await prerenderRoutes,
            ],
            renderFirstRouteAlone: true,
            puppeteerOptions: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ],
            },
        }),
    ],
}))()
