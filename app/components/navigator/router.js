/**
 * 用于实现代码拆分动态载入组件
 * 
 * DynamicComponentNavView: 实现加载普通React组件或者一个异步加载组件的函数
 * 
 * 用例：
 *      <DynamicComponentNavView navigation={} router={} />
 * 
 * 
 * StackAnimateView: 实现卡片切换页面的视图，用于模拟app的页面切换效果
 * 
 * 用例： 
 *      <StackAnimateView route={path} isForward={forward}>..children...</StackAnimateView>
 *
 *  
 * Processing ： web端自定义加载效果
 */
import React from 'react';
import StackAnimateView from './animate-view';
import Processing from './processing';

const isFunction = (handle) => (typeof handle === 'function');

export default class DynamicComponentNavView extends React.Component {

  /**
   * 组件构造函数
   * @param props {Object} 组件props
   */
  constructor(props) {
    super(props);
    this.routeComponent = props;
    //设置默认state
    this.state = {
      //需要渲染的组件
      requiredComponent: this.isAsyncComponent ? null : this.routeComponent
    }
  }

  /**
   * 当前路由需要展示的组件
   */
  get routeComponent() {
    return this._routeComponent;
  }

  /**
   * 设置当前路由需要展示的组件
   */
  set routeComponent(props) {
    const { navigation, router } = props;
    const { state } = navigation;
    this._routeComponent = router.getComponentForState(state);
  }

  /**
   * 判断当前props.asyncComponent 是否为一个异步加载组件
   * 而不是纯粹的React组件
   */
  get isAsyncComponent() {
    let asyncComponent = this.routeComponent;
    return !(asyncComponent instanceof React.Component || this.isReduxConnect) && isFunction(asyncComponent)
  }

  /**
   * 判断是否为一个redux的connect
   */
  get isReduxConnect() {
    let asyncComponent = this.routeComponent;
    return isFunction(asyncComponent) && (asyncComponent.prototype instanceof React.Component);
  }

  /**
   * 组件第一次渲染完成时，执行一次异步获取
   */
  componentDidMount() {
    this.asyncRequireComponent();
  }

  /**
   * 当路由切换时
   * @param nextProps {Object} 新的props
   */
  componentWillReceiveProps(nextProps) {
    this.state.requiredComponent = null;
    this.routeComponent = nextProps;
    this.asyncRequireComponent();
  }

  /**
   * 仅在requiredComponent变更时，才刷新组件内容
   * @param nextProps {Object} 新的props
   * @param nextState {Object} 新的state
   * @returns {Boolean} 
   */
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.requiredComponent && nextState.requiredComponent.prototype instanceof React.Component;
  }

  /**
   * 尝试异步方式获取要显示的组件
   */
  asyncRequireComponent() {
    if (this.isAsyncComponent) {
      this.state.requiredComponent = null;
      this.onProcessing();
      //异步加载组件，然后进行渲染
      this.routeComponent().then((m) => {
        let requiredComponent = (m.default || m);
        this.setState({ requiredComponent });
        this.onProcessed();
      })
    } else if (this.routeComponent !== this.state.requiredComponent) {
      //如果传入的是同步组件
      let requiredComponent = this.routeComponent;
      this.setState({ requiredComponent });
    }
  }

  /**
   * 异步组件请求中，可以在次函数中添加loaing效果
   */
  onProcessing() {
    const { onProcessing } = this.props;
    if (isFunction(onProcessing)) {
      onProcessing();
    } else {
      Processing.show();
    }
  }

  /**
   * 异步组件请求完毕
   */
  onProcessed() {
    const { onProcessed } = this.props;
    if (isFunction(onProcessed)) {
      onProcessed();
    } else {
      Processing.hide();
    }
  }

  /**
   * 渲染页面标题
   */
  titleQuestion(Component) {
    const { title } = (Component.navigationOptions || {});
    title && (document.title = title);
  }

  /**
   * 组件渲染
   */
  render() {
    const Component = this.state.requiredComponent;
    const { navigation, router, isForward, pathName } = this.props;
    const state = navigation.state;
    const { path } = router.getPathAndParamsForState(state);
    const forward = isForward || false;
    if (Component) {
      this.titleQuestion(Component)
      return (
        <StackAnimateView route={pathName} isForward={forward}>
          <Component navigation={navigation} />
        </StackAnimateView>
      );
    } else {
      return '';
    }
  }
}