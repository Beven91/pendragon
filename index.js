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
var proxyPool = require('./proxy');
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')

var port = 3003;
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

//添加接口代理
app.use((req, resp, next) => {
    if (req.headers['x-p'] === "fetch") {
        const proxyUrl = 'http://rapapi.org/mockjsdata/28825' + req.path;
        req.baseUrl = proxyUrl;
        req.originalUrl = proxyUrl;
        req.url = proxyUrl;
        proxyPool
            .createProxy(proxyUrl)
            .then((proxy) => proxy.web(req, resp, {}, (ex, a, b, c) => next(ex)))
            .catch((ex) => next(ex));
    } else {
        next();
    }
})

//设置静态目录
app.use(express.static(path.resolve('dist')));

//设置默认返回视图
app.use(function (req, resp, next) {
    resp.sendFile(path.resolve('index.html'));
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
