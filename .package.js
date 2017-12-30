var path = require('path');
var fs = require('fs');


module.exports = {
    //网站访问路径前缀 例如 /static
    publicPath: '',
    //打包发布的目标目录
    releaseDir: path.resolve('dist'),
    //入口文件
    entry: path.resolve('app/index.js'),
    //靜態資源
    static: [
        '.psd', // Image formats
        '.m4v', '.mov', '.mp4', '.mpeg', '.mpg', '.webm', // Video formats
        '.aac', '.aiff', '.caf', '.m4a', '.mp3', '.wav', // Audio formats
        '.html', '.pdf', // Document formats
        '.woff', '.woff2', '.woff', '.woff2', '.eot', '.ttf', //icon font
    ],
    //圖片壓縮配置
    minOptions: {
        onlyWeb: true,
        contextName: '',
        gifsicle: {
            interlaced: false
        },
        optipng: {
            optimizationLevel: 7
        },
        pngquant: {
            quality: '65-90',
            speed: 4
        },
        mozjpeg: {
            progressive: true,
            quality: 65
        }
    },
    //babelrc
    babelrc: {
        presets: ["react-native"],
        plugins: [
            //"transform-runtime",
            ["transform-react-remove-prop-types", {
                "mode": "wrap",
                "ignoreFilenames": ["node_modules"]
            }],
            ["import", [{ "libraryName": "antd-mobile", style: "css" }]]
        ]
    },
    //代碼拆分配置
    splitRoutes: splitRoutes(),
    /**
     * 处理hanzojs App.use 异步拆分处理
     */
    splitWrapper: function (exports, abspath) {
        var code = String(fs.readFileSync(abspath));
        var views = code.match(/(\w|\d)*:\s*connect/gi) || [];
        views = views.map(function (view) { return view.split(':').shift(); })
        return 'function(callback){ return callback(' + exports + ', ' + JSON.stringify(views) + '); }';
    },

}


/**
 * 搜索 app/modules目录下需要拆分的文件列表
 * @param {String} modules 存放搜索到的文件的数组
 */
function splitRoutes(modules) {
    return searchRoutes(path.resolve('app/modules'), path.resolve(''), modules);
}

/**
 * 递归搜索指定目录下的需要拆分的文件
 * @param {String} searchDir 搜索目录 
 * @param {String} baseDir 基础目录
 * @param {String} modules 存放搜索到的文件的数组 可以不传递
 */
function searchRoutes(searchDir, baseDir, modules) {
    modules = modules || [];
    fs.readdirSync(searchDir)
        .forEach(function (name) {
            var dir = path.resolve(searchDir, name);
            var index = path.join(dir, 'index.js');
            if (fs.existsSync(index)) {
                modules.push(path.relative(baseDir, index));
            } else if (fs.lstatSync(dir).isDirectory()) {
                searchRoutes(dir, baseDir, modules);
            }
        });
    return modules;
}