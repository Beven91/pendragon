/**
 * @module Base
 * @name  基础组件，用于提供组件继承使用
 * @date  2017-11-03
 * @description 
 */

// 引入依赖>>
import Validator from '../validation';
import React, { PropTypes } from 'react'
import { Toast } from 'antd-mobile'
import { shallowEqualImmutable } from "react-immutable-render-mixin";

export default class Base extends React.Component {

  constructor(props) {
    super(props)
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
}
