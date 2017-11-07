/**
 * 名称：前端网络接口基础类
 * 日期：2017-10-29
 * 描述：基于fetch 用于提供全局监听，以及派生业务接口用
 */

//引入fetch polyfill
import 'whatwg-fetch';
import { Toast } from 'antd-mobile';
import { EventEmitter } from 'dantejs'

let Options = {};
//创建一个事件容器
const emitter = new EventEmitter();

export default class Network {

    constructor() {

    }

    /**
     * 接口全局配置
     * @param {Object}  options 全局配置  { baseUri:'',data:{} }
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
     * 发送一个post请求
     * @param {String} uri 服务端接口url 可以为完整路径或者相对路径
     * 完整路径例如: https://api.pendragon/rest/order/submit
     * 相对路径： 相对路径是相对于 Network.config() 配置的 baseUri
     * @param {Object/FormData} 发送的正文数据 ，可以为json对象或者字符串或者FormData
     * @param {Object} headers  发送报文首部配置
     */
    get(uri, data, headers) {
        return this.any(uri, data, 'Get', headers);
    }

    /**
     * 发送一个get请求
     * @param {String} uri 服务端接口url 可以为完整路径或者相对路径
     * 完整路径例如: https://api.pendragon/rest/order/submit
     * 相对路径： 相对路径是相对于 Network.config() 配置的 baseUri
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
     * 相对路径： 相对路径是相对于 Network.config() 配置的 baseUri
     * @param {Object/FormData} 发送的正文数据 ，可以为json对象或者字符串或者FormData
     * @param {String} method 请求类型 例如 Get Post Put Delete 等
     * @param {Object} headers  发送报文首部配置
     */
    any(uri, data, method, headers) {
        emitter.emit('start');
        uri = combine(uri, method, data);
        const promise = fetch(uri, {
            //请求谓词
            method,
            //默认设置成同源模式 需要发送cookie到服务端
            credentials: 'same-origin',
            //请求首部
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                //合并传入的headers 传入的headers会覆盖前面行配置的默认headers
                ...headers,
            },
            //请求正文
            body: adapter(data, headers)
        }).then((response) => {
            const { status } = response;
            emitter.emit('end', response);
            emitter.emit('response', response);
            if (status >= 200 && status < 300 || status === 304) {
                return response;
            } else {
                emitter.emit('error', response);
                return Promise.reject(response);
            }
        }, (error) => {
            emitter.emit('end', error);
            emitter.emit('error', error);
            return error;
        })
        return new AttachResponse(promise);
    }
}

/**
 * 链式钩子，用于丰富Network.get/post 返回对象
 */
class AttachResponse {

    constructor(promise) {
        this.promise = promise;
    }

    /**
     * 添加一个请求回调，在请求完成后触发
     * @param {Function} success 请求成功响应函数
     * @param {Function} error  请求失败响应函数
     * @returns this self
     */
    then(...params) {
        this.promise = this.promise.then(...params);
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
     * @param {Number} duration loaing效果显示时长 默认 1s 单位:秒
     * @returns this self
     */
    showLoading(message, duration = 1) {
        if (typeof Options.loading === 'function') {
            Options.loading(message, duration);
        }
        return this;
    }

    /**
     * 返回一个redux action
     * @returns {promise:Promise,...}
     */
    redux() {
        return { promise: this.promise }
    }
}

/**
 * 根据请求报文的ContentType来适配发送正文的形态
 * @param {Object} data 发送的数据
 * @param {Object} headers 请求首部
 */
function adapter(data, headers) {
    data = merge(data, Options.data);
    headers = headers || {};
    //默认content-type为 
    let ct = headers['Content-Type'] || 'application/x-www-form-urlencoded';
    switch (ct) {
        case 'application/json':
            return JSON.stringify(data);
        case 'application/x-www-form-urlencoded':
            return formdata(data);
        default:
            //其他类型，默认直接范围原始data
            return data;
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
    if (data instanceof FormData) {
        return { ...merge, ...data };
    }
    Object.keys(merge).forEach((k) => {
        if (data.get(k) === undefined) {
            data.append(k, merge[k]);
        }
    })
    return data;
}

/**
 * 合并uri
 * @param {String} uri 请求的uri路径
 * @param {String} method 请求类型
 * @param {Object} data 请求数据
 */
function combine(uri, method, data) {
    if (/(https:|http:)/.test(uri) && Options.baseUri) {
        uri = Options.baseUri + uri;
    }
    const isGet = method === "Get";
    const search = isGet ? Object.keys(data).map((k) => k + '=' + data[k]) : [];
    const char = uri.indexOf('?') > -1 ? '&' : '?';
    return uri + char + search.join('&');

}

/**
 * 适配FormData参数
 * @param {Object} data 
 * FormData: h5全局对象可传递复杂对象数据例如 二进制流，键值对等信息
 */
function formdata(data = {}) {
    if (!(data instanceof FormData)) {
        let fd = new FormData();
        Object
            .keys(data)
            .forEach((k) => {
                fd.append(k, data[k]);
            })
        data = fd;
    }
    return data;
}