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
const Queues= [];
let screenCount = 0;

export default class StackAnimateView extends React.Component {

  //组件属性类型
  static propTypes = {
    //当前路由对应的url
    url:PropTypes.string,
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
    const { activingScreen } = this.state;
    this.setState({ activedScreen: activingScreen, activingScreen: null })
    this.executeComponentUpdate();
    if (activingScreen) {
      const activingDOM = this.refScreens[activingScreen.id];
      activingDOM && activingDOM.classList.add("active");
    }
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
   * 创建一个新的screen.id
   */
  createId(){
    return `route_${++screenCount}`;
  }

  /**
   * 当前进入的页面是否需要刷新还是使用缓存
   * @param {Object} props 当前新的属性
   */
  shouldRefresh(props){
    const {  Component,isForward } = props;
    const RealComponent = Component.WrappedComponent || Component;
    const { navigationOptions = {} } = RealComponent;
    const cacheable =('cache' in navigationOptions);
    //在未设置cache参数时，默认isForward创建新的页面 否则根据cache来决定是否创建新的页面
    return cacheable ?  navigationOptions.cache === false : isForward;
  }

  /**
   * 设置非异步组件
   * @param {Object} props 当前输入的属性
   */
  setNavigatorScreen(props) {
    const {  Component,url } = props;
    const route = (props.route || '').toLowerCase();
    const shouldRefresh = this.shouldRefresh(props);
    let activingScreen = CACHE[route];
    if (!(route in CACHE)) {
      activingScreen = this.pushScreen({ id: this.createId(),url, route, Component })
    }else if(shouldRefresh){
      activingScreen.instance = null;
      activingScreen.RealComponent.shouldResetRedux  = true;
      activingScreen.id = this.createId();
    }
    this.setState({ current:route, activingScreen });
    //强制刷新
    this.forceUpdate();
  }

  /**
   * push页面到栈中
   */
  pushScreen(screen) {
    const Component = screen.Component.WrappedComponent || screen.Component;
    const { screens = [] } = this.state;
    CACHE[screen.route] = screen;
    screen.RealComponent = Component;
    screens.push(screen);
    //组件性能优化
    this.initScreenPerformance(screen.Component,Component.shouldResetRedux)
    return screen;
  }

  /**
   * 延迟调用页面componentWillMount
   */
  initScreenPerformance(ReduxComponent,shouldResetRedux) {
    const thisContext = this;
    const Component = ReduxComponent.WrappedComponent || ReduxComponent;
    if (!Component[PAUSE]) {
      Component[PAUSE] = true;
      const { componentWillMount = NOOP,shouldComponentUpdate = NOOP } = Component.prototype;
      Component.prototype.componentWillMount = function () {
        thisContext.prevInstance = thisContext.currentInstance;
        thisContext.currentInstance = this;
        Component.shouldResetRedux = shouldResetRedux;
        componentWillMount.apply(this,arguments);
      }
      Component.prototype.shouldComponentUpdate = function(){
        if(Queues.indexOf(this)<0){
          Queues.push(this);
        }
        return thisContext.isAnimating ? false:shouldComponentUpdate.apply(this,arguments);
      }
    }
  }

  /**
   * 执行组件更新
   */
  executeComponentUpdate() {
    if(Queues.length>0){
      Queues.forEach((queue)=>queue.forceUpdate());
      Queues.length = 0;
    }
  }

  /**
   * 执行页面组件离开事件与页面进入事件
   */
  executePageBackfaceAndFront(){
    const actived = this.prevInstance;
    const activing = this.currentInstance;
    if(actived && typeof actived.componentDidHidden === 'function'){
      actived.componentDidHidden();
    }
    if(activing && typeof activing.componentDidShow === 'function'){
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
    const activedDOM = refs[activedScreen.id];
    const activingDOM = refs[activingScreen.id];
    this.context.store.dispatch({ type: 'NavigateTransition', payload: { prev: activedDOM, current: activingDOM } })
    if (activedDOM && activingDOM) {
      const activeCls = isForward ? 'forward' : 'back';
      activingDOM.className = "page active " + activeCls;
      activedDOM.className = "page inactive " + activeCls;
      this.isAnimating = true;
      this.bindAnimationEnd(activedDOM, () => {
        this.isAnimating = false;
        activingDOM.classList.remove('backface');
        activedDOM.classList.add("backface")
        //延迟执行componentWillMount
        this.executeComponentUpdate();
        this.executePageBackfaceAndFront(activingScreen,activedScreen)

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
      const { id } = instance.props.screen;
      this.refScreens[id] = instance.dom;
    }
  }

  /**
   * 渲染screens
   */
  screens() {
    const { navigation } = this.props;
    const { screens,current,activedScreen } = this.state;
    return screens
      .filter((screen) => screen && screen.Component && (screen.route===current || screen===activedScreen) )
      .map((screen) => {
        return (<Screen key={screen.id} current={current} navigation={navigation} screen={screen} ref={this.bindRefs} />)
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

