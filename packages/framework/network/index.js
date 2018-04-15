/**
 * @name 前端网络接口基础类
 * @date   2017-10-29
 * @description  基于fetch 用于提供全局监听，以及派生业务接口用
 */

// 引入fetch polyfill
import 'whatwg-fetch';
import stringify from 'qs/lib/stringify';
import { Type, EventEmitter } from 'dantejs';

let Options = {};
// 创建一个事件容器
const emitter = new EventEmitter();

export default class Network {
  constructor() {

  }

  /**
   * 接口全局配置
   * @param {Object}  options 全局配置  { base:'',data:{} }
   */
  static config(options) {
    Options = options || {};
  }

  /**
   * 添加一个全局监听事件
   * @param {String} name 事件名称 目前支持 response / error
   * @param {Function} handler 响应函数
   * response ：  function(response){    }
   * error: function(error){}
   */
  static on(name, handler) {
    emitter.on(name, handler);
    return this;
  }

  /**
   * 发送一个get请求
   * @param {String} uri 服务端接口url 可以为完整路径或者相对路径
   * 完整路径例如: https://api.pendragon/rest/order/submit
   * 相对路径： 相对路径是相对于 Network.config() 配置的 base
   * @param {Object/FormData} 发送的正文数据 ，可以为json对象或者字符串或者FormData
   * @param {Object} headers  发送报文首部配置
   */
  get(uri, data, headers) {
    return this.any(uri, data, 'Get', headers);
  }

  /**
   * 发送一个post请求
   * @param {String} uri 服务端接口url 可以为完整路径或者相对路径
   * 完整路径例如: https://api.pendragon/rest/order/submit
   * 相对路径： 相对路径是相对于 Network.config() 配置的 base
   * @param {Object/FormData} 发送的正文数据 ，可以为json对象或者字符串或者FormData
   * @param {Object} headers  发送报文首部配置
   */
  post(uri, data, headers) {
    return this.any(uri, data, 'Post', headers);
  }

  /**
   * 发送一个网络请求
   * @param {String} uri 服务端接口url 可以为完整路径或者相对路径
   * 完整路径例如: https://api.pendragon/rest/order/submit
   * 相对路径： 相对路径是相对于 Network.config() 配置的 base
   * @param {Object/FormData} 发送的正文数据 ，可以为json对象或者字符串或者FormData
   * @param {String} method 请求类型 例如 Get Post Put Delete 等
   * @param {Object} headers  发送报文首部配置
   */
  any(uri, data, method, headers) {
    emitter.emit('start', data, headers);
    const context = { assert: defaultAssert, useTry: false, tryMax: 0, uri, data, method, headers };
    const promise = new Promise((resolve, reject) => this.request(context, resolve, reject, 0));
    return new AttachResponse(promise, context, uri);
  }

  /**
   * 发送wx.request请求
   * @param {Function} resolve 成功的回调通知函数
   * @param {Function} reject 失败时的回调通知函数
   * @param {Object} context 请求上下文参数
   * @param {Number} tryProcess 当前尝试的次数
   */
  request(context, resolve, reject, tryProcess) {
    const { uri, data, method } = context;
    const tryRequest2 = this.tryRequest.bind(this, context, reject, resolve, tryProcess);
    let headers = context.headers;
    window.fetch(combine(uri, method, data), {
      // 请求谓词
      method,
      // 设置证书类型 omit:不传递cookie same-origin:同源发送cookie include:都发送cookie
      credentials: context.credentials || 'include',
      // 请求首部
      headers: headers = {
        'Content-Type': Options.defaultContentType || 'application/x-www-form-urlencoded',
        // 合并传入的headers 传入的headers会覆盖前面行配置的默认headers
        ...headers,
      },
      // 请求正文
      body: adapter(data, headers, method),
    }).then((response) => {
      const { status } = response;
      const isOK = status >= 200 && status < 300 || status === 304;
      const tryAssert = context.useTry && context.assert(response);
      emitter.emit('end', response);
      emitter.emit('response', response);
      if (isOK && !tryAssert) {
        resolve(response);
      } else if (!tryRequest2()) {
        reject(response);
        emitter.emit('error', response);
      }
    }, (error) => {
      if (!tryRequest2()) {
        emitter.emit('end', error);
        emitter.emit('error', error);
        reject(error);
      }
    });
  }

  /**
   * 请求重试
   * @param {Function} resolve 成功的回调通知函数
   * @param {Function} reject 失败时的回调通知函数
   * @param {Object} context 请求上下文参数
   * @param {Number} tryProcess 当前尝试的次数
   */
  tryRequest(context, reject, resolve, tryProcess) {
    const { useTry, tryMax } = context;
    const needTry = useTry && tryProcess < tryMax;
    console.log('retry uri:' + context.uri);
    needTry ? this.request(context, resolve, reject, ++tryProcess) : undefined;
    return needTry;
  }
}

/**
 * 链式钩子，用于丰富Network.get/post 返回对象
 */
class AttachResponse {
  constructor(promise, context, uri) {
    this.contextResult = {};
    this.context = {};
    this.uri = uri;
    Object.defineProperty(this, 'context', { writable: false, configurable: false, value: context });
    this.promise = promise;
  }

  /**
   * 添加一个请求回调，在请求完成后触发
   * @param {Function} success 请求成功响应函数
   * @param {Function} error  请求失败响应函数
   * @returns this self
   */
  then(success, error) {
    const errorWrapper = (result) => {
      if (typeof error === 'function') {
        emitter.emit('error', result);
        return error(result);
      } else {
        emitter.emit('error', result);
        return result;
      }
    };
    this.promise = this.promise.then(success, errorWrapper);
    return this;
  }

  /**
   * 添加一个请求异常捕获回调
   * @param {Function} errorHandle 异常处理函数
   * @returns this self
   */
  catch(...params) {
    this.promise = this.promise.catch(...params);
    return this;
  }

  /**
   * 本次接口显示悬浮的Loading效果
   * @param {String} message loading效果显示的文案 默认为：请稍后...
   * @param {Number} mask 是否遮罩背景
   * @returns this self
   */
  showLoading(message, mask) {
    if (typeof Options.loading === 'function') {
      this.complete(Options.loading(message, mask));
    }
    return this;
  }

  /**
   * 回调处理，不管是成功还是失败，都出发该回调
   * @param  {Function} callback 回调函数
   */
  complete(callback) {
    const onlyCallback = (context) => {
      callback(); return context;
    };
    this.then(onlyCallback, onlyCallback);
    return this;
  }

  /**
   * 设定返回json数据
   */
  json() {
    return this.then((response) => {
      return Type.isFunction(response.json) ? response.json() : response;
    });
  }

  /**
   * 本次接口不显示全局错误提示
   */
  slient() {
    this.slient = true;
    return this;
  }

  /**
   * 返回一个redux action
   * @returns {promise:Promise,...}
   */
  redux() {
    this.then((data) => {
      data['@@NETWORKRESPONSE@@'] = this.uri;
      data.__slient = this.slient;
      return data;
    });
    return { 'promise': this.promise, '@@NETWORKSTART@@': true, 'api': this.uri };
  }

  /**
   * 合并其他请求
   * @param {Promise} promise 其他请求返回的promise
   * @param {String} name 当前合并请求的结果附加的属性名称
   */
  merge(promise, name) {
    if (name === 'original') {
      throw new Error(`name参数不能为original,改名称为默认返回值`);
    }
    const contextResult = this.contextResult;
    return this.then((response) => {
      if (!contextResult.original) {
        contextResult.original = response;
      }
      return promise.then((afterResponse) => {
        contextResult[name] = afterResponse;
        return contextResult;
      });
    });
  }

  /**
   * 开启重试机制
   * 当网络访问失败时，进行重试
   * @param {Number} max 重试最大的次数 默认值=1
   * @param {Function} errorAssert 需要进行重试的条件函数,默认重试条件为:请求网络错误
   *         例如: function(response){ return response.status!=200  };
   *
   */
  try(max = 1, errorAssert) {
    this.context.useTry = true;
    this.context.tryMax = max;
    if (Type.isFunction(errorAssert)) {
      this.context.assert = errorAssert;
    }
    return this;
  }

  /**
   * 设置本次接口禁止发送cookie
   */
  noCookie() {
    this.context.credentials = 'omit';
  }
}

/**
 * 根据请求报文的ContentType来适配发送正文的形态
 * @param {Object} data 发送的数据
 * @param {Object} headers 请求首部
 * @param {String} method 请求类型
 */
function adapter(data, headers, method) {
  if (['get', 'head'].indexOf(method.toLowerCase()) < 0) {
    data = merge(data, Options.data);
    headers = headers || {};
    // 默认content-type为
    let ct = headers['Content-Type'];
    switch (ct) {
      case 'application/json':
        return JSON.stringify(data);
      case 'application/x-www-form-urlencoded':
        return formdata(data);
      default:
        // 其他类型，默认直接范围原始data
        return data;
    }
  }
}

/**
 * 合并全局参数
 * @param {Object} data 请求参数
 * @param {Object} merge 全局参数
 */
function merge(data, merge) {
  data = data || {};
  merge = merge || {};
  if (!(data instanceof FormData)) {
    return { ...merge, ...data };
  }
  Object.keys(merge).forEach((k) => {
    if (data.get(k) === undefined) {
      data.append(k, merge[k]);
    }
  });
  return data;
}

/**
 * 合并uri
 * @param {String} uri 请求的uri路径
 * @param {String} method 请求类型
 * @param {Object} data 请求数据
 */
function combine(uri, method, data) {
  if (!/(https:|http:)/.test(uri) && Options.base) {
    uri = Options.base + uri;
  }
  const isGet = method === 'Get';
  const search = isGet ? stringify(data) : '';
  const char = uri.indexOf('?') > -1 ? '&' : '?';
  return search.length > 0 ? uri + char + search : uri;
}

/**
 * 适配FormData参数
 * @param {Object} data
 * FormData: h5全局对象可传递复杂对象数据例如 二进制流，键值对等信息
 */
function formdata(data = {}) {
  if (!(data instanceof FormData)) {
    return stringify(data);
  }
  return data;
}

function defaultAssert() {
  return false;
}
