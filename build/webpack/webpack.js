/**
 * 名称：Webpack打包客户端
 * 描述：用于进行客户端代码打包
 */

var path = require('path')
var webpack = require('webpack')
var config = require('../../.package');
var autoprefixer = require('autoprefixer');
var pxtorem = require('postcss-pxtorem');

//是否為生產環境
var isProudction = process.env.NODE_ENV === 'production'

// Webpack 插件
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
var RuntimeCapturePlugin = require('./plugins/capture.js');
var AssetsPlugin  =require('./plugins/assets');
var CleanWebpackPlugin = require('clean-webpack-plugin')
var ProgressBarPlugin = require('progress-bar-webpack-plugin')
var CodeSpliterPlugin = require('webpack-code-spliter').CodeSpliterPlugin;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
//初始化代碼拆分
var CodeSplit = CodeSpliterPlugin.configure(config.splitRoutes, null, 'pages', config.splitWrapper);

// 开发环境plugins
var devPlugins = [
    new webpack.HotModuleReplacementPlugin()
]

// 生产环境plugins
var proPlugins = [
    new CleanWebpackPlugin('**/*.*', { root: config.releaseDir }),
    new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false
    }),
    new AssetsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
        compressor: {
            warnings: false
        },
        sourceMap: true
    })
]

module.exports = {
    devtool: isProudction ? 'source-map' : 'source-map',
    name: 'pendragon',
    context: path.dirname(config.entry),
    stats: isProudction ? 'errors-only' : 'detailed',
    entry: {
        app: [
            'babel-polyfill',
            'react',
            'react-dom',
            'react-navigation',
            'dantejs',
            'hanzojs/mobile',
            'redux-thunk',
            'redux-promise-middleware',
            'hanzojs/router',
            'whatwg-fetch',
            'prop-types',
            './components/base',
            './' + path.basename(config.entry),
            isProudction ? null : 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'
        ].filter(function (v) { return v; })
    },
    output: {
        path: config.releaseDir,
        filename: '[name].js',
        chunkFilename: '[name].js',
        publicPath: config.publicPath
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: JSON.stringify(isProudction ? 'production' : 'development') }
        }),
        new ProgressBarPlugin(),
        new ExtractTextPlugin({ filename: '[name].css', allChunks: true }),
        new RuntimeCapturePlugin(),
        new CodeSpliterPlugin(isProudction ? config.releaseDir : null,false),
        new webpack.optimize.CommonsChunkPlugin('app'),
        new webpack.NoEmitOnErrorsPlugin(),
    ].concat(isProudction ? proPlugins : devPlugins),
    module: {
        loaders: [
            {
                // jsx 以及js
                test: /\.js$|\.jsx$/,
                loader: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: config.babelrc.presets,
                            plugins: config.babelrc.plugins
                        }
                    }
                ],
                exclude: []
            },
            {
                // jsx 以及js
                test: /\.js$|\.jsx$/,
                include: CodeSplit.includes,
                loader: [
                    {
                        loader: CodeSplit.loader,
                        options: CodeSplit.options
                    },
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: config.babelrc.presets,
                            plugins: config.babelrc.plugins
                        }
                    }
                ],
                exclude: []
            },
            {
                // 图片类型模块资源访问
                test: /\.(png|jpg|jpeg|gif|webp|bmp|ico|jpeg)$/,
                loader: [
                    {
                        loader: 'file-loader',
                        options:{
                            name:'./images/[hash].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(svg)$/i,
                loader: 'web-svg-sprite-loader',
                include: [
                    path.resolve('node_modules/antd-mobile')
                ]
            },
            {
                test: /\.css$|\.less$/i,
                use: ['css-hot-loader'].concat(
                    ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: [
                            'css-loader', {
                                loader: 'postcss-loader', options: {
                                    ident: 'postcss',
                                    plugins: () => [
                                        autoprefixer({
                                            browsers: ['iOS >= 8', 'Android >= 4'],
                                        }),
                                        pxtorem({ rootValue: 37.5, propWhiteList: [] })
                                    ]
                                }
                            }
                        ]
                    }))
            },
            {
                // url类型模块资源访问
                test: new RegExp('\\' + config.static.join('$|\\') + '$'),
                loader: 'url-loader',
                query: {
                    name: '[hash].[ext]',
                    limit: 10000
                }
            },
            {
                // json类型模块处理
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    resolve: {
        alias: {
            'hanzojs/mobile': 'hanzojs-follower/mobile',
            'hanzojs/router': path.resolve('app/components/navigator/index.js'),
        },
        extensions: ['.web.js', ".js"]
    }
}