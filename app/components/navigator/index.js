import "./navigation.css";
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { UrlParser } from 'dantejs';
import Navigation, { NavigationActions, addNavigationHelpers } from 'react-navigation';
import RouterView from './router';
import NavigateHelper from './forward';

let PATHEXTENSION = '';
let PATHROOT = '';

class StackNavigator extends Component {

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
     * 根据router的path与params获取对应的action
     * @param {*} path 当前访问路径
     * @param {*} params 对应的参数
     */
    getAction(path, params) {
        return this.props.router.getActionForPathAndParams(path, params) || NavigationActions.navigate({
            params: { path },
            routeName: 'NotFound',
        });
    }

    /**
     * 根据当前上下文数据原始router
     * 创建一个新的naviagation实例
     */
    getNavigation() {
        const { router } = this.props;
        const state = this.state;
        const { params } = router.getPathAndParamsForState(state);
        state.params = params || this.getRouteParams();
        const navigation = addNavigationHelpers({ state: this.state, dispatch: this.dispatch })
        const screenNavigation = addNavigationHelpers({ ...navigation, state: state.routes[state.index] });
        const options = router.getScreenOptions(screenNavigation, {});
        document.title = options.title;
        this.navigation = navigation;
        return navigation;
    }

    /**
     * 在单页跳转到第N页时，刷新了界面时的路由参数同步
     */
    getRouteParams() {
        const parser = new UrlParser(location.href);
        const qs = parser.paras.qs || '{}';
        return JSON.parse(qs);
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
        const webRoot = PATHROOT ? PATHROOT + '/' : '';
        return `/${webRoot}${path}${qs}`.toLowerCase();
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
        window.onpopstate = (ev) => {
            ev.preventDefault();
            this.dispatch({
                ...this.getAction(getWebPath().substr(1)),
                triggerPopState: true
            });
        };
    }

    /**
     * 当路由发生改变时
     * @param {*} props 新的props
     * @param {*} state 新的state
     */
    componentWillUpdate(props, state) {
        const uri = this.getURI(state);
        if (getLocationPath() !== uri) {
            const id = NavigateHelper.genStateID();
            console.log('change to:' + uri);
            window.history.pushState({ id }, state.title, uri);
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

Navigation.StackNavigator = (routeConfigs, stackConfig) => {
    let { TabRouter, createNavigator } = Navigation;
    let navigator = createNavigator(TabRouter(handlePathExtensions(routeConfigs), stackConfig))(StackNavigator);
    navigator.initialRouteName = getWebPath();
    return navigator;
}

/**
 * 设置路由后缀 例如设置成.html  那么所有路由path默认会拼接.html 例如: path:'login' 那么可以 login.html
 * @param {String} extension 后缀名 
 * @param {String} rootPath 默认路由根部分 例如  web/order
 */
Navigation.StackNavigator.setPathExtension = function (extension, rootPath = '') {
    PATHEXTENSION = extension;
    PATHROOT = rootPath;
}

/**
 * 获取当前路由pathname
 */
function getWebPath() {
    const pathname = getLocationPath();
    const pathRoot = PATHROOT;
    const pathRootIndex = pathname.indexOf(pathRoot);
    if (pathRootIndex > -1) {
        return pathname.substr(pathRootIndex + pathRoot.length);
    } else {
        return pathname;
    }
}

/**
 * 处理路由path后缀
 * @param {*} routeConfigs 
 */
function handlePathExtensions(routeConfigs) {
    const extension = PATHEXTENSION;
    if (extension) {
        Object.keys(routeConfigs).map((k) => {
            const route = routeConfigs[k];
            if (route.path && !route.rest) {
                route.path = route.path + extension;
            }
        })
    }
    return routeConfigs;
}

/**
 * 获取当前location.pathname
 */
function getLocationPath() {
    return window.location.pathname.toLowerCase();
}

module.exports = Navigation;