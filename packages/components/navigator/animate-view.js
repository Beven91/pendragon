/**
 * 实现卡片切换页面的视图，用于模拟app的页面切换效果
 * 
 * 用例： 
 *      <StackAnimateView route={path} isForward={forward}>..children...</StackAnimateView>
 */
import React from 'react'
import PropTypes from 'prop-types';
import Screen from './screen';

//已经加载的所有页面
const CACHE = {};
const PAUSE = "@PAUSE@";
const NOOP = (a) => a;
const Queues = [];
let screenCount = 0;

export default class StackAnimateView extends React.Component {

  //组件属性类型
  static propTypes = {
    //当前路由对应的url
    url: PropTypes.string,
    //当前路由
    route: PropTypes.string,
    //导航对象
    navigation: PropTypes.object,
    //当前要渲染的页面
    Component: PropTypes.func,
    //当前是前进还是后退
    isForward: PropTypes.bool
  }

  static contextTypes = {
    store: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.refScreens = {};
    this.bindRefs = this.bindRefs.bind(this);
    this.currentInstance = null;
    this.prevInstance = null;
    this.state = {
      //当前已经加载的所有界面
      stacks: [],
      //当前要展示的页面
      activingScreen: null,
      //目前活动的页面
      activedScreen: null,
    };
  }

  /**
   * 组件开始首次渲染前
   */
  componentWillMount() {
    this.setNavigatorScreen(this.props);
  }

  /**
   * 组件首次渲染完毕
   */
  componentDidMount() {
    const { activingScreen } = this.state;
    this.setState({ activedScreen: activingScreen, activingScreen: null })
    this.executeComponentUpdate();
    if (activingScreen) {
      const activingDOM = this.refScreens[activingScreen.id];
      activingDOM && activingDOM.classList.add("active");
    }
    this.executePageBackfaceAndFront();
  }

  /**
   * 当属性改变时,切换窗口样式
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.url !== this.props.url) {
      this.setNavigatorScreen(nextProps);
    }
  }

  /**
   * 当组件更新完毕
   */
  componentDidUpdate() {
    if (!this.isAnimating) {
      this.transitionAnimations();
    } else {
      clearTimeout(this.timerId);
      this.timerId = setTimeout(this.transitionAnimations.bind(this), 100)
    }
  }

  /**
   * 手动控制刷新，所以始终返回false
   * @param nextProps {Object} 新的props
   * @param nextState {Object} 新的state
   * @returns {Boolean} 
   */
  shouldComponentUpdate() {
    return false;
  }

  /**
   * 创建一个新的screen.id
   */
  createId() {
    return `route_${++screenCount}`;
  }

  /**
   * 当前进入的页面是否需要刷新还是使用缓存
   * @param {Object} props 当前新的属性
   */
  shouldRefresh(props) {
    const { Component } = props;
    const RealComponent = Component.WrappedComponent || Component;
    const { navigationOptions = {} } = RealComponent;
    return navigationOptions.cache === false;
  }

  /**
   * 清除操作
   */
  releaseScreens(screen) {
    if (screen) {
      const { stacks = [] } = this.state;
      const index = stacks.indexOf(screen);
      stacks.splice(index, 1);
    }
  }

  /**
   * 设置非异步组件
   * @param {Object} props 当前输入的属性
   */
  setNavigatorScreen(props) {
    const { Component, url, isForward } = props;
    const route = (props.route || '').toLowerCase();
    const shouldRefresh = this.shouldRefresh(props);
    let activingScreen = CACHE[url] || this.getStack(url, isForward);
    if (isForward && !activingScreen) {
      //前进
      activingScreen = this.pushScreen({ id: this.createId(), url, route, Component });
    } else if (activingScreen) {
      //如果前进且有缓存
    } else if (activingScreen && shouldRefresh) {
      //后退且需要刷新
      activingScreen.instance = null;
      activingScreen.cache = false;
      activingScreen.RealComponent.shouldResetRedux = true;
      activingScreen.id = this.createId();
    } else if (!activingScreen) {
      //后退，且找不到screen (在中间页面 刷新了浏览器,然后点击后退)
      activingScreen = this.pushScreen({ id: this.createId(), url, route, Component });
    } else {
      //后退，且无需刷新
    }
    this.setState({ activingScreen });
    //强制刷新
    this.forceUpdate();
  }

  /**
   * 获取stack中的路由
   */
  getStack(url, isForward) {
    const { stacks = [] } = this.state;
    if (isForward) {
      return null;
    } else {
      return stacks.filter((s) => s.url === url).pop();
    }
  }

  /**
   * push页面到栈中
   */
  pushScreen(screen) {
    const Component = screen.Component.WrappedComponent || screen.Component;
    const { navigationOptions = {} } = Component;
    const { stacks = [] } = this.state;
    screen.cache = navigationOptions.cache;
    screen.animate = navigationOptions.animate !== false;
    if (screen.cache) {
      CACHE[screen.url] = screen;
    }
    screen.RealComponent = Component;
    stacks.push(screen);
    //组件性能优化
    this.initScreenPerformance(screen.Component, Component.shouldResetRedux)
    return screen;
  }

  /**
   * 延迟调用页面componentWillMount
   */
  initScreenPerformance(ReduxComponent, shouldResetRedux) {
    const thisContext = this;
    const Component = ReduxComponent.WrappedComponent || ReduxComponent;
    if (!Component[PAUSE]) {
      Component[PAUSE] = true;
      const { componentWillMount = NOOP, shouldComponentUpdate = NOOP } = Component.prototype;
      Component.prototype.componentWillMount = function () {
        thisContext.prevInstance = thisContext.currentInstance;
        thisContext.currentInstance = this;
        Component.shouldResetRedux = shouldResetRedux;
        componentWillMount.apply(this, arguments);
      }
      Component.prototype.shouldComponentUpdate = function () {
        if (Queues.indexOf(this) < 0 && thisContext.isAnimating) {
          Queues.push(this);
        }
        return thisContext.isAnimating ? false : shouldComponentUpdate.apply(this, arguments);
      }
    }
  }

  /**
   * 执行组件更新
   */
  executeComponentUpdate() {
    if (Queues.length > 0) {
      Queues.forEach((queue) => queue.forceUpdate());
      Queues.length = 0;
    }
  }

  /**
   * 执行页面组件离开事件与页面进入事件
   */
  executePageBackfaceAndFront() {
    const actived = this.prevInstance;
    const activing = this.currentInstance;
    if (actived && typeof actived.componentDidHidden === 'function') {
      actived.componentDidHidden();
    }
    if (activing && typeof activing.componentDidShow === 'function') {
      activing.componentDidShow();
    }
  }

  /**
   * 播放动画页面进入动画
   */
  transitionAnimations() {
    const refs = this.refScreens;
    const { isForward } = this.props;
    const { activingScreen = {}, activedScreen = {} } = this.state;
    if (!activingScreen) {
      return;
    }
    const animateCls = (activingScreen.animate || activedScreen.animate && !isForward) ? 'animate' : 'no-animation'
    const activedDOM = refs[activedScreen.id];
    const activingDOM = refs[activingScreen.id];
    if (!isForward) {
      const prev = this.prevInstance;
      this.prevInstance = this.currentInstance;
      this.currentInstance = prev;
    }
    this.context.store.dispatch({ type: 'NavigateTransition', payload: { prev: activedDOM, current: activingDOM } })
    if (activedDOM && activingDOM) {
      const activeCls = isForward ? 'forward' : 'back';
      activingDOM.className = `page active-screen ${activeCls} ${animateCls}`;
      activedDOM.className = `page inactive-screen ${activeCls}  ${animateCls}`;
      this.isAnimating = true;
      this.bindAnimationEnd(activedDOM, () => {
        this.isAnimating = false;
        activingDOM.classList.remove('backface');
        activedDOM.classList.add("backface")
        //延迟执行componentWillMount
        this.executeComponentUpdate();
        this.executePageBackfaceAndFront()
        if (!isForward && activedScreen) {
          this.releaseScreens(activedScreen);
        }
      })
      this.setState({ activedScreen: activingScreen, activingScreen: null })
    }
  }

  /**
   * 绑定元素animationend事件
   */
  bindAnimationEnd(element, callback) {
    const styles = window.getComputedStyle(element);
    const name = styles['webkitAnimationName'] || styles['animationName'];
    if (name === 'none' || !name) {
      return callback();
    }
    function once() {
      element.removeEventListener('webkitAnimationEnd', once);
      element.removeEventListener('animationEnd', once);
      callback();
    }
    element.addEventListener('webkitAnimationEnd', once);
    element.addEventListener('animationEnd', once);

  }

  /**
   * 获取ref
   */
  bindRefs(instance) {
    if (instance) {
      const { id } = instance.props.screen;
      this.refScreens[id] = instance.dom;
    }
  }

  /**
   * 渲染screens
   */
  screens() {
    const { navigation } = this.props;
    const { stacks, activedScreen, activingScreen } = this.state;
    return stacks
      .filter((screen) => screen && screen.Component && (screen === activingScreen || screen === activedScreen))
      .map((screen) => {
        return (<Screen key={screen.id} navigation={navigation} screen={screen} ref={this.bindRefs} />)
      })
  }

  /**
   * 渲染组件
   */
  render() {
    return (
      <div className="pages">
        {this.screens()}
      </div>
    );
  }
}