import "./navigation.css";
import React, { Component } from 'react';
import { CookieParser } from 'dantejs';
import { PropTypes } from 'prop-types';
import { NavigationActions, addNavigationHelpers } from 'react-navigation';
import RouterView from './router';
import NavigateHelper from './helper';

const cookies = new CookieParser(document.cookie);

export default class NavigationViewer extends Component {
  /**
   * 定义子组件共享数据类型
   */
  static childContextTypes = {
    //根据路径和参数获取对应的action
    getActionForPathAndParams: PropTypes.func.isRequired,
    //根据action获取对应的显示的uri字符串
    getURIForAction: PropTypes.func.isRequired,
    //执行action
    dispatch: PropTypes.func.isRequired,
    //导航组件
    navigation: PropTypes.object
  };

  /**
   * 构造函数
   * @param {*} props 
   */
  constructor(props) {
    super(props);
    const { router } = this.props;
    this.dispatch = this.dispatch.bind(this);
    this.state = props.navigation.state;
    this.getActionForPathAndParams = this.getActionForPathAndParams.bind(this);
    this.getURIForAction = this.getURIForAction.bind(this);
    //初始化
    NavigateHelper.initRoute();
  }

  /**
   * 附加404路由action获取
   * @param {*} router 
   */
  static initGetActionForPathAndParams(router) {
    const originalGetActionForPathAndParams = router.getActionForPathAndParams.bind(router);
    router.getActionForPathAndParams = (path, params) => {
      return originalGetActionForPathAndParams(path, params) || NavigationActions.navigate({
        params: { path },
        routeName: 'NotFound',
      });
    };
  }

  /**
   * 根据当前上下文数据原始router
   * 创建一个新的naviagation实例
   */
  getNavigation() {
    const { router } = this.props;
    const state = this.state;
    state.params = NavigateHelper.getRouteParams();
    const navigation = addNavigationHelpers({ state: this.state, dispatch: this.dispatch })
    const screenNavigation = addNavigationHelpers({ ...navigation, state: state.routes[state.index] });
    const { title } = router.getScreenOptions(screenNavigation, {});
    title && (document.title = title);
    this.navigation = navigation;
    return navigation;
  }

  /**
   * 执行传入的action
   * @param {*} action 
   */
  dispatch(action) {
    const { router } = this.props;
    const state = router.getStateForAction(action, this.state);
    const isChange = state && state !== this.state;
    if (action.type === 'Navigation/BACK') {
      window.history.back();
    } else if (isChange) {
      this.setState({
        ...state,
        popstate: action.triggerPopState
      })
    }
    return (isChange || !state);
  }

  /**
   * 获取传入action对应的URL
   * @param {Object} action 
   */
  getURIForAction(action) {
    const { router } = this.props;
    const state = router.getStateForAction(action, this.state) || this.state;
    return this.getURI(state);
  }

  /**
   * 根据当前state获取对应的URL
   * @param {*} state 
   */
  getURI(state) {
    const { router } = this.props;
    const { path, params } = router.getPathAndParamsForState(state);
    const qs = params ? '?qs=' + encodeURIComponent(JSON.stringify(params || {})) : '';
    const pathRoot = NavigateHelper.getPathRoot();
    const webRoot = pathRoot ? pathRoot + '/' : '';
    const pathName = path === "/" ? "" : path;
    switch (NavigateHelper.getMode()) {
      case 'hash':
        return `#${webRoot}${pathName}${qs}`.toLowerCase();
      default:
        return `/${webRoot}${pathName}${qs}`.toLowerCase();;
    }
  }

  /**
   * 根据路径和参数获取对应的action
   * @param {*} path 当前请求的路径
   * @param {*} params 配置参数
   */
  getActionForPathAndParams(path, params) {
    return this.props.router.getActionForPathAndParams(path, params);
  }

  /**
   * 定义子组件共享数据
   */
  getChildContext() {
    return {
      //根据路径和参数获取对应的action
      getActionForPathAndParams: this.getActionForPathAndParams,
      //根据action获取对应的显示的uri字符串
      getURIForAction: this.getURIForAction,
      //执行action
      dispatch: this.dispatch,
      navigation: this.navigation
    };
  }

  /**
   * 组件第一次渲染完毕，
   * 绑定onpopstate事件，用于执行对应的action
   */
  componentDidMount() {
    const { router } = this.props;
    const context = { event: '' };
    switch (NavigateHelper.getMode()) {
      case 'hash':
        context.event = 'hashchange'
        break;
      default:
        context.event = 'popstate'
    }
    window.addEventListener(context.event, (ev) => {
      ev.preventDefault();
      this.dispatch({
        ...this.getActionForPathAndParams(NavigateHelper.getInitialRouteName()),
        triggerPopState: true
      });
    });
  }

  /**
   * 当路由发生改变时
   * @param {*} props 新的props
   * @param {*} state 新的state
   */
  componentWillUpdate(props, state) {
    const uri = this.getURI(state);
    const location = NavigateHelper.getLocationPath();
    if (!state.popstate) {
      NavigateHelper.goUrl(uri,state)
    }
  }

  /**
   * 路由更新完毕，设置当前的历史记录id
   */
  componentDidUpdate() {
    NavigateHelper.setCurrentStateID((window.history.state || {}).id);
  }

  /**
   * 自定义路由组件渲染
   */
  render() {
    const { router } = this.props;
    const navigation = this.getNavigation();
    const { state } = navigation;
    const pathName = this.getURI(state);
    const isForward = NavigateHelper.isForward()
    return (
      <RouterView navigation={navigation} pathName={pathName} router={router} isForward={isForward} />
    )
  }
}