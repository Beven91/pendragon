/**
 * @name 代理中间件
 * @date 2017-11-28
 * @description  
 *       用于提供项目mock服务
 *       mock服务分为两种返回处理：
 *        1.根据本地的mock文件进行接口返回
 *        2.代理请求到远程服务器
 */

//引入依赖>>
const path = require("path");
const fs = require("fs-extra");
const httpProxy = require("http-proxy");
const url = require("url");
const bodyParser = require("body-parser");
const dantejs = require("dantejs");
var MockContext = require('./context');

/**
 * 网关接口中间件
 */
class MockMiddleware {
  constructor(req, resp, next, config) {
    this.request = req;
    this.response = resp;
    this.next = next;
    this.config = config || {};
    this.baseRemoteUrl = null;
    try {
      this.handleRequest();
    } catch (ex) {
      console.error(ex.stack);
      this.handleLocal({ code: -1, message: ex.message });
    }
  }

  /**
   * 根据request.pathname来寻找对应的本地mock文件
   */
  get idModule() {
    return path.resolve("mock/" + this.request.path.replace(/^\/mock\//,''));
  }

  /**
   * 处理接口请求
   */
  handleRequest() {
    const data = this.handleMock();
    if (data === "self") {
      return;
    } else if (data && data["__Off"]) {
      this.baseRemoteUrl = (data || {}).__Off;
      this.handleRemote();
    } else if (data) {
      this.handleLocal(data);
    } else {
      this.handleRemote();
    }
  }

  /**
   * 尝试获取本地mock数据
   */
  handleMock() {
    const jsFile = this.idModule + ".js";
    const jsonFile = this.idModule + ".json";
    if (fs.existsSync(jsFile)) {
      //js mock模块
      const data = this.getNoCacheModule(jsFile);
      return typeof data === "function" ? this.handleFunctionMock(data) : data;
    } else if (fs.existsSync(jsonFile)) {
      //json mock模块
      return fs.readJSONSync(jsonFile);
    } else {
      return null;
    }
  }

  /**
   * 处理函数mock模块
   */
  handleFunctionMock(handler) {
    if (handler["__Off"]) {
      this.baseRemoteUrl = handler["__Off"];
      return null;
    }
    bodyParser.urlencoded({ extended: true })(this.request, this.response, () => {
      try {
        const contextApplication = new MockContext(
          this.request,
          this.response
        );
        contextApplication.throwRequired(this.request, handler.parameters);
        const data = handler.apply(contextApplication, [this.request]);
        this.handleLocal(data);
      } catch (ex) {
        console.error(ex.stack);
        this.handleLocal({ stat: { code: -1, message: ex.message } });
      }
    });
    return "self";
  }

  /**
   * 返回本地的mock数据到客户端
   */
  handleLocal(data) {
    const { response } = this;
    response.setHeader("Data-Provider", "Mock");
    response.setHeader("content-type", "application/json");
    response.setHeader("access-control-allow-origin", this.request.host);
    response.setHeader(
      "access-control-allow-method",
      "POST, GET, OPTIONS, PUT, DELETE, HEAD"
    );
    response.setHeader("access-control-allow-credentials", "true");
    response.write(JSON.stringify(data, null, 4));
    response.end();
  }

  /**
   * 代理到原始服务器请求网关接口进行接口返回
   */
  handleRemote() {
    const { request, response, next } = this;
    const parts = url.parse(request.headers.origin);
    const config = this.config;
    const Strings = dantejs.String;
    const pathname = Strings.trimLeft(request.path, "/");
    const configUrl = typeof config.url === 'function' ? config.url(this.request) : config.url;
    const tempBaseUrl = this.baseRemoteUrl === true ? null : this.baseRemoteUrl;
    const baseUrl = tempBaseUrl || configUrl;
    const proxy = httpProxy.createProxyServer({
      target: /^\/\//.test(baseUrl) ? parts.protocol + baseUrl : baseUrl,
      changeOrigin: true
    });
    this.baseRemoteUrl = null;
    request.url = request.originalUrl = request.baseUrl =
      Strings.ensureEndsWith(baseUrl, "/") + pathname;
    console.log(`proxy remote:${request.url} ${request.query._mt}`);
    proxy.web(request, response, {}, ex => next(ex));
  }

  /**
   * 获取一个无缓存的模块
   */
  getNoCacheModule(id) {
    delete require.cache[require.resolve(id)];
    return require(id);
  }
}

module.exports = function (config) {
  return (req, resp, next) => new MockMiddleware(req, resp, next, config);
} 
