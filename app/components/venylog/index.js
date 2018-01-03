import './index.css';
import React from 'react';
import PropTypes from 'prop-types';

export default class VenyLogProvider extends React.Component {

  constructor(props) {
    super(props);
    this.sendBeacon = this.sendBeacon.bind(this);
  }

  //定义子组件共享数据类型
  static childContextTypes = {
    sendBeacon: PropTypes.func
  }

  /**
   * 组件渲染完毕
   */
  componentDidMount() {
    //事件捕获阶段进行打点响应
    this.refs.venylog.addEventListener('click', this.onCaptureClick.bind(this), true);
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
      return navigator.sendBeacon('/venylog/v.gif', record.message);
    }
  }

  /**
   * 当捕获到点击事件，进行点击日志处理
   * @param {*} ev 
   */
  onCaptureClick(ev) {
    const { target } = ev;
    if (target.hasAttribute('data-venylog')) {
      const message = target.getAttribute('data-venylog');
      this.sendBeacon({ message });
    }
  }

  //渲染组件
  render() {
    return (<div ref="venylog" className="venylog">{this.props.children}</div>)
  }
}