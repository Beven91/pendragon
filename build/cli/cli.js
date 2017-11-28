/**
 * 名称：本地cli工具
 * 日期：2017-11-07
 * 描述：用于辅助开发，提供相关构建任务
 */

// 引入依赖>>
var path = require('path')
var fs = require('fs');
var dantejs = require('dantejs');
var logger = require('./helpers/logger.js');
var Templater = require('./helpers/templater.js');

// 构建任务黑名单
var blackList = ['run']

/**
 * CLI 构造函数
 */
function Archer() {
}

/**
 * 返回一个调用sherlockcli指定任务的函数
 * @param name  要返回的任务名称
 */
Archer.prototype.run = function (name) {
  if (blackList.indexOf(name) > -1) {
    throw new Error(name + ' is not suported')
  }
  var handler = this[name]
  if (typeof handler == 'function') {
    return handler.bind(this)
  } else {
    throw new Error(name + ' is not suported')
  }
}

/**
 * 新建一个hanzojs业务模块 
 * @param name {String} 业务名称
 */
Archer.prototype.create = function (name) {
  var dir = path.join(__dirname, '..', 'app', 'modules', name);
  if (!name) {
    return logger.log('请输入业务名称，例如: user/login 或者 trade ')
  } else if (fs.existsSync(dir)) {
    return logger.log('模块: ' + name + ' 已存在');
  }
  name = name.replace(/\\/g, '/').toLowerCase();
  var compiler = new Templater(path.join(__dirname, 'tmpl', 'module'), dir);
  var compileOptions = {
    api:this.relative(dir, path.resolve('app/api')),
    rb: this.relative(path.join(dir, 'views'), path.resolve('app/components/base')),
    name: this.toCamel(name),
    namespace: name,
    state: name.split('/').join('.')
  }
  compiler.compileTo('action.js', 'action.js', compileOptions);
  compiler.compileTo('index.js', 'index.js', compileOptions);
  compiler.compileTo('model.js', 'model.js', compileOptions);
  compiler.compileTo('views/index.js', 'views/index.js', compileOptions);
}

Archer.prototype.relative= function(dir,src){
  return  path.relative(dir, src).replace(/\\/g, '/');
}

Archer.prototype.toCamel = function (name) {
  var paths = name.split('/');
  var newName = '';
  var segments = [];
  paths.forEach(function (p) {
    segments = segments.concat(p.split('-'))
  })
  segments.forEach(function (segment) {
    newName = newName + dantejs.String.toCamel(segment);
  })
  return newName;
}

// 公布cli
module.exports = new Archer()
