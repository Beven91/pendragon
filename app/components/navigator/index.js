import Navigation from 'react-navigation';
import NavigateHelper from './helper';
import NavigationViewer from './navigation';
import NavigationActions from 'react-navigation/src/NavigationActions';

/**
 * 根据配置创建一个导航组件
 * @param {*} routeConfigs 路由配置 
 * @param {*} stackConfig 
 */
function StackNavigator(routeConfigs, stackConfig) {
  let { TabRouter, createNavigator, StackRouter } = Navigation;
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
    let navigationOptions = route.navigationOptions;
    const { permission, title } = route;
    navigationOptions = route.navigationOptions = navigationOptions || {};
    navigationOptions.permission = permission != null ? permission : false;
    navigationOptions.title = navigationOptions.title || title;
  })
  return routeConfigs;
}

/**
 * 创建一个路由器
 * @param {Object} routers 配置的路由信息 
 * 例如: { Index:{ screen:xxx,path:'login'  }  }
 * @param {String} mode 路由类型 可选择: hash pushState
 */
function Router(routers, mode = 'pushState') {
  NavigateHelper.setMode(mode);
  return StackNavigator(routers, {})
}

module.exports = {
  ...Navigation,
  Router,
};