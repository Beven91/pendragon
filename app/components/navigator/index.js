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
  let routes = NavigateHelper.handlePathExtensions(routeConfigs)
  let navigator = createNavigator(StackRouter(routes, stackConfig))(NavigationViewer);
  navigator.initialRouteName = NavigateHelper.getInitialRouteName();
  NavigationViewer.initGetActionForPathAndParams(navigator.router);
  return navigator;
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