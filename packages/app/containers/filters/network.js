/**
 * @name:用户登陆权限
 * 日期:2018-01-08
 * 描述:用于处理网页程序登录态权限限制
 */
import { Profile, Network } from 'framework';
import { Toast } from 'antd-mobile'
import { NavigationActions } from 'react-navigation'
import { getMessage } from '../../contants/network';

//权限校验redux中间件
export default () => {
  return (next) => (action) => {
    switch (action.type) {
      case NavigationActions.BACK:
      case NavigationActions.INIT:
      case NavigationActions.NAVIGATE:
      case NavigationActions.RESET:
        //页面切换时登陆权限判定
        authorizeCookie(next,action);
        break;
      default:
        //接口请求登陆权限判定
        authorizeNetwork(next, action);
        break;
    }
  }
}

/**
 * 用户登陆权限校验
 */
function authorizeCookie(next, action) {
  const payload = action.payload || {};
  if (payload.permission && !Profile.authed) {
    authorizeFail('您没有登录')
  } else {
    next(action);
  }
}

/**
 * 校验用户是否已登陆
 */
function authorizeNetwork(next, action) {
  const { payload = {} } = action;
  const rest = payload[Network.Actions.NETWORKRESPONSE];
  //如果时接口返回 非法访问状态
  if (rest) {
    const code = payload.code;
    //是否有登录态cookie
    switch (code) {
      case -1:
        authorizeFail(getMessage('network', code), code);
        next(action);
        break;
      default:
        showNetworkToast(payload, rest);
        next(action);
        break;
    }
  }
}

/**
 * 显示接口异常
 */
function showNetworkToast(payload, rest) {
  if (payload.code !== 0 && payload.__slient !== true) {
    Toast.show(getMessage(rest) || payload.message)
  }
}

/**
 * 校验失败处理
 */
function authorizeFail() {
  location.href = '#login'
}