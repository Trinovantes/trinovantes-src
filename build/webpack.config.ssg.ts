import path from 'path'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import { PuppeteerPrerenderPlugin } from 'puppeteer-prerender-plugin'
import { VueSsrAssetsServerPlugin } from 'vue-ssr-assets-plugin'
import { Configuration, DefinePlugin } from 'webpack'
import { merge } from 'webpack-merge'
import { prerenderRoutes } from './utils/prerenderRoutes'
import { srcWebDir, publicPath, manifestFilePath, distWebPublicDir, distSsgDir, commonNodeConfig, entryFilePath, distWebDir, htmlTemplatePath } from './webpack.common'

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
                    from: path.resolve(srcWebDir, 'index.html'),
                    to: htmlTemplatePath,
                },
            ],
        }),
        new DefinePlugin({
            'DEFINE.ENTRY_FILE': JSON.stringify(path.relative(distWebPublicDir, entryFilePath)),
            'DEFINE.PUBLIC_DIR': JSON.stringify(distWebPublicDir),
            'DEFINE.PUBLIC_PATH': JSON.stringify(publicPath),
            'DEFINE.MANIFEST_FILE': JSON.stringify(manifestFilePath),
            'DEFINE.HTML_TEMPLATE': JSON.stringify(htmlTemplatePath),
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
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ],
            },
        }),
    ],
}))()
