import CopyWebpackPlugin from 'copy-webpack-plugin'
import { VueSsrAssetsServerPlugin } from 'vue-ssr-assets-plugin'
import { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import { srcWebDir, distSsgDir, distSsgTemplate, srcWebTemplate, distWebDir, prerenderRoutes } from './BuildConstants'
import { commonNodeConfig } from './webpack.common'
import { PuppeteerPrerenderPlugin } from 'puppeteer-prerender-plugin'

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
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: srcWebTemplate,
                    to: distSsgTemplate,
                },
            ],
        }),
        new VueSsrAssetsServerPlugin(),
        new PuppeteerPrerenderPlugin({
            enabled: true,
            enablePageJs: false,
            entryDir: distSsgDir,
            entryFile: 'www.js',
            outputDir: distWebDir,
            routes: [
                '/404',
                ...await prerenderRoutes,
            ],
            renderFirstRouteAlone: true,
            puppeteerOptions: {
                headless: 'new',
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ],
            },
        }),
    ],
}))()
