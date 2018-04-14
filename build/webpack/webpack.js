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
var CleanWebpackPlugin = require('clean-webpack-plugin')
var AutoDllPlugin = require('autodll-webpack4-plugin');
var CodeSpliterPlugin = require('webpack-code-spliter').CodeSpliterPlugin;
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var HtmlWebpackPlugin  = require('html-webpack-plugin');
var ConflictPlugin = require('./plugins/conflict');
//初始化代碼拆分
var CodeSplit = CodeSpliterPlugin.configure(config.splitRoutes, null, 'pages', config.splitWrapper);

// 开发环境plugins
var devPlugins = [
  new AutoDllPlugin({ inject: true }),
  new webpack.HotModuleReplacementPlugin()
]

// 生产环境plugins
var proPlugins = [
  new CleanWebpackPlugin('*', { root: config.releaseDir }),
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    openAnalyzer: false
  })
]

module.exports = {
  devtool: 'source-map',
  name: 'pendragon',
  mode: isProudction ? 'production' : 'development',
  stats: isProudction ? 'errors-only' : { chunks: false, assets: false, modules: false },
  context: path.dirname(config.entry),
  entry: {
    app: [
      isProudction ? null : 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
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
      './' + path.basename(config.entry)
    ].filter(function (v) { return v; })
  },
  output: {
    path: config.releaseDir,
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: config.publicPath
  },
  optimization: {
    splitChunks: {
      name: isProudction ? 'app' : true,
      chunks: 'initial'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__ : JSON.stringify(isProudction),
    }),
    new HtmlWebpackPlugin({
      filename:'index.html',
      template:path.resolve('www/views/index.cshtml')
    }),
    new ConflictPlugin(),
   // new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new RuntimeCapturePlugin(),
    new CodeSpliterPlugin(isProudction ? config.releaseDir : null, false)
  ].concat(isProudction ? proPlugins : devPlugins),
  module: {
    rules: [
      {
        // jsx 以及js
        test: /\.js$|\.jsx$/,
        include: [
          /app/,
          /hanzojs/,
          /react-navigation/,
        ],
        loader: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: config.babelrc.presets,
              plugins: config.babelrc.plugins
            }
          }
        ]
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
              cacheDirectory: true,
              presets: config.babelrc.presets,
              plugins: config.babelrc.plugins
            }
          }
        ]
      },
      {
        // 图片类型模块资源访问
        test: /\.(png|jpg|jpeg|gif|webp|bmp|ico|jpeg)$/,
        loader: [
          // (
          //   isProudction ?
          //     {
          //       loader: 'image-web-loader',
          //       options: config.minOptions
          //     }
          //     :
          //     undefined
          // ),
          {
            loader: 'file-loader',
            options: {
              name: './images/[hash].[ext]'
            }
          }
        ].filter(function (v) { return !!v })
      },
      {
        test: /\.(svg)$/i,
        loader: 'web-svg-sprite-loader',
        include: [
          path.resolve('node_modules/antd-mobile')
        ]
      },
      {
        test: /\.(css|scss)$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
          {
            loader: 'postcss-loader',
            options: {
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
      },
      {
        // url类型模块资源访问
        test: new RegExp('\\' + config.static.join('$|\\') + '$'),
        loader: 'url-loader',
        query: {
          name: '[hash].[ext]',
          limit: 10000
        }
      }
    ],
    noParse: function (content) {
      return /whatwg-fetch/.test(content);
    },
  },
  resolve: {
    alias: {
      'hanzojs/mobile': 'hanzojs-follower/mobile',
      'react-navigation': require.resolve('react-navigation/src/react-navigation.web.js'),
      'hanzojs/router': path.resolve('app/components/navigator/index.js'),
    },
    extensions: ['.web.js', ".js"]
  }
}