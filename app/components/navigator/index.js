import "./navigation.css";
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import Navigation, { NavigationActions, addNavigationHelpers } from 'react-navigation';
import RouterView from './router';
import NavigateHelper from './forward';

let PATHEXTENSION = '';
let PATHROOT = '';
const LOCATIONPATHNAME = window.location.pathname.toLowerCase();

class StackNavigator extends Component {

    static childContextTypes = {
        getActionForPathAndParams: PropTypes.func.isRequired,
        getURIForAction: PropTypes.func.isRequired,
        dispatch: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        const { router } = this.props;
        const path = getWebPath();
        const initAction = this.getAction(router, path, { path });
        this.dispatch = this.dispatch.bind(this);
        this.state = props.navigation.state;
        this.getActionForPathAndParams = this.getActionForPathAndParams.bind(this);
        this.getURIForAction = this.getURIForAction.bind(this);
        NavigateHelper.initRoute();
    }

    getAction(router, path, params) {
        return router.getActionForPathAndParams(path, params) || NavigationActions.navigate({
            params: { path },
            routeName: 'NotFound',
        });
    }

    getNavigation() {
        const { router } = this.props;
        const state = this.state;
        const { path, params } = router.getPathAndParamsForState(state);
        state.params = params;
        const navigation = addNavigationHelpers({
            state: this.state,
            dispatch: this.dispatch,
        })
        const screenNavigation = addNavigationHelpers({
            ...navigation,
            state: state.routes[state.index],
        });
        const options = router.getScreenOptions(screenNavigation, {});

        document.title = options.title;
        return navigation;
    }

    dispatch(action) {
        const { router } = this.props;
        const state = router.getStateForAction(action, this.state);
        const isChange = state && state !== this.state;
        if (action.type === 'Navigation/BACK') {
            window.history.back();
        } else if (isChange) {
            state.popstate = action.fromPopstate;
            this.setState(state)
        }
        return (isChange || !state);
    }

    getURIForAction(action) {
        const { router } = this.props;
        const state = router.getStateForAction(action, this.state) || this.state;
        return this.getURI(state);
    }

    getActionForPathAndParams(path, params) {
        return router.getActionForPathAndParams(path, params);
    }

    getChildContext() {
        return {
            getActionForPathAndParams: this.getActionForPathAndParams,
            getURIForAction: this.getURIForAction,
            dispatch: this.dispatch,
        };
    }

    getURI(state) {
        const { router } = this.props;
        const { path, params } = router.getPathAndParamsForState(state);
        const maybeHash = params && params.hash ? `#${params.hash}` : '';
        const webRoot = PATHROOT ? PATHROOT + '/' : '';
        return `/${webRoot}${path}${maybeHash}`.toLowerCase();
    }

    componentDidMount() {
        const { router } = this.props;
        window.onpopstate = e => {
            e.preventDefault();
            const action = this.getAction(router, LOCATIONPATHNAME.substr(1));
            action.fromPopstate = true;
            if (action) this.dispatch(action);
        };
    }

    componentWillUpdate(props, state) {
        const uri = this.getURI(state);
        if (LOCATIONPATHNAME !== uri) {
            const id = NavigateHelper.genStateID();
            window.history.pushState({ id }, state.title, uri);
        }
    }

    componentDidUpdate() {
        NavigateHelper.setCurrentStateID(window.history.state.id);
    }

    render() {
        const { router } = this.props;
        const navigation = this.getNavigation();
        const Screen = router.getComponentForState(this.state);
        const isForward = NavigateHelper.isForward(this.state.popstate || this.state.isBack)
        return (
            <RouterView navigation={navigation} router={router} isForward={isForward} />
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
    const pathname = LOCATIONPATHNAME;
    const pathRoot = PATHROOT;
    if (pathRoot) {
        return pathname.substr(pathname.indexOf(pathRoot) + pathRoot.length);
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

module.exports = Navigation;