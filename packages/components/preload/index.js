import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class Preload extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  /**
   * 显示悬浮的Loading效果
   * @param {String} message loading效果显示的文案 默认为：请稍后...
   * @param {Boolean} mask 是否覆盖背景,使背景不可点击，默认为false 
   */
  static showLoading(message, mask = false, delay = true) {
    clearTimeout(this.timerId);
    const container = this._getContainer();
    function render() {
      ReactDOM.render(<Preload message={message} mask={mask} />, container)
    }
    delay ? this.timerId = setTimeout(render, 200) : render();
    return this.closeLoading.bind(this);
  }

  /**
   * 关闭loading效果
   */
  static closeLoading() {
    clearTimeout(this.timerId);
    ReactDOM.render('', this._getContainer())
  }

  /**
   * 获取loading容器
   */
  static _getContainer() {
    const id = '__preload_container__';
    let preloadContainer = document.getElementById(id);
    if (!preloadContainer) {
      preloadContainer = document.createElement('div');
      preloadContainer.id = id;
      document.body.appendChild(preloadContainer);
    }
    return preloadContainer;
  }

  /**
   * 组件props类型定义
   */
  static propTypes = {
    //显示的loading消息
    message: PropTypes.string,
    //loading图标类型
    loading: PropTypes.oneOf(['default']),
    //是否覆盖背景,使背景不可点击，默认为false 
    mask: PropTypes.bool
  }

  /**
   * 组件默认props
   */
  static defaultProps = {
    message: '',
    mask: false,
    loading: 'default'
  }

  //渲染组件
  render() {
    const { message, loading, mask } = this.props;
    const maskCls = mask ? 'am-toast-mask' : 'no-mask';
    return (
      <div className={`am-toast ${maskCls}`}>
        <span>
          <div className="am-toast-notice am-toast-notice-closable">
            <div className="am-toast-notice-content">
              <div className="am-toast-text am-toast-text-icon" role="alert" aria-live="assertive">
                <div className={"am-icon am-icon-loading am-icon-lg " + loading}>
                  <div className="inner"></div>
                </div>
                {
                  message?<div className="am-toast-text-info">{message}</div>:''
                }
              </div>
            </div>
            <a tabIndex="0" className="am-toast-notice-close">
              <span className="am-toast-notice-close-x"></span>
            </a>
          </div>
        </span>
      </div>
    )
  }
}