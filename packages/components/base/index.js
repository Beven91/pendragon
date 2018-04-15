/**
 * @module Base
 * @name  页面基础组件，用于提供组件继承使用
 * @date  2017-11-03
 * @description
 */

// 引入依赖>>
import "../wechat";
import { UrlParser, EventEmitter } from 'dantejs';
import PropTypes from "prop-types";
import Preload from "../preload";
import { queryWxConfigUrl } from 'configs';
import ComponentLock from "./lock";
import { Modal, Toast } from "antd-mobile";
import { Validation, Venylog, Network } from "framework";
import { NavigationActions } from "react-navigation";

const network = new Network();
// 原始location.href
const ORIGINAL_HREF = location.href;
// 判断当前环境是否为ios
const IOS = /\(i[^;]+;( U;)? CPU.+Mac OS X/.test(navigator.userAgent);

export default class Base extends ComponentLock {
  constructor(props, name) {
    super(props);
    // 初始化日志打点
    Base.initVenylog(this, name);
    // 发送onload打点
  }

  static contextTypes = {
    //导航对象
    navigation: PropTypes.object,
    //所有的路由视图
    routeViews: PropTypes.object
  };

  // 初始化日期打点
  static initVenylog(instance, name) {
    Object.defineProperty(instance, "_venylog", {
      writable: false,
      configurable: false,
      value: new Venylog(name)
    });
    const originalComponentDidMount = instance.componentDidMount;
    instance.componentDidMount = function () {
      return (
        originalComponentDidMount &&
        originalComponentDidMount.apply(this, arguments)
      );
    };
  }

  /**
   * 显示一个(toast)黑色浮层提示
   * @param {String} message 提示消息
   * @param {Number} duration 浮层存活时间 默认为2秒 单位为 s/秒
   */
  showTip(message, duration = 2) {
    return new Promise(resolve => {
      Toast.show(message, duration);
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  /**
   * 获取当url的参数
   */
  get urlParams() {
    return new UrlParser(location.href).paras;
  }

  /**
   * 获取当前导航对象
   */
  get navigation() {
    return this.props.navigation || (this.context || {}).navigation || {};
  }

  /**
   * 获取当前程序所有的路由视图
   */
  get routeViews() {
    return (this.context || {}).routeViews || {};
  }

  /**
   * 获取路由参数
   */
  get routeParams() {
    const navigation = this.navigation;
    const state = navigation.state || {};
    const routes = state.routes || [];
    const route = routes[state.index] || {};
    const data = route.params || {};
    return { ...data, ...this.urlParams };
  }

  /**
   * 校验指定model数据是否填写符合规范
   * @param {Object} data 要校验的数据
   * @param {Object} partten 校验规则 例如:
   *
   *    (//具体校验规则 可参见 components/validation/index.js)
   *
   *    const partten = {
   *        username: { required: '请输入用户名' },
   *        password: { required: '请输入密码' }
   *    }
   *
   */
  modelValidation(data, partten) {
    return Validation.validator.model(data, partten);
  }

  /**
   * 弹出一个alert对话框
   * @param {String/JSXElement} title 标题
   * @param {String/JSXElement} message 对话消息
   * @param {String} callback 点击确定按钮的回调函数
   */
  alert(title, message, callback) {
    const actions = [{ text: "确定", onPress: callback }];
    return Modal.alert(title, message, actions);
  }

  /**
   * 弹出一个confirm对话框
   * @param {String/JSXElement} title 标题
   * @param {String/JSXElement} message 对话消息
   */
  confirm(title, message) {
    const emitter = new EventEmitter();
    const actions = [
      { text: "确定", onPress: () => emitter.emit("ok") },
      { text: "取消", onPress: () => emitter.emit("cancel") }
    ];
    Modal.alert(title, message, actions);
    return {
      /**
       * 点击确定按钮回调函数
       */
      yes: handler => emitter.once("ok", handler),
      /**
       * 点击取消按钮回调函数
       */
      cancel: handler => emitter.once("cancel", handler)
    };
  }

  /**
   * 显示悬浮的Loading效果
   * @param {String} message loading效果显示的文案 默认为：请稍后...
   */
  showLoading(message) {
    return Preload.showLoading(message);
  }

  /**
   * 关闭loading效果
   */
  closeLoading() {
    return Preload.closeLoading();
  }

  /**
   * 发送一个事件日志
   * @param {String} event 事件名称
   */
  sendBeancon(event) {
    if (this._venylog) {
      this._venylog.sendBeancon({ name: event });
    }
  }

  /**
   * 跳转到指定路由
   * @param {String} route 路由名称
   * @param {Object} params 路由参数 仅能为json对象，不能传递函数数据
   */
  forward(route, params) {
    return this.navigation.navigate(route, params);
  }

  /**
   * 路由后退
   */
  back() {
    return this.navigation.goBack();
  }

  /**
   * 替换当前路由
   * @param {String} 新的路由名称
   * @param {Object} 对应的参数
   */
  navigateReplace(name, params = {}) {
    const action = {
      type: NavigationActions.NAVIGATE,
      routeName: name,
      params: params,
      isReplacement: true
    };
    this.navigation.dispatch(action);
  }

  /**
   * 重新载入当前路由
   */
  reload(name) {
    const { navigation } = this;
    const state = navigation.state || {};
    const routes = state.routes || [];
    const route = routes[state.index] || {};
    navigation.dispatch({
      isReload: true,
      type: NavigationActions.NAVIGATE,
      routeName: name || route.routeName,
      params: this.routeParams
    });
  }

  /**
   * 连接微信sdk 链接成功后会触发onWechatConnection
   * @param apiList 需要使用的apiList 例如：['onMenuShareTimeline','...']
   */
  connectionWechat(apiList) {
    const url = (IOS ? ORIGINAL_HREF : location.href).split("#")[0];
    network
      .post(queryWxConfigUrl, { url: url })
      .then(data => {
        const config = {
          debug: false,
          appId: data.appid,
          timestamp: data.timestamp,
          nonceStr: data.noncestr,
          signature: data.signature,
          jsApiList: apiList
        };
        // 配置微信
        window.wx.config(config);
        // 监听微信sdk ready事件
        window.wx.ready(() => {
          this.onWechatConnection(window.wx);
        });
      });
  }

  /**
   * 微信sdk操作事件函数，可以通过子类复写此函数执行具体微信操作
   * @param wx 微信sdk对象
   * 注意：当前函数在微信sdk初始化成功后自动调用
   */
  onWechatConnection() { }
}
