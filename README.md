### 开始上手

#### 开发环境配置
- 配置本地dns域名 可以配置 `*.test.pajk.cn` 
- mac电脑修改`etc/hosts` 添加域名例如: 127.0.0.1 dev.test.pajk.cn
- windows电脑 修改  `C:\WINDOWS\system32\drivers\etc\hosts` 添加域名例如: 127.0.0.1 dev.test.pajk.cn
#### 安装依赖(切换到项目更目录)
  `npm install`
    
#### 启动项目
  `npm start`
  
  
#### 环境登录

> 使用以下登录地址，可以写入对应环境的登录态cookie从而实现浏览器调试

- 开发环境登录[`http://buy.test.pajk.cn/product.html`](http://buy.test.pajk.cn/product.html?id=20014242&code=E12345678901&shelvesId=1061&showhcode=true&showDetail=true&skuId=911911888305498#/product#5cfe6a1ee82f16120fb2ffc0f646bf1d)
  
- 测试环境登录[`http://buy.test.pajk.cn/product.html`](http://buy.test.pajk.cn/product.html?id=20014242&code=E12345678901&shelvesId=1061&showhcode=true&showDetail=true&skuId=911911888305498#/product#5cfe6a1ee82f16120fb2ffc0f646bf1d)
  
- 预发布环境登录[`http://buy.pre.jk.cn/product.html`](http://buy.pre.jk.cn/product.html?id=20014242&code=E12345678901&shelvesId=1061&showhcode=true&showDetail=true&skuId=911911888305498#/product#5cfe6a1ee82f16120fb2ffc0f646bf1d)
  
- 生产环境登录[`http://buy.jk.cn/product.html`](http://buy.jk.cn/product.html?id=20014242&code=E12345678901&shelvesId=1061&showhcode=true&showDetail=true&skuId=911911888305498#/product#5cfe6a1ee82f16120fb2ffc0f646bf1d)
    
### 关于构建流程

> diablo-h5-user主要的构建工具是自定义的构建工具(`app.js`) + `gulp`组合实现 目前 构建流程如下

- 清除目标目录`dist`
- 开始构建(执行:`node app.js —build`）
- 合并配置(global.json,config.json,vote/config.json)
- 编译js库以及编译所有页面js
- 编译样式(scss编译  从配置:global.json.css)
- 编译模板页面(index.html redirect.html vote.html ..)
- 复制静态资源 (copy share.html xxx)
- 执行glup (build rev revCollector) 对`dist`目录下的js与css进行hash命名
### 关于global.json与config.json
> global.json
```js
    
    {
    //开发express站点端口
    {
    "port": 7788,
    /**
      js打包的模块的搜索目录 
      例如: 
      当path配置为['./js','./app/js']
      压缩合并打包的js配置为:{
          "framework":{
             "graphics/tween":"./graphics/tween"
          }
      }
      在查找 ./graphics/tween模块时，会从以下两个目录搜索
      ./js/graphics/tween.js
      ./js/graphics/tween.jsx
      ./app/js/graphics/tween.js
      ./app/js/graphics/tween.jsx
    */
    {
    "path": [
        "./js",
        "./"
    ],
    //打包发布的目标目录
    "dist": "./dist",
    //要压缩合并的css文件
    "css": {
        //将配置的所有scss或者css文件压缩为 dist/css/app.css 
        "css/app": [
            /**
              默认后缀名为['.scss','css'] 
              例如: 
                  sass/app.scss 
                  sass/app.css
             */
            "sass/app"
        ]
    },
    //打包合并js配置
    "js": {
         //合并配置的js到framework.js
         "framework": {
             //模块名称:"模块路径"
             //默认查找后缀: ['.js','.jsx']
            "graphics/tween": "./graphics/tween",
            "util/promise":"./util/promise",
        },
        //合并配置的js到entrance.js 
        "entrance": {
            "core/Application": "./core/application",
            "entrance": "./entrance"
        }
        //其他以此类推...
    },
    //要复制的静态资源目录
    //默认复制以下后缀的文件 jpg|svg|png|gif|eot|ttf|woff
    "resources": {
        "img": "./img",
    },
    //工程路由配置
    //默认会搜索配置目录下的config.json
    //例如: 
    //    ./config.json
    //    ./vote/config.json
    // config.json 跟global.json类似的配置
    "projects": [
        "./",
        "./vote"
    ]
}
```
> config.json
```js
{
    "css": {},
    "js": {},
    // 路由配置 默认会打包成pack.js
    "route": {
        //格式:    hash:views/DoctorChoosed.react
        //当 访问 local.test.pajk.cn/diablo-h5-user/#/home时会展示 views/Redirection.react组件
        "/": "views/DoctorChoosed.react",
        "/home": "views/Redirection.react",
        "/redirect": "views/Redirection.react"
    }
}
```
###  关于运行流程
> 例如访问 : https://www.test.pajk.cn/diablo-h5-user/index.html#/records
- 1.引入`bridge.js`  (android.js ios.js)
- 2.初始化打点 引入: `beacon.js`
- 3.1 引入`framework.js`

- 3.2 初始化`seajs`  拦截`fetch` 映射配置
- 3.3 分流`sx-chat`   (location.hash chat/choose/doctor)
- 3.4 `pushAction` 处理
- 3.5 `entrance.js`
- 3.5.1 `application.js` 初始化 `application.start()` 
- 3.5.2 `application.js` `application.navigate(location.hash)` 导航组件根据hash渲染对应的React页面
- 4.进入`config.json`中配置的 `/records`对应的组件`views/Record.react` 
