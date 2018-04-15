import Navigation from 'react-navigation';
import NavigateHelper from './helper';
import NavigationViewer from './navigation';

/**
 * 根据配置创建一个导航组件
 * @param {*} routeConfigs 路由配置 
 * @param {*} stackConfig 
 */
function StackNavigator(routeConfigs, stackConfig) {
  let { createNavigator, StackRouter } = Navigation;
  let routes = handleRouteConfig(routeConfigs)
  let navigator = createNavigator(StackRouter(routes, stackConfig))(NavigationViewer);
  navigator.initialRouteName = NavigateHelper.getInitialRouteName();
  NavigationViewer.initGetActionForPathAndParams(navigator.router);
  return navigator;
}

function handleRouteConfig(routeConfigs) {
  routeConfigs = NavigateHelper.handlePathExtensions(routeConfigs)
  Object.keys(routeConfigs).map((k) => {
    const route = routeConfigs[k];
    if (route) {
      let navigationOptions = route.navigationOptions;
      const { permission, title } = route;
      navigationOptions = route.navigationOptions = navigationOptions || {};
      navigationOptions.permission = permission != null ? permission : false;
      navigationOptions.title = navigationOptions.title || title;
    } else {
      delete routeConfigs[k];
    }
  })
  return routeConfigs;
}

/**
 * 创建一个路由器
 * @param {Object} routers 配置的路由信息 
 * 例如: { Index:{ screen:xxx,path:'login'  }  }
 * @param {String} mode 路由类型 可选择: hash pushState
 * @param {Object} options 其他配置 例如: { error:当页面加载异常时的显示组件 }
 */
function Router(routers, mode = 'pushState', options = {}) {
  NavigateHelper.setMode(mode);
  NavigateHelper.errorComponent = options.error;
  return StackNavigator(routers, {})
}

module.exports = {
  ...Navigation,
  Router,
};