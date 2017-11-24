/**
 * 名称：代理工具
 * 日期：2017-05-19
 * 描述：
 */

//引入依赖>>

const urlParser = require('url');
const httpProxy = require('http-proxy');
const { EventEmitter } = require('dantejs');

class ProxyPool {

  constructor() {
  }

  /**
   * 创建一个数据代理
   */
  createProxy(url) {
    return new Promise((resolve, reject) => {
      let target = this.proxyTarget(url)
      let proxyOptions = {
        target: target,
        changeOrigin: true
      }
      let proxy = this.proxy
      if (!proxy) {
        this.proxy = proxy = httpProxy.createProxyServer(proxyOptions)
      }
      resolve(proxy)
    })
  }

  /**
   * 根据url获取对应的代理target
   * @param {String} url 
   */
  proxyTarget(url) {
    let uri = urlParser.parse(url)
    return `${uri.protocol}//${uri.host}`
  }
}

module.exports = new ProxyPool;