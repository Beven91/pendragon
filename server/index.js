/**
 * 名称：本地開發node服務 web应用程序服务端初始化
 * 描述：
 *      使用express作为服务端程序，
 *      用於提供react開發環境使用     
 */

// 依赖引入
var path = require('path');
var ejs = require('ejs');
var express = require('express')
var webpack = require('webpack')
var childProcess = require('child_process')
var Npm = require('npm-shell');
var AssetsPlugin = require('../build/webpack/plugins/assets');
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')

var port = 3003;
// 创建一个网站服务
var app = new express()
// 创建一个webpack编译器
var compiler = new webpack(require('../build/webpack/webpack.js'))

new Npm().run("link")
// 添加webpack打包服务中间件到app中
app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: compiler.options.output.publicPath
}))
// 添加webpack热部署中间件到app中
app.use(webpackHotMiddleware(compiler))
//添加接口代理 用于fetch跨域支持 当服务端不支持CORS时，可以使用此方案
app.use(require('./handlers/proxy'))
//设置视图引擎
app.set('views', path.resolve('server/views'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
//设置默认返回视图
app.use(function (req, resp, next) {
  resp.render('index', AssetsPlugin.getIndex());
})

// 开始监听指定端口
const server = app.listen(port, (err) => {
  if (err) {
    logger.error('Sorry has a error occur!')
    logger.error(err)
  } else {
    let port = server.address().port
    var accessUrl = 'http://localhost:' + port;
    console.log('--------------------------')
    console.log('===> 😊  Starting Pendragon ...')
    console.log('===>  Environment: ' + process.env.NODE_ENV || 'development')
    console.log('===>  Listening on port: ' + port)
    console.log('===>  Url: ' + accessUrl)
    console.log('--------------------------')
  }
})
