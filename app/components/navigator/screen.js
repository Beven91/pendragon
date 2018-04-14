/**
 * 名称：页面渲染承载组件
 * 日期：2018-01-18
 * 描述：用于进行页面渲染异常处理
 */
import React from "react";
import PropTypes from "prop-types";
import NavigateHelper from "./helper";

export default class Screen extends React.PureComponent {
  //组件属性类型
  static propTypes = {
    //当前要显示的页面路由
    current: PropTypes.string,
    //当前要显示的页面信息 {}
    screen: PropTypes.shape({
      route: PropTypes.string,
      Component: PropTypes.func
    }),
    //导航对象
    navigation: PropTypes.object
  };

  //构造函数
  constructor(props) {
    super(props);
    this.domRef = this.domRef.bind(this);
    this.state = {};
  }

  /**
   * 注册异常捕获事件，用于在异常时显示一个错误页
   */
  componentDidCatch(error) {
    this.setState({ error });
  }

  /**
   * 绑定当前dom元素
   */
  domRef(ins) {
    this.dom = ins;
  }

  /**
   * 渲染异常页面视图
   */
  renderCatchView(error) {
    const Error = NavigateHelper.errorComponent;
    if (Error) {
      return <Error error={error} />;
    } else {
      return <div className="error-component">非常抱歉,页面异常啦...</div>;
    }
  }

  /**
   * 渲染页面
   */
  renderScreenView() {
    const { screen, navigation } = this.props;
    const { Component, instance } = screen;
    const element = (screen.instance = instance || (
      <Component navigation={navigation} />
    ));
    return element;
  }

  //渲染页面
  render() {
    const { screen } = this.props;
    const { url } = screen;
    const { error } = this.state;
    return (
      <div ref={this.domRef} data-route={url} className="page">
        {error ? this.renderCatchView(error) : this.renderScreenView()}
      </div>
    );
  }
}
