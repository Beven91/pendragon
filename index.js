/**
 * 名称：本地開發node服務 web应用程序服务端初始化
 * 描述：
 *      使用express作为服务端程序，
 *      用於提供react開發環境使用     
 */

// 依赖引入
var path = require('path');
var childProcess = require('child_process')
var express = require('express')
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')

var port = 3000;
// 创建一个网站服务
var app = new express()
// 创建一个webpack编译器
var compiler = new webpack(require('./build/webpack.js'))

// 添加webpack打包服务中间件到app中
app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: compiler.options.output.publicPath
}))
// 添加webpack热部署中间件到app中
app.use(webpackHotMiddleware(compiler))

app.use(function (req, resp, next) {
    resp.sendFile(path.resolve('index.html'));
})

// 开始监听指定端口
const server = app.listen(3000, (err) => {
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
