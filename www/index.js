/**
 * @name 本地開發node服務 web应用程序服务端初始化
 * @description  
 *      使用express作为服务端程序，
 *      用於提供react開發環境使用     
 */

// 依赖引入
var express = require('express')
var webpack = require('webpack')
var configs = require('../packages/configs');
var open = require('open');
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var mockMiddleware = require('./filters/mock');

var port = 3003;
// 创建一个网站服务
var app = new express()
// 创建一个webpack编译器
var compiler = webpack(require('../build/webpack/webpack.js'))

// 添加webpack打包服务中间件到app中
app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  stats:compiler.options.stats,
  publicPath: compiler.options.output.publicPath
}))
// 添加webpack热部署中间件到app中
app.use(webpackHotMiddleware(compiler))
//mock服务
app.all('/mock/*', mockMiddleware({ url: configs.baseApi }))

// 开始监听指定端口
const server = app.listen(port, (err) => {
  if (err) {
    console.error('Sorry has a error occur!')
    console.error(err)
  } else {
    let port = server.address().port
    var url = 'http://localhost:' + port;
    open(url, 'chrome');
    console.log('--------------------------')
    console.log('===> 😊  Starting Pendragon ...')
    console.log('===>  Environment: ' + process.env.NODE_ENV || 'development')
    console.log('===>  Listening on port: ' + port)
    console.log('===>  Url: ' + url)
    console.log('--------------------------')
  }
})