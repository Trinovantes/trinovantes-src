import path from 'path'
import { merge } from 'webpack-merge'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import { staticDir, srcWebDir, distWebDir, distWebPublicDir, publicPath, manifestFilePath, commonWebConfig } from './webpack.common'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { Configuration } from 'webpack'
import { WebpackManifestPlugin } from 'webpack-manifest-plugin'
import SitemapPlugin from 'sitemap-webpack-plugin'
import { prerenderRoutes } from './routes'
import { createOutputNameFn } from './createOutputNameFn'
import 'webpack-dev-server'

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
        filename: createOutputNameFn('js', true),
        chunkFilename: createOutputNameFn('js', false),
    },

    optimization: {
        chunkIds: 'named',
        splitChunks: {
            chunks: 'all',
            minSize: 0,
        },
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
            filename: createOutputNameFn('css', true),
            chunkFilename: createOutputNameFn('css', false),
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(srcWebDir, 'index.html'),
            filename: path.resolve(distWebDir, 'app.html'),
        }),
        new WebpackManifestPlugin({
            fileName: manifestFilePath,
        }),
        new SitemapPlugin({
            base: 'https://www.stephenli.ca',
            paths: await prerenderRoutes,
        }),
    ],
}))()
