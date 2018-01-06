/**
 * 名称：解决windows下盘符大小写冲突问题
 * 日期：2018-01-06
 * 描述：用于解决windows下盘符大小写，导致打包问题
 */
var path = require('path');

function ConflictPlugin() { }

ConflictPlugin.prototype.apply = function (compiler) {
  compiler.plugin('compilation', function (compilation) {
    compilation.resolvers.normal.plugin('result', function (request, done) {
      var filePath = request.path;
      var segments = path.parse(filePath);
      request.path = filePath.replace(segments.root,segments.root.toLowerCase());
      done();
    })
  });
}

module.exports = ConflictPlugin;