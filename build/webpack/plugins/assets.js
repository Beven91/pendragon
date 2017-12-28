/**
 * 名称：发布完毕后复制其他资源的定制插件
 * 日期：2017-11-28
 * 描述：定义静态资源发布
 */
var fs = require('fs');
var path = require('path');
var ejs = require('ejs');
var config = require('../../../.package.js');

/**
 * 插件构造函数
 */
function AssetsPlugin() {
}

/**
 * 插件执行入口
 */
AssetsPlugin.prototype.apply = function (compiler) {
  var handle = this.handle.bind(this);
  compiler.plugin('emit', function (compilation, callback) {
    handle();
    callback()
  })
}

/**
 * 执行自定义编译流程
 */
AssetsPlugin.prototype.handle = function () {
  this.compileIndex();
  this.copyAssets();
}

/**
 * 编译index.html
 */
AssetsPlugin.prototype.compileIndex = function () {
  var index = path.resolve('server/views/index.html');
  var target = path.resolve(config.releaseDir, 'index.html');
  this.compile(index, target, AssetsPlugin.getIndex());
}

/**
 * 获取编译index.html的数据
 * 
 */
AssetsPlugin.getIndex = function (isReturnContent) {
  var target = path.resolve(config.releaseDir, 'index.html');
  var data = Object.assign({
    env: process.env.NODE_ENV
  }, config);
  return data;
}

/**
 * 编译指定文件到指定目录
 * @param {String} file 要编译的文件
 * @param {String} target 编译到的目标目录
 * @param {Object} data 编译上下文数据
 * @param {boolean} isReturnContent  是否仅返回编译后的内容，不生成物理文件
 */
AssetsPlugin.prototype.compile = function (file, target, data, isReturnContent) {
  var innerHTML = String(fs.readFileSync(file));
  var dir = path.dirname(target);
  innerHTML = ejs.compile(innerHTML)(data);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  if (isReturnContent) {
    return innerHTML;
  } else {
    fs.writeFileSync(target, innerHTML);
  }
}

/**
 * 复制资源
 */
AssetsPlugin.prototype.copyAssets = function () {

}

module.exports = AssetsPlugin;