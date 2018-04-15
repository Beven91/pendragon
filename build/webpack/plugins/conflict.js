/**
 * @name 解决windows下盘符大小写冲突问题
 * @date   2018-01-06
 * @description  用于解决windows下盘符大小写，导致打包问题
 */
var path = require('path');

function ConflictPlugin() { }

ConflictPlugin.prototype.apply = function (compiler) {
  compiler.plugin('compilation', function () {
    compiler.resolverFactory.plugin("resolver normal", function (resolver) {
      resolver.plugin('result', function (request, done) {
        var filePath = request.path;
        var segments = path.parse(filePath);
        request.path = filePath.replace(segments.root, segments.root.toUpperCase());
        done();
      })
    })
  });
}

module.exports = ConflictPlugin;