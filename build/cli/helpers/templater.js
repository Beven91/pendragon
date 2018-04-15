/**
 * @name 简单模板编译工具
 * @date   2017-11-07
 * @description  使用$<name>$的形式进行模板编译
 */

//引入依赖>>
var fse = require('fs-extra');
var path = require('path');
var logger = require('./logger.js');

/**
 * 编译器构造函数
 * @param {String} tmplBase 模板读取基础路径
 * @param {String} targetBase 模板编译目标目录基础目录
 */
function TemplateCompiler(tmplBase, targetBase) {
  this.tmplBaseDir = tmplBase;
  this.targetBaseDir = targetBase;
}

/**
 * 将制定模板编译成目标文件
 * @param file {String} 模板文件路径 可以是绝对路径或者相对于tmplBase的相对路径
 * @param targetFile {String} 目标文件路径 可以是绝对路径或者相对于targetBase的相对路径
 * @param obj  {Object} 模板数据
 */
TemplateCompiler.prototype.compileTo = function (file, targetFile, obj) {
  var rootDir = process.cwd();
  if (!path.isAbsolute(file)) {
    file = path.join(this.tmplBaseDir, file);
  }
  if (!path.isAbsolute(targetFile)) {
    targetFile = path.join(this.targetBaseDir, targetFile);
  }
  var template = this.compile(file, obj);
  var dir = path.dirname(targetFile);
  fse.ensureDirSync(dir);
  fse.writeFileSync(targetFile, template);
  logger.log(' Make ' + file.split(rootDir)[1] + ' > ' + targetFile.split(rootDir)[1]);
}

/**
 * 编译模板
 * @param file {String} 模板文件路径
 * @param obj  {Object} 模板数据
 */
TemplateCompiler.prototype.compile = function (file, obj) {
  var template = new String(fse.readFileSync(file));
  var keys = Object.keys(obj);
  var key = null;
  for (var i = 0, k = keys.length; i < k; i++) {
    key = keys[i];
    template = template.replace(new RegExp('\\$' + key + '\\$', 'g'), obj[key]);
  }
  return template;
}

//公布引用
module.exports = TemplateCompiler;