/**
 * 名称：代理中间件
 * 日期：2017-11-28
 * 描述：用于解决
 */

//引入依赖>>
const urlParser = require('url');
const httpProxy = require('http-proxy');

const baseUri = 'http://rapapi.org/mockjsdata/28825';
const baseUriParts = urlParser.parse(baseUri);
const proxy = httpProxy.createProxyServer({
  target: baseUriParts.protocol + '//' + baseUriParts.host,
  changeOrigin: true
})

module.exports = (req, resp, next) => {
  if (req.headers['x-p'] === "fetch") {
    const proxyUrl = baseUri + req.path;
    req.baseUrl = proxyUrl;
    req.originalUrl = proxyUrl;
    req.url = proxyUrl;
    proxy.web(req, resp, {}, (ex, a, b, c) => next(ex));
  } else {
    next();
  }
};