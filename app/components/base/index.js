/**
 * @module Base
 * @name  基础组件，用于提供组件继承使用
 * @date  2017-11-03
 * @description 
 */

// 引入依赖>>
import './base.css';
import dantejs from 'dantejs';
import Validator from '../validation';
import React from 'react'
import PropTypes from 'prop-types';
import { Modal, Toast } from 'antd-mobile';
import { shallowEqualImmutable } from 'react-immutable-render-mixin';

export default class Base extends React.Component {

  constructor(props) {
    super(props)
  }

  static contextTypes = {
    sendBeacon: PropTypes.func
  }

  /**
   * 提供默认的 shouldComponentUpdate
   * 使用immuteablejs 优化组件性能 阻止组件重复渲染
   * @param nextProps {Object} 新的props
   * @param nextState {Object} 新的state
   * @returns {Boolean} 
   */
  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqualImmutable(this.props, nextProps) || !shallowEqualImmutable(this.state, nextState)
  }

  /**
   * 显示一个(toast)黑色浮层提示
   * @param {String} message 提示消息
   * @param {Number} duration 浮层存活时间 默认为2秒 单位为 s/秒 
   */
  showTip(message, duration = 2) {
    Toast.show(message, duration)
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
    return Validator.validator.model(data, partten);
  }

  /**
   * 弹出一个alert对话框
   * @param {String/JSXElement} title 标题
   * @param {String/JSXElement} message 对话消息
   * @param {String} callback 点击确定按钮的回调函数
   */
  alert(title, message, callback) {
    const actions = [
      { text: '确定', onPress: callback }
    ]
    return Modal.alert(title, message, actions);
  }

  /**
   * 弹出一个confirm对话框
   * @param {String/JSXElement} title 标题
   * @param {String/JSXElement} message 对话消息
   */
  confirm(title, message) {
    const emitter = new dantejs.EventEmitter();
    const actions = [
      { text: '确定', onPress: () => emitter.emit('ok') },
      { text: '取消', onPress: () => emitter.emit('cancel') }
    ]
    Modal.alert(title, message, actions);
    return {
      /**
       * 点击确定按钮回调函数
       */
      yes: (handler) => emitter.once('ok', handler),
      /**
       * 点击取消按钮回调函数
       */
      cancel: (handler) => emitter.once('cancel', handler)
    }
  }

  /**
   * 显示悬浮的Loading效果
   * @param {String} message loading效果显示的文案 默认为：请稍后...
   * @param {Number} duration loaing效果显示时长 默认 1秒 单位：秒
   */
  showLoading(message, duration = 1) {
    Toast.loading(message, duration)
  }

  /**
  * 发送一条打点日志
  * @param {Object} record 日志对象
  */
  sendBeacon(record) {
    if(this.context.sendBeacon){
      return this.context.sendBeacon(record);
    }
  }
}
