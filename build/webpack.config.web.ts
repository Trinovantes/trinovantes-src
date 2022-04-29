import path from 'path'
import { merge } from 'webpack-merge'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import { staticDir, srcWebDir, distWebDir, distWebPublicDir, publicPath, manifestFilePath, commonWebConfig, isDev } from './webpack.common'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { Configuration } from 'webpack'
import SitemapPlugin from 'sitemap-webpack-plugin'
import { prerenderRoutes } from './utils/routes'
import { VueSsrAssetsClientPlugin } from 'vue-ssr-assets-plugin'
import 'webpack-dev-server'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

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
