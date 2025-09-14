import CopyWebpackPlugin from 'copy-webpack-plugin'
import { VueSsrAssetsServerPlugin } from 'vue-ssr-assets-plugin'
import type { Configuration } from 'webpack'
import { merge } from 'webpack-merge'
import { srcWebDir, distSsgDir, distSsgTemplate, srcWebTemplate, distWebDir, prerenderRoutes } from './BuildConstants.ts'
import { commonNodeConfig } from './webpack.common.ts'
import { PuppeteerPrerenderPlugin } from 'puppeteer-prerender-plugin'

// ----------------------------------------------------------------------------
// Server
// ----------------------------------------------------------------------------

export default (async (): Promise<Configuration> => merge(commonNodeConfig, {
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
            entryFile: 'www.cjs',
            outputDir: distWebDir,
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
