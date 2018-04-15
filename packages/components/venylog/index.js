import './index.css';
import React from 'react';
import PropTypes from 'prop-types';
import { Venylog } from 'framework';

export default class VenyLogProvider extends React.Component {

  constructor(props) {
    super(props);
    this.venylog = new Venylog('global');
    this.sendBeacon = this.sendBeacon.bind(this);
    this.onCaptureClick = this.onCaptureClick.bind(this);
  }

  //定义子组件共享数据类型
  static childContextTypes = {
    sendBeacon: PropTypes.func
  }

  //定义子组件能获取的共享数据
  getChildContext() {
    return {
      sendBeacon: this.sendBeacon
    }
  }

  /**
   * 发送一条打点日志
   * @param {Object} record 日志对象
   */
  sendBeacon(record) {
    if (record) {
      this.venylog.sendOriginalBeancon(record);
    }
  }

  /**
   * 当捕获到点击事件，进行点击日志处理
   * @param {*} ev 
   */
  onCaptureClick(ev) {
    const target = this.closest(ev.target, 'data-veny-log')
    if (target) {
      var venylog = this.getVenyPage(target);
      venylog.sendOriginalBeancon({ ...target.dataset });
    }
    return true;
  }

  /**
   * 获取当前点击元素所在页面
   */
  getVenyPage(target) {
    const attr = 'data-veny-page';
    const page = this.closest(target, attr);
    return page ? new Venylog(page.getAttribute(attr)) : this.venylog;
  }

  /**
   * 获取就近包含指定属性的元素
   */
  closest(target, name) {
    let parent = target;
    while (parent) {
      if (parent.hasAttribute(name)) {
        return parent;
      }
      parent = parent.parentElement;
    }
  }

  //渲染组件
  render() {
    return (<div onTouchStartCapture={this.onCaptureClick} className="venylog">{this.props.children}</div>)
  }
}