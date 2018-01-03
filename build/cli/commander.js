/**
 * 名称: cli命令行支持
 * 日期：2017-11-07
 * 描述：用于针对不同终端，提供标准的命令行信息
 */

// 引入依赖>>
var program = require('commander')
var pgk = require('../../package.json')
var cli = require('./cli.js')

module.exports = function (argv) {
  //默认参数
  if (argv.length <= 2) {
    argv.push('-h');
  }

  program
    .version(pgk.version)
    .usage('npm run cli [command] [options]')

  program
    .command('new <name>')
    .action(cli.run('create'))
    .description('创建一个业务模块')

  // 解析参数
  program.parse(argv)
}
