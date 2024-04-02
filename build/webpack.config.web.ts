import path from 'node:path'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import SitemapPlugin from 'sitemap-webpack-plugin'
import { VueSsrAssetsClientPlugin } from 'vue-ssr-assets-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import 'webpack-dev-server'
import { merge } from 'webpack-merge'
import { Configuration } from 'webpack'
import { srcWebDir, distWebPublicDir, publicPath, isDev, entryFile, distWebDir, prerenderRoutes, distSsgManifest, srcWebStaticDir, distWebEntryFile } from './BuildConstants'
import { commonWebConfig } from './webpack.common'
import { isAnalyze } from './BuildSecret'

// ----------------------------------------------------------------------------
// Web
// ----------------------------------------------------------------------------

export default (async(): Promise<Configuration> => merge(commonWebConfig, {
    target: 'web',

    entry: {
        main: path.resolve(srcWebDir, 'entryClient.ts'),
    },

    output: {
        path: distWebPublicDir,
        publicPath,
        filename: isDev
            ? '[name].js'
            : '[name].[contenthash].js',
    },

    devServer: {
        port: 9000,
        devMiddleware: {
            index: entryFile,
            writeToDisk: (filePath) => {
                // Since output.publicPath is '/public', app.html can only be accessed at /public/index.html
                // Instead, we need to write it to disk and have webpack-dev-server serve it from '/' (contentBasePublicPath)
                return filePath.endsWith('.html')
            },
        },
        historyApiFallback: {
            index: entryFile,
        },
        static: [
            {
                directory: distWebDir,
                publicPath: '/',
            },
            {
                // CopyWebpackPlugin does not run during dev mode
                directory: srcWebStaticDir,
                publicPath: '/',
            },
        ],
        proxy: [
            {
                context: ['/api'],
                target: 'http://localhost:3000',
            },
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(srcWebDir, 'index.html'),
            filename: distWebEntryFile,
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: srcWebStaticDir,
                    to: distWebDir,
                },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: isDev
                ? '[name].css'
                : '[name].[contenthash].css',
        }),
        new SitemapPlugin({
            base: 'https://www.stephenli.ca',
            paths: await prerenderRoutes,
            options: {
                filename: '../sitemap.xml',
            },
        }),
        new VueSsrAssetsClientPlugin({
            fileName: distSsgManifest,
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: isAnalyze()
                ? 'server'
                : 'disabled',
        }),
    ],
}))()
