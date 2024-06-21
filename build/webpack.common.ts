import path from 'node:path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { VueLoaderPlugin } from 'vue-loader'
import { Configuration, DefinePlugin } from 'webpack'
import { merge } from 'webpack-merge'
import { buildConstants, isDev, publicPath, rawDirRegexp, srcDir } from './BuildConstants'

// ----------------------------------------------------------------------------
// Common
// ----------------------------------------------------------------------------

const commonConfig: Configuration = {
    mode: isDev
        ? 'development'
        : 'production',
    devtool: 'source-map',

    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json', 'scss', '.css'],
        alias: {
            // Need to match aliases in tsconfig.json
            '@': path.resolve(srcDir),
        },
    },

    plugins: [
        new DefinePlugin(buildConstants),
        new VueLoaderPlugin(),
    ],

    module: {
        rules: [
            {
                test: rawDirRegexp,
                type: 'asset/source',
            },
            {
                test: /\.(frag|vert)$/,
                type: 'asset/source',
            },
            {
                test: /\.tsx?$/,
                exclude: [
                    /node_modules/,
                    rawDirRegexp,
                ],
                use: [{
                    loader: 'esbuild-loader',
                    options: {
                        loader: 'ts',
                        target: 'es2021',
                    },
                }],
            },
            {
                test: /\.vue$/,
                use: [{
                    loader: 'vue-loader',
                }],
            },
            {
                test: /\.(svg)$/i,
                type: 'asset/source',
            },
            {
                test: /\.(csv)$/i,
                type: 'asset/source',
            },
        ],
    },
}

export const commonWebConfig = merge(commonConfig, {
    target: 'web',

    module: {
        rules: [
            {
                test: /\.(sass|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            additionalData: (content: string, loaderContext: { resourcePath: string }): string => {
                                return (loaderContext.resourcePath.endsWith('sass'))
                                    ? '@use "sass:math"\n @import "@/web/client/assets/css/variables.scss"\n' + content
                                    : '@use "sass:math";  @import "@/web/client/assets/css/variables.scss"; ' + content
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
            {
                test: /\.(ttf|eot|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                type: 'asset',
            },
            {
                test: /\.(jpe?g|png|gif|webp)$/i,
                use: [
                    {
                        loader: 'responsive-loader',
                        options: {
                            format: 'webp',
                            placeholder: true,
                            publicPath,
                        },
                    },
                ],
            },
        ],
    },
})

export const commonNodeConfig = merge(commonConfig, {
    target: 'node',

    output: {
        libraryTarget: 'commonjs2',
    },

    module: {
        rules: [
            {
                // Do not emit css in the server bundle
                test: /\.(css|sass|scss)$/,
                use: 'null-loader',
            },
            {
                // Do not emit fonts in the server bundle
                test: /\.(ttf|eot|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'null-loader',
            },
            {
                test: /\.(jpe?g|png|gif|webp)$/i,
                use: [
                    {
                        loader: 'responsive-loader',
                        options: {
                            format: 'webp',
                            placeholder: true,
                            publicPath,

                            // Do not emit images in the server bundle
                            emitFile: false,
                        },
                    },
                ],
            },
        ],
    },

    externals: [
        'express',
        'vue-ssr-assets-plugin',
        'puppeteer-prerender-plugin',
        'jsdom',
    ],
})
