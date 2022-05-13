import path from 'path'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import SitemapPlugin from 'sitemap-webpack-plugin'
import { VueSsrAssetsClientPlugin } from 'vue-ssr-assets-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import 'webpack-dev-server'
import { merge } from 'webpack-merge'
import { prerenderRoutes } from './utils/prerenderRoutes'
import { staticDir, srcWebDir, distWebDir, distWebPublicDir, publicPath, manifestFilePath, commonWebConfig, isDev } from './webpack.common'
import type { Configuration } from 'webpack'

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
        devMiddleware: {
            index: 'app.html',
            writeToDisk: (filePath) => {
                // Since output.publicPath is '/public', app.html can only be accessed at /public/index.html
                // Instead, we need to write it to disk and have webpack-dev-server serve it from '/' (contentBasePublicPath)
                return filePath.endsWith('.html')
            },
        },
        historyApiFallback: {
            index: 'app.html',
        },
        static: [
            {
                directory: distWebDir,
                publicPath: '/',
            },
            {
                directory: staticDir,
                publicPath: '/',
            },
        ],
        proxy: {
            '/api': 'http://localhost:3000',
        },
    },

    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: staticDir,
                    to: distWebDir,
                    noErrorOnMissing: true,
                },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: isDev
                ? '[name].css'
                : '[name].[contenthash].css',
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(srcWebDir, 'index.html'),
            filename: path.resolve(distWebDir, 'app.html'),
        }),
        new SitemapPlugin({
            base: 'https://www.stephenli.ca',
            paths: await prerenderRoutes,
            options: {
                filename: path.join(path.relative(distWebPublicDir, distWebDir), 'sitemap.xml'),
            },
        }),
        new VueSsrAssetsClientPlugin({
            fileName: manifestFilePath,
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'disabled',
            generateStatsFile: false,
        }),
    ],
}))()
