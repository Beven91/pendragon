/**
 * 实现卡片切换页面的视图，用于模拟app的页面切换效果
 * 
 * 用例： 
 *      <StackAnimateView route={path} isForward={forward}>..children...</StackAnimateView>
 */
import React from 'react'
import PropTypes from 'prop-types';

//已经加载的所有页面
const CACHE = {};
const PAUSE = "@PAUSE@";
const PauseQueues = [];
const NOOP = (a) => a;
let screenCount = 0;

export default class StackAnimateView extends React.Component {

  static propTypes = {
    route: PropTypes.string,
    isForward: PropTypes.bool
  }

  constructor(props) {
    super(props);
    this.refScreens = {};
    this.bindRefs = this.bindRefs.bind(this);
    this.state = {
      //当前已经加载的所有界面
      screens: [],
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
    this.setState({ activedScreen: this.state.activingScreen, activingScreen: null })
    this.executeQueues();
  }

  /**
   * 当属性改变时,切换窗口样式
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.route !== this.props.route) {
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
   * 设置非异步组件
   * @param {Object} props 当前输入的属性
   */
  setNavigatorScreen(props) {
    const { route, children, navigationOptions = {} } = props;
    const { cache = false } = navigationOptions;
    const { screens } = this.state;
    let screen = CACHE[route];
    if (!screen) {
      this.initScrennPerformance(children)
      screen = { id: `route_${++screenCount}`, route, component: children, cache };
      this.pushScreen(screen);
    }
    this.setState({ screens: this.clearScreens(screens), activingScreen: screen });
    //强制刷新
    this.forceUpdate();
  }

  /**
   * push页面到栈中
   */
  pushScreen(screen) {
    const route = screen.route;
    const { screens = [] } = this.state;
    screens.push(screen);
    if (screen.cache) {
      CACHE[route] = screen;
    }
  }

  /**
   * 延迟调用页面componentWillMount
   */
  initScrennPerformance(children) {
    const type = children.type;
    const Component = type.WrappedComponent || type;
    if (!Component[PAUSE]) {
      Component[PAUSE] = true;
      const { componentWillMount = NOOP, componentDidMount = NOOP } = Component.prototype
      Component.prototype.componentWillMount = function (...params) {
        PauseQueues.push(componentWillMount.bind(this, ...params));
        PauseQueues.push(componentDidMount.bind(this, ...params));
      }
      Component.prototype.componentDidMount = NOOP;
    }
  }

  /**
   * 执行延迟事件
   */
  executeQueues() {
    PauseQueues.map((handler) => handler());
    PauseQueues.length = 0;
  }

  /**
   * 清除需要清除的页面
   */
  clearScreens(screens = []) {
    const noCacheScreens = screens.filter((s) => !s.cache);
    const noCacheCount = noCacheScreens.length;
    const k = (screens.length - noCacheCount) >= 2 ? noCacheCount : noCacheCount - 2;
    for (let i = 0; i < k; i++) {
      const screen = noCacheScreens[i];
      screen.component = null;
      this.refScreens[screen.id];
    }
    return screens.filter((s) => s.component);
  }

  /**
   * 播放动画页面进入动画
   */
  transitionAnimations() {
    const refs = this.refScreens;
    const { isForward } = this.props;
    const { activingScreen, activedScreen } = this.state;
    if (activedScreen) {
      const activedDOM = refs[activedScreen.id];
      const activingDOM = refs[activingScreen.id];
      const activeCls = isForward ? 'forward' : 'back';
      activingDOM.className = "page active " + activeCls;
      activedDOM.className = "page inactive " + activeCls;
      this.isAnimating = true;
      this.bindAnimationEnd(activedDOM, () => {
        this.isAnimating = false;
        activingDOM.classList.remove('backface');
        activedDOM.classList.add("backface")
        //延迟执行componentWillMount
        this.executeQueues();
      })
      this.setState({ activedScreen: activingScreen, activingScreen: null })
    }
  }

  /**
   * 绑定元素animationend事件
   */
  bindAnimationEnd(element, callback) {
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
      this.refScreens[instance.getAttribute('data-id')] = instance;
    }
  }

  /**
   * 渲染screens
   */
  renderScreens() {
    const { screens } = this.state;
    return screens.map((screen) => {
      const { component, id, route } = screen;
      if (component) {
        return (<div ref={this.bindRefs} data-route={route} data-id={id} key={id} className="page">{component}</div>)
      } else {
        return '';
      }
    })
  }

  /**
   * 渲染组件
   */
  render() {
    return (
      <div className="pages">
        {this.renderScreens()}
      </div>
    );
  }
}